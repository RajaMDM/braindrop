import { useMemo } from 'react';
import { parseMarkdown } from '../../utils/markdownParser.js';
import QuizCard from '../assessment/QuizCard.jsx';
import FlashcardDeck from '../assessment/FlashcardDeck.jsx';
import MagicBlock from '../interactive/MagicBlock.jsx';

/**
 * MarkdownRenderer — Parses AI response text and renders:
 * - Standard markdown as HTML
 * - Quiz blocks as QuizCard components
 * - Flashcard blocks as FlashcardDeck components
 * - Magic blocks as MagicBlock components (with full-screen support)
 */
export default function MarkdownRenderer({ text }) {
  const parsed = useMemo(() => parseMarkdown(text || ''), [text]);

  const parts = useMemo(() => {
    const result = [];
    let htmlStr = parsed.html;

    // Build a unified list of all placeholders with their positions
    const placeholders = [];

    parsed.quizBlocks.forEach((qb, i) => {
      const ph = `<div data-quiz-index="${i}"></div>`;
      const idx = htmlStr.indexOf(ph);
      if (idx !== -1) placeholders.push({ idx, len: ph.length, type: 'quiz', data: qb, key: `quiz-${i}` });
    });

    parsed.flashcardBlocks.forEach((fb, i) => {
      const ph = `<div data-flashcard-index="${i}"></div>`;
      const idx = htmlStr.indexOf(ph);
      if (idx !== -1) placeholders.push({ idx, len: ph.length, type: 'flashcard', data: fb, key: `fc-${i}` });
    });

    // Find magic block placeholders — they're rendered as inline HTML with data-magic-index
    parsed.magicBlocks.forEach((mb, i) => {
      // The parser wraps magic blocks in a div with class="magic-block" and an iframe inside
      // Find by data-magic-index attribute
      const marker = `data-magic-index="${i}"`;
      const markerIdx = htmlStr.indexOf(marker);
      if (markerIdx !== -1) {
        // Find the opening <div of this magic block
        let start = htmlStr.lastIndexOf('<div', markerIdx);
        // Find the closing </div> — the magic block div contains nested divs, so find the end
        // Simple approach: find the next </div></div> after the marker
        let searchFrom = markerIdx;
        let depth = 0;
        let end = -1;
        // Find opening tag end first
        let tagEnd = htmlStr.indexOf('>', start) + 1;
        depth = 1;
        let pos = tagEnd;
        while (depth > 0 && pos < htmlStr.length) {
          const nextOpen = htmlStr.indexOf('<div', pos);
          const nextClose = htmlStr.indexOf('</div>', pos);
          if (nextClose === -1) break;
          if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            pos = nextOpen + 4;
          } else {
            depth--;
            if (depth === 0) {
              end = nextClose + 6; // '</div>'.length
              break;
            }
            pos = nextClose + 6;
          }
        }
        if (start !== -1 && end !== -1) {
          placeholders.push({ idx: start, len: end - start, type: 'magic', data: mb, key: `mb-${i}` });
        }
      }
    });

    // Sort placeholders by position
    placeholders.sort((a, b) => a.idx - b.idx);

    // Split HTML at placeholder positions
    let cursor = 0;
    placeholders.forEach((ph) => {
      if (ph.idx > cursor) {
        result.push({ type: 'html', content: htmlStr.substring(cursor, ph.idx), key: `h-${cursor}` });
      }
      result.push(ph);
      cursor = ph.idx + ph.len;
    });

    // Remaining HTML after last placeholder
    if (cursor < htmlStr.length) {
      result.push({ type: 'html', content: htmlStr.substring(cursor), key: 'html-tail' });
    }

    return result;
  }, [parsed]);

  return (
    <div className="bb-content">
      {parts.map((part) => {
        if (part.type === 'html') {
          const trimmed = part.content.trim();
          if (!trimmed) return null;
          return (
            <div key={part.key} className="bb" dangerouslySetInnerHTML={{ __html: trimmed }} />
          );
        }
        if (part.type === 'quiz') {
          return <QuizCard key={part.key} data={part.data} />;
        }
        if (part.type === 'flashcard') {
          return <FlashcardDeck key={part.key} data={part.data} />;
        }
        if (part.type === 'magic') {
          return <MagicBlock key={part.key} title={part.data.title} html={part.data.html} />;
        }
        return null;
      })}
      <style>{`
        .bb h1 { font-size:1.1rem; margin:10px 0 6px; color:var(--nk); }
        .bb h2 { font-size:1rem; margin:8px 0 4px; color:var(--np); }
        .bb h3 { font-size:.92rem; margin:6px 0 3px; color:var(--nc); }
        .bb p { margin:5px 0; }
        .bb ul, .bb ol { padding-left:18px; margin:6px 0; }
        .bb li { margin-bottom:3px; }
        .bb strong { color:var(--ny); font-weight:600; }
        .bb em { color:var(--nc); }
        .bb code { background:rgba(180,74,255,.1); padding:2px 6px; border-radius:4px; font-family:'Geist Mono',monospace; font-size:.82em; color:var(--nc); }
        .bb pre { background:var(--bg); padding:12px; border-radius:8px; overflow-x:auto; margin:8px 0; border:1px solid var(--bd); }
        .bb pre code { background:none; padding:0; }
        .bb blockquote { border-left:3px solid var(--np); padding:8px 12px; margin:8px 0; background:rgba(180,74,255,.04); border-radius:0 8px 8px 0; color:var(--t2); font-style:italic; }
        .bb table { border-collapse:collapse; width:100%; margin:8px 0; font-size:.82rem; }
        .bb th, .bb td { border:1px solid var(--bd); padding:7px 10px; text-align:left; }
        .bb th { background:rgba(180,74,255,.1); color:var(--np); font-weight:600; }
        .bb hr { border:none; border-top:1px solid var(--bd); margin:10px 0; }
      `}</style>
    </div>
  );
}
