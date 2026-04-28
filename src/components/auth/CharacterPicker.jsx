import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { CHARACTERS } from '../../data/characters'

export default function CharacterPicker() {
  const { user, setCharacter } = useAuth()
  const [selected, setSelected] = useState(null)

  function handleConfirm() {
    if (!selected) return
    setCharacter(selected)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 500,
      overflow: 'auto', padding: 20
    }}>
      <div className="bgfx" /><div className="pgrid" />
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎮</div>
        <h2 style={{
          fontSize: '1.5rem', fontWeight: 700, marginBottom: 6,
          background: 'linear-gradient(135deg,#fee440,#ff6d00)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Choose Your Character!
        </h2>
        <p style={{ color: 'var(--t2)', fontSize: '.88rem', marginBottom: 24 }}>
          Hey {user?.name?.split(' ')[0] || 'there'}! Pick your study buddy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelected(char)}
              style={{
                padding: '14px 8px', borderRadius: 14, cursor: 'pointer',
                background: selected?.id === char.id ? `${char.color}15` : 'var(--bg3)',
                border: `2px solid ${selected?.id === char.id ? char.color : 'var(--bd)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'border-color 0.2s, background 0.2s, transform 0.15s',
                transform: selected?.id === char.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>{char.emoji}</span>
              <span style={{
                fontSize: '.72rem', fontWeight: 600,
                color: selected?.id === char.id ? char.color : 'var(--t2)'
              }}>
                {char.name}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div style={{
            background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 14,
            padding: '16px 20px', textAlign: 'center', marginBottom: 20
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{selected.emoji}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selected.color, marginBottom: 4 }}>
              {selected.name}
            </div>
            <div style={{ fontSize: '.82rem', color: 'var(--t2)', marginBottom: 6 }}>
              {selected.description}
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--t3)', fontStyle: 'italic', fontFamily: "'Geist Mono', monospace" }}>
              "{selected.catchphrase}"
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selected}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: selected ? 'linear-gradient(135deg,#ff6b9d,#b44aff)' : 'var(--bg3)',
            color: selected ? '#fff' : 'var(--t3)',
            fontFamily: 'Geist,sans-serif', fontSize: '1rem', fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            opacity: selected ? 1 : 0.5
          }}
        >
          {selected ? `I choose ${selected.name}!` : 'Pick a character above'}
        </button>
      </div>
    </div>
  )
}
