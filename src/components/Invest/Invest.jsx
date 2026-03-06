import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import InvestInputs from './InvestInputs'
import ProjectionCards from './ProjectionCards'
import MonteCarloChart from './MonteCarloChart'
import InstrumentCard from './InstrumentCard'
import { Coins, Loader2 } from 'lucide-react'

export default function Invest() {
  const { transactions } = useStore()
  const [threshold, setThreshold] = useState(10)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (transactions.length === 0) return
    
    setLoading(true)
    setError('')
    
    fetch('http://127.0.0.1:8000/api/invest/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions, threshold })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) setData(res)
        else setError(res.error || 'Failed to analyze investment data')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [transactions, threshold])

  // Map to format XIRR keys nicely
  const XIRR_NAMES = {
    "NIFTYBEES": { name: "Nifty 50 ETF", color: "#00f5a0" },
    "JUNIORBEES": { name: "Nifty Next 50", color: "#00d4ff" },
    "GOLDBEES": { name: "Gold ETF", color: "#f59e0b" }
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 pb-32 max-w-6xl mx-auto text-center mt-20">
        <div className="text-6xl mb-4">💰</div>
        <div className="font-mono text-xs text-white/30 tracking-[2px]">UPLOAD A FILE FIRST</div>
      </div>
    )
  }

  return (
    <div className="p-8 pb-32 max-w-6xl mx-auto">
      <div className="mb-8">
        
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Coins className="text-[#00f5a0]" size={28} />
          MicroRoundUp India
        </h1>
        <p className="text-white/40 mt-2 max-w-2xl leading-relaxed">
          Round up every transaction to the nearest ₹10/₹50/₹100. Invest the spare change into Nifty ETF, Gold, or ELSS. Watch it compound.
        </p>
      </div>

      <InvestInputs threshold={threshold} onChangeThreshold={setThreshold} />

      {loading && !data && (
        <div className="flex items-center gap-3 text-white/50 py-10">
          <Loader2 className="animate-spin" size={20} />
          <span className="font-mono text-xs tracking-widest">RUNNING MONTE CARLO SIMULATIONS...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#ff3c64]/10 border border-[#ff3c64]/30 rounded-xl text-[#ff3c64] text-sm">
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="animate-fade-in">
          <ProjectionCards stats={data.corpus_stats} />

          {/* Historical XIRR Simulation */}
          {data.xirr && Object.keys(data.xirr).length > 0 && (
            <div className="mb-10">
              <div className="text-[10px] font-mono text-[#00f5a0] tracking-[2px] mb-4 uppercase">
                HISTORICAL XIRR SIMULATION (₹{threshold} THRESHOLD)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(data.xirr).map(([key, xdata]) => {
                  const meta = XIRR_NAMES[key] || { name: key, color: '#fff' }
                  return (
                    <div key={key} className="p-5 bg-white/5 border border-white/10 rounded-xl" style={{ borderColor: `${meta.color}30` }}>
                      <div className="text-[11px] font-mono mb-2" style={{ color: meta.color }}>{meta.name}</div>
                      <div className="text-[22px] font-black" style={{ color: meta.color }}>{xdata.xirr_pct}%</div>
                      <div className="text-[10px] text-white/40 mt-0.5">XIRR</div>
                      
                      <div className="mt-4 text-xs text-white/60 space-y-1">
                        <div className="flex justify-between">
                          <span>Invested:</span>
                          <span className="font-mono font-medium">₹{xdata.total_invested.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Value:</span>
                          <span className="font-mono font-medium">₹{xdata.current_value.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        </div>
                        <div className={`flex justify-between font-medium ${xdata.absolute_gain > 0 ? 'text-[#00f5a0]' : 'text-[#ff3c64]'}`}>
                          <span>Gain:</span>
                          <span className="font-mono">+{xdata.absolute_gain > 0 ? '+' : ''}₹{xdata.absolute_gain.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-white/35 mt-3 pt-3 border-t border-white/10 flex justify-between">
                        <span>vs Fixed Deposit</span>
                        <span className="font-mono font-medium">{xdata.vs_fd_delta > 0 ? '+' : ''}₹{xdata.vs_fd_delta.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <MonteCarloChart mcData={data.mc} />

          {/* Recommended Instruments */}
          {data.instruments && data.instruments.length > 0 && (
            <div className="mt-10">
              <div className="text-[10px] font-mono text-[#00f5a0] tracking-[2px] mb-4 uppercase">
                WHERE TO INVEST YOUR ROUND-UPS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.instruments.map((inst, i) => (
                  <InstrumentCard key={i} inst={inst} />
                ))}
              </div>
            </div>
          )}

          {data.disclaimer && (
            <div className="mt-8 p-4 bg-white/5 border-l-4 border-white/20 rounded-r-lg">
              <span className="text-[10px] text-white/25 font-mono leading-relaxed">
                &#9878; SEBI DISCLAIMER · {data.disclaimer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
