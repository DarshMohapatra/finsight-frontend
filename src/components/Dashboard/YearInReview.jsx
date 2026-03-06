import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Calendar, ShoppingBag, Zap,
  DollarSign, Award, Target, Clock, ArrowUpRight,
  ArrowDownRight, CreditCard, Repeat, Activity, AlertTriangle
} from 'lucide-react'
import fmt from './fmt'

function StatCard({ icon: Icon, label, value, sub, color = '#00f5a0', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace",
          color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5 }}>{label}</span>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'DM Mono',monospace",
          color, lineHeight: 1.1, wordBreak: 'break-word' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)',
          marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </motion.div>
  )
}

export default function YearInReview({ stats, yearTxns, currency }) {
  if (!stats) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 16, marginBottom: 32 }}>
      <StatCard icon={TrendingDown}   label="TOTAL SPENT"      value={fmt(stats.spent,currency)}    sub={`across ${yearTxns.length} transactions`}           color="#ff3c64"  delay={0}    />
      <StatCard icon={TrendingUp}     label="TOTAL RECEIVED"   value={fmt(stats.received,currency)} sub={`net saved: ${fmt(Math.abs(stats.saved),currency)}`} color="#00f5a0"  delay={0.04} />
      <StatCard icon={Target}         label="SAVINGS RATE"     value={`${stats.savingsRate}%`}      sub={stats.saved >= 0 ? 'positive savings' : 'overspent'}  color={stats.saved >= 0 ? '#00f5a0' : '#ff3c64'} delay={0.08} />
      <StatCard icon={Calendar}       label="TRANSACTIONS"     value={stats.txnCount}               sub={`${(stats.txnCount/12).toFixed(0)} avg per month`}    color="#00d4ff"  delay={0.12} />
      <StatCard icon={ShoppingBag}    label="TOP CATEGORY"     value={stats.topCat?.[0] || '—'}     sub={stats.topCat ? fmt(stats.topCat[1],currency) : ''}   color="#7b61ff"  delay={0.16} />
      <StatCard icon={Award}          label="TOP MERCHANT"     value={(stats.topMerchant?.[0]||'—').substring(0,20)} sub={stats.topMerchant ? fmt(stats.topMerchant[1],currency) : ''} color="#f59e0b" delay={0.20} />
      <StatCard icon={ArrowUpRight}   label="BIGGEST MONTH"    value={stats.bigMonth?.[0]?.substring(0,7)||'—'}   sub={stats.bigMonth   ? fmt(stats.bigMonth[1].spent,currency)   : ''} color="#f97316" delay={0.24} />
      <StatCard icon={ArrowDownRight} label="QUIETEST MONTH"   value={stats.quietMonth?.[0]?.substring(0,7)||'—'} sub={stats.quietMonth ? fmt(stats.quietMonth[1].spent,currency) : ''} color="#10b981" delay={0.28} />
      <StatCard icon={Clock}          label="MOST EXP DAY"     value={stats.topDay?.[0]||'—'}       sub={stats.topDay ? fmt(stats.topDay[1],currency) : ''}   color="#e11d48"  delay={0.32} />
      <StatCard icon={Zap}            label="LARGEST TXN"      value={stats.largest ? fmt(stats.largest['WITHDRAWAL AMT'],currency) : '—'} sub={(stats.largest?.['TRANSACTION DETAILS']||'').substring(0,22)} color="#00d4ff" delay={0.36} />
      <StatCard icon={AlertTriangle}  label="ANOMALIES"        value={stats.anomalies}              sub={stats.anomalies > 0 ? 'suspicious transactions' : 'all clear'} color={stats.anomalies > 0 ? '#ff3c64' : '#00f5a0'} delay={0.40} />
      <StatCard icon={DollarSign}     label="AUTO CATEGORIZED" value={`${Math.round(yearTxns.filter(t=>t.CATEGORY!=='Other').length/yearTxns.length*100)}%`} sub="of transactions tagged" color="#7b61ff" delay={0.44} />
      <StatCard icon={Activity}       label="AVG TXN SIZE"     value={fmt(stats.avgTxn,currency)}   sub="per withdrawal"                                       color="#06b6d4"  delay={0.48} />
      <StatCard icon={Repeat}         label="MOST FREQUENT"    value={stats.mostFreqCat?.[0]||'—'}  sub={`${stats.mostFreqCat?.[1]||0} times`}                color="#a855f7"  delay={0.52} />
      <StatCard icon={CreditCard}     label="CATEGORIES USED"  value={stats.uniqueCats}             sub="distinct spend types"                                 color="#84cc16"  delay={0.56} />
    </div>
  )
}