import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const messages = [
  { role:'user', text:"What's my biggest spending category?" },
  { role:'ai',   text:'Your biggest category is Online Payment at ₹1.1L — 46% of total spend. Recurring NEFT transfers are the main driver. 💡' },
  { role:'user', text:'Give me 3 tips to cut spending!' },
  { role:'ai',   text:'Based on your real data:\n1. Online Payments — audit ₹1.1L in recurring transfers\n2. ATM — ₹42K in cash withdrawals. Switch to UPI for tracking\n3. Untagged — ₹27K uncategorized. Hiding leaks.' },
]

function ChatBubbles() {
  return (
    <div style={{ background:'rgba(10,14,26,0.9)', border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:20, padding:24, maxWidth:500 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20,
        paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width:36, height:36, borderRadius:10,
          background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Zap size={16} style={{ color:'#000' }} />
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700 }}>FinSight AI</div>
          <div style={{ fontSize:11, color:'#00f5a0', display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00f5a0',
              display:'inline-block', boxShadow:'0 0 6px #00f5a0' }} />
            Analyzing your data
          </div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.15 }}
            style={{ alignSelf: m.role==='user' ? 'flex-end' : 'flex-start', maxWidth:'85%' }}>
            {m.role === 'user' ? (
              <div style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
                color:'#000', padding:'10px 14px', borderRadius:'18px 18px 4px 18px',
                fontSize:13, fontWeight:600 }}>{m.text}</div>
            ) : (
              <div style={{ background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.8)', padding:'10px 14px',
                borderRadius:'18px 18px 18px 4px', fontSize:13, lineHeight:1.6,
                whiteSpace:'pre-line' }}>{m.text}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function ChatPreview() {
  return (
    <section id="ai-advisor" style={{ position:'relative', zIndex:1,
      padding:'80px clamp(20px,5vw,80px)', maxWidth:1200, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:60,
        flexWrap:'wrap', justifyContent:'space-between' }}>

        <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }} style={{ flex:'1 1 320px', maxWidth:480 }}>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
            color:'#00f5a0', letterSpacing:3, marginBottom:16 }}>AI FINANCIAL ADVISOR</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800,
            letterSpacing:'-1px', lineHeight:1.1, marginBottom:20 }}>
            Talk to your{' '}
            <span style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              financial data.
            </span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>
            Ask anything about your spending. FinSight AI knows your actual
            transaction history and gives answers based on your real numbers —
            not generic advice.
          </p>
        </motion.div>

        <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }} transition={{ delay:0.2 }}
          style={{ flex:'1 1 400px' }}>
          <ChatBubbles />
        </motion.div>
      </div>
    </section>
  )
}