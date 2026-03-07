import { FileText, Calendar, ChevronRight, RefreshCw } from 'lucide-react'

function friendlyDate(raw) {
  try {
    return new Date(raw).toLocaleDateString('en-GB', {
      day:'numeric', month:'short', year:'numeric'
    })
  } catch { return raw }
}

function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}

export default function GmailPickStep({ emails, onPick, onRescan, scanning }) {
  // Group by bank_name
  const grouped = {}
  emails.forEach(e => {
    const bank = e.bank_name || 'Other'
    if (!grouped[bank]) grouped[bank] = []
    grouped[bank].push(e)
  })

  if (emails.length === 0) {
    return (
      <div style={{ padding:'28px', textAlign:'center' }}>
        <FileText size={40} style={{ color:'rgba(255,255,255,0.1)', margin:'0 auto 16px', display:'block' }} />
        <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:8 }}>
          No bank emails found
        </div>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginBottom:20 }}>
          We scanned for emails from 25+ banks but found no PDFs.<br/>
          Make sure your bank sends statements to this Gmail account.
        </p>
        <button onClick={onRescan} disabled={scanning}
          style={{ padding:'10px 24px', background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:600,
            cursor:'pointer', fontFamily:'inherit',
            display:'inline-flex', alignItems:'center', gap:6 }}>
          <RefreshCw size={13}/> Scan Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding:'20px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>
            Found {emails.length} statement email{emails.length !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
            Select a PDF attachment to import
          </div>
        </div>
        <button onClick={onRescan} disabled={scanning}
          style={{ padding:'6px 12px', background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:8,
            color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:600,
            cursor:'pointer', fontFamily:'inherit',
            display:'flex', alignItems:'center', gap:4 }}>
          <RefreshCw size={11}/> Rescan
        </button>
      </div>

      <div style={{ maxHeight:380, overflowY:'auto',
        display:'flex', flexDirection:'column', gap:16 }}>
        {Object.entries(grouped).map(([bank, bankEmails]) => (
          <div key={bank}>
            {/* Bank group header */}
            <div style={{ fontSize:9, fontFamily:"'DM Mono',monospace",
              color:'rgba(255,255,255,0.3)', letterSpacing:2,
              marginBottom:8, paddingLeft:2 }}>
              {bank.toUpperCase()}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {bankEmails.map(email => (
                <div key={email.id}>
                  {/* Email row */}
                  <div style={{ background:'rgba(255,255,255,0.03)',
                    border:'1px solid rgba(255,255,255,0.06)',
                    borderRadius:10, padding:'10px 12px', marginBottom:2 }}>
                    <div style={{ display:'flex', alignItems:'flex-start',
                      justifyContent:'space-between', gap:8 }}>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)',
                          fontWeight:500, marginBottom:3 }}>
                          {truncate(email.subject, 55)}
                        </div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)',
                          display:'flex', alignItems:'center', gap:6 }}>
                          <Calendar size={10}/>
                          {friendlyDate(email.date)}
                        </div>
                      </div>
                    </div>

                    {/* Attachments */}
                    <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:5 }}>
                      {email.attachments.map(att => (
                        <button key={att.attachment_id}
                          onClick={() => onPick(email, att)}
                          style={{ display:'flex', alignItems:'center',
                            justifyContent:'space-between', gap:8,
                            padding:'9px 12px',
                            background:'rgba(0,245,160,0.04)',
                            border:'1px solid rgba(0,245,160,0.12)',
                            borderRadius:8, cursor:'pointer', width:'100%',
                            transition:'all 0.15s' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0,245,160,0.1)'
                            e.currentTarget.style.borderColor = 'rgba(0,245,160,0.3)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(0,245,160,0.04)'
                            e.currentTarget.style.borderColor = 'rgba(0,245,160,0.12)'
                          }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                            <FileText size={14} style={{ color:'#00f5a0', flexShrink:0 }} />
                            <span style={{ fontSize:12, color:'rgba(255,255,255,0.7)',
                              fontFamily:"'DM Mono',monospace", truncate:true,
                              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {truncate(att.filename, 40)}
                            </span>
                            <span style={{ fontSize:10, color:'rgba(255,255,255,0.25)',
                              flexShrink:0 }}>
                              {att.size_kb} KB
                            </span>
                          </div>
                          <ChevronRight size={14} style={{ color:'#00f5a0', flexShrink:0 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}