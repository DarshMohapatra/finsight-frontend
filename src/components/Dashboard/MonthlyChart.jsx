import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import fmt from './fmt'

const PALETTE = ['#00f5a0', '#00d4ff', '#7b61ff', '#f59e0b', '#ff3c64', '#ec4899', '#64748b']

function StackedTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', minWidth: 160 }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace",
        color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
        Total: {fmt(total, currency)}
      </div>
      {payload.filter(p => p.value > 0).sort((a, b) => b.value - a.value).map((p, i) => (
        <div key={i} style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span style={{ color: p.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
            {p.name.length > 22 ? p.name.slice(0, 20) + '...' : p.name}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>
            {fmt(p.value, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}

function truncName(name, max = 18) {
  if (!name) return ''
  const noExt = name.replace(/\.(pdf|csv|xlsx|xls)$/i, '')
  return noExt.length > max ? noExt.slice(0, max - 1) + '...' : noExt
}

export default function MonthlyChart({ catData, categories, currency, sourceData, sourceFiles }) {
  const [mode, setMode] = useState('category')

  const hasSourceData = sourceData?.length > 0 && sourceFiles?.length > 1
  const chartData = mode === 'source' && hasSourceData ? sourceData : catData
  const chartKeys = mode === 'source' && hasSourceData ? sourceFiles : categories

  if (!chartData?.length) return null

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      className="p-4 md:p-6 mb-5"
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:20 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
            color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>MONTHLY WITHDRAWALS</p>
          <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>Month-by-Month Spend</h3>
        </div>
        {hasSourceData && (
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3 }}>
            {[{ key: 'category', label: 'By Category' }, { key: 'source', label: 'By Statement' }].map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none',
                  fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                  background: mode === m.key ? 'rgba(0,245,160,0.15)' : 'transparent',
                  color: mode === m.key ? '#00f5a0' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.2s'
                }}>
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top:5, right:16, left:-10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.35)', fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}
            tickFormatter={v => fmt(v, currency)}/>
          <Tooltip content={<StackedTooltip currency={currency}/>}/>
          {chartKeys.map((key, i) => (
            <Bar key={key} dataKey={key} stackId="a"
              fill={PALETTE[i % PALETTE.length]}
              radius={i === chartKeys.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, justifyContent: 'center' }}>
        {chartKeys.map((key, i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
            {mode === 'source' ? truncName(key) : key}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
