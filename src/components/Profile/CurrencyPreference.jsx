import { useState } from 'react'
import useStore from '../../store/useStore'
import { CheckCircle2 } from 'lucide-react'

export default function CurrencyPreference() {
  const { currency, setCurrency } = useStore()
  const [success, setSuccess] = useState(false)

  const REGIONS = [
    { code: 'IN', symbol: '₹', name: 'India (INR)' },
    { code: 'US', symbol: '$', name: 'United States (USD)' },
    { code: 'UK', symbol: '£', name: 'United Kingdom (GBP)' },
    { code: 'CA', symbol: 'C$', name: 'Canada (CAD)' },
    { code: 'AU', symbol: 'A$', name: 'Australia (AUD)' },
  ]

  const handleSave = (code) => {
    setCurrency(code)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    // Here you could also fire an API call to save to backend preferences
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-2">Regional Preferences</h2>
      <p className="text-sm text-white/40 mb-6">
        Set your default currency and region. This affects SmartCash recommendations and dashboard formatting.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {REGIONS.map(reg => {
          const active = currency === reg.code
          return (
            <button
              key={reg.code}
              onClick={() => handleSave(reg.code)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                active 
                  ? 'bg-[#00d4ff]/10 border-[#00d4ff]/50' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono ${active ? 'bg-[#00d4ff] text-black' : 'bg-white/10 text-white/50'}`}>
                  {reg.symbol}
                </div>
                <div className={`text-sm font-medium ${active ? 'text-white' : 'text-white/60'}`}>
                  {reg.name}
                </div>
              </div>
              {active && <CheckCircle2 className="text-[#00d4ff]" size={18} />}
            </button>
          )
        })}
      </div>

      {success && (
        <div className="text-xs text-[#00f5a0] font-mono flex items-center gap-2">
          <CheckCircle2 size={14} /> Preference saved locally!
        </div>
      )}
    </div>
  )
}
