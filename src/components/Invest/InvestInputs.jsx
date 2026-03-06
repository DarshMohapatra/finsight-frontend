export default function InvestInputs({ threshold, onChangeThreshold }) {
  return (
    <div className="mb-8">
      <div className="text-[10px] font-mono text-white/35 tracking-[1px] mb-3 ml-1 uppercase">
        ROUND-UP THRESHOLD · <span className="text-[#00f5a0] font-bold">₹{threshold}</span> PER TRANSACTION
      </div>
      
      <div className="flex gap-2 w-full max-w-sm">
        {[10, 50, 100].map(val => (
          <button
            key={val}
            onClick={() => onChangeThreshold(val)}
            className={`flex-1 py-2 font-mono text-[13px] font-bold rounded-[10px] transition-all border
              ${threshold === val 
                ? 'bg-white/5 border-[#00f5a0] text-[#00f5a0]' 
                : 'bg-white/5 border-white/10 text-white/50 hover:border-[#00f5a0]/50 hover:text-[#00f5a0]/80'}`}
          >
            ₹{val}
          </button>
        ))}
      </div>
    </div>
  )
}
