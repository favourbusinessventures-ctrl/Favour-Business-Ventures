interface Env {
  BUCKET?: any;
  [key: string]: any;
}

interface EventContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, any>;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
};

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestPost = async (context: EventContext): Promise<Response> => {
  const { request, env } = context;

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload in request body' }, 400);
    }

    const { url } = body;
    if (!url || typeof url !== 'string') {
      return jsonResponse({ error: 'Missing image URL' }, 400);
    }

    // If Firebase Storage URL and auth header present
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
};

export const onRequestDelete = onRequestPost;

export const onRequest = async (context: EventContext): Promise<Response> => {
  const { request } = context;
  if (request.method === 'OPTIONS') {
    return onRequestOptions();
  }
  if (request.method === 'POST' || request.method === 'DELETE') {
    return onRequestPost(context);
  }
  return jsonResponse({ error: `Method ${request.method} Not Allowed. Use POST or DELETE.` }, 405);
};
