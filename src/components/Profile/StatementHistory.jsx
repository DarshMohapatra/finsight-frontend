import { useEffect, useState, useMemo } from 'react'
import useStore from '../../store/useStore'
import { FileText, Calendar, CheckCircle2, Activity, ChevronDown, FolderOpen } from 'lucide-react'
import { authAPI } from '../../api/client'

// Truncate long/garbled filenames (e.g. Google Drive hash downloads)
function shortName(name) {
  if (!name || name === 'Legacy Cloud Backup') return 'Cloud Backup'
  const noExt = name.replace(/\.(pdf|csv|xlsx|xls)$/i, '')
  if (noExt.length > 40 && !noExt.includes(' ')) {
    return noExt.slice(0, 18) + '…' + noExt.slice(-8)
  }
  if (noExt.length > 32) return noExt.slice(0, 28) + '…'
  return noExt
}

function currSym(c) {
  return { IN:'₹', US:'$', UK:'£', CA:'C$', AU:'A$' }[c] || '₹'
}

export default function StatementHistory() {
  const {
    user, transactions, setTransactions,
    setSummary, setCurrency, setUploadedFileName, uploadedFileName,
  } = useStore()

  const [loading,    setLoading]    = useState(true)
  const [cloudTxns,  setCloudTxns]  = useState([])
  const [error,      setError]      = useState('')
  const [selected,   setSelected]   = useState('')
  const [dropOpen,   setDropOpen]   = useState(false)
  const [activating, setActivating] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function fetchAll() {
      if (!user?.user_id) return
      setLoading(true)
      try {
        const res = await authAPI.loadStatements(user.user_id)
        if (res.data?.records) setCloudTxns(res.data.records)
      } catch {
        setError('Failed to load statement history.')
      }
      setLoading(false)
    }
    fetchAll()
  }, [user])

  // Group by source file
  const storedFiles = useMemo(() => {
    const map = {}
    cloudTxns.forEach(t => {
      const fn = t._source_file || 'Legacy Cloud Backup'
      if (!map[fn]) map[fn] = { name: fn, count: 0, amount: 0, dates: [], currency: t.CURRENCY || 'IN' }
      map[fn].count += 1
      if (t['WITHDRAWAL AMT'] > 0) map[fn].amount += t['WITHDRAWAL AMT']
      if (t.DATE) map[fn].dates.push(new Date(t.DATE))
    })
    return Object.values(map).map(file => {
      const valid = file.dates.filter(d => !isNaN(d))
      const start = valid.length ? new Date(Math.min(...valid)).toLocaleDateString('en-GB', { day:'numeric', month:'short' }) : '?'
      const end   = valid.length ? new Date(Math.max(...valid)).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'2-digit' }) : '?'
      return { ...file, start, end }
    }).sort((a, b) => b.count - a.count)
  }, [cloudTxns])

  const selectedFile = storedFiles.find(f => f.name === selected)

  function handleLoad() {
    if (!selected || activating) return
    setActivating(true)
    const fileTxns = cloudTxns.filter(t => (t._source_file || 'Legacy Cloud Backup') === selected)
    setTransactions(fileTxns)
    setUploadedFileName(selected)
    setCurrency(fileTxns[0]?.CURRENCY || 'IN')
    setSummary({
      txn_count:    fileTxns.length,
      total_spent:  fileTxns.reduce((s, t) => s + (t['WITHDRAWAL AMT'] || 0), 0),
      total_income: fileTxns.reduce((s, t) => s + (t['DEPOSIT AMT']    || 0), 0),
    })
    setSuccessMsg(`✅ Loaded ${fileTxns.length} transactions from "${shortName(selected)}"`)
    setActivating(false)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-1">Statement Filing Cabinet</h2>
      <p className="text-sm text-white/40 mb-6">
        Select a previously uploaded statement to load into the dashboard.
      </p>

      {error && (
        <div className="text-xs text-red-400 mb-4 p-3 bg-red-500/10 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10 text-white/40 animate-pulse text-sm">
          Scanning cloud storage…
        </div>
      ) : storedFiles.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/5">
          <FileText size={40} className="mx-auto text-white/10 mb-4" />
          <h3 className="text-base font-bold text-white mb-1">Drive Empty</h3>
          <p className="text-sm text-white/40">
            Upload a statement in the Upload tab — it will save here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* ── Dropdown ─────────────────────────────────────────── */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 tracking-[3px] mb-2">
              SELECT STATEMENT
            </label>
            <div className="relative">
              <button
                onClick={() => setDropOpen(o => !o)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderOpen size={16} className="text-[#00f5a0] flex-shrink-0" />
                  <span className={`text-sm font-medium truncate ${selected ? 'text-white' : 'text-white/25'}`}>
                    {selected ? shortName(selected) : 'Choose a statement…'}
                  </span>
                  {selectedFile && (
                    <span className="flex-shrink-0 text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/40">
                      {selectedFile.count} txns
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropOpen && (
                <div className="absolute z-30 mt-1 w-full bg-[#0c1018] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {storedFiles.map(f => {
                    const active = uploadedFileName === f.name
                    const S = currSym(f.currency)
                    return (
                      <button
                        key={f.name}
                        onClick={() => { setSelected(f.name); setDropOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0
                          ${selected === f.name ? 'bg-[#00f5a0]/5' : 'hover:bg-white/5'}`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center
                          ${active ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-white/5 text-white/25'}`}>
                          {active ? <Activity size={14}/> : <FileText size={14}/>}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-medium truncate">
                              {shortName(f.name)}
                            </span>
                            {active && (
                              <span className="px-1.5 py-px rounded text-[8px] font-bold bg-[#00f5a0] text-black flex-shrink-0">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-white/30 font-mono">
                            <Calendar size={9}/>
                            <span>{f.start} – {f.end}</span>
                            <span className="text-white/15">·</span>
                            <span>{f.count} txns</span>
                            <span className="text-white/15">·</span>
                            <span>{S}{(f.amount/1000).toFixed(0)}K spent</span>
                          </div>
                        </div>

                        {selected === f.name && (
                          <CheckCircle2 size={15} className="text-[#00f5a0] flex-shrink-0"/>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Preview + Load button ────────────────────────────── */}
          {selectedFile && (
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 flex-wrap">
              <div>
                <div className="text-[10px] font-mono text-white/30 tracking-widest mb-1">SELECTED FILE</div>
                <div className="text-sm font-bold text-white">{shortName(selectedFile.name)}</div>
                <div className="text-xs text-white/35 mt-0.5 font-mono">
                  {selectedFile.count} transactions · {selectedFile.start} → {selectedFile.end}
                </div>
              </div>
              <button
                onClick={handleLoad}
                disabled={activating || uploadedFileName === selectedFile.name}
                style={{
                  padding: '10px 28px',
                  background: uploadedFileName === selectedFile.name
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg,#00f5a0,#00d4ff)',
                  border: 'none', borderRadius: 10,
                  color: uploadedFileName === selectedFile.name ? 'rgba(255,255,255,0.25)' : '#000',
                  fontWeight: 700, fontSize: 13,
                  cursor: uploadedFileName === selectedFile.name ? 'default' : 'pointer',
                  fontFamily: 'inherit', flexShrink: 0,
                }}
              >
                {uploadedFileName === selectedFile.name ? '✓ Already Active' : activating ? 'Loading…' : 'Load This Statement'}
              </button>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 text-sm text-[#00f5a0] p-3 bg-[#00f5a0]/8 rounded-lg border border-[#00f5a0]/20">
              <CheckCircle2 size={15}/> {successMsg}
            </div>
          )}
        </div>
      )}
    </div>
  )
}