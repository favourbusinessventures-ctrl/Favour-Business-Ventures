/**
 * Cloudflare Worker Entry Point
 *
 * Handles:
 * - SPA/static assets
 * - Image uploads
 * - Image retrieval
 * - Image deletion
 *
 * Image storage uses Cloudflare KV through the IMAGES_KV binding.
 */

interface Env {
  ASSETS?: {
    fetch: (
      req: Request | string,
      init?: RequestInit
    ) => Promise<Response>;
  };

  IMAGES_KV?: {
    put: (
      key: string,
      value: string
    ) => Promise<void>;

    get: (
      key: string
    ) => Promise<string | null>;

    delete: (
      key: string
    ) => Promise<void>;
  };

  STORAGE_BUCKET?: string;

  [key: string]: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods':
    'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Range',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(
  data: any,
  status = 200
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type':
          'application/json; charset=utf-8',
        ...CORS_HEADERS,
      },
    }
  );
}

/**
 * Convert base64 data into binary bytes.
 */
function base64ToUint8Array(
  base64: string
): Uint8Array {
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

/**
 * Health endpoint.
 */
async function handleHealthRequest(): Promise<Response> {
  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service:
      'Favour Business Ventures API (Cloudflare Worker)',
    storage: 'cloudflare-kv',
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

/**
 * Upload image to Cloudflare KV.
 */
async function handleImageUpload(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    /**
     * Make sure the KV binding exists.
     */
    if (!env.IMAGES_KV) {
      console.error(
        '[Cloudflare Worker] IMAGES_KV binding is missing.'
      );

      return jsonResponse(
        {
          error:
            'Image storage is not configured. IMAGES_KV binding is missing.',
        },
        500
      );
    }

    /**
     * Read Firebase auth token.
     *
     * We keep accepting the token because the frontend
     * already sends it. KV itself does not require this
     * token to perform the storage operation.
     */
    const authHeader =
      request.headers.get('Authorization') ||
      request.headers.get('authorization');

    const idToken =
      authHeader &&
      authHeader.startsWith('Bearer ')
        ? authHeader.substring(7).trim()
        : null;

    /**
     * Parse request body.
     */
    let body: any;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          error:
            'Invalid JSON payload in request body.',
        },
        400
      );
    }

    const {
      fileData,
      fileName,
      folder,
      mimeType,
    } = body;

    /**
     * Validate file data.
     */
    if (
      !fileData ||
      typeof fileData !== 'string'
    ) {
      return jsonResponse(
        {
          error:
            'Missing or invalid "fileData" base64 string.',
        },
        400
      );
    }

    /**
     * Validate folder.
     */
    const targetFolder =
      folder === 'gallery'
        ? 'gallery'
        : 'products';

    /**
     * Validate MIME type.
     */
    const declaredMime =
      mimeType || 'image/jpeg';

    if (!declaredMime.startsWith('image/')) {
      return jsonResponse(
        {
          error:
            `Invalid image type: ${declaredMime}`,
        },
        400
      );
    }

    /**
     * Extract raw base64 data.
     */
    let rawBase64 = fileData;

    if (rawBase64.includes(';base64,')) {
      rawBase64 =
        rawBase64.split(';base64,')[1];
    }

    rawBase64 =
      rawBase64.replace(/[\r\n\s]/g, '');

    /**
     * Decode base64.
     */
    let binaryData: Uint8Array;

    try {
      binaryData =
        base64ToUint8Array(rawBase64);
    } catch (error: any) {
      return jsonResponse(
        {
          error:
            `Base64 decoding failed: ${
              error?.message || error
            }`,
        },
        400
      );
    }

    /**
     * Maximum image size: 10MB.
     */
    const MAX_SIZE =
      10 * 1024 * 1024;

    if (binaryData.length > MAX_SIZE) {
      return jsonResponse(
        {
          error:
            'File size exceeds the 10MB limit.',
        },
        400
      );
    }

    /**
     * Determine file extension.
     */
    let extension = 'jpg';

    if (declaredMime.includes('png')) {
      extension = 'png';
    } else if (
      declaredMime.includes('webp')
    ) {
      extension = 'webp';
    } else if (
      declaredMime.includes('jpeg') ||
      declaredMime.includes('jpg')
    ) {
      extension = 'jpg';
    } else if (
      declaredMime.includes('svg')
    ) {
      extension = 'svg';
    } else if (
      declaredMime.includes('gif')
    ) {
      extension = 'gif';
    }

    /**
     * Clean the original filename.
     */
    const rawName = (
      fileName || 'image'
    )
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    /**
     * Create unique filename.
     */
    const timestamp = Date.now();

    const cleanFileName =
      `${timestamp}_${rawName}.${extension}`;

    /**
     * Create KV key.
     *
     * Example:
     * products_1755555555_stockfish.jpg
     */
    const storageKey =
      `${targetFolder}_${cleanFileName}`;

    /**
     * Store image information in KV.
     *
     * The base64 image is stored together with
     * its metadata.
     */
    const kvValue = JSON.stringify({
      fileName: cleanFileName,
      folder: targetFolder,
      mimeType: declaredMime,
      size: binaryData.length,
      data: rawBase64,
      createdAt:
        new Date().toISOString(),
    });

    console.log(
      '[Cloudflare Worker] Saving image to KV:',
      {
        storageKey,
        folder: targetFolder,
        size: binaryData.length,
        mimeType: declaredMime,
        authenticated: Boolean(idToken),
      }
    );

    /**
     * SAVE TO CLOUDFLARE KV
     */
    await env.IMAGES_KV.put(
      storageKey,
      kvValue
    );

    /**
     * Public image URL.
     */
    const publicUrl =
      `/api/images/raw/${storageKey}`;

    console.log(
      '[Cloudflare Worker] Image saved successfully:',
      publicUrl
    );

    return jsonResponse({
      success: true,
      url: publicUrl,
      fileName: cleanFileName,
      size: binaryData.length,
      mimeType: declaredMime,
      provider: 'cloudflare-kv',
    });
  } catch (error: any) {
    console.error(
      '[Cloudflare Worker] Image upload failed:',
      error
    );

    return jsonResponse(
      {
        error:
          error?.message ||
          'Server error uploading image.',
      },
      500
    );
  }
}

