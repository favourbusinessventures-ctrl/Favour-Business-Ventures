/**
 * Cloudflare Worker Entry Point
 * Explicitly dispatches API routes (/api/*) BEFORE the SPA / static asset fallback.
 */

interface Env {
  ASSETS?: {
    fetch: (req: Request | string, init?: RequestInit) => Promise<Response>;
  };
  STORAGE_BUCKET?: string;
  BUCKET?: {
    put: (key: string, data: any, options?: any) => Promise<any>;
    get: (key: string) => Promise<any>;
    delete: (key: string) => Promise<any>;
  };
  R2_PUBLIC_DOMAIN?: string;
  [key: string]: any;
}

const FIREBASE_CONFIG = {
  projectId: 'gen-lang-client-0856184409',
  apiKey: 'AIzaSyAsKTFdrPDOb3C-bYWvCHrCwiWH06osefI',
  databaseId: 'ai-studio-favourbusinessve-67e8ce41-b682-4624-bb35-d6c0590b7542',
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function base64ToUint8Array(base64: string): Uint8Array {
  let clean = base64;
  if (clean.includes(';base64,')) {
    clean = clean.split(';base64,')[1];
  }
  clean = clean.replace(/[\r\n\s]/g, '');
  const binaryString = atob(clean);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function handleHealthRequest(): Promise<Response> {
  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Favour Business Ventures API (Cloudflare Worker)',
    storage: 'firestore-cloud-storage',
    endpoints: [
      'GET /api/health',
      'POST /api/images/upload',
      'OPTIONS /api/images/upload',
      'POST /api/images/delete',
      'OPTIONS /api/images/delete',
      'GET /api/images/raw/:key',
      'GET /uploads/:path',
    ],
  });
}

async function handleImageUpload(request: Request, env: Env): Promise<Response> {
  try {
    // 1. Extract Bearer token if provided
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    let idToken: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      idToken = authHeader.substring(7).trim();
    }

    // 2. Parse request JSON body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload in request body' }, 400);
    }

    const { fileData, fileName, folder, mimeType } = body;

    if (!fileData || typeof fileData !== 'string') {
      return jsonResponse({ error: 'Missing or invalid "fileData" base64 string' }, 400);
    }

    const targetFolder = folder === 'gallery' ? 'gallery' : 'products';
    const declaredMime = mimeType || 'image/jpeg';

    if (!declaredMime.startsWith('image/')) {
      return jsonResponse({ error: `Invalid image type: ${declaredMime}` }, 400);
    }

    // 3. Extract raw base64 string and convert to binary buffer
    let rawBase64 = fileData;
    if (rawBase64.includes(';base64,')) {
      rawBase64 = rawBase64.split(';base64,')[1];
    }
    rawBase64 = rawBase64.replace(/[\r\n\s]/g, '');

    let binaryData: Uint8Array;
    try {
      binaryData = base64ToUint8Array(rawBase64);
    } catch (e: any) {
      return jsonResponse({ error: `Base64 decoding failed: ${e?.message || e}` }, 400);
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (binaryData.length > MAX_SIZE) {
      return jsonResponse({ error: 'File size exceeds 10MB limit' }, 400);
    }

    // Determine extension
    let extension = 'jpg';
    if (declaredMime.includes('png')) extension = 'png';
    else if (declaredMime.includes('webp')) extension = 'webp';
    else if (declaredMime.includes('jpeg') || declaredMime.includes('jpg')) extension = 'jpg';
    else if (declaredMime.includes('svg')) extension = 'svg';
    else if (declaredMime.includes('gif')) extension = 'gif';

    // Sanitize file name
    const rawName = (fileName || 'image')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    const timestamp = Date.now();
    const cleanFileName = `${timestamp}_${rawName}.${extension}`;
    const storageKey = `${targetFolder}_${cleanFileName}`;

    // 4. Save to Persistent Firestore Cloud Database (Zero paid tiers, 100% durable across deploys)
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/${FIREBASE_CONFIG.databaseId}/documents/uploaded_images/${encodeURIComponent(storageKey)}?key=${FIREBASE_CONFIG.apiKey}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const firestorePayload = {
      fields: {
        fileName: { stringValue: cleanFileName },
        folder: { stringValue: targetFolder },
        mimeType: { stringValue: declaredMime },
        size: { integerValue: String(binaryData.length) },
        data: { stringValue: rawBase64 },
        createdAt: { stringValue: new Date().toISOString() },
      },
    };

    const firestoreRes = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(firestorePayload),
    });

    if (firestoreRes.ok) {
      const publicUrl = `/api/images/raw/${storageKey}`;
      return jsonResponse({
        success: true,
        url: publicUrl,
        fileName: cleanFileName,
        size: binaryData.length,
        mimeType: declaredMime,
        provider: 'firestore-cloud-storage',
      });
    }

    const errorDetails = await firestoreRes.text();
    console.error('[Cloudflare Worker] Firestore storage write failed:', firestoreRes.status, errorDetails);

    return jsonResponse(
      {
        error: `Could not save image to cloud storage (Firestore HTTP ${firestoreRes.status}). Please check administrator authentication.`,
      },
      firestoreRes.status >= 400 && firestoreRes.status < 500 ? firestoreRes.status : 500
    );
  } catch (err: any) {
    return jsonResponse({ error: err?.message || 'Server error uploading image' }, 500);
  }
}

