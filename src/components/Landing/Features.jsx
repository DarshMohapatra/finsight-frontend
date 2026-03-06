import { motion } from 'framer-motion'
import { Brain, Shield, TrendingUp, Zap, CreditCard, PieChart } from 'lucide-react'

const FEATURES = [
  { icon:Brain,      title:'AI Categorization',   desc:'30+ smart categories detected automatically from any bank format' },
  { icon:Shield,     title:'Fraud Detection',      desc:'Contextual flagging engine catches anomalies human eyes miss' },
  { icon:TrendingUp, title:'6-Month Forecast',     desc:'ML-powered spending projections with confidence bands' },
  { icon:Zap,        title:'AI Financial Advisor', desc:'Groq-powered chat that knows your actual transaction history' },
  { icon:CreditCard, title:'SmartCash Optimizer',  desc:'Find which credit card earns maximum cashback per category' },
  { icon:PieChart,   title:'Year in Review',       desc:'12 live stat cards rebuilt every year from your real data' },
]

export default function Features() {
  return (
    <section id="features" style={{ position:'relative', zIndex:1,
      padding:'80px clamp(20px,5vw,80px)', maxWidth:1200, margin:'0 auto' }}>

      <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} style={{ textAlign:'center', marginBottom:60 }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
          color:'#00f5a0', letterSpacing:3, marginBottom:14 }}>CAPABILITIES</p>
        <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, letterSpacing:'-1px' }}>
          Four AI engines.{' '}
          <span style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            One platform.
          </span>
        </h2>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:20 }}>
        {FEATURES.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.07 }}
            whileHover={{ y:-4, borderColor:'rgba(0,245,160,0.25)' }}
            style={{ background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:20, padding:28, cursor:'default', transition:'border-color 0.3s' }}>
            <div style={{ width:44, height:44, borderRadius:12, marginBottom:18,
              background:'rgba(0,245,160,0.08)', border:'1px solid rgba(0,245,160,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <f.icon size={20} style={{ color:'#00f5a0' }} />
            </div>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.38)', lineHeight:1.7 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}