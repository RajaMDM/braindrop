/**
 * markdownParser.js
 * Converts markdown text (with BrainDrop custom blocks) into structured output.
 * Extracted from index.legacy.html md(t) function.
 *
 * Returns { html, quizBlocks, flashcardBlocks, magicBlocks } so React can
 * render quiz/flashcard/magic blocks as dedicated components.
 */

/**
 * Parse markdown text that may contain <quiz-data>, <flashcard-data>, and
 * <magic-block> custom tags into structured output.
 *
 * @param {string} text - Raw markdown/AI response text
 * @returns {{ html: string, quizBlocks: Array, flashcardBlocks: Array, magicBlocks: Array }}
 */
export function parseMarkdown(text) {
  let t = text;

  // --- Extract quiz-data blocks before markdown processing ---
  const quizBlocks = [];
  t = t.replace(/<quiz-data>([\s\S]*?)<\/quiz-data>/gi, (match, json) => {
    try {
      quizBlocks.push(JSON.parse(json.trim()));
    } catch (e) {
      quizBlocks.push(null);
    }
    return `%%QUIZ_${quizBlocks.length - 1}%%`;
  });

  // --- Extract flashcard-data blocks ---
  const flashcardBlocks = [];
  t = t.replace(/<flashcard-data>([\s\S]*?)<\/flashcard-data>/gi, (match, json) => {
    try {
      flashcardBlocks.push(JSON.parse(json.trim()));
    } catch (e) {
      flashcardBlocks.push(null);
    }
    return `%%FC_${flashcardBlocks.length - 1}%%`;
  });

  // --- Extract magic-block tags ---
  const magicBlocks = [];
  t = t.replace(
    /<magic-block(?:\s+title="([^"]*)")?\s*>([\s\S]*?)<\/magic-block>/gi,
    (match, title, html) => {
      magicBlocks.push({ title: title || 'Interactive', html: html.trim() });
      return `%%MAGIC_${magicBlocks.length - 1}%%`;
    }
  );

  // --- Standard markdown → HTML conversion ---
  let html = t
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*?<\/li>\s*)+)/gs, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // --- Re-inject placeholder tokens ---
  // Magic blocks get a simple placeholder div with data attributes so React
  // can mount interactive iframes.  The legacy code rendered full iframes
  // inline; here we leave lightweight placeholders for the component layer.
  magicBlocks.forEach((mb, i) => {
    const escaped = mb.html.replace(/"/g, '&quot;');
    const uid = 'mb_' + Math.random().toString(36).slice(2, 8);
    const mbHTML = `<div class="magic-block" id="${uid}" data-magic-index="${i}">` +
      `<div class="mb-head"><span class="mb-label">⚡ Interactive${mb.title ? ' — ' + mb.title : ''}</span></div>` +
      `<iframe sandbox="allow-scripts" srcdoc="${escaped}"></iframe>` +
      `</div>`;
    html = html.replace(`%%MAGIC_${i}%%`, mbHTML);
  });

  quizBlocks.forEach((_qb, i) => {
    // Leave a placeholder div for React to hydrate with a Quiz component
    html = html.replace(`%%QUIZ_${i}%%`, `<div data-quiz-index="${i}"></div>`);
  });

  flashcardBlocks.forEach((_fb, i) => {
    // Leave a placeholder div for React to hydrate with a Flashcard component
    html = html.replace(`%%FC_${i}%%`, `<div data-flashcard-index="${i}"></div>`);
  });

  return { html, quizBlocks, flashcardBlocks, magicBlocks };
}
