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
 * - Magic blocks as MagicBlock components
 */
export default function MarkdownRenderer({ text }) {
  const parsed = useMemo(() => parseMarkdown(text || ''), [text]);

  // Split the html at quiz/flashcard/magic placeholders and render components
  const parts = useMemo(() => {
    const result = [];
    let htmlStr = parsed.html;

    // Replace quiz placeholders
    parsed.quizBlocks.forEach((qb, i) => {
      const placeholder = `<div data-quiz-index="${i}"></div>`;
      const idx = htmlStr.indexOf(placeholder);
      if (idx !== -1) {
        if (idx > 0) {
          result.push({ type: 'html', content: htmlStr.substring(0, idx), key: `h-q-${i}` });
        }
        if (qb) {
          result.push({ type: 'quiz', data: qb, key: `quiz-${i}` });
        }
        htmlStr = htmlStr.substring(idx + placeholder.length);
      }
    });

    // Replace flashcard placeholders
    parsed.flashcardBlocks.forEach((fb, i) => {
      const placeholder = `<div data-flashcard-index="${i}"></div>`;
      const idx = htmlStr.indexOf(placeholder);
      if (idx !== -1) {
        if (idx > 0) {
          result.push({ type: 'html', content: htmlStr.substring(0, idx), key: `h-f-${i}` });
        }
        if (fb) {
          result.push({ type: 'flashcard', data: fb, key: `fc-${i}` });
        }
        htmlStr = htmlStr.substring(idx + placeholder.length);
      }
    });

    // Remaining HTML (includes magic-block iframes inline)
    if (htmlStr.trim()) {
      result.push({ type: 'html', content: htmlStr, key: 'html-tail' });
    }

    return result;
  }, [parsed]);

  return (
    <div className="bb-content">
      {parts.map((part) => {
        if (part.type === 'html') {
          return (
            <div
              key={part.key}
              className="bb"
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          );
        }
        if (part.type === 'quiz') {
          return <QuizCard key={part.key} data={part.data} />;
        }
        if (part.type === 'flashcard') {
          return <FlashcardDeck key={part.key} data={part.data} />;
        }
        return null;
      })}
      {/* Inline styles for markdown content */}
      <style>{`
        .bb h1 { font-size:1.1rem; margin:10px 0 6px; color:var(--nk); }
        .bb h2 { font-size:1rem; margin:8px 0 4px; color:var(--np); }
        .bb h3 { font-size:.92rem; margin:6px 0 3px; color:var(--nc); }
        .bb p { margin:5px 0; }
        .bb ul, .bb ol { padding-left:18px; margin:6px 0; }
        .bb li { margin-bottom:3px; }
        .bb strong { color:var(--ny); font-weight:600; }
        .bb em { color:var(--nc); }
        .bb code { background:rgba(180,74,255,.1); padding:2px 6px; border-radius:4px; font-family:'Space Mono',monospace; font-size:.82em; color:var(--nc); }
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
