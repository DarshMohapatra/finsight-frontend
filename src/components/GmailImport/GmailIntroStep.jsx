import { Shield, Mail, Eye, Trash2, Send, Loader2 } from 'lucide-react'

const PERMISSIONS = [
  { icon: Eye,   color: '#00f5a0', label: 'Read emails from your bank senders only' },
  { icon: Trash2,color: '#ff3c64', label: 'Cannot delete or modify any emails' },
  { icon: Send,  color: '#ff3c64', label: 'Cannot send emails on your behalf' },
]

const HOW_IT_WORKS = [
  { n:'1', text:'We scan for emails from known banks (HDFC, ICICI, SBI, Chase and 25+ others)' },
  { n:'2', text:'Emails with PDF attachments are listed — you choose which one to import' },
  { n:'3', text:'The PDF is downloaded, parsed, and run through FinSight\'s analyzer instantly' },
  { n:'4', text:'Your OAuth token is revoked the moment you close this dialog' },
]

export default function GmailIntroStep({ onConnect, loading, error }) {
  return (
    <div style={{ padding: '28px 28px 24px' }}>

      {/* Icon + heading */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ width:48, height:48, borderRadius:14,
          background:'linear-gradient(135deg,#ea4335 0%,#fbbc04 100%)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Mail size={22} style={{ color:'#fff' }} />
        </div>
        <div>
          <div style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>
            Import from Gmail
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>
            Read-only access · Revoked after use
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
        <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:'rgba(255,255,255,0.3)',
          letterSpacing:2, marginBottom:12 }}>WHAT WE CAN AND CANNOT DO</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {PERMISSIONS.map(p => (
            <div key={p.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                background:`${p.color}15`, border:`1px solid ${p.color}30`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p.icon size={13} style={{ color:p.color }} />
              </div>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:'rgba(255,255,255,0.3)',
          letterSpacing:2, marginBottom:10 }}>HOW IT WORKS</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {HOW_IT_WORKS.map(s => (
            <div key={s.n} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0,
                background:'rgba(0,245,160,0.1)', border:'1px solid rgba(0,245,160,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:10, fontWeight:700, color:'#00f5a0', fontFamily:"'DM Mono',monospace" }}>
                {s.n}
              </div>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:20,
        background:'rgba(0,245,160,0.04)', border:'1px solid rgba(0,245,160,0.12)',
        borderRadius:10, padding:'10px 12px' }}>
        <Shield size={13} style={{ color:'#00f5a0', marginTop:1, flexShrink:0 }} />
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6, margin:0 }}>
          This uses Google's official OAuth 2.0 — your Gmail password is{' '}
          <span style={{ color:'#00f5a0' }}>never shared with FinSight</span>.
          You can revoke access anytime from{' '}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer"
            style={{ color:'#00d4ff', textDecoration:'none' }}>
            Google Account → Security
          </a>.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10,
          background:'rgba(255,60,100,0.08)', border:'1px solid rgba(255,60,100,0.2)',
          fontSize:12, color:'#ff3c64' }}>
          {error}
        </div>
      )}

      {/* CTA */}
      <button onClick={onConnect} disabled={loading}
        style={{ width:'100%', padding:'13px',
          background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#ea4335,#fbbc04)',
          border:'none', borderRadius:12,
          color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
          fontSize:14, fontWeight:700, fontFamily:'inherit',
          cursor: loading ? 'not-allowed' : 'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        {loading ? (
          <><Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> Connecting to Google...</>
        ) : (
          <><Mail size={15} /> Connect Gmail Account</>
        )}
      </button>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}