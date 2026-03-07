export default function CashbackTable({ summary, currency }) {
  const sym = currency === "IN" ? "₹" : "$"

  if (!summary || summary.length === 0) return null

  return (
    <div className="mt-8">
      <div className="text-[10px] font-mono text-[#00d4ff] tracking-[2px] mb-3">CATEGORY GUIDE</div>
      <div className="text-xs text-white/40 mb-4">Best card to use per spend type:</div>
      
      <div className="space-y-3">
        {summary.map((row, i) => {
          // Calculate a rough percentage for the bar (max out realistically around 6%)
          const pct = Math.min(Math.round((row.avg_rate / 6) * 100), 100)
          
          return (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                <div className="font-bold text-[#e8eaf0] text-sm">{row.CATEGORY}</div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#00f5a0] truncate">Use → {row.best_card}</div>
              </div>
              
              <div className="text-xs text-white/40 mb-3">
                {sym}{row.spend.toLocaleString()} spent • {row.txns.toLocaleString()} txns • 
                earns {sym}{Math.round(row.cashback).toLocaleString()} at {row.avg_rate.toFixed(1)}%
              </div>
              
              <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f5a0] to-[#00d4ff] rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
