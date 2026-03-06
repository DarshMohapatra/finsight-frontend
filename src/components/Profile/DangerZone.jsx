import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/client'
import useStore from '../../store/useStore'
import { ShieldAlert } from 'lucide-react'

export default function DangerZone() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you ABSOLUTELY sure? This will permanently delete your account, uploaded statements, and history. This action cannot be undone.")) return
    
    setLoading(true)
    try {
      await authAPI.delete(user.user_id)
      logout()
      navigate('/')
    } catch (err) {
      alert("Failed to delete account. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShieldAlert className="text-[#ff3c64]" /> Danger Zone
      </h2>

      <div className="p-6 rounded-xl border border-[#ff3c64]/30 bg-[#ff3c64]/5">
        <h3 className="text-lg font-bold text-[#ff3c64] mb-2">Delete Account</h3>
        <p className="text-sm text-white/50 mb-6 leading-relaxed">
          Once you delete your account, there is no going back. Please be certain. All data, personal preferences, and uploaded financial statements will be wiped permanently from our servers.
        </p>

        <button 
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-3 bg-[#ff3c64]/10 hover:bg-[#ff3c64]/20 text-[#ff3c64] border border-[#ff3c64]/50 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete My Account Permanently'}
        </button>
      </div>
    </div>
  )
}
