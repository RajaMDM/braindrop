/**
 * BrainDrop Proxy — Cloudflare Worker (Production)
 * Securely routes AI API calls so keys never touch the browser.
 *
 * Deploy:
 *   npx wrangler deploy
 *
 * Set secrets (one-time, via CLI or Cloudflare dashboard):
 *   npx wrangler secret put ANTHROPIC_API_KEY
 *   npx wrangler secret put GEMINI_API_KEY
 *   npx wrangler secret put GROQ_API_KEY
 *   npx wrangler secret put OPENAI_API_KEY
 *   npx wrangler secret put DEEPSEEK_API_KEY
 *   npx wrangler secret put MISTRAL_API_KEY
 *
 * Get free keys:
 *   Claude:   https://console.anthropic.com
 *   Gemini:   https://aistudio.google.com/apikey (free, no credit card)
 *   Groq:     https://console.groq.com/keys (free tier)
 *   OpenAI:   https://platform.openai.com/api-keys
 *   DeepSeek: https://platform.deepseek.com/api_keys
 *   Mistral:  https://console.mistral.ai/api-keys (free tier)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
};

/** Provider configurations — maps path to upstream URL + auth style */
const PROVIDERS = {
  '/claude': {
    url: 'https://api.anthropic.com/v1/messages',
    keyEnv: 'ANTHROPIC_API_KEY',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
  },
  '/gemini': {
    keyEnv: 'GEMINI_API_KEY',
    url: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    headers: () => ({ 'Content-Type': 'application/json' }),
  },
  '/openai': {
    url: 'https://api.openai.com/v1/chat/completions',
    keyEnv: 'OPENAI_API_KEY',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
  '/groq': {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyEnv: 'GROQ_API_KEY',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
  '/deepseek': {
    url: 'https://api.deepseek.com/chat/completions',
    keyEnv: 'DEEPSEEK_API_KEY',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
  '/mistral': {
    url: 'https://api.mistral.ai/v1/chat/completions',
    keyEnv: 'MISTRAL_API_KEY',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
  },
};

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ─── Health check ───
    if (path === '/' || path === '/health') {
      const status = {};
      for (const [route, cfg] of Object.entries(PROVIDERS)) {
        const name = route.slice(1);
        status[name] = env[cfg.keyEnv] ? 'configured' : 'missing-key';
      }
      return new Response(JSON.stringify({
        service: 'BrainDrop Proxy',
        status: 'ok',
        providers: status,
        timestamp: new Date().toISOString(),
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Only POST for AI calls
    if (request.method !== 'POST') {
      return json({ error: { message: 'Method not allowed' } }, 405);
    }

    // ─── Route to provider ───
    const provider = PROVIDERS[path];
    if (!provider) {
      return json({ error: { message: `Unknown endpoint: ${path}` } }, 404);
    }

    const apiKey = env[provider.keyEnv];
    if (!apiKey) {
      return json({ error: { message: `${path.slice(1)} is not configured. API key missing.` } }, 503);
    }

    try {
      const body = await request.text();
      const targetUrl = typeof provider.url === 'function' ? provider.url(apiKey) : provider.url;
      const headers = provider.headers(apiKey);

      const upstream = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body,
      });

      const responseBody = await upstream.text();

      return new Response(responseBody, {
        status: upstream.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return json({ error: { message: `Proxy error (${path.slice(1)}): ${err.message}` } }, 502);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
