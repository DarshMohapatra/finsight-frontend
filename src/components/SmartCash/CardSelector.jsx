import { useState } from 'react'
import { Check, Save, X } from 'lucide-react'

export default function CardSelector({ availableCards, selectedIds, onChange, currency, onSaveCard, savingCard }) {
  const [promptCardId, setPromptCardId] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardNickname, setCardNickname] = useState('')

  const feeSymbol = currency === "IN" ? "₹" : "$"

  const toggleCard = (id) => {
    if (selectedIds.includes(id)) {
      // Deselect — just remove from local selection
      onChange(selectedIds.filter(x => x !== id))
      if (promptCardId === id) setPromptCardId(null)
    } else {
      // Select — add to local selection and show inline prompt
      onChange([...selectedIds, id])
      if (onSaveCard) {
        setPromptCardId(id)
        setCardNumber('')
        setCardNickname('')
      }
    }
  }

  const handleSave = () => {
    if (!promptCardId) return
    onSaveCard(promptCardId, cardNumber, cardNickname)
    setPromptCardId(null)
    setCardNumber('')
    setCardNickname('')
  }

  const handleDismiss = () => {
    setPromptCardId(null)
    setCardNumber('')
    setCardNickname('')
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 mb-6">
      <h3 className="text-sm font-mono tracking-widest text-[#00f5a0] mb-4">YOUR WALLET</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {availableCards.map(c => {
          const isSelected = selectedIds.includes(c.card_id)
          const fee = c.annual_fee === 0 ? "FREE" : `${feeSymbol}${c.annual_fee}/yr`
          const showPrompt = promptCardId === c.card_id

          return (
            <div key={c.card_id}>
              <div
                onClick={() => toggleCard(c.card_id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                  ${isSelected
                    ? 'bg-[#00f5a0]/10 border-[#00f5a0]/30'
                    : 'bg-black/20 border-white/10 hover:border-white/20'}
                  ${showPrompt ? 'rounded-b-none' : ''}`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#e8eaf0] truncate">{c.bank} {c.card_name}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/40 font-mono mt-1">{fee} • {c.network}</div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-[#00f5a0] text-black' : 'bg-white/5 border border-white/10'}`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              {/* Inline save prompt */}
              {showPrompt && (
                <div className="p-3 bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 border-t-0 rounded-b-lg">
                  <div className="text-[10px] text-[#f59e0b] font-mono tracking-[1px] mb-2">SAVE TO YOUR CARDS</div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Last 4 digits (e.g. 4523)"
                      maxLength={4}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#f59e0b]"
                    />
                    <input
                      type="text"
                      value={cardNickname}
                      onChange={e => setCardNickname(e.target.value)}
                      placeholder="Nickname (optional)"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#f59e0b]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={savingCard}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#f59e0b] text-black hover:bg-[#f59e0b]/90 disabled:opacity-40 transition-colors"
                      >
                        <Save size={11} /> {savingCard ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleDismiss}
                        className="px-3 py-1.5 rounded-lg text-[11px] text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
