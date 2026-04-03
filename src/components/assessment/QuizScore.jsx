import { motion } from 'framer-motion';

export default function QuizScore({ correct, total, xpEarned }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  let color = 'var(--ng)';
  if (pct < 50) color = 'var(--nr)';
  else if (pct < 80) color = 'var(--ny)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        background: 'var(--bg3)',
        border: '1px solid rgba(180,74,255,.2)',
        borderRadius: 14, padding: 20, margin: '14px 0',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontSize: '2rem', fontWeight: 700,
        fontFamily: "'Space Mono',monospace", color,
      }}>
        {correct}/{total}
      </div>
      <div style={{ fontSize: '.78rem', color: 'var(--t3)', marginTop: 4 }}>
        {pct}% Accuracy
      </div>
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--bg)',
        margin: '12px auto', maxWidth: 200, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 4, background: color }}
        />
      </div>
      {xpEarned > 0 && (
        <div style={{ fontSize: '.75rem', color: 'var(--ny)', marginTop: 8 }}>
          &#x26A1; +{xpEarned} XP earned!
        </div>
      )}
    </motion.div>
  );
}
