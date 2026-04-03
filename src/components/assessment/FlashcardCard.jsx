import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FlashcardCard — Single flashcard with 3D flip animation.
 * card shape: { front: string, back: string }
 */
export default function FlashcardCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: 800, margin: '12px 0', cursor: 'pointer' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: '100%', minHeight: 180, position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 14, padding: 24,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          background: 'var(--bg3)', border: '1px solid var(--bd)',
        }}>
          <div style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{card.front}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--t3)', marginTop: 12 }}>
            Tap to reveal answer
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 14, padding: 24,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          background: 'rgba(180,74,255,.06)',
          border: '1px solid rgba(180,74,255,.2)',
          transform: 'rotateY(180deg)',
        }}>
          <div style={{ fontSize: '.95rem', lineHeight: 1.6, color: 'var(--nc)' }}>{card.back}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--t3)', marginTop: 12 }}>
            Tap to see question
          </div>
        </div>
      </motion.div>
    </div>
  );
}
