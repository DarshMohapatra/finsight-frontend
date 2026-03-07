export default function BestCardBanner({ suggestions, currency }) {
  const sym = currency === "IN" ? "₹" : "$"

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mt-8 p-4 bg-[#00f5a0]/10 border border-[#00f5a0]/30 rounded-xl">
        <div className="text-sm text-[#00f5a0] text-center">
          You already own all available optimal cards for your spending — maximum coverage!
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div className="text-[10px] font-mono text-[#00d4ff] tracking-[2px] mb-3">AI CARD MATCHMAKER</div>
      <div className="text-xs text-white/40 mb-4">Cards you don't own yet that could boost your rewards based on your spending:</div>
      
      <div className="space-y-4">
        {suggestions.map((s, i) => {
          const fee = s.card.annual_fee === 0 ? "FREE" : `${sym}${s.card.annual_fee}/yr`
          
          return (
            <div key={i} className="p-5 bg-white/5 border border-[#00d4ff]/20 rounded-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 relative z-10">
                <div>
                  <div className="font-bold text-[#e8eaf0] text-sm sm:text-[15px]">{s.card.bank} {s.card.card_name}</div>
                  <div className="text-[11px] text-white/40 font-mono mt-1">{fee} • {s.card.network}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-base sm:text-lg font-black text-[#00f5a0]">{sym}{Math.round(s.net).toLocaleString()}</div>
                  <div className="text-[10px] text-white/40">/yr net</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3 relative z-10">
                {s.top_cats.map((tc, j) => (
                  <span key={j} className="px-2 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded text-[10px] text-[#00d4ff]">
                    {tc.category} {tc.rate}%
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-white/50 mb-4 max-w-lg relative z-10">
                This card would earn ~{sym}{Math.round(s.annual).toLocaleString()}/year in rewards
                {s.card.annual_fee > 0 ? ` (net after fee: ${sym}${Math.round(s.net).toLocaleString()})` : ""}.
              </div>
              
              {s.card.apply_url && (
                <a 
                  href={s.card.apply_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block px-5 py-2 bg-gradient-to-r from-[#00f5a0] to-[#00d4ff] text-black font-bold text-[11px] rounded-lg font-mono hover:-translate-y-0.5 transition-transform relative z-10"
                >
                  APPLY NOW
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
