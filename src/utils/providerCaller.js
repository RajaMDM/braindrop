/**
 * providerCaller.js
 * Calls each AI provider's API through the BrainDrop proxy (or direct for Ollama).
 * Extracted from index.legacy.html callProvider() and callProviderWithSys().
 *
 * Both functions accept an explicit `config` object instead of reading global state.
 */

const PROXY_BASE = 'https://braindrop-ai-proxy.raja-cloudmdm.workers.dev';

/**
 * Get the user's email from localStorage for the proxy auth header.
 * @returns {string}
 */
function getUserEmail() {
  try {
    return localStorage.getItem('userEmail') || '';
  } catch {
    return '';
  }
}

/**
 * Build standard headers for proxy requests.
 * @returns {Object}
 */
function proxyHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-User-Email': getUserEmail(),
  };
}

/**
 * Call an AI provider using the standard conversation pattern.
 * History entries are expected as `{ role: 'user'|'model', text: string }`.
 * The system prompt is generated externally and passed in.
 *
 * @param {string} provider    - claude | gemini | openai | groq | deepseek | mistral | nvidia | ollama
 * @param {string} userMsg     - The current user message
 * @param {string} systemPrompt- Full system prompt
 * @param {Array<{role:string, text:string}>} history - Recent conversation history
 * @param {Object} [config]    - Optional overrides
 * @param {string} [config.proxyUrl]  - Override proxy base URL
 * @param {string} [config.ollamaUrl] - Ollama base URL (default http://localhost:11434)
 * @param {string} [config.ollamaModel] - Ollama model name (default llama3.2)
 * @returns {Promise<string>} AI response text
 */
export async function callProvider(
  provider,
  userMsg,
  systemPrompt,
  history = [],
  config = {}
) {
  const proxy = config.proxyUrl || PROXY_BASE;
  const ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
  const ollamaModel = config.ollamaModel || 'llama3.2';
  const msgs = history.slice(-16);

  // Truncate system prompt to prevent oversized requests on free-tier providers
  const maxPromptLen = provider === 'claude' ? 40000 : 20000;
  const sysPrompt = systemPrompt.length > maxPromptLen ? systemPrompt.substring(0, maxPromptLen) + '\n[Context truncated for token limits]' : systemPrompt;

  // Helper: fetch with 30s timeout
  async function fetchWithTimeout(url, opts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  switch (provider) {
    case 'claude': {
      const messages = msgs.map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text,
      }));
      messages.push({ role: 'user', content: userMsg });
      const res = await fetchWithTimeout(`${proxy}/claude`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: sysPrompt,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.content?.[0]?.text || 'No response';
    }

    case 'gemini': {
      const contents = msgs.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));
      contents.push({ role: 'user', parts: [{ text: userMsg }] });
      const res = await fetchWithTimeout(`${proxy}/gemini`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sysPrompt }] },
          contents,
          generationConfig: { temperature: 0.75, maxOutputTokens: 4096, topP: 0.95 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    }

    case 'openai': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/openai`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 4096, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'groq': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/groq`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 4096,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'deepseek': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/deepseek`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 4096, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'mistral': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/mistral`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'mistral-small-latest',
          max_tokens: 4096,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'nvidia': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/nvidia`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'meta/llama-3.3-70b-instruct',
          max_tokens: 4096,
          temperature: 0.2,
          top_p: 0.7,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'ollama': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetch(`${ollamaUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: ollamaModel, messages, stream: false }),
      });
      const data = await res.json();
      if (data.error)
        throw new Error(data.error.message || JSON.stringify(data.error));
      return data.choices?.[0]?.message?.content || 'No response';
    }

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Call an AI provider with a custom system prompt and pre-formatted message history.
 * Used by the Classroom mode where each agent (teacher / classmate) has its own
 * system prompt and the history is formatted with speaker labels.
 *
 * `formattedMsgs` entries: `{ role: 'assistant'|'user', text: string }`
 *
 * @param {string} provider       - claude | gemini | openai | groq | deepseek | mistral | nvidia | ollama
 * @param {string} userMsg        - The current message to send
 * @param {string} systemPrompt   - Full system prompt for this agent
 * @param {Array<{role:string, text:string}>} formattedMsgs - Pre-formatted history
 * @param {Object} [config]       - Optional overrides (same shape as callProvider config)
 * @returns {Promise<string>} AI response text
 */
export async function callProviderWithSys(
  provider,
  userMsg,
  systemPrompt,
  formattedMsgs = [],
  config = {}
) {
  const proxy = config.proxyUrl || PROXY_BASE;
  const ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
  const ollamaModel = config.ollamaModel || 'llama3.2';
  const msgs = formattedMsgs;

  // Truncate system prompt for free-tier limits
  const maxLen = provider === 'claude' ? 40000 : 20000;
  const sysPrompt = systemPrompt.length > maxLen ? systemPrompt.substring(0, maxLen) + '\n[Context truncated]' : systemPrompt;

  // Timeout helper
  async function fetchWithTimeout(url, opts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try { const res = await fetch(url, { ...opts, signal: controller.signal }); clearTimeout(timer); return res; }
    catch (err) { clearTimeout(timer); throw err; }
  }

  switch (provider) {
    case 'claude': {
      const messages = msgs.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));
      messages.push({ role: 'user', content: userMsg });
      const res = await fetchWithTimeout(`${proxy}/claude`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: sysPrompt,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.content?.[0]?.text || 'No response';
    }

    case 'gemini': {
      const contents = msgs.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));
      contents.push({ role: 'user', parts: [{ text: userMsg }] });
      const res = await fetchWithTimeout(`${proxy}/gemini`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sysPrompt }] },
          contents,
          generationConfig: { temperature: 0.75, maxOutputTokens: 4096, topP: 0.95 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    }

    case 'openai': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/openai`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 4096, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'groq': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/groq`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 4096,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'deepseek': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/deepseek`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 4096, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'mistral': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/mistral`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'mistral-small-latest',
          max_tokens: 4096,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'nvidia': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetchWithTimeout(`${proxy}/nvidia`, {
        method: 'POST',
        headers: proxyHeaders(),
        body: JSON.stringify({
          model: 'meta/llama-3.3-70b-instruct',
          max_tokens: 4096,
          temperature: 0.2,
          top_p: 0.7,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || 'No response';
    }

    case 'ollama': {
      const messages = [
        { role: 'system', content: sysPrompt },
        ...msgs.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        { role: 'user', content: userMsg },
      ];
      const res = await fetch(`${ollamaUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: ollamaModel, messages, stream: false }),
      });
      const data = await res.json();
      if (data.error)
        throw new Error(data.error.message || JSON.stringify(data.error));
      return data.choices?.[0]?.message?.content || 'No response';
    }

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
