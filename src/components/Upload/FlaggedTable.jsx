import { AlertCircle, CheckCircle2 } from 'lucide-react'

function shortSource(name) {
  if (!name) return '-'
  return name.replace(/\.(pdf|csv|xlsx|xls)$/i, '').slice(0, 20)
}

export default function FlaggedTable({ S, scannedTxns, transactions }) {
  const hasScanned  = scannedTxns.length > 0
  if (!hasScanned) return null

  const levelKey  = '_GUARD_LEVEL'
  const reasonKey = '_GUARD_REASON'
  const flagged   = scannedTxns.filter(t => t[levelKey] > 0)

  return flagged.length > 0 ? (
    <div className="mb-8 p-4 md:p-5 bg-red-500/[0.06] border border-red-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <span className="text-xs font-mono text-red-400 tracking-[2px] font-semibold">
          FLAGGED TRANSACTIONS — {flagged.length} SUSPICIOUS
        </span>
      </div>
      <div className="overflow-x-auto -mx-4 md:mx-0 -mb-2">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-gray-500 text-xs font-mono">
              <th className="text-left pb-3 pl-4 md:pl-0 w-[90px]">Date</th>
              <th className="text-left pb-3 w-[160px]">Details</th>
              <th className="text-right pb-3 w-[90px]">Amount</th>
              <th className="text-left pb-3 pl-3 w-[100px]">Category</th>
              <th className="text-left pb-3 pl-3 w-[100px]">Card/Bank</th>
              <th className="text-left pb-3 pl-3 w-[70px]">Level</th>
              <th className="text-left pb-3 pl-3 min-w-[220px]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {flagged.slice(0,20).map((t,i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-2.5 text-gray-300 text-xs pl-4 md:pl-0">{t.DATE}</td>
                <td className="py-2.5 text-gray-300 pr-2 max-w-[160px] truncate text-xs">{t['TRANSACTION DETAILS']}</td>
                <td className="py-2.5 text-right text-white font-mono text-xs">{S}{Math.round(t['WITHDRAWAL AMT']).toLocaleString()}</td>
                <td className="py-2.5 text-gray-400 pl-3 text-xs">{t.CATEGORY}</td>
                <td className="py-2.5 text-cyan-400/70 pl-3 text-xs">{shortSource(t._source_file)}</td>
                <td className="py-2.5 pl-3 text-xs">{t[levelKey]===3?'Hard':t[levelKey]===2?'Soft':'Info'}</td>
                <td className="py-2.5 text-gray-400 text-xs pl-3 leading-relaxed">{t[reasonKey]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="mb-8 p-4 bg-emerald-500/[0.04] border border-emerald-500/[0.12] rounded-xl flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      <span className="text-xs font-mono text-emerald-400">All clear — no suspicious transactions.</span>
    </div>
  )
}
