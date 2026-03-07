import { motion } from 'framer-motion'

const BANKS = ['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Chase', 'Barclays', 'HSBC']

export default function GmailScanStep({ message }) {
  return (
    <div style={{ padding:'48px 28px', textAlign:'center' }}>

      {/* Animated radar ring */}
      <div style={{ position:'relative', width:80, height:80, margin:'0 auto 24px' }}>
        <motion.div
          animate={{ scale:[1, 1.6, 1], opacity:[0.6, 0, 0.6] }}
          transition={{ duration:2, repeat:Infinity, ease:'easeOut' }}
          style={{ position:'absolute', inset:0, borderRadius:'50%',
            border:'2px solid rgba(0,245,160,0.4)' }}
        />
        <motion.div
          animate={{ scale:[1, 1.3, 1], opacity:[0.4, 0, 0.4] }}
          transition={{ duration:2, repeat:Infinity, ease:'easeOut', delay:0.4 }}
          style={{ position:'absolute', inset:0, borderRadius:'50%',
            border:'2px solid rgba(0,212,255,0.3)' }}
        />
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:'linear-gradient(135deg,rgba(0,245,160,0.15),rgba(0,212,255,0.1))',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div
            animate={{ rotate:360 }}
            transition={{ duration:3, repeat:Infinity, ease:'linear' }}
            style={{ width:28, height:28, borderRadius:'50%',
              border:'2px solid transparent',
              borderTopColor:'#00f5a0',
              borderRightColor:'#00d4ff' }}
          />
        </div>
      </div>

      <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>
        {message || 'Scanning your inbox…'}
      </div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>
        {message ? 'Parsing and analyzing transactions' : 'Looking for bank statement emails with PDF attachments'}
      </div>

      {/* Scrolling bank names — only during scanning */}
      {!message && (
        <>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
            {BANKS.map((bank, i) => (
              <motion.div key={bank}
                initial={{ opacity:0, y:6 }}
                animate={{ opacity:[0.3, 0.8, 0.3] }}
                transition={{ duration:2, repeat:Infinity, delay:i * 0.25 }}
                style={{ fontSize:10, fontFamily:"'DM Mono',monospace",
                  color:'rgba(255,255,255,0.5)', letterSpacing:1.5,
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:6, padding:'4px 10px' }}>
                {bank}
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop:28, fontSize:11, color:'rgba(255,255,255,0.2)',
            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
            READ-ONLY · NO EMAILS MODIFIED
          </div>
        </>
      )}
    </div>
  )
}