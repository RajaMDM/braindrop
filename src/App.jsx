import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import AuthGate from './components/auth/AuthGate'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="bgfx" />
        <div className="pgrid" />
        <AuthGate />
      </AppProvider>
    </AuthProvider>
  )
}
