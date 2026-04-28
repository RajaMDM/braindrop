import { Component } from 'react'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import AuthGate from './components/auth/AuthGate'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[BrainDrop] Component crash:', error, info.componentStack); }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position:'fixed', inset:0, background:'#0b0b14', color:'#eef0ff',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column', padding:40, textAlign:'center', fontFamily:'Geist,sans-serif'
        }}>
          <div style={{ fontSize:'3rem', marginBottom:16 }}>⚡</div>
          <h2 style={{ fontSize:'1.3rem', marginBottom:8, color:'#ff6b9d' }}>Something went wrong</h2>
          <p style={{ color:'#a0a4c4', fontSize:'.88rem', marginBottom:16, maxWidth:400 }}>
            BrainDrop hit a snag. Try refreshing the page.
          </p>
          <pre style={{
            background:'#1a1a2e', padding:12, borderRadius:8, fontSize:'.7rem',
            color:'#ff1744', maxWidth:500, overflow:'auto', textAlign:'left', marginBottom:16
          }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => { localStorage.removeItem('bd_user'); location.reload(); }} style={{
            padding:'10px 24px', borderRadius:8, border:'1px solid #b44aff',
            background:'transparent', color:'#b44aff', cursor:'pointer',
            fontFamily:'Geist,sans-serif', fontSize:'.85rem', fontWeight:600
          }}>
            Reset & Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <div className="bgfx" />
          <div className="pgrid" />
          <AuthGate />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
