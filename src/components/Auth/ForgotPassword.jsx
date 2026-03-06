import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { authAPI } from '../../api/client'
import Field from './Field'

export default function ForgotPassword({ onBack }) {
  const [email,   setEmail]   = useState('')
  const [newPass, setNewPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !newPass) { setError('Please fill all fields.'); return }
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await authAPI.reset(email, newPass)
      if (res.data.success) setSuccess('Password updated! You can now log in.')
      else setError(res.data.error || 'Reset failed.')
    } catch { setError('Cannot connect to server.') }
    setLoading(false)
  }

  return (
    <motion.div key="forgot"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>

      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Reset Password</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
        Enter your email and new password to reset.
      </p>

      {error && (
        <div style={{ background: 'rgba(255,60,100,0.08)', border: '1px solid rgba(255,60,100,0.2)',
          borderRadius: 8, padding: '9px 12px', marginBottom: 14, fontSize: 12, color: '#ff3c64' }}>
          {error}
        </div>
      )}

      {success ? (
        <div style={{ background: 'rgba(0,245,160,0.08)', border: '1px solid rgba(0,245,160,0.2)',
          borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#00f5a0', marginBottom: 16 }}>
          {success}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Field icon={Mail} label="EMAIL"        type="email"    value={email}   onChange={setEmail}   placeholder="you@example.com" />
          <Field icon={Lock} label="NEW PASSWORD" type="password" value={newPass} onChange={setNewPass} placeholder="Min 8 characters" />
          <button type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 8,
              background: 'linear-gradient(135deg,#00f5a0,#00d4ff)',
              border: 'none', borderRadius: 10, padding: '13px',
              color: '#000', fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer' }}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      )}

      <button onClick={onBack}
        style={{ marginTop: 14, background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit', width: '100%', textAlign: 'center' }}>
        ← Back to login
      </button>
    </motion.div>
  )
}