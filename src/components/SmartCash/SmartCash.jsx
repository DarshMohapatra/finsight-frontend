import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import CardSelector from './CardSelector'
import CashbackTable from './CashbackTable'
import BestCardBanner from './BestCardBanner'
import { Award, Zap, CreditCard } from 'lucide-react'

export default function SmartCash() {
  const { transactions, currency } = useStore()
  const [availableCards, setAvailableCards] = useState([])
  const [selectedWallet, setSelectedWallet] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/smartcash/cards?currency=${currency}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.cards) {
          setAvailableCards(data.cards)
          const duds = data.cards.filter(c => c.annual_fee === 0).slice(0, 3).map(c => c.card_id)
          setSelectedWallet(duds)
        }
      })
      .catch(e => console.error("Failed to fetch cards:", e))
  }, [currency])

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
    
    // Create uniqueness of dates for approximate months
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

    // Missed Cash Alerts
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
  
   if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center animate-fade-in px-4">
        {/* Glowing floating card container */}
        <div className="relative mb-8 w-40 h-24 sm:w-48 sm:h-32 rounded-xl bg-gradient-to-br from-[#00f5a0] to-[#00d4ff] p-[1px] shadow-[0_0_30px_rgba(0,245,160,0.3)] animate-float">
          <div className="w-full h-full bg-[#0a0a0a] rounded-xl flex flex-col justify-between p-3 sm:p-4 overflow-hidden relative group">
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 z-10" />
            
            {/* Card Chip & Network */}
            <div className="flex justify-between items-start z-20">
              <div className="w-6 sm:w-8 h-4 sm:h-6 rounded bg-gradient-to-br from-yellow-600 to-yellow-400 opacity-80" />
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white/40 rounded-full" />
              </div>
            </div>

            {/* Glowing lines simulating card tracks */}
            <div className="w-full space-y-2 z-20 relative">
              <div className="h-1 sm:h-1.5 w-3/4 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-[#00f5a0] to-transparent animate-pulse" />
              </div>
              <div className="h-1 w-1/2 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold tracking-wide text-white mb-2">
          Unlock Card Rewards
        </h2>
        
        <p className="text-sm font-mono text-white/40 tracking-[2px] uppercase text-center max-w-sm">
          Please upload your bank statement first to analyse your wallet potential
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 pb-32 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <CreditCard className="text-[#00d4ff]" size={28} />
          Card Reward Maximiser
        </h1>
        <p className="text-white/40 mt-2">Find the best card in your wallet for every {currency==="IN"?"rupee":"dollar"} you spend.</p>
      </div>

      <CardSelector 
        availableCards={availableCards} 
        selectedIds={selectedWallet} 
        onChange={setSelectedWallet} 
        currency={currency}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

          {/* Celebrations Section */}
          {celebrations.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-br from-[#00f5a0]/10 to-[#00d4ff]/5 border border-[#00f5a0]/30 rounded-xl">
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

          {/* Missed Cashback Alerts */}
          {missedAlerts.length > 0 && (
            <div className="mt-8">
              <div className="text-[10px] font-mono text-[#ff3c64] tracking-[2px] mb-2">MISSED CASHBACK ALERTS</div>
              <div className="text-xs text-white/40 mb-4">If you use the wrong card for these categories, here's what you leave on the table:</div>
              <div className="space-y-3">
                {missedAlerts.map((m, i) => (
                  <div key={i} className="p-4 bg-[#ff3c64]/10 border border-[#ff3c64]/20 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-[#e8eaf0]">{m.category}</span>
                      <span className="text-sm font-black text-[#ff3c64]">-{sym}{Math.round(m.amount).toLocaleString()}</span>
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
    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
      <div className="text-[10px] font-mono text-white/40 tracking-[1px] mb-2">{title}</div>
      <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
    </div>
  )
}
