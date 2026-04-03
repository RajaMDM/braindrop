/**
 * markdownParser.js
 * Converts markdown text (with BrainDrop custom blocks) into structured output.
 * Includes KaTeX rendering for LaTeX math formulas.
 *
 * Returns { html, quizBlocks, flashcardBlocks, magicBlocks } so React can
 * render quiz/flashcard/magic blocks as dedicated components.
 */
import katex from 'katex';

/**
 * Parse markdown text that may contain <quiz-data>, <flashcard-data>, and
 * <magic-block> custom tags into structured output.
 *
 * @param {string} text - Raw markdown/AI response text
 * @returns {{ html: string, quizBlocks: Array, flashcardBlocks: Array, magicBlocks: Array }}
 */
export function parseMarkdown(text) {
  let t = text;

  // Strip markdown code fences that wrap our custom tags (Claude does this)
  t = t.replace(/```(?:json|html)?\s*\n?\s*(<(?:quiz-data|flashcard-data|magic-block)[^>]*>)/gi, '$1');
  t = t.replace(/(<\/(?:quiz-data|flashcard-data|magic-block)>)\s*\n?\s*```/gi, '$1');

  // --- Extract quiz-data blocks before markdown processing ---
  const quizBlocks = [];
  t = t.replace(/<quiz-data>([\s\S]*?)<\/quiz-data>/gi, (match, json) => {
    try {
      let parsed = JSON.parse(json.trim());
      // Normalize: might be an array or { questions: [...] } or { topic, questions }
      if (parsed && !Array.isArray(parsed)) {
        if (parsed.questions) parsed = parsed.questions;
        else parsed = [parsed];
      }
      // Normalize field names: correctAnswer→answer, question→q
      if (Array.isArray(parsed)) {
        parsed = parsed.map(q => ({
          q: q.q || q.question || q.text || '',
          options: q.options || [],
          answer: q.answer ?? q.correctAnswer ?? q.correct_answer ?? 0,
          explanation: q.explanation || q.explain || '',
          difficulty: q.difficulty || 'medium',
          topic: q.topic || '',
        }));
      }
      quizBlocks.push(parsed);
    } catch (e) {
      quizBlocks.push(null);
    }
    return `%%QUIZ_${quizBlocks.length - 1}%%`;
  });

  // --- Extract flashcard-data blocks ---
  const flashcardBlocks = [];
  t = t.replace(/<flashcard-data>([\s\S]*?)<\/flashcard-data>/gi, (match, json) => {
    try {
      let parsed = JSON.parse(json.trim());
      // Normalize: might be { cards: [...] } or { flashcards: [...] }
      if (parsed && !Array.isArray(parsed)) {
        if (parsed.cards) parsed = parsed.cards;
        else if (parsed.flashcards) parsed = parsed.flashcards;
        else parsed = [parsed];
      }
      // Normalize field names
      if (Array.isArray(parsed)) {
        parsed = parsed.map(c => ({
          front: c.front || c.question || c.term || c.q || '',
          back: c.back || c.answer || c.definition || c.a || '',
          topic: c.topic || '',
        }));
      }
      flashcardBlocks.push(parsed);
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

  // --- Render LaTeX math with KaTeX ---
  // Display math: $$...$$ (block)
  t = t.replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }); }
    catch { return `<code>${tex}</code>`; }
  });
  // Inline math: $...$ (not greedy, single line)
  t = t.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$(?!\$)/g, (_m, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
    catch { return `<code>${tex}</code>`; }
  });
  // Also handle \[ ... \] and \( ... \) notation
  t = t.replace(/\\\[([\s\S]*?)\\\]/g, (_m, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }); }
    catch { return `<code>${tex}</code>`; }
  });
  t = t.replace(/\\\(([\s\S]*?)\\\)/g, (_m, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
    catch { return `<code>${tex}</code>`; }
  });

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
