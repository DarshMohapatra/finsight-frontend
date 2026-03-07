import { useState } from 'react'
import { X } from 'lucide-react'
import useStore from '../../store/useStore'
import { authAPI } from '../../api/client'
import api from '../../api/client'
import useGmailToken              from './useGmailToken'
import GmailIntroStep             from './GmailIntroStep'
import GmailScanStep              from './GmailScanStep'
import GmailPickStep              from './GmailPickStep'
import GmailPasswordStep          from './GmailPasswordStep'
import { GmailDoneStep, GmailErrorStep } from './GmailDoneStep'

// Steps: intro → scanning → pick | empty → password → importing → done | error

export default function GmailImport({ onImported, onClose }) {
  const { user, setTransactions, setSummary, setCurrency, setUploadedFileName } = useStore()
  const { token, loading: tokenLoading, error: tokenError, requestToken, revokeToken } = useGmailToken()

  const [step,     setStep]     = useState('intro')
  const [emails,   setEmails]   = useState([])
  const [selected, setSelected] = useState(null)   // { message_id, attachment_id, filename, bank_name }
  const [result,   setResult]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [months,   setMonths]   = useState(6)

  // ── Step: intro → trigger Google OAuth ───────────────────────
  function handleConnect() {
    requestToken()
  }

  // ── When token arrives → scan Gmail ──────────────────────────
  // useGmailToken sets token async; we watch it via effect
  // But since the hook callback sets token, we need to trigger scan
  // We pass a combined handler — token hook calls back via onToken
  // Actually simpler: expose scanEmails to be called after token is ready
  async function handleTokenReady(accessToken) {
    setStep('scanning')
    try {
      const res = await api.post('/api/gmail/scan', { access_token: accessToken, months })
      console.warn('[Gmail Scan]', JSON.stringify(res.data, null, 2).slice(0, 500))
      if (!res.data.success) throw new Error(res.data.error)
      const found = res.data.emails || []
      setEmails(found)
      setStep(found.length > 0 ? 'pick' : 'empty')
    } catch (e) {
      setErrorMsg(e.response?.data?.error || e.message || 'Scan failed')
      setStep('error')
    }
  }

  // ── Pick attachment ───────────────────────────────────────────
  function handlePick(email, attachment) {
    setSelected({
      message_id:    email.id,
      attachment_id: attachment.attachment_id,
      filename:      attachment.filename,
      bank_name:     email.bank_name || email.from,
    })
    setStep('password')
  }

  // ── Import ────────────────────────────────────────────────────
  async function handleImport(password) {
    setStep('importing')
    try {
      const res = await api.post('/api/gmail/fetch', {
        access_token:  token,
        message_id:    selected.message_id,
        attachment_id: selected.attachment_id,
        filename:      selected.filename,
        password,
      })
      if (!res.data.success) throw new Error(res.data.error)

      const txns = res.data.transactions
      setTransactions(txns)
      setSummary(res.data.summary)
      setCurrency(res.data.currency)
      setUploadedFileName(selected.filename)
      setResult(res.data.summary)

      // Save to cloud
      if (user?.user_id) {
        try { await authAPI.saveStatements(user.user_id, txns, selected.filename) }
        catch (e) { console.warn('Cloud save failed:', e) }
      }

      setStep('done')
      if (onImported) onImported(res.data)
    } catch (e) {
      setErrorMsg(e.response?.data?.error || e.message || 'Import failed')
      setStep('error')
    }
  }

  // ── Close — revoke token ──────────────────────────────────────
  function handleClose() {
    if (token) revokeToken(token)
    onClose()
  }

  // ── Retry from error ──────────────────────────────────────────
  function handleRetry() {
    setErrorMsg('')
    setStep('intro')
  }

  // ── Determine step title ──────────────────────────────────────
  const TITLES = {
    intro:     'Import from Gmail',
    scanning:  'Scanning Inbox',
    pick:      `Found ${emails.length} Statement${emails.length !== 1 ? 's' : ''}`,
    empty:     'No Statements Found',
    password:  'PDF Password',
    importing: 'Importing…',
    done:      'Import Complete',
    error:     'Import Failed',
  }

  // Wire token → scan (token changes when GSI callback fires)
  // We use a ref to avoid double-calling
  const scannedRef = { current: false }
  if (token && step === 'intro' && !scannedRef.current) {
    scannedRef.current = true
    handleTokenReady(token)
  }

  return (
    /* Portal overlay */
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20,
    }}>
      <div style={{
        background:'#0d1117',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:20, width:'100%', maxWidth:520,
        maxHeight:'92vh', overflowY:'auto',
        boxShadow:'0 40px 80px rgba(0,0,0,0.6)',
        position:'relative',
      }}>

        {/* ── Dialog Header ──────────────────────────────────── */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'18px 24px',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          position:'sticky', top:0, zIndex:10,
          background:'#0d1117',
        }}>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>
            {TITLES[step] || 'Gmail Import'}
          </div>

          {/* Step indicator dots */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {['intro','scanning','pick','password','done'].map((s, i) => {
              const steps    = ['intro','scanning','pick','password','done']
              const current  = steps.indexOf(step)
              const past     = i < current
              const active   = i === current
              return (
                <div key={s} style={{
                  width: active ? 20 : 6, height:6, borderRadius:3,
                  background: past || active ? '#00f5a0' : 'rgba(255,255,255,0.1)',
                  transition:'all 0.3s',
                }} />
              )
            })}

            <button onClick={handleClose}
              style={{ marginLeft:4, background:'none', border:'none',
                cursor:'pointer', color:'rgba(255,255,255,0.4)',
                padding:4, display:'flex', alignItems:'center' }}>
              <X size={16}/>
            </button>
          </div>
        </div>

        {/* ── Step Content ───────────────────────────────────── */}
        {step === 'intro' && (
          <GmailIntroStep
            onConnect={handleConnect}
            loading={tokenLoading}
            error={tokenError}
            months={months}
            setMonths={setMonths}
          />
        )}

        {(step === 'scanning' || step === 'importing') && (
          <GmailScanStep
            message={step === 'importing' ? 'Analyzing your statement…' : undefined}
          />
        )}

        {(step === 'pick' || step === 'empty') && (
          <GmailPickStep
            emails={emails}
            onPick={handlePick}
            onRescan={() => handleTokenReady(token)}
            scanning={false}
          />
        )}

        {step === 'password' && (
          <GmailPasswordStep
            selected={selected}
            onImport={handleImport}
            onBack={() => setStep('pick')}
            importing={false}
          />
        )}

        {step === 'done' && (
          <GmailDoneStep
            summary={result}
            filename={selected?.filename}
            onViewDashboard={handleClose}
            onImportAnother={() => {
              setSelected(null)
              setResult(null)
              setStep(emails.length > 0 ? 'pick' : 'intro')
            }}
          />
        )}

        {step === 'error' && (
          <GmailErrorStep
            error={errorMsg}
            onRetry={handleRetry}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  )
}