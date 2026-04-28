import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

const MODES = [
  { key: 'explain', icon: '\uD83D\uDCD6', label: 'Explain' },
  { key: 'socratic', icon: '\uD83E\uDDE0', label: 'Socratic' },
  { key: 'quiz', icon: '\uD83C\uDFAE', label: 'Quiz Me' },
  // Flashcards removed — structured JSON output too unreliable across AI providers
  { key: 'examprep', icon: '\uD83C\uDFAF', label: 'Exam Prep' },
  { key: 'tutor', icon: '\uD83E\uDD16', label: 'AI Tutor' },
  { key: 'classroom', icon: '\uD83C\uDFEB', label: 'Classroom' },
];

export default function ModeTabs() {
  const { mode, setMode } = useApp();

  return (
    <div style={{
      display: 'flex', gap: 6, padding: '10px 18px',
      background: 'rgba(18,18,31,.4)',
      borderBottom: '1px solid var(--bd)',
      overflowX: 'auto', flexShrink: 0,
    }} className="mode-tabs-scroll">
      {MODES.map((m) => {
        const active = mode === m.key;
        return (
          <motion.button
            key={m.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMode(m.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 15px',
              border: `1px solid ${active ? 'var(--np)' : 'var(--bd)'}`,
              borderRadius: 9,
              background: active ? 'rgba(180,74,255,.08)' : 'var(--bg3)',
              color: active ? 'var(--np)' : 'var(--t3)',
              fontFamily: "'Geist',sans-serif", fontSize: '.78rem',
              fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: active ? '0 0 12px rgba(180,74,255,.1)' : 'none',
              position: 'relative',
              transition: 'border-color .25s, color .25s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{m.icon}</span>
            {m.label}
            {active && (
              <motion.div
                layoutId="mode-underline"
                style={{
                  position: 'absolute', bottom: -1, left: 8, right: 8,
                  height: 2, borderRadius: 1, background: 'var(--np)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
      <style>{`
        .mode-tabs-scroll::-webkit-scrollbar { height: 0; }
        @media(max-width:768px) {
          .mode-tabs-scroll { padding: 8px 12px; gap: 4px; }
          .mode-tabs-scroll button { padding: 7px 11px; font-size: .72rem; }
        }
      `}</style>
    </div>
  );
}
