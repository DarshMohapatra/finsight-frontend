import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Calendar, ArrowRight, AlertCircle } from 'lucide-react'
import { authAPI } from '../../api/client'
import useStore from '../../store/useStore'
import { useNavigate } from 'react-router-dom'
import Field from './Field'

export default function SignupForm() {
  const navigate = useNavigate()
  const setUser  = useStore(s => s.setUser)

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [age,     setAge]     = useState('')
  const [pass,    setPass]    = useState('')
  const [pass2,   setPass2]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !pass || !pass2) { setError('Please fill all fields.'); return }
    if (pass !== pass2)    { setError('Passwords do not match.'); return }
    if (pass.length < 8)   { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await authAPI.signup(email, pass, name, parseInt(age) || 25)
      if (res.data.success) { setUser(res.data); navigate('/app') }
      else setError(res.data.error || 'Signup failed.')
    } catch { setError('Cannot connect to server.') }
    setLoading(false)
  }

  return (
    <motion.form key="signup"
      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}
      onSubmit={handleSubmit}>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(255,60,100,0.08)', border: '1px solid rgba(255,60,100,0.2)',
              borderRadius: 8, padding: '9px 12px', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#ff3c64' }}>
            <AlertCircle size={13} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Field icon={User}     label="FULL NAME"        type="text"     value={name}  onChange={setName}  placeholder="Your name" />
      <Field icon={Mail}     label="EMAIL"            type="email"    value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field icon={Calendar} label="AGE"              type="number"   value={age}   onChange={setAge}   placeholder="25" />
      <Field icon={Lock}     label="PASSWORD"         type="password" value={pass}  onChange={setPass}  placeholder="Min 8 characters" />
      <Field icon={Lock}     label="CONFIRM PASSWORD" type="password" value={pass2} onChange={setPass2} placeholder="••••••••" />

      <button type="submit" disabled={loading}
        style={{ width: '100%', marginTop: 4,
          background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#00f5a0,#00d4ff)',
          border: 'none', borderRadius: 10, padding: '13px',
          color: loading ? 'rgba(255,255,255,0.3)' : '#000',
          fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        {loading ? 'Creating account...' : <><ArrowRight size={14} /> Create Account</>}
      </button>
    </motion.form>
  )
}