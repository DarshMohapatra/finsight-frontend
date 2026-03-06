import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import LoginForm      from './LoginForm'
import SignupForm     from './SignupForm'
import ForgotPassword from './ForgotPassword'

export default function AuthGate() {
  const navigate    = useNavigate()
  const [tab,        setTab]        = useState('login')
  const [forgotMode, setForgotMode] = useState(false)

  return (
    <div style={{ background: '#020408', minHeight: '100vh', color: '#e8eaf0',
      fontFamily: "'Syne',sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px',
      position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,245,160,0.06) 0%, transparent 70%)',
          borderRadius: '50%' }} />
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/')}
        style={{ position: 'absolute', top: 20, left: 20, background: 'transparent',
          border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
          fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
        ← Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <Zap size={22} style={{ color: '#00f5a0' }} />
            <span style={{ fontSize: 26, fontWeight: 800,
              background: 'linear-gradient(135deg,#00f5a0,#00d4ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinSight</span>
          </div>
          <p style={{ fontSize: 10, fontFamily: "'DM Mono',monospace",
            color: 'rgba(255,255,255,0.25)', letterSpacing: 3, margin: 0 }}>
            AI FINANCIAL INTELLIGENCE
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '24px 24px 20px' }}>

          <AnimatePresence mode="wait">
            {forgotMode ? (
              <ForgotPassword key="forgot"
                onBack={() => setForgotMode(false)} />
            ) : (
              <motion.div key="auth"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Tab switcher */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10, padding: 3, marginBottom: 22, gap: 3 }}>
                  {['login', 'signup'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        fontFamily: 'inherit', transition: 'all 0.2s',
                        background: tab === t ? 'rgba(255,255,255,0.09)' : 'transparent',
                        color: tab === t ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                      {t === 'login' ? '🔑  Login' : '✨  Sign Up'}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {tab === 'login'
                    ? <LoginForm  key="login"  onForgot={() => setForgotMode(true)} />
                    : <SignupForm key="signup" />
                  }
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11,
          color: 'rgba(255,255,255,0.18)', fontFamily: "'DM Mono',monospace" }}>
          Your data stays private. Always.
        </p>
      </motion.div>
    </div>
  )
}