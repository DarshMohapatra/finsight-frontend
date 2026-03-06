import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    { label:'Features',   id:'features'   },
    { label:'AI Advisor', id:'ai-advisor'  },
    { label:'Pricing',    id:'cta'         },
  ]

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50,
      background:'rgba(2,4,8,0.85)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
      padding:'0 clamp(16px,5vw,60px)', height:64 }}
      className="flex items-center justify-between">

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Zap size={18} style={{ color:'#00f5a0' }} />
        <span style={{ fontSize:20, fontWeight:800,
          background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FinSight</span>
      </div>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center" style={{ gap:36 }}>
        {links.map(item => (
          <span key={item.label}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior:'smooth' })}
            style={{ fontSize:13, color:'rgba(255,255,255,0.45)', cursor:'pointer',
              fontWeight:500, transition:'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
            {item.label}
          </span>
        ))}
        <button onClick={() => navigate('/auth')}
          style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
            border:'none', color:'#000', borderRadius:8, padding:'9px 24px',
            cursor:'pointer', fontSize:13, fontFamily:'inherit', fontWeight:700,
            display:'flex', alignItems:'center', gap:6 }}>
          <Zap size={13} /> Launch App
        </button>
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden bg-transparent border-none text-white/70" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#020408]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4">
          {links.map(item => (
            <span key={item.label}
              onClick={() => { document.getElementById(item.id)?.scrollIntoView({ behavior:'smooth' }); setOpen(false) }}
              style={{ fontSize:14, color:'rgba(255,255,255,0.6)', cursor:'pointer', fontWeight:500 }}>
              {item.label}
            </span>
          ))}
          <button onClick={() => { navigate('/auth'); setOpen(false) }}
            style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              border:'none', color:'#000', borderRadius:8, padding:'12px 24px',
              cursor:'pointer', fontSize:14, fontFamily:'inherit', fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Zap size={13} /> Launch App
          </button>
        </div>
      )}
    </nav>
  )
}