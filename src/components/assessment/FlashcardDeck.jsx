import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardCard from './FlashcardCard.jsx';

/**
 * FlashcardDeck — Manages a set of flashcards.
 * data shape: { cards: [{ front, back }] }
 */
export default function FlashcardDeck({ data }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState({}); // { idx: 'got' | 'need' }
  const [showSummary, setShowSummary] = useState(false);

  // Accept both array and {cards:[...]} shapes
  const cards = Array.isArray(data) ? data : (data?.cards || data?.flashcards || data?.items || []);
  if (!cards || cards.length === 0) return null;
  const card = cards[currentIdx];
  const totalDone = Object.keys(results).length;

  const handleAction = (action) => {
    setResults((prev) => ({ ...prev, [currentIdx]: action }));
    if (currentIdx < cards.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    const gotCount = Object.values(results).filter((r) => r === 'got').length;
    const needCount = Object.values(results).filter((r) => r === 'need').length;
    return (
      <motion.div
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--bg3)', border: '1px solid var(--bd)',
          borderRadius: 14, padding: 20, textAlign: 'center', margin: '12px 0',
        }}
      >
        <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
          Flashcard Summary
        </div>
        <div style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: 12 }}>
          <span style={{ color: 'var(--ng)', fontWeight: 700 }}>{gotCount}</span> mastered,{' '}
          <span style={{ color: 'var(--nr)', fontWeight: 700 }}>{needCount}</span> need practice
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setCurrentIdx(0); setResults({}); setShowSummary(false); }}
          style={{
            padding: '9px 20px', borderRadius: 8, border: '1px solid var(--np)',
            background: 'rgba(180,74,255,.08)', color: 'var(--np)',
            fontFamily: "'Fredoka',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div style={{ margin: '12px 0' }}>
      {/* Progress */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10, fontSize: '.75rem', color: 'var(--t3)',
      }}>
        <span>Card {currentIdx + 1} of {cards.length}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {cards.map((_, i) => {
            const r = results[i];
            let bg = 'var(--bg3)';
            let borderColor = 'var(--bd)';
            if (r === 'got') { bg = 'var(--ng)'; borderColor = 'var(--ng)'; }
            else if (r === 'need') { bg = 'var(--nr)'; borderColor = 'var(--nr)'; }
            else if (i === currentIdx) { borderColor = 'var(--np)'; }
            return (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: bg, border: `1px solid ${borderColor}`,
                boxShadow: i === currentIdx ? '0 0 6px rgba(180,74,255,.4)' : 'none',
              }} />
            );
          })}
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 1, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <FlashcardCard card={card} />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(57,255,20,.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('got')}
          style={{
            padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(57,255,20,.2)',
            background: 'rgba(57,255,20,.12)', color: 'var(--ng)',
            fontFamily: "'Fredoka',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Got it &#x2713;
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(255,23,68,.18)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('need')}
          style={{
            padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,23,68,.2)',
            background: 'rgba(255,23,68,.1)', color: 'var(--nr)',
            fontFamily: "'Fredoka',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Need practice
        </motion.button>
      </div>
    </div>
  );
}
