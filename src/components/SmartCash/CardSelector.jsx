import { Check } from 'lucide-react'

export default function CardSelector({ availableCards, selectedIds, onChange, currency }) {
  const toggleCard = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const feeSymbol = currency === "IN" ? "₹" : "$"

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 mb-6">
      <h3 className="text-sm font-mono tracking-widest text-[#00f5a0] mb-4">YOUR WALLET</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {availableCards.map(c => {
          const isSelected = selectedIds.includes(c.card_id)
          const fee = c.annual_fee === 0 ? "FREE" : `${feeSymbol}${c.annual_fee}/yr`
          
          return (
            <div 
              key={c.card_id}
              onClick={() => toggleCard(c.card_id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                ${isSelected 
                  ? 'bg-[#00f5a0]/10 border-[#00f5a0]/30' 
                  : 'bg-black/20 border-white/10 hover:border-white/20'}`}
            >
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#e8eaf0] truncate">{c.bank} {c.card_name}</div>
                <div className="text-[9px] sm:text-[10px] text-white/40 font-mono mt-1">{fee} • {c.network}</div>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center 
                ${isSelected ? 'bg-[#00f5a0] text-black' : 'bg-white/5 border border-white/10'}`}>
                {isSelected && <Check size={14} strokeWidth={3} />}
              </div>
            </div>
          )
        })}
      </div>
      
      {availableCards.length === 0 && (
        <div className="text-xs text-white/40 italic">Loading cards...</div>
      )}
    </div>
  )
}
