/**
 * Favour Business Ventures
 * Cloudflare Worker
 *
 * Handles:
 * - SPA/static assets
 * - Image uploads
 * - Image retrieval
 * - Image deletion
 * - System health monitoring
 * - Human-readable health warnings
 *
 * Image storage:
 * Cloudflare KV through the IMAGES_KV binding.
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


/* =========================================================
   CONFIGURATION
   ========================================================= */

const WORKER_VERSION = '2.0.0';

const SERVICE_NAME =
  'Favour Business Ventures API (Cloudflare Worker)';

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;


/* =========================================================
   CORS
   ========================================================= */

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Methods':
    'GET, POST, PUT, DELETE, OPTIONS, HEAD',

  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Range',

  'Access-Control-Max-Age':
    '86400',
};


/* =========================================================
   RESPONSE HELPERS
   ========================================================= */

function jsonResponse(
  data: any,
  status = 200
): Response {

  return new Response(
    JSON.stringify(data, null, 2),
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


/* =========================================================
   BASE64 → BINARY
   ========================================================= */

function base64ToUint8Array(
  base64: string
): Uint8Array {

  let clean = base64;

  if (
    clean.includes(';base64,')
  ) {
    clean =
      clean.split(';base64,')[1];
  }

  clean =
    clean.replace(
      /[\r\n\s]/g,
      ''
    );

  const binaryString =
    atob(clean);

  const len =
    binaryString.length;

  const bytes =
    new Uint8Array(len);

  for (
    let i = 0;
    i < len;
    i++
  ) {

    bytes[i] =
      binaryString.charCodeAt(i);
  }

  return bytes;
}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

async function handleHealthRequest(
  env: Env
): Promise<Response> {

  const warnings: string[] = [];

  const checks: Record<string, any> = {};


  /* -------------------------------------------------------
     Check Cloudflare Worker
     ------------------------------------------------------- */

  checks.worker = {
    status: 'healthy',
    message:
      'Cloudflare Worker is running correctly.',
    version:
      WORKER_VERSION,
  };


  /* -------------------------------------------------------
     Check image storage
     ------------------------------------------------------- */

  if (env.IMAGES_KV) {

    checks.imageStorage = {
      status: 'healthy',
      provider: 'Cloudflare KV',
      message:
        'Image storage is connected and available.',
    };

  } else {

    checks.imageStorage = {
      status: 'error',
      provider: 'Cloudflare KV',
      message:
        'Image storage is NOT connected.',
    };

    warnings.push(
      'WARNING: IMAGES_KV is missing. Image uploads, image retrieval, and image deletion will not work.'
    );
  }


  /* -------------------------------------------------------
     Check website assets
     ------------------------------------------------------- */

  if (
    env.ASSETS &&
    typeof env.ASSETS.fetch ===
      'function'
  ) {

    checks.website = {
      status: 'healthy',
      message:
        'Website frontend assets are connected.',
    };

  } else {

    checks.website = {
      status: 'warning',
      message:
        'Website asset binding was not detected. The API may still work, but the frontend deployment should be checked.',
    };

    warnings.push(
      'WARNING: ASSETS binding was not detected. Check the Cloudflare Pages/Workers static asset configuration.'
    );
  }


  /* -------------------------------------------------------
     Overall status
     ------------------------------------------------------- */

  let overallStatus =
    'healthy';

  if (
    !env.IMAGES_KV
  ) {

    overallStatus =
      'error';

  } else if (
    warnings.length > 0
  ) {

    overallStatus =
      'warning';
  }


  /* -------------------------------------------------------
     Human-readable message
     ------------------------------------------------------- */

  let message =
    'Everything looks good. The website API and image storage are ready.';

  if (
    overallStatus ===
    'warning'
  ) {

    message =
      'The website is running, but there is something you should check.';

  } else if (
    overallStatus ===
    'error'
  ) {

    message =
      'The website API is running, but image storage is not configured correctly.';
  }


  return jsonResponse({

    status:
      overallStatus,

    message,

    service:
      SERVICE_NAME,

    version:
      WORKER_VERSION,

    timestamp:
      new Date().toISOString(),

    checks,

    warnings,

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


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

async function handleImageUpload(
  request: Request,
  env: Env
): Promise<Response> {

  try {

    /* -----------------------------------------------------
       Check KV
       ----------------------------------------------------- */

    if (!env.IMAGES_KV) {

      console.error(
        '[Cloudflare Worker] IMAGES_KV binding is missing.'
      );

      return jsonResponse(
        {
          success: false,

          error:
            'Image storage is not configured.',

          explanation:
            'The website cannot save images because the Cloudflare KV storage connection is missing.',

          fix:
            'Open Cloudflare Worker settings and make sure the IMAGES_KV KV namespace is connected to this Worker.',
        },

        500
      );
    }


    /* -----------------------------------------------------
       Read authentication token
       ----------------------------------------------------- */

    const authHeader =
      request.headers.get(
        'Authorization'
      ) ||
      request.headers.get(
        'authorization'
      );

    const idToken =
      authHeader &&
      authHeader.startsWith(
        'Bearer '
      )
        ? authHeader
            .substring(7)
            .trim()
        : null;


    /* -----------------------------------------------------
       Parse JSON
       ----------------------------------------------------- */

    let body: any;

    try {

      body =
        await request.json();

    } catch {

      return jsonResponse(
        {
          success: false,

          error:
            'Invalid JSON payload.',

          explanation:
            'The browser sent an invalid image upload request.',
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


    /* -----------------------------------------------------
       Validate file data
       ----------------------------------------------------- */

    if (
      !fileData ||
      typeof fileData !==
        'string'
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            'Missing or invalid fileData.',

          explanation:
            'No valid image data was received from the website.',
        },

        400
      );
    }


    /* -----------------------------------------------------
       Validate folder
       ----------------------------------------------------- */

    const targetFolder =
      folder === 'gallery'
        ? 'gallery'
        : 'products';


    /* -----------------------------------------------------
       Validate MIME type
       ----------------------------------------------------- */

    const declaredMime =
      mimeType ||
      'image/jpeg';

    if (
      !declaredMime.startsWith(
        'image/'
      )
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            `Invalid image type: ${declaredMime}`,

          explanation:
            'Only image files are allowed.',
        },

        400
      );
    }


    /* -----------------------------------------------------
       Extract raw base64
       ----------------------------------------------------- */

    let rawBase64 =
      fileData;

    if (
      rawBase64.includes(
        ';base64,'
      )
    ) {

      rawBase64 =
        rawBase64.split(
          ';base64,'
        )[1];
    }

    rawBase64 =
      rawBase64.replace(
        /[\r\n\s]/g,
        ''
      );


    /* -----------------------------------------------------
       Decode image
       ----------------------------------------------------- */

    let binaryData: Uint8Array;

    try {

      binaryData =
        base64ToUint8Array(
          rawBase64
        );

    } catch (
      error: any
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            'Image decoding failed.',

          explanation:
            'The image data sent by the browser could not be read.',

          details:
            error?.message ||
            String(error),
        },

        400
      );
    }


    /* -----------------------------------------------------
       Check file size
       ----------------------------------------------------- */

    if (
      binaryData.length >
      MAX_IMAGE_SIZE
    ) {

      return jsonResponse(
        {
          success: false,

          error:
            'Image is too large.',

          explanation:
            'The maximum allowed image size is 10MB.',

          receivedBytes:
            binaryData.length,

          maximumBytes:
            MAX_IMAGE_SIZE,
        },

        400
      );
    }


    /* -----------------------------------------------------
       Determine extension
       ----------------------------------------------------- */

    let extension =
      'jpg';

    if (
      declaredMime.includes(
        'png'
      )
    ) {

      extension =
        'png';

    } else if (
      declaredMime.includes(
        'webp'
      )
    ) {

      extension =
        'webp';

    } else if (
      declaredMime.includes(
        'jpeg'
      ) ||
      declaredMime.includes(
        'jpg'
      )
    ) {

      extension =
        'jpg';

    } else if (
      declaredMime.includes(
        'svg'
      )
    ) {

      extension =
        'svg';

    } else if (
      declaredMime.includes(
        'gif'
      )
    ) {

      extension =
        'gif';
    }


    /* -----------------------------------------------------
       Clean filename
       ----------------------------------------------------- */

    const rawName =
      (
        fileName ||
        'image'
      )

        .replace(
          /\.[^/.]+$/,
          ''
        )

        .toLowerCase()

        .replace(
          /[^a-z0-9_-]/g,
          '_'
        )

        .replace(
          /_+/g,
          '_'
        );


    /* -----------------------------------------------------
       Generate unique filename
       ----------------------------------------------------- */

    const timestamp =
      Date.now();

    const cleanFileName =
      `${timestamp}_${rawName}.${extension}`;


    /* -----------------------------------------------------
       Generate KV key
       ----------------------------------------------------- */

    const storageKey =
      `${targetFolder}_${cleanFileName}`;


    /* -----------------------------------------------------
       Prepare KV record
       ----------------------------------------------------- */

    const kvValue =
      JSON.stringify({

        fileName:
          cleanFileName,

        folder:
          targetFolder,

        mimeType:
          declaredMime,

        size:
          binaryData.length,

        data:
          rawBase64,

        createdAt:
          new Date()
            .toISOString(),

      });


    console.log(
      '[Cloudflare Worker] Saving image:',
      {
        storageKey,

        folder:
          targetFolder,

        size:
          binaryData.length,

        mimeType:
          declaredMime,

        authenticated:
          Boolean(idToken),
      }
    );


    /* -----------------------------------------------------
       SAVE TO CLOUDFLARE KV
       ----------------------------------------------------- */

    await env.IMAGES_KV.put(
      storageKey,
      kvValue
    );


    /* -----------------------------------------------------
       Public image URL
       ----------------------------------------------------- */

    const publicUrl =
      `/api/images/raw/${storageKey}`;


    console.log(
      '[Cloudflare Worker] Image saved:',
      publicUrl
    );


    return jsonResponse({

      success:
        true,

      message:
        'Image uploaded successfully.',

      url:
        publicUrl,

      fileName:
        cleanFileName,

      size:
        binaryData.length,

      mimeType:
        declaredMime,

      provider:
        'cloudflare-kv',

    });

  } catch (
    error: any
  ) {

    console.error(
      '[Cloudflare Worker] Image upload failed:',
      error
    );

    return jsonResponse(
      {

        success:
          false,

        error:
          error?.message ||
          'Server error uploading image.',

        explanation:
          'The server encountered an unexpected problem while saving the image.',

      },

      500
    );
  }
}


/* =========================================================
   IMAGE RETRIEVAL
   ========================================================= */

async function handleGetRawImage(
  storageKey: string,
  env: Env
): Promise<Response> {

  try {

    /* -----------------------------------------------------
       Check KV
       ----------------------------------------------------- */

    if (!env.IMAGES_KV) {

      return new Response(
        'Image storage is not configured. Please check the IMAGES_KV binding.',
        {
          status: 500,
          headers:
            CORS_HEADERS,
        }
      );
    }


    /* -----------------------------------------------------
       Clean storage key
       ----------------------------------------------------- */

    const cleanKey =
      decodeURIComponent(
        storageKey
      )

        .replace(
          /[^a-zA-Z0-9_.-]/g,
          ''
        );


    if (!cleanKey) {

      return new Response(
        'Image key is missing.',
        {
          status: 404,
          headers:
            CORS_HEADERS,
        }
      );
    }


    /* -----------------------------------------------------
       Get image from KV
       ----------------------------------------------------- */

    const storedValue =
      await env.IMAGES_KV.get(
        cleanKey
      );


    if (!storedValue) {

      return new Response(
        'Image Not Found.',
        {
          status: 404,
          headers:
            CORS_HEADERS,
        }
      );
    }


    /* -----------------------------------------------------
       Parse stored record
       ----------------------------------------------------- */

    let record: any;

    try {

      record =
        JSON.parse(
          storedValue
        );

    } catch {

      return new Response(
        'Invalid Image Record.',
        {
          status: 404,
          headers:
            CORS_HEADERS,
        }
      );
    }


    if (
      !record ||
      !record.data
    ) {

      return new Response(
        'Invalid Image Record.',
        {
          status: 404,
          headers:
            CORS_HEADERS,
        }
      );
    }


    /* -----------------------------------------------------
       Convert base64 to binary
       ----------------------------------------------------- */

    const binaryData =
      base64ToUint8Array(
        record.data
      );


    /* -----------------------------------------------------
       Return image
       ----------------------------------------------------- */

    return new Response(
      binaryData,
      {

        status:
          200,

        headers: {

          'Content-Type':
            record.mimeType ||
            'image/jpeg',

          'Content-Length':
            String(
              binaryData.length
            ),

          'Cache-Control':
            'public, max-age=31536000, immutable',

          ...CORS_HEADERS,

        },

      }
    );

  } catch (
    error
  ) {

    console.error(
      '[Cloudflare Worker] Image retrieval failed:',
      error
    );

    return new Response(
      'Error retrieving image. Please check the Worker and IMAGES_KV configuration.',
      {
        status: 500,
        headers:
          CORS_HEADERS,
      }
    );
  }
}


/* =========================================================
   IMAGE DELETE
   ========================================================= */

async function handleImageDelete(
  request: Request,
  env: Env
): Promise<Response> {

  try {

    /* -----------------------------------------------------
       Check KV
       ----------------------------------------------------- */

    if (!env.IMAGES_KV) {

      return jsonResponse(
        {

          success:
            false,

          error:
            'Image storage is not configured.',

          explanation:
            'The IMAGES_KV connection is missing from this Worker.',

        },

        500
      );
    }


    /* -----------------------------------------------------
       Parse request
       ----------------------------------------------------- */

    let body: any;

    try {

      body =
        await request.json();

    } catch {

      return jsonResponse(
        {

          success:
            false,

          error:
            'Invalid JSON body.',

          explanation:
            'The browser sent an invalid delete request.',

        },

        400
      );
    }


    const {
      url,
    } = body;


    if (!url) {

      return jsonResponse(
        {

          success:
            false,

          error:
            'Missing image URL.',

          explanation:
            'The server needs the image URL to know which image to delete.',

        },

        400
      );
    }


    /* -----------------------------------------------------
       Extract storage key
       ----------------------------------------------------- */

    let storageKey =
      '';


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
      url.includes(
        '/uploads/'
      )
    ) {

      const parts =
        url

          .replace(
            /^\/uploads\//,
            ''
          )

          .split('/');


      if (
        parts.length ===
        2
      ) {

        storageKey =
          `${parts[0]}_${parts[1]}`;

      } else {

        storageKey =
          parts[0];
      }
    }


    /* -----------------------------------------------------
       Delete image
       ----------------------------------------------------- */

    if (storageKey) {

      const cleanKey =
        decodeURIComponent(
          storageKey
        )

          .replace(
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


      return jsonResponse({

        success:
          true,

        message:
          'Image deleted successfully.',

        key:
          cleanKey,

      });
    }


    return jsonResponse(
      {

        success:
          false,

        error:
          'Could not determine the image storage key.',

        explanation:
          'The supplied image URL is not in a format this Worker understands.',

      },

      400
    );

  } catch (
    error: any
  ) {

    console.error(
      '[Cloudflare Worker] Image deletion failed:',
      error
    );

    return jsonResponse(
      {

        success:
          false,

        error:
          error?.message ||
          'Error deleting image.',

        explanation:
          'The server could not delete the image.',

      },

      500
    );
  }
}


/* =========================================================
   CLOUDFLARE WORKER ENTRY POINT
   ========================================================= */

export default {

  async fetch(
    request: Request,
    env: Env,
    ctx: any
  ): Promise<Response> {

    const url =
      new URL(
        request.url
      );

    const pathname =
      url.pathname;


    /* -----------------------------------------------------
       1. GLOBAL CORS PREFLIGHT
       ----------------------------------------------------- */

    if (
      request.method ===
      'OPTIONS'
    ) {

      return new Response(
        null,
        {
          status:
            204,

          headers:
            CORS_HEADERS,
        }
      );
    }


    /* -----------------------------------------------------
       2. HEALTH CHECK
       ----------------------------------------------------- */

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

        return handleHealthRequest(
          env
        );
      }


      return jsonResponse(
        {

          success:
            false,

          error:
            `Method ${request.method} Not Allowed.`,

          explanation:
            'The health page can only be opened with GET.',

        },

        405
      );
    }


    /* -----------------------------------------------------
       3. IMAGE UPLOAD
       ----------------------------------------------------- */

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

          success:
            false,

          error:
            `Method ${request.method} Not Allowed.`,

          explanation:
            'Image uploads must use POST.',

        },

        405
      );
    }


    /* -----------------------------------------------------
       4. IMAGE DELETE
       ----------------------------------------------------- */

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

          success:
            false,

          error:
            `Method ${request.method} Not Allowed.`,

          explanation:
            'Image deletion must use POST or DELETE.',

        },

        405
      );
    }


    /* -----------------------------------------------------
       5. DIRECT IMAGE RETRIEVAL
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       6. UNKNOWN API ENDPOINT
       ----------------------------------------------------- */

    if (
      pathname.startsWith(
        '/api/'
      )
    ) {

      return jsonResponse(
        {

          success:
            false,

          error:
            `API endpoint "${pathname}" not found.`,

          explanation:
            'The requested API route does not exist on this Worker.',

        },

        404
      );
    }


    /* -----------------------------------------------------
       7. BACKWARD-COMPATIBLE UPLOADS ROUTE
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       8. FRONTEND / SPA
       ----------------------------------------------------- */

    if (
      env.ASSETS &&
      typeof env.ASSETS.fetch ===
        'function'
    ) {

      return env.ASSETS.fetch(
        request
      );
    }


    /* -----------------------------------------------------
       9. FINAL FALLBACK
       ----------------------------------------------------- */

    return fetch(
      request
    );
  },

};
