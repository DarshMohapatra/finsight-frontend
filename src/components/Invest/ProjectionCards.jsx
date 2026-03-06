export default function ProjectionCards({ stats }) {
  if (!stats) return null

  const metrics = [
    { label: 'TOTAL CORPUS', value: `₹${stats.total_corpus.toLocaleString(undefined, {maximumFractionDigits:0})}`, sub: 'spare change captured', color: 'text-[#00f5a0]' },
    { label: 'MONTHLY AVG', value: `₹${stats.monthly_avg.toLocaleString(undefined, {maximumFractionDigits:0})}`, sub: 'per month', color: 'text-[#00d4ff]' },
    { label: 'TRANSACTIONS', value: stats.total_txns.toLocaleString(), sub: 'rounded up', color: 'text-[#f59e0b]' },
    { label: 'AVG / TXN', value: `₹${stats.avg_per_txn.toFixed(1)}`, sub: 'per transaction', color: 'text-[#a855f7]' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => (
        <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="text-[10px] text-white/35 font-mono tracking-[1.5px] mb-2">{m.label}</div>
          <div className={`text-2xl font-black tracking-[-0.5px] ${m.color}`}>{m.value}</div>
          <div className="text-[10px] text-white/25 mt-1">{m.sub}</div>
        </div>
      ))}
    </div>
  )
}
