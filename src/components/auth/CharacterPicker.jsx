import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { CHARACTERS } from '../../data/characters'

export default function CharacterPicker() {
  const { user, setCharacter } = useAuth()
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleSelect(char) {
    setSelected(char)
  }

  function handleConfirm() {
    if (!selected) return
    setConfirmed(true)
    setTimeout(() => setCharacter(selected), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 500,
        overflow: 'auto', padding: '20px'
      }}
    >
      <div className="bgfx" /><div className="pgrid" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 540, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '3rem', marginBottom: 12 }}
        >
          🎮
        </motion.div>
        <h2 style={{
          fontSize: '1.5rem', fontWeight: 700, marginBottom: 6,
          background: 'linear-gradient(135deg,#fee440,#ff6d00)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Choose Your Character!
        </h2>
        <p style={{ color: 'var(--t2)', fontSize: '.88rem', marginBottom: 24 }}>
          Hey {user?.name?.split(' ')[0] || 'there'}! Pick your study buddy — they'll be with you on your learning journey.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
          marginBottom: 24
        }}>
          {CHARACTERS.map((char, i) => (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.08, rotate: [-3, 3, -3, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(char)}
              style={{
                padding: '14px 8px', borderRadius: 14, cursor: 'pointer',
                background: selected?.id === char.id ? `${char.color}15` : 'var(--bg3)',
                border: `2px solid ${selected?.id === char.id ? char.color : 'var(--bd)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'border-color 0.2s, background 0.2s'
              }}
            >
              <motion.span
                style={{ fontSize: '2rem' }}
                animate={selected?.id === char.id ? {
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  y: [0, -8, 0, -4, 0]
                } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {char.emoji}
              </motion.span>
              <span style={{
                fontSize: '.72rem', fontWeight: 600,
                color: selected?.id === char.id ? char.color : 'var(--t2)'
              }}>
                {char.name}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}
            >
              <div style={{
                background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 14,
                padding: '16px 20px', textAlign: 'center'
              }}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: '2.5rem', marginBottom: 8 }}
                >
                  {selected.emoji}
                </motion.div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selected.color, marginBottom: 4 }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--t2)', marginBottom: 6 }}>
                  {selected.description}
                </div>
                <div style={{
                  fontSize: '.75rem', color: 'var(--t3)', fontStyle: 'italic',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  "{selected.catchphrase}"
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={selected ? { scale: 1.03 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          onClick={handleConfirm}
          disabled={!selected}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: selected
              ? 'linear-gradient(135deg,#ff6b9d,#b44aff)'
              : 'var(--bg3)',
            color: selected ? '#fff' : 'var(--t3)',
            fontFamily: 'Fredoka,sans-serif', fontSize: '1rem', fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            opacity: selected ? 1 : 0.5
          }}
        >
          {confirmed ? '🎉 Let\'s Go!' : selected ? `I choose ${selected.name}!` : 'Pick a character above'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