/**
 * Retrieve an image from Cloudflare KV.
 */
async function handleGetRawImage(
  storageKey: string,
  env: Env
): Promise<Response> {
  try {
    /**
     * Make sure KV exists.
     */
    if (!env.IMAGES_KV) {
      return new Response(
        'Image storage is not configured.',
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }

    /**
     * Clean key.
     */
    const cleanKey =
      decodeURIComponent(storageKey)
        .replace(
          /[^a-zA-Z0-9_.-]/g,
          ''
        );

    if (!cleanKey) {
      return new Response(
        'Not Found',
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    /**
     * Get image from KV.
     */
    const storedValue =
      await env.IMAGES_KV.get(
        cleanKey
      );

    if (!storedValue) {
      return new Response(
        'Image Not Found',
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    /**
     * Parse stored record.
     */
    let record: any;

    try {
      record =
        JSON.parse(storedValue);
    } catch {
      return new Response(
        'Invalid Image Record',
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    if (
      !record ||
      !record.data
    ) {
      return new Response(
        'Invalid Image Record',
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    /**
     * Convert base64 back to binary.
     */
    const binaryData =
      base64ToUint8Array(
        record.data
      );

    /**
     * Return image.
     */
    return new Response(
      binaryData,
      {
        status: 200,
        headers: {
          'Content-Type':
            record.mimeType ||
            'image/jpeg',

          'Content-Length':
            String(binaryData.length),

          'Cache-Control':
            'public, max-age=31536000, immutable',

          ...CORS_HEADERS,
        },
      }
    );
  } catch (error) {
    console.error(
      '[Cloudflare Worker] KV image retrieval error:',
      error
    );

    return new Response(
      'Error retrieving image',
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * Delete image from Cloudflare KV.
 */
async function handleImageDelete(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    /**
     * Make sure KV exists.
     */
    if (!env.IMAGES_KV) {
      return jsonResponse(
        {
          error:
            'Image storage is not configured. IMAGES_KV binding is missing.',
        },
        500
      );
    }

    /**
     * Parse request body.
     */
    let body: any;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          error:
            'Invalid JSON body.',
        },
        400
      );
    }

    const { url } = body;

    if (!url) {
      return jsonResponse(
        {
          error:
            'Missing image URL.',
        },
        400
      );
    }

    /**
     * Extract storage key.
     */
    let storageKey = '';

    if (
      url.includes(
        '/api/images/raw/'
      )
    ) {
      storageKey =
        url.split(
          '/api/images/raw/'
        )[1];
    } else if (
      url.includes('/uploads/')
    ) {
      const parts =
        url
          .replace(
            /^\/uploads\//,
            ''
          )
          .split('/');

      if (parts.length === 2) {
        storageKey =
          `${parts[0]}_${parts[1]}`;
      } else {
        storageKey = parts[0];
      }
    }

    /**
     * Delete from KV.
     */
    if (storageKey) {
      const cleanKey =
        decodeURIComponent(
          storageKey
        ).replace(
          /[^a-zA-Z0-9_.-]/g,
          ''
        );

      await env.IMAGES_KV.delete(
        cleanKey
      );

      console.log(
        '[Cloudflare Worker] Image deleted:',
        cleanKey
      );
    }

    return jsonResponse({
      success: true,
      message:
        'Image deleted successfully.',
    });
  } catch (error: any) {
    console.error(
      '[Cloudflare Worker] Image deletion failed:',
      error
    );

    return jsonResponse(
      {
        error:
          error?.message ||
          'Error deleting image.',
      },
      500
    );
  }
}

/**
 * Cloudflare Worker entry point.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: any
  ): Promise<Response> {
    const url =
      new URL(request.url);

    const pathname =
      url.pathname;

    /**
     * 1. Global CORS preflight.
     */
    if (
      request.method ===
      'OPTIONS'
    ) {
      return new Response(
        null,
        {
          status: 204,
          headers: CORS_HEADERS,
        }
      );
    }

    /**
     * 2. Health endpoint.
     */
    if (
      pathname ===
      '/api/health'
    ) {
      if (
        request.method ===
          'GET' ||
        request.method ===
          'HEAD'
      ) {
        return handleHealthRequest();
      }

      return jsonResponse(
        {
          error:
            `Method ${request.method} Not Allowed. Use GET.`,
        },
        405
      );
    }

    /**
     * 3. Image upload endpoint.
     */
    if (
      pathname ===
      '/api/images/upload'
    ) {
      if (
        request.method ===
        'POST'
      ) {
        return handleImageUpload(
          request,
          env
        );
      }

      return jsonResponse(
        {
          error:
            `Method ${request.method} Not Allowed. Use POST for /api/images/upload.`,
        },
        405
      );
    }

    /**
     * 4. Image delete endpoint.
     */
    if (
      pathname ===
      '/api/images/delete'
    ) {
      if (
        request.method ===
          'POST' ||
        request.method ===
          'DELETE'
      ) {
        return handleImageDelete(
          request,
          env
        );
      }

      return jsonResponse(
        {
          error:
            `Method ${request.method} Not Allowed. Use POST or DELETE.`,
        },
        405
      );
    }

    /**
     * 5. Direct KV image retrieval.
     */
    if (
      pathname.startsWith(
        '/api/images/raw/'
      )
    ) {
      const storageKey =
        pathname.replace(
          /^\/api\/images\/raw\//,
          ''
        );

      return handleGetRawImage(
        storageKey,
        env
      );
    }

    /**
     * 6. Unknown API endpoint.
     */
    if (
      pathname.startsWith(
        '/api/'
      )
    ) {
      return jsonResponse(
        {
          error:
            `API endpoint "${pathname}" not found.`,
        },
        404
      );
    }

    /**
     * 7. Backward-compatible /uploads/ route.
     */
    if (
      pathname.startsWith(
        '/uploads/'
      )
    ) {
      const cleanPath =
        pathname.replace(
          /^\/uploads\//,
          ''
        );

      const parts =
        cleanPath.split('/');

      const storageKey =
        parts.length === 2
          ? `${parts[0]}_${parts[1]}`
          : cleanPath;

      const imageResponse =
        await handleGetRawImage(
          storageKey,
          env
        );

      if (
        imageResponse.status ===
        200
      ) {
        return imageResponse;
      }
    }

    /**
     * 8. Serve frontend assets / SPA.
     */
    if (
      env.ASSETS &&
      typeof env.ASSETS.fetch ===
        'function'
    ) {
      return env.ASSETS.fetch(
        request
      );
    }

    /**
     * Final fallback.
     */
    return fetch(request);
  },
};
