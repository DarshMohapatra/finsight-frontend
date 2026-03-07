import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import fmt from './fmt'

const PALETTE = ['#ef4444', '#f87171', '#dc2626', '#fb923c', '#f43f5e', '#e11d48', '#b91c1c']

function StackedTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', minWidth: 160, maxWidth: 260 }}>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace",
        color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
        Total: {fmt(total, currency)}
      </div>
      {payload.filter(p => p.value > 0).sort((a, b) => b.value - a.value).map((p, i) => (
        <div key={i} style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
          <span style={{ color: p.color, display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name.replace(/\.(pdf|csv|xlsx|xls)$/i, '')}
            </span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>
            {fmt(p.value, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}

function SimpleTooltip({ active, payload, label, currency }) {
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

function truncName(name, max = 20) {
  if (!name) return ''
  const noExt = name.replace(/\.(pdf|csv|xlsx|xls)$/i, '')
  return noExt.length > max ? noExt.slice(0, max - 1) + '...' : noExt
}

export default function MonthlyChart({ data, currency, sourceData, sourceFiles }) {
  const hasMultipleSources = sourceData?.length > 0 && sourceFiles?.length > 1

  if (!data?.length) return null

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      className="p-4 md:p-6 mb-5"
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:20 }}>

      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10,
        color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:4 }}>MONTHLY WITHDRAWALS</p>
      <h3 style={{ fontSize:16, fontWeight:700, margin:0, marginBottom: 16 }}>
        {hasMultipleSources ? 'Month-by-Month Spend (by Bank/Card)' : 'Month-by-Month Spend'}
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        {hasMultipleSources ? (
          <BarChart data={sourceData} margin={{ top:5, right:8, left:-10, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.35)', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}
              tickFormatter={v => fmt(v, currency)}/>
            <Tooltip content={<StackedTooltip currency={currency}/>}/>
            {sourceFiles.map((key, i) => (
              <Bar key={key} dataKey={key} stackId="a"
                fill={PALETTE[i % PALETTE.length]}
                radius={i === sourceFiles.length - 1 ? [4,4,0,0] : [0,0,0,0]} />
            ))}
          </BarChart>
        ) : (
          <BarChart data={data} margin={{ top:5, right:8, left:-10, bottom:0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="month" tick={{ fill:'rgba(255,255,255,0.35)', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false}
              tickFormatter={v => fmt(v, currency)}/>
            <Tooltip content={<SimpleTooltip currency={currency}/>}/>
            <Bar dataKey="spent" name="Withdrawn" fill="url(#barGrad)" radius={[6,6,0,0]} />
          </BarChart>
        )}
      </ResponsiveContainer>

      {hasMultipleSources && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, justifyContent: 'center' }}>
          {sourceFiles.map((key, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
              {truncName(key)}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
