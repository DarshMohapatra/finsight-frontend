import { useState } from 'react'
import { FileText, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react'

export default function GmailPasswordStep({ selected, onImport, onBack, importing }) {
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)

  return (
    <div style={{ padding:'24px 28px' }}>

      {/* Back */}
      <button onClick={onBack} disabled={importing}
        style={{ display:'flex', alignItems:'center', gap:4, marginBottom:20,
          background:'none', border:'none', color:'rgba(255,255,255,0.35)',
          fontSize:12, cursor:'pointer', fontFamily:'inherit', padding:0 }}>
        <ChevronLeft size={14}/> Back to email list
      </button>

      {/* Selected file card */}
      <div style={{ background:'rgba(0,245,160,0.04)', border:'1px solid rgba(0,245,160,0.15)',
        borderRadius:12, padding:'14px 16px', marginBottom:20,
        display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
          background:'rgba(0,245,160,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FileText size={16} style={{ color:'#00f5a0' }} />
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13, color:'#fff', fontWeight:600,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {selected?.filename}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
            From: {selected?.bank_name || selected?.from}
          </div>
        </div>
      </div>

      {/* Password field */}
      <div style={{ marginBottom:8 }}>
        <label style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8,
          fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:"'DM Mono',monospace",
          letterSpacing:1.5 }}>
          <Lock size={12}/> PDF PASSWORD (IF ENCRYPTED)
        </label>
        <div style={{ position:'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !importing && onImport(password)}
            placeholder="e.g. DDMMYYYY or PAN number"
            style={{ width:'100%', boxSizing:'border-box',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:10, padding:'11px 40px 11px 14px',
              color:'#fff', fontSize:13, fontFamily:'inherit',
              outline:'none' }}
          />
          <button onClick={() => setShowPw(p => !p)}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer',
              color:'rgba(255,255,255,0.3)', padding:0 }}>
            {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)',
        lineHeight:1.6, marginBottom:24 }}>
        Common formats: <span style={{ fontFamily:"'DM Mono',monospace",
          color:'rgba(255,255,255,0.5)' }}>DDMMYYYY</span> of account holder,
        first 4 letters of name + birth year, or your PAN number.
        Leave blank if the PDF is not password protected.
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => onImport('')} disabled={importing}
          style={{ flex:1, padding:'12px',
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:10, color:'rgba(255,255,255,0.45)',
            fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          Skip (No Password)
        </button>
        <button onClick={() => onImport(password)} disabled={importing}
          style={{ flex:2, padding:'12px',
            background: importing
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg,#00f5a0,#00d4ff)',
            border:'none', borderRadius:10,
            color: importing ? 'rgba(255,255,255,0.3)' : '#000',
            fontSize:13, fontWeight:700, cursor: importing ? 'not-allowed' : 'pointer',
            fontFamily:'inherit' }}>
          {importing ? 'Importing…' : 'Import Statement ⚡'}
        </button>
      </div>
    </div>
  )
}