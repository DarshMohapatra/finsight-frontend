import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts'

export default function MonteCarloChart({ mcData }) {
  if (!mcData || !mcData.projections) return null

  const yearsList = [5, 10, 15, 20]
  
  // Format data for Recharts
  const data = yearsList.map(y => {
    const proj = mcData.projections[String(y)]
    return {
      year: `${y}yr`,
      median: proj.p50,
      optimistic: proj.p75,
      conservative: proj.p25,
      invested: proj.simple_invested,
      range: [proj.p25, proj.p75] // For the shaded area
    }
  })

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return '₹0'
    if (tickItem >= 10000000) return `₹${(tickItem/10000000).toFixed(1)}Cr`
    if (tickItem >= 100000) return `₹${(tickItem/100000).toFixed(0)}L`
    return `₹${tickItem.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#080d1a] border border-[#1a2035] p-3 rounded-lg shadow-xl">
          <p className="text-[#00f5a0] font-mono text-xs mb-2">Year {label.replace('yr', '')}</p>
          {payload.map((entry, index) => {
            // Skip the range payload
            if (entry.dataKey === 'range') return null
            return (
              <p key={index} className="text-xs mb-1" style={{ color: entry.color }}>
                {entry.name}: {formatYAxis(entry.value)}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="mb-10">
      <div className="text-[10px] font-mono text-[#00f5a0] tracking-[2px] mb-4 uppercase">
        MONTE CARLO PROJECTION — 1000 SIMULATIONS
      </div>
      
      <div className="h-[260px] sm:h-[320px] md:h-[380px] w-full p-3 sm:p-4 bg-[#0d1420] rounded-xl border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
            <XAxis dataKey="year" stroke="#555" tick={{fill: '#555', fontSize: 11}} axisLine={false} tickLine={false} />
            <YAxis stroke="#555" tickFormatter={formatYAxis} tick={{fill: '#555', fontSize: 11}} axisLine={false} tickLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Shaded Area between 25th and 75th percentile */}
            <Area type="monotone" dataKey="range" fill="rgba(0,245,160,0.08)" stroke="none" />
            
            {/* Median Line */}
            <Line type="monotone" dataKey="median" name="Median" stroke="#00f5a0" strokeWidth={3} dot={{ r: 4, fill: '#00f5a0' }} />
            
            {/* Optimistic Line */}
            <Line type="monotone" dataKey="optimistic" name="Optimistic (75th)" stroke="#00d4ff" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            
            {/* Conservative Line */}
            <Line type="monotone" dataKey="conservative" name="Conservative (25th)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            
            {/* Amount Invested Line */}
            <Line type="monotone" dataKey="invested" name="Amount Invested" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
