// ── GmailDoneStep ─────────────────────────────────────────────────
export function GmailDoneStep({ summary, filename, onViewDashboard, onImportAnother }) {
  const sym = { IN:'₹', US:'$', UK:'£', CA:'C$', AU:'A$' }

  return (
    <div style={{ padding:'36px 28px', textAlign:'center' }}>
      {/* Success ring */}
      <div style={{ width:64, height:64, margin:'0 auto 20px',
        borderRadius:'50%', background:'rgba(0,245,160,0.1)',
        border:'2px solid rgba(0,245,160,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28 }}>
        ✅
      </div>

      <div style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:6 }}>
        Statement Imported!
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:24,
        fontFamily:"'DM Mono',monospace", overflow:'hidden',
        textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:300, margin:'0 auto 24px' }}>
        {filename}
      </div>

      {/* Stats */}
      {summary && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
          gap:10, marginBottom:28,
          background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:12, padding:'16px' }}>
          {[
            { val: summary.txn_count,                    label:'TRANSACTIONS' },
            { val: `${summary.months || 1}mo`,           label:'MONTHS'       },
            { val: `${Math.round(summary.avg_monthly_spend / 1000)}K`, label:'AVG/MONTH' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:18, fontWeight:800, color:'#00f5a0',
                fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
              <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)',
                letterSpacing:1.5, marginTop:4, fontFamily:"'DM Mono',monospace" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onViewDashboard}
        style={{ width:'100%', padding:'13px',
          background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
          border:'none', borderRadius:12,
          color:'#000', fontSize:14, fontWeight:700,
          cursor:'pointer', fontFamily:'inherit', marginBottom:10 }}>
        View Dashboard →
      </button>

      <button onClick={onImportAnother}
        style={{ width:'100%', padding:'10px',
          background:'none', border:'none',
          color:'rgba(255,255,255,0.3)', fontSize:12,
          cursor:'pointer', fontFamily:'inherit' }}>
        Import another statement
      </button>
    </div>
  )
}

// ── GmailErrorStep ────────────────────────────────────────────────
export function GmailErrorStep({ error, onRetry, onClose }) {
  return (
    <div style={{ padding:'36px 28px', textAlign:'center' }}>
      <div style={{ width:64, height:64, margin:'0 auto 20px',
        borderRadius:'50%', background:'rgba(255,60,100,0.1)',
        border:'2px solid rgba(255,60,100,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28 }}>
        ⚠️
      </div>

      <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:10 }}>
        Something went wrong
      </div>
      <div style={{ fontSize:12, color:'rgba(255,60,100,0.8)',
        background:'rgba(255,60,100,0.08)', border:'1px solid rgba(255,60,100,0.2)',
        borderRadius:10, padding:'10px 14px', marginBottom:24,
        lineHeight:1.6, textAlign:'left' }}>
        {error || 'An unexpected error occurred.'}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose}
          style={{ flex:1, padding:'11px',
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:10, color:'rgba(255,255,255,0.45)',
            fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          Close
        </button>
        <button onClick={onRetry}
          style={{ flex:2, padding:'11px',
            background:'linear-gradient(135deg,#00f5a0,#00d4ff)',
            border:'none', borderRadius:10,
            color:'#000', fontSize:13, fontWeight:700,
            cursor:'pointer', fontFamily:'inherit' }}>
          Try Again
        </button>
      </div>
    </div>
  )
}