import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import DashboardMockup from './DashboardMockup'

const fade    = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0 } }
const stagger = { show:{ transition:{ staggerChildren:0.1 } } }

function Counter({ to, duration = 2, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref    = useRef()
  const inView = useInView(ref, { once:true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step  = to / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 1000/60)
    return () => clearInterval(timer)
  }, [inView, to, duration])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section style={{ position:'relative', zIndex:1, minHeight:'100vh',
      display:'flex', alignItems:'center',
      padding:'100px clamp(20px,5vw,80px) 60px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',
        gap:60, width:'100%', maxWidth:1200, margin:'0 auto', alignItems:'center' }}>

        {/* Left — text */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fade}
            style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:28,
              background:'rgba(0,245,160,0.08)', border:'1px solid rgba(0,245,160,0.2)',
              borderRadius:100, padding:'6px 16px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00f5a0',
              boxShadow:'0 0 8px #00f5a0', display:'inline-block' }} />
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace",
              color:'#00f5a0', letterSpacing:2 }}>CUSTOM NLP + CONTEXTUAL FLAGGING + LLAMA 3.3</span>
          </motion.div>

          <motion.h1 variants={fade}
            style={{ fontSize:'clamp(36px,5vw,72px)', fontWeight:800,
              lineHeight:1.0, marginBottom:24, letterSpacing:'-2px' }}>
            Your Money,<br />
            <span style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Understood.
            </span>
          </motion.h1>

          <motion.p variants={fade}
            style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.8, marginBottom:36 }}>
            Upload your bank statement. FinSight reads every transaction,
            flags anomalies, forecasts your future, and gives you a personal
            AI advisor — in seconds.
          </motion.p>

          <motion.div variants={fade} style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <button onClick={() => navigate('/auth')}
              style={{ display:'inline-flex', alignItems:'center', gap:10,
                background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
                border:'none', borderRadius:12, padding:'14px 28px',
                color:'#000', fontSize:14, fontWeight:700,
                fontFamily:'inherit', cursor:'pointer',
                boxShadow:'0 0 40px rgba(0,245,160,0.3)' }}>
              <Zap size={15} /> Analyze My Finances
            </button>
            <button style={{ display:'inline-flex', alignItems:'center', gap:8,
              background:'transparent', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:12, padding:'14px 28px',
              color:'rgba(255,255,255,0.55)', fontSize:14, fontWeight:600,
              fontFamily:'inherit', cursor:'pointer' }}>
              → See How It Works
            </button>
          </motion.div>

          {/* Stats counters */}
          <motion.div variants={fade} style={{ display:'flex', gap:32, marginTop:44, flexWrap:'wrap' }}>
            {[
              { val:113,  suffix:'K+', label:'TRANSACTIONS'    },
              { val:78,   suffix:'%',  label:'AUTO-TAGGED'     },
              { val:2275, suffix:'',   label:'ANOMALIES CAUGHT'},
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize:26, fontWeight:800, fontFamily:"'DM Mono',monospace",
                  background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)',
                  fontFamily:"'DM Mono',monospace", letterSpacing:2, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — dashboard widget */}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}