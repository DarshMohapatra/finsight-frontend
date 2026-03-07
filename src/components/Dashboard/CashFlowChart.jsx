import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import fmt from './fmt'

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', minWidth: 140 }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace",
        color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color,
          display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{p.name}</span>
          <span>{fmt(p.value, currency)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CashFlowChart({ data, currency }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      className="p-4 md:p-6 h-full flex flex-col"
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:20 }}>
      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
        color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>MONTHLY TREND</p>
      <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Cash Flow Overview</h3>
       <div style={{ margin: 'auto 0' }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top:5, right:10, left:-10, bottom:0 }}>
            <defs>
              <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ff3c64" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff3c64" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="recvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00f5a0" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f5a0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}
              tickFormatter={v => fmt(v,currency)}/>
            <Tooltip content={<CustomTooltip currency={currency}/>}/>
            <Legend wrapperStyle={{ paddingTop:16, fontSize:11, fontFamily:"'DM Mono',monospace" }}
              formatter={v => <span style={{ color:'rgba(255,255,255,0.5)', letterSpacing:1 }}>{v.toUpperCase()}</span>}/>
            <Area type="monotone" dataKey="spent"    name="Spent"    stroke="#ff3c64" fill="url(#spentGrad)" strokeWidth={2} dot={false}/>
            <Area type="monotone" dataKey="received" name="Received" stroke="#00f5a0" fill="url(#recvGrad)"  strokeWidth={2} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div> 
    </motion.div>
  )
}