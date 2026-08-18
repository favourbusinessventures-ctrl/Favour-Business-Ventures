/**
 * Cloudflare Worker / Pages Entry Point
 * Dispatches API routes (/api/*) BEFORE falling back to static SPA assets.
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
      'Content-Type': 'application/json; charset=utf-8',
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
    const pathname = url.pathname;

    // 1. Intercept Global CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 2. Health Endpoint
    if (pathname === '/api/health') {
      if (request.method === 'GET' || request.method === 'HEAD') {
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
      return jsonResponse({ error: `Method ${request.method} Not Allowed. Use GET.` }, 405);
    }

    // 3. Image Upload Endpoint (POST /api/images/upload)
    if (pathname === '/api/images/upload') {
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
          return jsonResponse({ error: 'Missing or invalid "fileData" base64 string' }, 400);
        }

        const targetFolder = folder === 'gallery' ? 'gallery' : 'products';
        const declaredMime = mimeType || 'image/jpeg';

        if (!declaredMime.startsWith('image/')) {
          return jsonResponse({ error: `Invalid image type: ${declaredMime}` }, 400);
        }

        const binaryData = base64ToUint8Array(fileData);

        const MAX_SIZE = 15 * 1024 * 1024;
        if (binaryData.length > MAX_SIZE) {
          return jsonResponse({ error: 'File size exceeds 15MB limit' }, 400);
        }

        let extension = 'jpg';
        if (declaredMime.includes('png')) extension = 'png';
        else if (declaredMime.includes('webp')) extension = 'webp';
        else if (declaredMime.includes('jpeg') || declaredMime.includes('jpg')) extension = 'jpg';
        else if (declaredMime.includes('svg')) extension = 'svg';
        else if (declaredMime.includes('gif')) extension = 'gif';

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
            console.warn('[Cloudflare Worker] Firebase Storage upload error:', fbErr);
          }
        }

        // Try R2 if bound
        if (env?.BUCKET && typeof env.BUCKET.put === 'function') {
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

        // Fallback: Data URI
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
    if (pathname === '/api/images/delete') {
      if (request.method !== 'POST' && request.method !== 'DELETE') {
        return jsonResponse({ error: `Method ${request.method} Not Allowed. Use POST or DELETE.` }, 405);
      }

      try {
        const body = await request.json();
        const { url: imageUrl } = body;
        if (!imageUrl) {
          return jsonResponse({ error: 'Missing image URL' }, 400);
        }

        const authHeader = request.headers.get('Authorization');
        if (imageUrl.includes('firebasestorage.googleapis.com') && authHeader) {
          try {
            await fetch(imageUrl, {
              method: 'DELETE',
              headers: { 'Authorization': authHeader },
            });
          } catch (e) {
            console.warn('[Cloudflare Worker] Delete error:', e);
          }
        }

        return jsonResponse({ success: true, message: 'Image deleted or unlinked successfully' });
      } catch (err) {
        return jsonResponse({ error: err?.message || 'Error deleting image' }, 500);
      }
    }

    // 5. Catch-all for any other unmatched /api/* route -> Return 404 JSON (NOT SPA HTML)
    if (pathname.startsWith('/api/')) {
      return jsonResponse({ error: `API endpoint "${pathname}" not found.` }, 404);
    }

    // 6. Static Assets fallback (Cloudflare Workers ASSETS binding or Pages)
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
