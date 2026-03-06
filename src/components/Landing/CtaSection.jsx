import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTASection() {
  const navigate = useNavigate()
  return (
    <>
      {/* CTA */}
      <section id="cta" style={{ position:'relative', zIndex:1,
        padding:'100px clamp(20px,5vw,80px)', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(32px,5vw,60px)', fontWeight:800,
            letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:20 }}>
            Ready to understand<br />
            <span style={{ background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              your finances?
            </span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.35)', marginBottom:40, fontSize:15, lineHeight:1.8 }}>
            Upload your first bank statement free. No credit card required.
          </p>
          <button onClick={() => navigate('/auth')}
            style={{ display:'inline-flex', alignItems:'center', gap:10,
              background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
              border:'none', borderRadius:12, padding:'17px 48px',
              color:'#000', fontSize:16, fontWeight:700,
              fontFamily:'inherit', cursor:'pointer',
              boxShadow:'0 0 60px rgba(0,245,160,0.25)' }}>
            Get Started Free <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)',
        padding:'28px clamp(20px,5vw,60px)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:12, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Zap size={15} style={{ color:'#00f5a0' }} />
          <span style={{ fontWeight:800, fontSize:14,
            background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FinSight</span>
        </div>
        <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace",
          color:'rgba(255,255,255,0.2)', letterSpacing:1.5 }}>AI FINANCIAL INTELLIGENCE</span>
      </footer>
    </>
  )
}