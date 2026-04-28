import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import CharacterPicker from './CharacterPicker'
import AppShell from '../layout/AppShell'
import { CONFIG } from '../../data/config'

export default function AuthGate() {
  const { user } = useAuth()

  if (!user) return <LoginScreen />
  if (!user.character) return <CharacterPicker />
  return <AppShell />
}

function LoginScreen() {
  const { loginWithGoogle, loginAsGuest } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const googleRef = useRef(null)

  useEffect(() => {
    if (typeof google === 'undefined' || !google.accounts) {
      const timer = setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts && googleRef.current) {
          initGoogle()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    initGoogle()
  }, [])

  function initGoogle() {
    if (!CONFIG.GOOGLE_CLIENT_ID || !googleRef.current) return
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: (response) => loginWithGoogle(response.credential),
      auto_select: true,
    })
    google.accounts.id.renderButton(googleRef.current, {
      theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill', width: 300
    })
    google.accounts.id.prompt()
  }

  function handleGuest() {
    const errs = {}
    if (!name.trim()) errs.name = true
    if (!email.trim() || !email.includes('@')) errs.email = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    loginAsGuest(name.trim(), email.trim().toLowerCase())
  }

  return (
    <div
      style={{
        position:'fixed', inset:0, background:'var(--bg)', display:'flex',
        alignItems:'center', justifyContent:'center', flexDirection:'column', zIndex:500
      }}
    >
      <div className="bgfx" /><div className="pgrid" />
      <div
        style={{ maxWidth:460, padding:'40px 30px', textAlign:'center', position:'relative', zIndex:1 }}
      >
        <div style={{ fontSize:'4rem', marginBottom:16, filter:'drop-shadow(0 0 30px rgba(180,74,255,.5))' }}>
          ⚡
        </div>
        <div style={{
          fontSize:'2rem', fontWeight:700,
          background:'linear-gradient(135deg,#ff6b9d,#b44aff)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6
        }}>BrainDrop</div>
        <div style={{ color:'#ff6b9d', fontSize:'.85rem', fontStyle:'italic', marginBottom:6, fontWeight:500 }}>
          Dedicated to Alishba & Inaayah ✦ Open for every student everywhere
        </div>
        <div style={{ color:'var(--t3)', fontSize:'.78rem', marginBottom:24, lineHeight:1.5, fontStyle:'italic' }}>
          "Built by a father who believes his daughters can conquer anything — and so can you."
          <br /><span style={{ fontSize:'.68rem', fontStyle:'normal' }}>— Raja Shahnawaz Soni</span>
        </div>
        <div style={{ color:'var(--t2)', fontSize:'.88rem', marginBottom:24, lineHeight:1.6 }}>
          Multiple AI engines. Every CBSE subject. One mission — your success.
        </div>

        <div ref={googleRef} style={{ display:'flex', justifyContent:'center', marginBottom:16 }} />

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0', color:'var(--t3)', fontSize:'.75rem' }}>
          <div style={{ flex:1, height:1, background:'var(--bd)' }} />
          or continue as guest
          <div style={{ flex:1, height:1, background:'var(--bd)' }} />
        </div>

        <div style={{
          textAlign:'left', background:'var(--bg3)', border:'1px solid var(--bd)',
          borderRadius:12, padding:16
        }}>
          <label style={{ fontSize:'.78rem', color:'var(--t2)', display:'block', marginBottom:6 }}>What's your name? *</label>
          <input
            value={name} onChange={e => { setName(e.target.value); setErrors(p=>({...p,name:false})) }}
            placeholder="Enter your name..."
            style={{
              width:'100%', padding:'10px 14px', background:'var(--bg)',
              border:`1px solid ${errors.name?'var(--nr)':'var(--bd)'}`, borderRadius:8,
              color:'var(--t1)', fontFamily:'Geist,sans-serif', fontSize:'.88rem', outline:'none', marginBottom:10
            }}
          />
          <label style={{ fontSize:'.78rem', color:'var(--t2)', display:'block', marginBottom:6 }}>Your email *</label>
          <input
            value={email} onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:false})) }}
            placeholder="your@email.com" type="email"
            style={{
              width:'100%', padding:'10px 14px', background:'var(--bg)',
              border:`1px solid ${errors.email?'var(--nr)':'var(--bd)'}`, borderRadius:8,
              color:'var(--t1)', fontFamily:'Geist,sans-serif', fontSize:'.88rem', outline:'none', marginBottom:10
            }}
          />
          <button
            onClick={handleGuest}
            style={{
              width:'100%', padding:11, borderRadius:8, border:'1px solid var(--np)',
              background:'var(--bg3)', color:'var(--np)', fontFamily:'Geist,sans-serif',
              fontSize:'.85rem', fontWeight:600, cursor:'pointer'
            }}
          >
            Start Learning →
          </button>
        </div>

        <div style={{ fontSize:'.65rem', color:'var(--t3)', marginTop:20, lineHeight:1.6 }}>
          Crafted with ❤ by <strong style={{color:'var(--np)'}}>Raja Shahnawaz Soni</strong><br />
          <a href="mailto:raja.cloudmdm@gmail.com" style={{color:'var(--nc)'}}>raja.cloudmdm@gmail.com</a> ·{' '}
          <a href="https://www.linkedin.com/in/raja-shahnawaz/" target="_blank" rel="noreferrer" style={{color:'var(--nb)'}}>LinkedIn</a> ·{' '}
          <a href="https://github.com/RajaMDM" target="_blank" rel="noreferrer" style={{color:'var(--ng)'}}>GitHub</a>
        </div>
      </div>
    </div>
  )
}
