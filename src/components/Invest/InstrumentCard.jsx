export default function InstrumentCard({ inst }) {
  const { returns, platform_links } = inst
  const r_vals = [returns?.['1Y'] || 0, returns?.['3Y'] || 0, returns?.['5Y'] || 0]
  const max_r = Math.max(...r_vals)
  
  const r_colors = r_vals.map(r => r > 0 && r === max_r ? '#00f5a0' : '#e8eaf0')

  return (
    <div className="p-3 sm:p-5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl relative overflow-hidden mb-4">
      <div 
        className="absolute top-0 left-0 w-full h-[3px]" 
        style={{ background: `linear-gradient(90deg, ${inst.risk_color}, ${inst.risk_color}80, transparent)` }} 
      />
      
      <div className="flex items-center justify-between gap-2 mb-1 mt-1">
        <div className="text-[13px] sm:text-[15px] font-bold text-[#e8eaf0] flex items-center flex-wrap">
          {inst.name}
          {inst.tax_benefit && (
            <span className="bg-gradient-to-r from-[#00f5a0] to-[#00d4ff] text-black text-[9px] font-bold px-2 py-0.5 rounded ml-2">
              80C
            </span>
          )}
        </div>
        <div 
          className="text-[10px] font-mono px-2 py-0.5 rounded"
          style={{ color: inst.risk_color, backgroundColor: `${inst.risk_color}15` }}
        >
          {inst.risk}
        </div>
      </div>
      
      <div className="text-[11px] text-white/35 font-mono mb-3">
        {inst.type} · {inst.fund_house}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: '1Y', val: returns?.['1Y'] ? `${returns['1Y']}%` : '—', color: r_colors[0] },
          { label: '3Y', val: returns?.['3Y'] ? `${returns['3Y']}%` : '—', color: r_colors[1] },
          { label: '5Y', val: returns?.['5Y'] ? `${returns['5Y']}%` : '—', color: r_colors[2] },
        ].map(r => (
          <div key={r.label} className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-[9px] text-white/30 font-mono tracking-[1px]">{r.label}</div>
            <div className="text-base font-bold mt-0.5" style={{ color: r.color }}>{r.val}</div>
          </div>
        ))}
      </div>
      
      <div className="text-[11px] text-white/45 leading-relaxed mb-3">
        {inst.description}
      </div>
      
      {platform_links && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(platform_links).map(([name, url]) => (
            <a 
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[#00d4ff] text-[10px] font-mono hover:bg-white/10 transition-colors capitalize"
            >
              {name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
