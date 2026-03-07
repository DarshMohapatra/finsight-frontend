import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { cardsAPI } from '../../api/client'
import CardSelector from './CardSelector'
import CashbackTable from './CashbackTable'
import BestCardBanner from './BestCardBanner'
import { Award, Zap, CreditCard, Plus, Trash2, Save, X } from 'lucide-react'

export default function SmartCash() {
  const { transactions, currency, user, savedCards, setSavedCards } = useStore()
  const [availableCards, setAvailableCards] = useState([])
  const [selectedWallet, setSelectedWallet] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Saved card form
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCardId, setNewCardId] = useState('')
  const [newCardNumber, setNewCardNumber] = useState('')
  const [newCardNickname, setNewCardNickname] = useState('')
  const [savingCard, setSavingCard] = useState(false)

  // Load available cards from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/smartcash/cards?currency=${currency}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.cards) {
          setAvailableCards(data.cards)
        }
      })
      .catch(e => console.error("Failed to fetch cards:", e))
  }, [currency])

  // Load saved cards from DB on mount
  useEffect(() => {
    if (!user?.user_id) return
    cardsAPI.load(user.user_id)
      .then(res => {
        if (res.data?.cards) {
          setSavedCards(res.data.cards)
          // Auto-select saved cards in wallet
          const ids = res.data.cards.map(c => c.card_id).filter(Boolean)
          if (ids.length > 0) setSelectedWallet(ids)
        }
      })
      .catch(() => {})
  }, [user?.user_id])

  // Auto-detect cards from uploaded statements
  useEffect(() => {
    if (availableCards.length === 0 || transactions.length === 0) return
    const sources = [...new Set(transactions.map(t => t._source_file).filter(Boolean))]
    if (sources.length === 0) return
    const detected = []
    sources.forEach(src => {
      const lower = src.toLowerCase()
      availableCards.forEach(c => {
        const bankLower = (c.bank || '').toLowerCase()
        if (bankLower && lower.includes(bankLower) && !detected.includes(c.card_id)) {
          detected.push(c.card_id)
        }
      })
    })
    if (detected.length > 0) {
      setSelectedWallet(prev => {
        const merged = [...new Set([...prev, ...detected])]
        return merged
      })
    }
  }, [availableCards, transactions])

  // If no saved cards and nothing detected, default to free cards
  useEffect(() => {
    if (savedCards.length === 0 && availableCards.length > 0 && selectedWallet.length === 0) {
      const duds = availableCards.filter(c => c.annual_fee === 0).slice(0, 3).map(c => c.card_id)
      setSelectedWallet(duds)
    }
  }, [availableCards, savedCards])

  const handleSaveCard = async () => {
    if (!newCardId || !user?.user_id) return
    setSavingCard(true)
    try {
      const res = await cardsAPI.save(user.user_id, newCardId, newCardNumber, newCardNickname)
      if (res.data?.success) {
        setSavedCards([res.data.card, ...savedCards])
        // Auto-add to wallet selection
        if (!selectedWallet.includes(newCardId)) {
          setSelectedWallet([...selectedWallet, newCardId])
        }
        setNewCardId(''); setNewCardNumber(''); setNewCardNickname('')
        setShowAddCard(false)
      } else {
        setError(res.data?.error || 'Failed to save card')
      }
    } catch (e) {
      setError('Failed to save card — please try again.')
    }
    setSavingCard(false)
  }

  const handleDeleteCard = async (cardDbId, cardId) => {
    if (!user?.user_id) return
    try {
      await cardsAPI.remove(user.user_id, cardDbId)
      setSavedCards(savedCards.filter(c => c.id !== cardDbId))
    } catch {}
  }

  const runAnalysis = async () => {
    if (selectedWallet.length === 0) return
    setLoading(true)
    setError('')
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/smartcash/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, wallet: selectedWallet, currency })
      })
      const data = await resp.json()
      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || 'Failed to analyze wallet')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sym = currency === "IN" ? "₹" : "$"
  const isUS = currency === "US"

  // -- Celebration & Alert Logic --
  let celebrations = []
  let missedAlerts = []

  if (results && results.results.length > 0) {
    const tot_sp = results.results.reduce((a,b) => a + b.AMOUNT, 0)
    const tot_cb = results.results.reduce((a,b) => a + b.BEST_CASHBACK, 0)
    const tot_ex = results.results.reduce((a,b) => a + b.EXTRA, 0)
    const eff_r  = tot_sp > 0 ? (tot_cb/tot_sp)*100 : 0

    const allDates = results.results.map(r => r.DATE).filter(Boolean)
    const monthsInGrp = Math.max(new Set(allDates.map(d => d.substring(0,7))).size, 1)
    const annual_cb = (tot_cb / monthsInGrp) * 12

    if (tot_cb >= 1000 || (tot_cb >= 100 && isUS)) {
       celebrations.push(`You've optimised ${sym}${Math.round(tot_cb).toLocaleString()} in cashback — that's ${sym}${Math.round(annual_cb).toLocaleString()} projected annually!`)
    }
    if (eff_r >= 3.0) {
       celebrations.push(`Your effective reward rate is ${eff_r.toFixed(1)}% — you're in the top tier of cardholders!`)
    } else if (eff_r >= 2.0) {
       celebrations.push(`A solid ${eff_r.toFixed(1)}% effective rate — great card discipline!`)
    }
    if (tot_ex > 0) {
       celebrations.push(`By using the right cards you earn ${sym}${Math.round(tot_ex).toLocaleString()} more than a basic 1% card would give!`)
    }

    const perfectCats = results.summary.filter(r => r.avg_rate >= 4.0).map(r => r.CATEGORY)
    if (perfectCats.length > 0) {
       celebrations.push(`Excellent rewards on ${perfectCats.slice(0,3).join(", ")} — you're using the right card${perfectCats.length>1?'s':''} there!`)
    }

    if (selectedWallet.length > 1) {
      const missedSum = {}
      results.results.forEach(r => {
        if (!missedSum[r.CATEGORY]) missedSum[r.CATEGORY] = { amount: 0, worst: r.WORST_CARD, best: r.BEST_CARD, txns: 0 }
        missedSum[r.CATEGORY].amount += (r.MISSED || 0)
        missedSum[r.CATEGORY].txns += 1
      })

      missedAlerts = Object.entries(missedSum)
        .filter(([_, data]) => data.amount > 0 && data.worst !== data.best)
        .sort((a,b) => b[1].amount - a[1].amount)
        .slice(0, 5)
        .map(([cat, data]) => ({ category: cat, ...data }))
    }
  }

  // Card name lookup
  const cardName = (cardId) => {
    const c = availableCards.find(x => x.card_id === cardId)
    return c ? `${c.bank} ${c.card_name}` : cardId
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center animate-fade-in px-4">
        <div className="relative mb-8 w-40 h-24 sm:w-48 sm:h-32 rounded-xl bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] p-[1px] shadow-[0_0_30px_rgba(0,245,160,0.3)] animate-float">
          <div className="w-full h-full bg-[#0a0a0a] rounded-xl flex flex-col justify-between p-3 sm:p-4 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 z-10" />
            <div className="flex justify-between items-start z-20">
              <div className="w-6 sm:w-8 h-4 sm:h-6 rounded bg-gradient-to-br from-yellow-600 to-yellow-400 opacity-80" />
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white/40 rounded-full" />
              </div>
            </div>
            <div className="w-full space-y-2 z-20 relative">
              <div className="h-1 sm:h-1.5 w-3/4 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-[#00f5a0] to-transparent animate-pulse" />
              </div>
              <div className="h-1 w-1/2 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold tracking-wide text-white mb-2">Unlock Card Rewards</h2>
        <p className="text-sm font-mono text-white/40 tracking-[2px] uppercase text-center max-w-sm">
          Please upload your bank statement first to analyse your wallet potential
        </p>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 pb-32 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
          <CreditCard className="text-[#00d4ff]" size={24} />
          Card Reward Maximiser
        </h1>
        <p className="text-white/40 mt-2">Find the best card in your wallet for every {currency==="IN"?"rupee":"dollar"} you spend.</p>
      </div>

      {/* ── YOUR SAVED CARDS ─────────────────────────────────────── */}
      {user?.user_id && (
        <div className="mb-6 p-3 sm:p-5 bg-white/[0.03] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono tracking-widest text-[#f59e0b]">YOUR SAVED CARDS</h3>
            <button onClick={() => setShowAddCard(!showAddCard)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors">
              {showAddCard ? <><X size={12}/> Cancel</> : <><Plus size={12}/> Add Card</>}
            </button>
          </div>

          {/* Add card form */}
          {showAddCard && (
            <div className="mb-4 p-4 bg-black/30 border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">SELECT CARD</label>
                  <select value={newCardId} onChange={e => setNewCardId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f59e0b]">
                    <option value="">Choose a card...</option>
                    {availableCards.map(c => (
                      <option key={c.card_id} value={c.card_id}>
                        {c.bank} {c.card_name} ({c.network})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">CARD NUMBER (last 4)</label>
                  <input type="text" value={newCardNumber} onChange={e => setNewCardNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 4523" maxLength={4}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f59e0b]" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono tracking-[1px] mb-1 block">NICKNAME (optional)</label>
                  <input type="text" value={newCardNickname} onChange={e => setNewCardNickname(e.target.value)}
                    placeholder="e.g. My primary card"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f59e0b]" />
                </div>
              </div>
              <button onClick={handleSaveCard} disabled={!newCardId || savingCard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#f59e0b] text-black hover:bg-[#f59e0b]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Save size={14} /> {savingCard ? 'Saving...' : 'Save Card'}
              </button>
            </div>
          )}

          {/* Saved cards list */}
          {savedCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedCards.map(card => (
                <div key={card.id} className="p-3 bg-[#f59e0b]/[0.05] border border-[#f59e0b]/20 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#e8eaf0]">{cardName(card.card_id)}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-1">
                      {card.card_number ? `•••• ${card.card_number}` : ''}
                      {card.nickname ? ` · ${card.nickname}` : ''}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCard(card.id, card.card_id)}
                    className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">No cards saved yet. Add your cards to keep your wallet synced across sessions.</p>
          )}
        </div>
      )}

      <CardSelector
        availableCards={availableCards}
        selectedIds={selectedWallet}
        onChange={setSelectedWallet}
        currency={currency}
        onSaveCard={user?.user_id ? async (cardId, cardNum, nickname) => {
          setSavingCard(true)
          try {
            const res = await cardsAPI.save(user.user_id, cardId, cardNum, nickname)
            if (res.data?.success) {
              setSavedCards([res.data.card, ...savedCards])
            } else {
              setError(res.data?.error || 'Failed to save card')
            }
          } catch {
            setError('Failed to save card — please try again.')
          }
          setSavingCard(false)
        } : null}
        savingCard={savingCard}
      />

      <button
        onClick={runAnalysis}
        disabled={selectedWallet.length === 0 || loading || transactions.length === 0}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f5a0] to-[#00d4ff] text-black font-bold flex justify-center items-center gap-2 hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Zap fill="currentColor" size={18} />
        {loading ? "CALCULATING BEST COMBINATIONS..." : "ANALYSE CASHBACK POTENTIAL"}
      </button>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-[#ff3c64]/10 border border-[#ff3c64]/30 text-[#ff3c64] text-sm text-center">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-12 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <Metric title="TOTAL SPEND" value={`${sym}${results.results.reduce((a,b)=>a+b.AMOUNT,0).toLocaleString(undefined,{maximumFractionDigits:0})}`} />
            <Metric title="BEST CASHBACK" value={`${sym}${results.results.reduce((a,b)=>a+b.BEST_CASHBACK,0).toLocaleString(undefined,{maximumFractionDigits:0})}`} color="text-[#00f5a0]" />
            <Metric title="EXTRA VS 1% CARD" value={`${sym}${results.results.reduce((a,b)=>a+b.EXTRA,0).toLocaleString(undefined,{maximumFractionDigits:0})}`} color="text-[#00d4ff]" />
            <Metric
              title="EFFECTIVE RATE"
              value={`${(results.results.reduce((a,b)=>a+b.BEST_CASHBACK,0)/results.results.reduce((a,b)=>a+b.AMOUNT,0)*100).toFixed(2)}%`}
              color="text-[#a855f7]"
            />
          </div>

          <CashbackTable summary={results.summary} currency={currency} />

          {celebrations.length > 0 && (
            <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-[#00f5a0]/10 to-[#00d4ff]/5 border border-[#00f5a0]/30 rounded-xl">
              <div className="text-[10px] font-mono text-[#00f5a0] tracking-[2px] mb-4">MILESTONE CELEBRATIONS</div>
              <div className="space-y-3">
                {celebrations.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl">🏆</span>
                    <span className="text-sm text-[#e8eaf0] leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {missedAlerts.length > 0 && (
            <div className="mt-8">
              <div className="text-[10px] font-mono text-[#ff3c64] tracking-[2px] mb-2">MISSED CASHBACK ALERTS</div>
              <div className="text-xs text-white/40 mb-4">If you use the wrong card for these categories, here's what you leave on the table:</div>
              <div className="space-y-3">
                {missedAlerts.map((m, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-[#ff3c64]/10 border border-[#ff3c64]/20 rounded-xl">
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-[#e8eaf0]">{m.category}</span>
                      <span className="text-xs sm:text-sm font-black text-[#ff3c64] flex-shrink-0">-{sym}{Math.round(m.amount).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-white/50 leading-relaxed">
                      Using <span className="text-[#ff3c64] font-semibold">{m.worst}</span> instead of <span className="text-[#00f5a0] font-semibold">{m.best}</span> costs you rewards across {m.txns} transactions.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <BestCardBanner suggestions={results.suggestions} currency={currency} />
        </div>
      )}
    </div>
  )
}

function Metric({ title, value, color = "text-white" }) {
  return (
    <div className="p-3 sm:p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
      <div className="text-[9px] sm:text-[10px] font-mono text-white/40 tracking-[1px] mb-1 sm:mb-2">{title}</div>
      <div className={`text-lg sm:text-2xl font-black font-mono ${color} break-all`}>{value}</div>
    </div>
  )
}