async function handleGetRawImage(storageKey: string): Promise<Response> {
  try {
    const cleanKey = decodeURIComponent(storageKey).replace(/[^a-zA-Z0-9_.-]/g, '');
    if (!cleanKey) {
      return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/${FIREBASE_CONFIG.databaseId}/documents/uploaded_images/${encodeURIComponent(cleanKey)}?key=${FIREBASE_CONFIG.apiKey}`;

    const res = await fetch(firestoreUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return new Response('Image Not Found', { status: 404, headers: CORS_HEADERS });
    }

    const data: any = await res.json();
    const fields = data?.fields;
    if (!fields || !fields.data?.stringValue) {
      return new Response('Invalid Image Record', { status: 404, headers: CORS_HEADERS });
    }

    const base64Str = fields.data.stringValue;
    const mimeType = fields.mimeType?.stringValue || 'image/jpeg';
    const binaryData = base64ToUint8Array(base64Str);

    return new Response(binaryData, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(binaryData.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[Cloudflare Worker] Raw image retrieval error:', err);
    return new Response('Error retrieving image', { status: 500, headers: CORS_HEADERS });
  }
}

async function handleImageDelete(request: Request, env: Env): Promise<Response> {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const { url } = body;
    if (!url) {
      return jsonResponse({ error: 'Missing image URL' }, 400);
    }

    const authHeader = request.headers.get('Authorization');
    
    // Extract storage key from URL (/api/images/raw/key or /uploads/folder/file)
    let storageKey = '';
    if (url.includes('/api/images/raw/')) {
      storageKey = url.split('/api/images/raw/')[1];
    } else if (url.includes('/uploads/')) {
      const parts = url.replace(/^\/uploads\//, '').split('/');
      if (parts.length === 2) {
        storageKey = `${parts[0]}_${parts[1]}`;
      } else {
        storageKey = parts[0];
      }
    }

    if (storageKey) {
      const cleanKey = decodeURIComponent(storageKey).replace(/[^a-zA-Z0-9_.-]/g, '');
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/${FIREBASE_CONFIG.databaseId}/documents/uploaded_images/${encodeURIComponent(cleanKey)}?key=${FIREBASE_CONFIG.apiKey}`;

      const headers: Record<string, string> = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      await fetch(firestoreUrl, {
        method: 'DELETE',
        headers,
      });
    }

    return jsonResponse({ success: true, message: 'Image deleted or unlinked successfully' });
  } catch (err: any) {
    return jsonResponse({ error: err?.message || 'Error deleting image' }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Intercept Global CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 2. Explicit API Routing - Processed BEFORE any static asset / SPA fallback
    if (pathname === '/api/health') {
      if (request.method === 'GET' || request.method === 'HEAD') {
        return handleHealthRequest();
      }
      return jsonResponse({ error: `Method ${request.method} Not Allowed. Use GET.` }, 405);
    }

    if (pathname === '/api/images/upload') {
      if (request.method === 'POST') {
        return handleImageUpload(request, env);
      }
      return jsonResponse({ error: `Method ${request.method} Not Allowed. Use POST for /api/images/upload.` }, 405);
    }

    if (pathname === '/api/images/delete') {
      if (request.method === 'POST' || request.method === 'DELETE') {
        return handleImageDelete(request, env);
      }
      return jsonResponse({ error: `Method ${request.method} Not Allowed. Use POST or DELETE.` }, 405);
    }

    if (pathname.startsWith('/api/images/raw/')) {
      const storageKey = pathname.replace(/^\/api\/images\/raw\//, '');
      return handleGetRawImage(storageKey);
    }

    // 3. Catch-all for any other unmatched /api/* route -> Return 404 JSON, NOT SPA HTML
    if (pathname.startsWith('/api/')) {
      return jsonResponse({ error: `API endpoint "${pathname}" not found.` }, 404);
    }

    // 4. Serve uploaded images from Firestore (or static fallback)
    if (pathname.startsWith('/uploads/')) {
      const cleanPath = pathname.replace(/^\/uploads\//, '');
      const parts = cleanPath.split('/');
      const storageKey = parts.length === 2 ? `${parts[0]}_${parts[1]}` : cleanPath;
      
      const firestoreImgRes = await handleGetRawImage(storageKey);
      if (firestoreImgRes.status === 200) {
        return firestoreImgRes;
      }
    }

    // 5. Static Assets & SPA Fallback for all other frontend routes
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
