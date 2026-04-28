import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useRAG } from '../../hooks/useRAG.js';
import { useMemory } from '../../hooks/useMemory.js';

const SUBJECTS = [
  { key: 'mathematics', icon: '\u2211', label: 'Mathematics', bg: 'rgba(180,74,255,.15)', color: '#b44aff' },
  { key: 'science', icon: '\u2697', label: 'Science', bg: 'rgba(0,245,212,.12)', color: '#00f5d4' },
  { key: 'english', icon: '\u270E', label: 'English', bg: 'rgba(254,228,64,.12)', color: '#fee440' },
  { key: 'social-science', icon: '\uD83C\uDF0F', label: 'Social Science', bg: 'rgba(255,107,157,.12)', color: '#ff6b9d' },
  { key: 'hindi', icon: '\u0905', label: 'Hindi', bg: 'rgba(76,201,240,.12)', color: '#4cc9f0' },
];

const AI_BADGES = [
  { label: 'NVIDIA', bg: 'rgba(118,185,0,.12)', color: '#76b900' },
  { label: 'Groq', bg: 'rgba(255,109,0,.12)', color: 'var(--no)' },
  { label: 'Gemini', bg: 'rgba(0,245,212,.12)', color: 'var(--nc)' },
  { label: 'Claude', bg: 'rgba(180,74,255,.15)', color: 'var(--np)' },
];

export default function Sidebar() {
  const { subject, setSubject } = useApp();
  const { kbStatus, ragStatus, chunkCount } = useRAG();
  const { memory } = useMemory();

  const kbText =
    kbStatus === 'ready' ? (ragStatus === 'ready' ? `RAG Ready (${chunkCount} chunks)` : 'PDFs Loaded') :
    kbStatus === 'loading' ? 'Loading PDFs...' :
    kbStatus === 'error' ? 'Load Error' : 'No PDFs';

  const kbColor =
    kbStatus === 'ready' ? 'var(--ng)' :
    kbStatus === 'loading' ? 'var(--nb)' :
    'var(--no)';

  const memCount = memory?.history?.length || 0;

  return (
    <aside style={{
      width: 200, flexShrink: 0, padding: '14px 8px',
      background: 'rgba(18,18,31,.5)',
      borderRight: '1px solid var(--bd)',
      display: 'flex', flexDirection: 'column', gap: 4,
      overflowY: 'auto',
    }}>
      <div style={{
        fontSize: '.58rem', textTransform: 'uppercase', letterSpacing: 2.5,
        color: 'var(--t3)', padding: '10px 12px 6px', fontWeight: 600,
      }}>Subjects</div>

      {SUBJECTS.map((s) => {
        const active = subject === s.key;
        return (
          <motion.button
            key={s.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSubject(s.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', borderRadius: 9,
              background: active ? 'rgba(180,74,255,.1)' : 'none',
              color: active ? 'var(--np)' : 'var(--t2)',
              fontFamily: "'Geist',sans-serif", fontSize: '.85rem',
              fontWeight: 500, cursor: 'pointer', textAlign: 'left',
              width: '100%', position: 'relative',
              transition: 'all .2s',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: 20, borderRadius: '0 3px 3px 0',
                background: 'var(--np)',
              }} />
            )}
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', background: s.bg, color: s.color,
            }}>{s.icon}</span>
            {s.label}
          </motion.button>
        );
      })}

      <div style={{ height: 1, background: 'var(--bd)', margin: '8px 12px' }} />

      {/* Knowledge Base card */}
      <div style={{
        marginTop: 'auto', padding: 12,
        background: 'var(--bg3)', borderRadius: 10,
        border: '1px solid var(--bd)',
      }}>
        <div style={{
          fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: 2,
          color: 'var(--t3)', marginBottom: 6, fontWeight: 600,
        }}>Knowledge Base</div>
        <div style={{ fontSize: '.8rem', fontWeight: 500, color: kbColor }}>
          {kbText}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {AI_BADGES.map((b) => (
            <span key={b.label} style={{
              fontSize: '.55rem', padding: '2px 6px', borderRadius: 5,
              fontWeight: 600, fontFamily: "'Geist Mono',monospace",
              background: b.bg, color: b.color,
            }}>{b.label}</span>
          ))}
        </div>
        <div style={{
          marginTop: 6, fontSize: '.62rem', color: 'var(--nb)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {'\uD83E\uDDE0'} Memory: {memCount > 0 ? `${memCount} entries` : 'empty'}
        </div>
      </div>
    </aside>
  );
}
