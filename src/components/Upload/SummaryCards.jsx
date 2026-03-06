export default function SummaryCards({ S, summary, transactions, scannedTxns }) {
  const anomalyCount = scannedTxns.length > 0
    ? scannedTxns.filter(t => t._GUARD_LEVEL > 0).length
    : transactions.filter(t => t.ALERT_LEVEL > 0).length

  const cards = [
    { val: summary.txn_count, label: 'TRANSACTIONS', color: 'text-emerald-400' },
    {
      val: summary.total_spent >= 100000
        ? `${S}${(summary.total_spent/100000).toFixed(1)}L`
        : `${S}${Math.round(summary.total_spent).toLocaleString()}`,
      label: 'TOTAL WITHDRAWN', color: 'text-cyan-400',
    },
    {
      val: anomalyCount,
      label: 'ANOMALIES FLAGGED',
      color: anomalyCount > 0 ? 'text-red-400' : 'text-emerald-400',
    },
    {
      val: `${Math.round(transactions.filter(t=>t.CATEGORY!=='Other').length/transactions.length*100)}%`,
      label: 'AUTO CATEGORIZED', color: 'text-purple-400',
    },
  ]

  return (
    <>
      <h2 className="text-xs font-mono text-emerald-400 tracking-[3px] mb-6">ANALYSIS SUMMARY</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(m => (
          <div key={m.label} className="p-5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-center">
            <div className={`text-xl font-extrabold font-mono ${m.color}`}>{m.val}</div>
            <div className="text-[9px] text-gray-500 font-mono tracking-[1.5px] mt-1.5">{m.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}