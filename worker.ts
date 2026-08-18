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
    endpoints: [
      'GET /api/health',
      'POST /api/images/upload',
      'OPTIONS /api/images/upload',
      'POST /api/images/delete',
      'OPTIONS /api/images/delete',
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

    // 3. Convert base64 to binary buffer
    let binaryData: Uint8Array;
    try {
      binaryData = base64ToUint8Array(fileData);
    } catch (e: any) {
      return jsonResponse({ error: `Base64 decoding failed: ${e?.message || e}` }, 400);
    }

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (binaryData.length > MAX_SIZE) {
      return jsonResponse({ error: 'File size exceeds 15MB limit' }, 400);
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
    const finalFileName = `${timestamp}_${rawName}.${extension}`;
    const storagePath = `${targetFolder}/${finalFileName}`;

    // 4. Try Firebase Storage REST Upload
    const storageBucket = env.STORAGE_BUCKET || 'gen-lang-client-0856184409.firebasestorage.app';
    if (storageBucket) {
      try {
        const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?name=${encodeURIComponent(storagePath)}&uploadType=media`;
        const headers: Record<string, string> = {
          'Content-Type': declaredMime,
        };
        if (idToken) {
          headers['Authorization'] = `Bearer ${idToken}`;
        }

        const uploadRes = await fetch(firebaseUrl, {
          method: 'POST',
          headers,
          body: binaryData,
        });

        if (uploadRes.ok) {
          const resData: any = await uploadRes.json();
          const downloadToken = resData.downloadTokens;
          const publicUrl = downloadToken
            ? `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`
            : `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(storagePath)}?alt=media`;

          return jsonResponse({
            success: true,
            url: publicUrl,
            fileName: finalFileName,
            size: binaryData.length,
            mimeType: declaredMime,
            provider: 'firebase-storage',
          });
        }
      } catch (fbErr) {
        console.warn('[Cloudflare Worker] Firebase Storage REST upload returned:', fbErr);
      }
    }

    // 5. Try Cloudflare R2 if bound
    if (env.BUCKET && typeof env.BUCKET.put === 'function') {
      try {
        await env.BUCKET.put(storagePath, binaryData, {
          httpMetadata: { contentType: declaredMime },
        });
        const publicR2Domain = env.R2_PUBLIC_DOMAIN || '';
        const publicUrl = publicR2Domain
          ? `${publicR2Domain}/${storagePath}`
          : `/uploads/${storagePath}`;

        return jsonResponse({
          success: true,
          url: publicUrl,
          fileName: finalFileName,
          size: binaryData.length,
          mimeType: declaredMime,
          provider: 'cloudflare-r2',
        });
      } catch (r2Err) {
        console.warn('[Cloudflare Worker] R2 upload error:', r2Err);
      }
    }

    // 6. Resilient Base64 Data URL fallback for edge compatibility
    const dataUrl = fileData.startsWith('data:')
      ? fileData
      : `data:${declaredMime};base64,${fileData}`;

    return jsonResponse({
      success: true,
      url: dataUrl,
      fileName: finalFileName,
      size: binaryData.length,
      mimeType: declaredMime,
      provider: 'edge-data-storage',
    });
  } catch (err: any) {
    return jsonResponse({ error: err?.message || 'Server error uploading image' }, 500);
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
    if (url.includes('firebasestorage.googleapis.com') && authHeader) {
      try {
        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader,
          },
        });
      } catch (e) {
        console.warn('[Cloudflare Worker] Could not delete from Firebase Storage:', e);
      }
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

    // 3. Catch-all for any other unmatched /api/* route -> Return 404 JSON, NOT SPA HTML
    if (pathname.startsWith('/api/')) {
      return jsonResponse({ error: `API endpoint "${pathname}" not found.` }, 404);
    }

    // 4. Static Assets & SPA Fallback for all other frontend routes
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
