import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

export default function AppShell() {
  const { user, logout } = useAuth()
  const { state } = useApp()

  return (
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="bgfx" /><div className="pgrid" />
      {/* Placeholder — full shell coming in Phase 3 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 20
      }}>
        <div style={{ fontSize: '4rem' }}>{user?.character?.emoji || '⚡'}</div>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 700,
          background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          BrainDrop v6 — React Edition
        </h1>
        <p style={{ color: 'var(--t2)', fontSize: '.9rem' }}>
          Welcome, {user?.name}! You are {user?.character?.name || 'ready'}.
        </p>
        <p style={{ color: 'var(--t3)', fontSize: '.8rem' }}>
          Grade {state.grade} · {state.subject} · {state.mode} mode
        </p>
        <button
          onClick={logout}
          style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid var(--bd)',
            background: 'var(--bg3)', color: 'var(--t2)', cursor: 'pointer',
            fontFamily: 'Fredoka,sans-serif', fontSize: '.85rem'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
