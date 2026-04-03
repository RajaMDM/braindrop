import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useMemory } from '../../hooks/useMemory.js';

const btnStyle = {
  width: 36,
  height: 36,
  borderRadius: 9,
  background: 'var(--bg3)',
  border: '1px solid var(--bd)',
  color: 'var(--t3)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
};

export default function Header() {
  const { grade, setGrade, openModal } = useApp();
  const { user, logout } = useAuth();
  const { character } = useCharacter();
  const { clearMemory } = useMemory();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      minHeight: 56,
      background: 'rgba(18,18,31,.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--bd)',
      position: 'relative',
    }}>
      {/* Bottom gradient line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'var(--xp)', opacity: 0.5,
      }} />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: '#fff',
          boxShadow: '0 0 16px rgba(255,107,157,.4)',
          position: 'relative',
        }}>
          <span>&#x26A1;</span>
          <span style={{
            position: 'absolute', top: -4, right: -4, fontSize: 10,
            color: 'var(--ny)', animation: 'sp 2s ease-in-out infinite',
          }}>&#x2726;</span>
        </div>
        <div>
          <div style={{
            fontSize: '1.35rem', fontWeight: 700,
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>BrainDrop</div>
          <div style={{
            fontSize: '.6rem', color: 'var(--t3)', textTransform: 'uppercase',
            letterSpacing: 2, fontWeight: 500,
          }} className="btag-desktop">For Alishba &amp; Inaayah &middot; Multiple AI Engines</div>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Grade toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg3)', borderRadius: 9,
          padding: 3, border: '1px solid var(--bd)',
        }}>
          {[10, 7].map((g) => (
            <motion.button
              key={g}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGrade(g)}
              style={{
                padding: '6px 16px', border: 'none', borderRadius: 7,
                fontFamily: "'Space Mono',monospace", fontSize: '.72rem',
                fontWeight: 700, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                background: grade === g ? 'linear-gradient(135deg,#ff6b9d,#b44aff)' : 'none',
                color: grade === g ? '#fff' : 'var(--t3)',
                boxShadow: grade === g ? '0 2px 10px rgba(180,74,255,.3)' : 'none',
                transition: 'color .25s',
              }}
            >
              {g === 10 ? 'X' : 'VII'}
            </motion.button>
          ))}
        </div>

        {/* Toolbar buttons */}
        {[
          { icon: '\u2699', label: 'Settings', modal: 'settings' },
          { icon: '\uD83D\uDCDA', label: 'KB', modal: 'kb' },
          { icon: '\uD83D\uDCCA', label: 'Stats', modal: 'stats' },
          { icon: '\uD83C\uDFC6', label: 'Scores', modal: 'scores' },
          { icon: '\uD83D\uDCC8', label: 'Analytics', modal: 'analytics' },
        ].map((btn) => (
          <motion.button
            key={btn.modal}
            whileHover={{ scale: 1.1, borderColor: 'var(--np)', color: 'var(--np)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openModal(btn.modal)}
            title={btn.label}
            style={btnStyle}
          >
            {btn.icon}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1, borderColor: 'var(--np)', color: 'var(--np)' }}
          whileTap={{ scale: 0.9 }}
          onClick={clearMemory}
          title="Clear Memory"
          style={btnStyle}
        >
          {'\uD83E\uDDF9'}
        </motion.button>

        {/* User badge */}
        {user && (
          <motion.div
            whileHover={{ borderColor: 'var(--np)' }}
            onClick={logout}
            title="Click to sign out"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 10px 4px 4px',
              background: 'var(--bg3)', border: '1px solid var(--bd)',
              borderRadius: 20, fontSize: '.75rem', color: 'var(--t2)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.8rem', fontWeight: 700, color: '#fff',
            }}>
              {character?.emoji || user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span>{user.name}</span>
          </motion.div>
        )}
      </div>
    </header>
  );
}
