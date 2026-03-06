import { useState } from 'react'
import { authAPI } from '../../api/client'
import useStore from '../../store/useStore'
import { CheckCircle2, Lock } from 'lucide-react'

export default function ChangePassword() {
  const user = useStore(s => s.user)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await authAPI.reset(user.email, newPassword)
      if (res.data.success) {
        setSuccess('Password successfully updated!')
        setNewPassword('')
      } else {
        setError(res.data.error || 'Failed to update password')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="animate-fade-in max-w-md">
      <h2 className="text-xl font-bold text-white mb-2">Security</h2>
      <p className="text-sm text-white/40 mb-6">Update your account password.</p>

      {error && <div className="p-3 mb-4 rounded-lg bg-[#ff3c64]/10 text-[#ff3c64] text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-[#00f5a0]/10 text-[#00f5a0] text-sm flex items-center gap-2"><CheckCircle2 size={16}/> {success}</div>}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-white/40 mb-1">NEW PASSWORD</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
