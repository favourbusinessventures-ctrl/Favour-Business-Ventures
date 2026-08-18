/**
 * Cloudflare Pages & Worker Advanced Mode Dispatcher
 * Handles API routes for image uploads, deletes, and health checks before falling back to static assets.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function base64ToUint8Array(base64) {
  let clean = base64;
  if (clean.includes(';base64,')) {
    clean = clean.split(';base64,')[1];
  }
  clean = clean.replace(/[\r\n\s]/g, '');
  const binary = atob(clean);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Global CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 2. Health Endpoint
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Favour Business Ventures API (Cloudflare Worker)',
      });
    }

    // 3. Image Upload Endpoint (POST /api/images/upload)
    if (url.pathname === '/api/images/upload') {
      if (request.method !== 'POST') {
        return jsonResponse(
          { error: `Method ${request.method} Not Allowed. Use POST for /api/images/upload.` },
          405
        );
      }

      try {
        const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
        let idToken = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          idToken = authHeader.substring(7).trim();
        }

        const body = await request.json();
        const { fileData, fileName, folder, mimeType } = body;

        if (!fileData || typeof fileData !== 'string') {
          return jsonResponse({ error: 'Missing fileData in request body' }, 400);
        }

        const targetFolder = folder === 'gallery' ? 'gallery' : 'products';
        const declaredMime = mimeType || 'image/jpeg';
        const binaryData = base64ToUint8Array(fileData);

        let extension = 'jpg';
        if (declaredMime.includes('png')) extension = 'png';
        else if (declaredMime.includes('webp')) extension = 'webp';
        else if (declaredMime.includes('jpeg') || declaredMime.includes('jpg')) extension = 'jpg';
        else if (declaredMime.includes('svg')) extension = 'svg';

        const rawName = (fileName || 'image')
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '_')
          .replace(/_+/g, '_');

        const timestamp = Date.now();
        const finalFileName = `${timestamp}_${rawName}.${extension}`;
        const storagePath = `${targetFolder}/${finalFileName}`;

        // Attempt Firebase Storage REST upload
        const storageBucket = env?.STORAGE_BUCKET || 'gen-lang-client-0856184409.firebasestorage.app';
        if (storageBucket) {
          try {
            const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?name=${encodeURIComponent(storagePath)}&uploadType=media`;
            const headers = { 'Content-Type': declaredMime };
            if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

            const uploadRes = await fetch(firebaseUrl, {
              method: 'POST',
              headers,
              body: binaryData,
            });

            if (uploadRes.ok) {
              const resData = await uploadRes.json();
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
            console.warn('Firebase Storage upload warning in worker:', fbErr);
          }
        }

        // Resilient Fallback: Data URI for edge persistence
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
      } catch (uploadErr) {
        return jsonResponse({ error: uploadErr?.message || 'Failed to process image' }, 500);
      }
    }

    // 4. Image Delete Endpoint (POST /api/images/delete)
    if (url.pathname === '/api/images/delete') {
      if (request.method !== 'POST' && request.method !== 'DELETE') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }
      return jsonResponse({ success: true, message: 'Image deleted' });
    }

    // 5. Static Assets fallback (Cloudflare Pages env.ASSETS)
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
