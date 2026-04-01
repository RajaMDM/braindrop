/**
 * BrainDrop Proxy — Cloudflare Worker
 * Routes AI API calls through the proxy so API keys stay server-side.
 *
 * Deploy: wrangler deploy --name braindrop-proxy
 *
 * Required environment secrets (set via Cloudflare dashboard or wrangler secret put):
 *   ANTHROPIC_API_KEY   — Anthropic (Claude) API key
 *   GEMINI_API_KEY      — Google Gemini API key
 *   GROQ_API_KEY        — Groq API key
 *   OPENAI_API_KEY      — OpenAI API key
 *   DEEPSEEK_API_KEY    — DeepSeek API key
 *   MISTRAL_API_KEY     — Mistral API key
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const body = await request.text();

    try {
      let response;

      switch (path) {

        // ─── Claude (Anthropic) ───
        case '/claude': {
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
            },
            body,
          });
          break;
        }

        // ─── Gemini (Google) ───
        case '/gemini': {
          const model = 'gemini-2.5-flash';
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          break;
        }

        // ─── OpenAI (GPT) ───
        case '/openai': {
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            },
            body,
          });
          break;
        }

        // ─── Groq ───
        case '/groq': {
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            },
            body,
          });
          break;
        }

        // ─── DeepSeek ───
        case '/deepseek': {
          response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
            },
            body,
          });
          break;
        }

        // ─── Mistral ───
        case '/mistral': {
          response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.MISTRAL_API_KEY}`,
            },
            body,
          });
          break;
        }

        default:
          return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          });
      }

      // Stream response back to client with CORS headers
      const responseBody = await response.text();
      return new Response(responseBody, {
        status: response.status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};
