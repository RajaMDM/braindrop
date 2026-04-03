/**
 * tfidf.js
 * Client-side TF-IDF retrieval pipeline for RAG over NCERT content.
 * Extracted from index.legacy.html (chunkText, tokenize, buildChunkIndex, ragSearch).
 *
 * All functions are pure — no global state. The caller manages the index object.
 */

/**
 * Split text into overlapping chunks roughly `chunkSize` characters long.
 * Splits on sentence boundaries (., !, ?, devanagari danda, newlines).
 *
 * @param {string} text - Source text to chunk
 * @param {number} [chunkSize=500] - Target chunk length in characters
 * @param {number} [overlap=100] - Approximate character overlap between chunks
 * @returns {string[]} Array of text chunks
 */
export function chunkText(text, chunkSize = 500, overlap = 100) {
  const chunks = [];
  const sentences = text.split(/(?<=[.!?।\n])\s+/);
  let current = '';

  for (const s of sentences) {
    if ((current + ' ' + s).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      // Keep trailing words from previous chunk for overlap
      const words = current.split(' ');
      current = words.slice(-Math.floor(overlap / 6)).join(' ') + ' ' + s;
    } else {
      current += (current ? ' ' : '') + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Tokenize text into lowercase words (length > 2), stripping punctuation.
 *
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Build a TF-IDF chunk index from a body of text.
 *
 * @param {string} text - Full document text (e.g. extracted PDF content)
 * @param {number} [chunkSize=500]
 * @param {number} [overlap=100]
 * @returns {{ chunks: Array<{text: string, tokens: string[], tf: Object}>, idf: Object, total: number }}
 */
export function buildChunkIndex(text, chunkSize = 500, overlap = 100) {
  const rawChunks = chunkText(text, chunkSize, overlap);
  const df = {};
  const chunkTokens = [];

  rawChunks.forEach((chunk, i) => {
    const tokens = tokenize(chunk);
    const unique = new Set(tokens);
    chunkTokens.push({ text: chunk, tokens, tf: {} });
    unique.forEach((t) => {
      df[t] = (df[t] || 0) + 1;
    });
    tokens.forEach((t) => {
      chunkTokens[i].tf[t] = (chunkTokens[i].tf[t] || 0) + 1;
    });
  });

  const n = rawChunks.length;
  const idf = {};
  Object.keys(df).forEach((t) => {
    idf[t] = Math.log((n + 1) / (df[t] + 1)) + 1;
  });

  return { chunks: chunkTokens, idf, total: n };
}

/**
 * Search the TF-IDF index for chunks most relevant to the query.
 *
 * @param {{ chunks: Array, idf: Object, total: number }} index - Index built by buildChunkIndex
 * @param {string} query - User's search query
 * @param {number} [topK=5] - Number of top results to return
 * @returns {Array<{idx: number, score: number, text: string}>|null} Top results or null if nothing matches
 */
export function ragSearch(index, query, topK = 5) {
  if (!index || index.total === 0) return null;

  const qTokens = tokenize(query);
  const scores = index.chunks.map((chunk, i) => {
    let score = 0;
    qTokens.forEach((qt) => {
      const tf = chunk.tf[qt] || 0;
      const idfVal = index.idf[qt] || 0;
      score += tf * idfVal;
    });
    return { idx: i, score, text: chunk.text };
  });

  scores.sort((a, b) => b.score - a.score);
  const results = scores.slice(0, topK).filter((s) => s.score > 0);
  return results.length > 0 ? results : null;
}
