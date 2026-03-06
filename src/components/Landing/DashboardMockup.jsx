import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

const bars = [
  { label:'Online Pymt', pct:88, val:'₹1.1L', color:'#00f5a0' },
  { label:'UPI',         pct:55, val:'₹68K',  color:'#00d4ff' },
  { label:'ATM',         pct:34, val:'₹42K',  color:'#7b61ff' },
  { label:'Transfer',    pct:22, val:'₹27K',  color:'#f59e0b' },
]

export default function DashboardMockup() {
  return (
    <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:0.4, duration:0.8 }}
      style={{ background:'rgba(10,14,26,0.9)', border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:20, padding:24, width:'100%', maxWidth:420,
        boxShadow:'0 0 80px rgba(0,245,160,0.08), 0 40px 80px rgba(0,0,0,0.4)' }}>

      {/* Title bar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff3c64' }} />
        <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }} />
        <div style={{ width:10, height:10, borderRadius:'50%', background:'#00f5a0' }} />
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
          color:'rgba(255,255,255,0.3)', marginLeft:8, letterSpacing:2 }}>FINSIGHT DASHBOARD</span>
      </div>

      {/* Metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:20 }}>
        {[
          { val:'₹4.2L', label:'TOTAL SPEND'  },
          { val:'12',    label:'ANOMALIES'    },
          { val:'78%',   label:'CATEGORIZED' },
        ].map(m => (
          <div key={m.label} style={{ background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:12,
            padding:'12px 10px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, fontFamily:"'DM Mono',monospace",
              background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{m.val}</div>
            <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)',
              fontFamily:"'DM Mono',monospace", letterSpacing:1.5, marginTop:4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Spending bars */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9,
          color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:12 }}>SPENDING BY CATEGORY</div>
        {bars.map((b, i) => (
          <div key={b.label} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{b.label}</span>
              <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:b.color }}>{b.val}</span>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${b.pct}%` }}
                transition={{ delay:0.8 + i*0.1, duration:0.8, ease:'easeOut' }}
                style={{ height:'100%', background:b.color, borderRadius:2,
                  boxShadow:`0 0 8px ${b.color}60` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Anomaly alert */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}
        style={{ background:'rgba(255,60,100,0.08)', border:'1px solid rgba(255,60,100,0.2)',
          borderRadius:10, padding:'10px 14px',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <AlertTriangle size={13} style={{ color:'#ff3c64' }} />
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Unusual NEFT — ₹82,000 flagged</span>
        </div>
        <span style={{ fontSize:9, fontFamily:"'DM Mono',monospace",
          color:'#ff3c64', letterSpacing:1.5 }}>ANOMALY</span>
      </motion.div>
    </motion.div>
  )
}