import { useState } from 'react'
import useStore from '../../store/useStore'
import { Edit2, CheckCircle2 } from 'lucide-react'

export default function AccountInfo() {
  const { user, setUser } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editAge, setEditAge] = useState(user?.age || '')

  const handleSave = () => {
    setUser({ ...user, name: editName, age: editAge })
    setIsEditing(false)
  }

  if (!user) return <div className="text-white/40">Loading...</div>

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Personal Details</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-[#00d4ff] hover:text-white transition-colors bg-transparent border-none cursor-pointer">
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <button onClick={handleSave} className="flex items-center gap-2 text-sm text-[#00f5a0] hover:text-white transition-colors bg-transparent border-none cursor-pointer">
            <CheckCircle2 size={14} /> Save Changes
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] flex items-center justify-center text-black font-extrabold text-2xl">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            {!isEditing ? (
              <div className="text-lg font-bold text-white">{user.name || 'Pro User'}</div>
            ) : (
              <input 
                value={editName} onChange={e => setEditName(e.target.value)}
                className="bg-transparent border-b border-white/20 text-lg font-bold text-white w-48 focus:outline-none focus:border-[#00f5a0] pb-1"
                placeholder="Your Name"
              />
            )}
            <div className="text-[10px] font-mono text-[#00f5a0] tracking-widest mt-1">PREMIUM PLAN</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono text-white/40 mb-1">EMAIL ADDRESS</div>
            <div className="font-mono text-white/90">{user.email || (user.user_id?.includes('@') ? user.user_id : 'Not provided')}</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono text-white/40 mb-1">AGE</div>
            {!isEditing ? (
              <div className="font-mono text-white/90">{user.age || '—'} years old</div>
            ) : (
              <input 
                type="number"
                value={editAge} onChange={e => setEditAge(e.target.value)}
                className="bg-transparent border-b border-white/20 text-base font-mono text-white w-24 focus:outline-none focus:border-[#00f5a0] pb-1"
                placeholder="Age"
              />
            )}
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono text-white/40 mb-1">ACCOUNT ID / USER ID</div>
            <div className="font-mono text-xs text-white/50">{user.user_id || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
