import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50,
      background:'rgba(2,4,8,0.85)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
      padding:'0 clamp(20px,5vw,60px)',
      display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Zap size={18} style={{ color:'#00f5a0' }} />
        <span style={{ fontSize:20, fontWeight:800,
          background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FinSight</span>
      </div>

      {/* Nav links */}
      <div style={{ display:'flex', gap:36, alignItems:'center' }}>
        {[
          { label:'Features',   id:'features'   },
          { label:'AI Advisor', id:'ai-advisor'  },
          { label:'Pricing',    id:'cta'         },
        ].map(item => (
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
    </nav>
  )
}