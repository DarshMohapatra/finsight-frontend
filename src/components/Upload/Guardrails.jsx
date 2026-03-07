export default function Guardrails({ S, guardTxn, setGuardTxn, guardMonthly, setGuardMonthly,
  guardCats, setGuardCats, guardSource, setGuardSource, sourceFiles,
  transactions, onScan, onRemoveCat }) {

  const hasWatchCats = guardCats.length > 0

  return (
    <div className="mb-8 p-5 bg-amber-500/[0.06] border border-amber-500/[0.15] rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-amber-400 tracking-[2px] font-semibold">SET YOUR GUARDRAILS</span>
        <span className="text-[10px] text-gray-500">
          {hasWatchCats ? 'Watch-category mode active' : 'Set limits, then Scan'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Max per transaction — disabled in watch-cat mode */}
        <div style={{ opacity: hasWatchCats ? 0.4 : 1 }}>
          <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">
            MAX PER TRANSACTION ({S})
          </label>
          <input type="text" value={guardTxn} onChange={e => setGuardTxn(e.target.value)}
            disabled={hasWatchCats}
            placeholder="e.g. 10000"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 disabled:cursor-not-allowed" />
          {hasWatchCats && (
            <span className="text-[9px] text-gray-600 mt-1 block">Disabled — using watch categories</span>
          )}
        </div>

        {/* Monthly budget — disabled in watch-cat mode */}
        <div style={{ opacity: hasWatchCats ? 0.4 : 1 }}>
          <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">
            MONTHLY BUDGET LIMIT ({S})
          </label>
          <input type="text" value={guardMonthly} onChange={e => setGuardMonthly(e.target.value)}
            disabled={hasWatchCats}
            placeholder="e.g. 50000"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 disabled:cursor-not-allowed" />
          {hasWatchCats && (
            <span className="text-[9px] text-gray-600 mt-1 block">Disabled — using watch categories</span>
          )}
        </div>

        {/* Watch categories */}
        <div>
          <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">WATCH CATEGORIES</label>
          <select
            onChange={e => {
              const val = e.target.value
              if (val && !guardCats.includes(val)) setGuardCats([...guardCats, val])
              e.target.value = ''
            }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">Select category...</option>
            {[...new Set(transactions.map(t => t.CATEGORY))].sort().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {guardCats.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {guardCats.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                  {cat}
                  <button onClick={() => onRemoveCat(cat)} className="hover:text-white ml-0.5">&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Source file / card filter */}
        {sourceFiles && sourceFiles.length > 1 && (
          <div>
            <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">FILTER BY CARD / BANK</label>
            <select
              value={guardSource}
              onChange={e => setGuardSource(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="">All Statements</option>
              {sourceFiles.map(src => (
                <option key={src} value={src}>{src.replace(/\.(pdf|csv|xlsx|xls)$/i, '')}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button onClick={onScan}
        style={{ marginTop:8, padding:'10px 32px',
          background:'linear-gradient(135deg,#f59e0b,#f97316)',
          border:'none', borderRadius:10, color:'#000',
          fontWeight:700, fontSize:13, cursor:'pointer',
          fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8,
          boxShadow:'0 0 24px rgba(245,158,11,0.3)' }}>
        Scan Transactions
      </button>
    </div>
  )
}
