import { useState, useCallback } from 'react'
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff, CloudDownload, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'
import { uploadAPI, authAPI } from '../../api/client'
import DropZone           from './DropZone'
import Guardrails         from './Guardrails'
import SummaryCards       from './SummaryCards'
import FlaggedTable       from './FlaggedTable'
import RecentTransactions from './RecentTransactions'

function sym(currency) {
  return { IN:'₹', US:'$', UK:'£', CA:'C$', AU:'A$' }[currency] || '₹'
}

// Truncate long/garbled filenames
function shortName(name) {
  if (!name) return ''
  const noExt = name.replace(/\.(pdf|csv|xlsx|xls)$/i, '')
  if (noExt.length > 40 && !noExt.includes(' ')) return noExt.slice(0, 18) + '…' + noExt.slice(-8)
  if (noExt.length > 32) return noExt.slice(0, 28) + '…'
  return noExt
}

export default function Upload() {
  const [file,         setFile]         = useState(null)
  const [password,     setPassword]     = useState('')
  const [isUploading,  setIsUploading]  = useState(false)
  const [error,        setError]        = useState('')
  const [successMsg,   setSuccessMsg]   = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [guardTxn,     setGuardTxn]     = useState('10000')
  const [guardMonthly, setGuardMonthly] = useState('50000')
  const [guardCats,    setGuardCats]    = useState([])
  const [scannedTxns,  setScannedTxns]  = useState([])
  const [loadingCloud, setLoadingCloud] = useState(false)

  const {
    setTransactions, setSummary, setCurrency,
    transactions, summary, currency, user,
    uploadedFileName, setUploadedFileName,
  } = useStore()

  // ── NO auto-load on mount — user must explicitly click Load Previous ──

  // ── Manual load previous statement ───────────────────────────
  async function handleLoadPrevious() {
    if (!user?.user_id) return
    setLoadingCloud(true); setError('')
    try {
      const res = await authAPI.loadStatements(user.user_id)
      if (res.data?.records?.length > 0) {
        const recs = res.data.records
        setTransactions(recs)
        setCurrency(recs[0]?.CURRENCY || 'IN')
        setSummary({
          txn_count:    recs.length,
          total_spent:  recs.reduce((s,t) => s + (t['WITHDRAWAL AMT'] || 0), 0),
          total_income: recs.reduce((s,t) => s + (t['DEPOSIT AMT']    || 0), 0),
        })
        const lastFile = recs[recs.length - 1]?._source_file || 'Cloud Backup'
        setUploadedFileName(lastFile)
        setScannedTxns([])
        setSuccessMsg(`✅ Loaded ${recs.length} transactions. For individual files, use Profile → Statement History.`)
      } else {
        setError('No previous statement found. Upload one first.')
      }
    } catch {
      setError('Failed to fetch from backend. Make sure Flask is running.')
    }
    setLoadingCloud(false)
  }

  // ── Save to cloud with filename tag ──────────────────────────
  async function saveToCloud(txns, filename) {
    if (!user?.user_id) return
    try {
      await authAPI.saveStatements(user.user_id, txns, filename)
    } catch (e) {
      console.warn('Cloud save failed:', e)
    }
  }

  // ── Guardrails scan ───────────────────────────────────────────
  function runScan(cats = guardCats) {
    const txnLimit     = parseInt(guardTxn.replace(/,/g,''))     || 10000
    const monthlyLimit = parseInt(guardMonthly.replace(/,/g,'')) || 50000
    const S = sym(currency)
    const monthlyTotals = {}
    transactions.forEach(t => {
      if (t['WITHDRAWAL AMT'] > 0) {
        const month = t.DATE?.substring(0,7)
        monthlyTotals[month] = (monthlyTotals[month] || 0) + t['WITHDRAWAL AMT']
      }
    })
    const scanned = transactions.map(t => {
      const reasons = []; let level = t.ALERT_LEVEL || 0
      if (t['WITHDRAWAL AMT'] >= txnLimit) {
        reasons.push(`${S}${t['WITHDRAWAL AMT'].toLocaleString()} exceeds your ${S}${txnLimit.toLocaleString()} per-txn limit`)
        if (level < 2) level = 2
      }
      if (cats.length > 0 && cats.includes(t.CATEGORY) && t['WITHDRAWAL AMT'] > 0) {
        reasons.push(`'${t.CATEGORY}' is on your watch list`)
        if (level < 2) level = 2
      }
      const month = t.DATE?.substring(0,7)
      if (monthlyTotals[month] > monthlyLimit && t['WITHDRAWAL AMT'] > 0) {
        reasons.push(`Month total ${S}${Math.round(monthlyTotals[month]).toLocaleString()} exceeds ${S}${monthlyLimit.toLocaleString()} budget`)
        if (level < 1) level = 1
      }
      return { ...t, _GUARD_LEVEL: level, _GUARD_REASON: reasons.length > 0 ? reasons.join(' | ') : (t.ALERT_REASON || '') }
    })
    setScannedTxns(scanned)
  }

  function removeGuardCat(cat) {
    const updated = guardCats.filter(c => c !== cat)
    setGuardCats(updated)
    runScan(updated)
  }

  // ── Dropzone ──────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles) => {
    setError(''); setSuccessMsg('')
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploadedFileName(acceptedFiles[0].name)
    }
  }, [])

  // ── Upload + analyze ──────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return
    if (transactions.length > 0) {
      if (!window.confirm('Re-analyze? This replaces your current data.')) return
    }
    setIsUploading(true); setError(''); setSuccessMsg('')
    setTransactions([]); setSummary(null); setScannedTxns([])
    try {
      const res = await uploadAPI.upload(file, password)
      if (res.data.success) {
        setTransactions(res.data.transactions)
        setSummary(res.data.summary)
        setCurrency(res.data.currency)
        setSuccessMsg(`✅ Successfully processed ${res.data.summary.txn_count} transactions!`)
        await saveToCloud(res.data.transactions, file.name)
      } else {
        setError(res.data.error || 'Failed to process file.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot connect to backend. Make sure Flask is running.')
    }
    setIsUploading(false)
  }

  const displayName = file?.name || uploadedFileName
  const isPdf       = displayName?.toLowerCase().endsWith('.pdf')
  const S           = sym(currency)

  return (
    <div className="max-w-4xl mx-auto py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Upload Statement
        </h1>
        <p className="text-gray-400">
          Drop your bank statement here. We support HDFC, SBI, ICICI, Chase, and 50+ other banks globally.
        </p>
      </div>

      {/* Drop zone */}
      <DropZone
        displayName={displayName ? shortName(displayName) : null}
        file={file}
        onDrop={onDrop}
        onRemove={() => {
          setFile(null); setUploadedFileName(null)
          setPassword(''); setError(''); setSuccessMsg(''); setScannedTxns([])
          setTransactions([]); setSummary(null)
        }}
      />

      {/* OR divider */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-800" />
        <span className="text-xs text-gray-600 font-mono">OR</span>
        <div className="flex-1 border-t border-gray-800" />
      </div>

      {/* Load Previous button — explicit user action only, no auto-load */}
      <button onClick={handleLoadPrevious} disabled={loadingCloud}
        style={{ marginTop:12, width:'100%', padding:'12px',
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:12, color: loadingCloud ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)',
          fontSize:14, fontWeight:600, fontFamily:'inherit',
          cursor: loadingCloud ? 'not-allowed' : 'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        {loadingCloud
          ? <><RefreshCw size={15}/> Loading...</>
          : <><CloudDownload size={15}/> Load Previous Statement</>}
      </button>

      {/* PDF password */}
      {isPdf && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
            <Lock className="w-4 h-4 mr-2" /> PDF Password (if encrypted)
          </label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="e.g. your PAN or birthdate (DDMMYYYY)"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-emerald-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">We decrypt in memory and never store your password.</p>
        </div>
      )}

      {/* Status messages */}
      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5"/>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5"/>
          <p className="text-sm">{successMsg}</p>
        </div>
      )}

      {/* Analyze button */}
      {file && (
        <button onClick={handleUpload} disabled={isUploading}
          style={{ marginTop:24, width:'100%', padding:'14px',
            background: isUploading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#00f5a0,#00d4ff)',
            border:'none', borderRadius:12,
            color: isUploading ? 'rgba(255,255,255,0.3)' : '#000',
            fontSize:16, fontWeight:700, fontFamily:'inherit',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            boxShadow: isUploading ? 'none' : '0 0 32px rgba(0,245,160,0.25)' }}>
          {isUploading ? 'Analyzing Statement...' : 'Analyze My Finances ⚡'}
        </button>
      )}

      {/* Post-upload analysis */}
      {transactions.length > 0 && summary && (
        <div className="mt-12 border-t border-gray-800 pt-8">
          <Guardrails
            S={S}
            guardTxn={guardTxn}         setGuardTxn={setGuardTxn}
            guardMonthly={guardMonthly} setGuardMonthly={setGuardMonthly}
            guardCats={guardCats}       setGuardCats={setGuardCats}
            transactions={transactions}
            onScan={() => runScan()}
            onRemoveCat={removeGuardCat}
          />
          <SummaryCards S={S} summary={summary} transactions={transactions} scannedTxns={scannedTxns} />
          <FlaggedTable S={S} scannedTxns={scannedTxns} transactions={transactions} />
          <RecentTransactions S={S} transactions={transactions} />
        </div>
      )}

      {/* Privacy footer */}
      <div className="mt-12 text-center border-t border-gray-800 pt-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Your Data, Your Control</h3>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Your statements are processed securely and tied only to your account.
          You can delete your data at any time from Profile settings.
        </p>
      </div>
    </div>
  )
}