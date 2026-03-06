import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import fmt from './fmt'

const CAT_COLORS = [
  '#00f5a0','#00d4ff','#7b61ff','#f59e0b','#ff3c64',
  '#06b6d4','#8b5cf6','#f97316','#10b981','#e11d48',
  '#0ea5e9','#a855f7','#84cc16','#ec4899'
]

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

export default function CategoryChart({ data, currency }) {
  const height = Math.max(280, data.length * 36)
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
     style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:20, padding:24, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
        color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>BREAKDOWN</p>
      <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Spend by Category</h3>
      <div style={{ flex: 1, minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top:0, right:16, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false}/>
          <XAxis type="number" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:9 }}
            axisLine={false} tickLine={false} tickFormatter={v => fmt(v,currency)}/>
          <YAxis type="category" dataKey="cat"
            tick={{ fill:'rgba(255,255,255,0.55)', fontSize:10 }}
            axisLine={false} tickLine={false} width={110}/>
          <Tooltip content={<CustomTooltip currency={currency}/>}/>
          <Bar dataKey="val" name="Spend" radius={[0,4,4,0]}>
            {data.map((_,i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} opacity={0.85}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  )
}