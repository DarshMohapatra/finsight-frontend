import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
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

export default function MonthlyChart({ data, currency }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:20, padding:24, marginBottom:20 }}>
      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
        color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>MONTHLY WITHDRAWALS</p>
      <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Month-by-Month Spend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:5, right:16, left:-10, bottom:0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00f5a0" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.35)', fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}
            tickFormatter={v => fmt(v,currency)}/>
          <Tooltip content={<CustomTooltip currency={currency}/>}/>
          <Bar dataKey="spent" name="Withdrawn" fill="url(#barGrad)" radius={[6,6,0,0]}>
            {data.map((_,i) => <Cell key={i} fill="url(#barGrad)"/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}