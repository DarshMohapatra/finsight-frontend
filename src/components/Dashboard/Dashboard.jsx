import { useEffect, useMemo } from 'react'
import { PieChart } from 'lucide-react'
import useStore from '../../store/useStore'
import YearInReview  from './YearInReview'
import CashFlowChart from './CashFlowChart'
import CategoryChart from './CategoryChart'
import MonthlyChart  from './MonthlyChart'

export default function Dashboard() {
  const transactions    = useStore(s => s.transactions)
  const currency        = useStore(s => s.currency)
  const selectedYear    = useStore(s => s.selectedYear)
  const setSelectedYear = useStore(s => s.setSelectedYear)

  const years = useMemo(() => {
    const ys = [...new Set(transactions.map(t => t.DATE?.substring(0,4)).filter(Boolean))]
    return ys.sort().reverse()
  }, [transactions])

  useEffect(() => {
    if (years.length > 0 && !selectedYear) setSelectedYear(years[0])
  }, [years])

  const yearTxns = useMemo(() => {
    if (!selectedYear) return transactions
    return transactions.filter(t => t.DATE?.startsWith(selectedYear))
  }, [transactions, selectedYear])

  const stats = useMemo(() => {
    if (!yearTxns.length) return null
    const spent    = yearTxns.reduce((s,t) => s + (t['WITHDRAWAL AMT'] || 0), 0)
    const received = yearTxns.reduce((s,t) => s + (t['DEPOSIT AMT']    || 0), 0)
    const saved    = received - spent
    const savingsRate = received > 0 ? ((saved/received)*100).toFixed(1) : 0
    const wd = yearTxns.filter(t => t['WITHDRAWAL AMT'] > 0)

    const catSpend = {}
    wd.forEach(t => { catSpend[t.CATEGORY] = (catSpend[t.CATEGORY]||0) + t['WITHDRAWAL AMT'] })
    const topCat = Object.entries(catSpend).sort((a,b)=>b[1]-a[1])[0]

    const merchantSpend = {}
    wd.forEach(t => { merchantSpend[t['TRANSACTION DETAILS']] = (merchantSpend[t['TRANSACTION DETAILS']]||0) + t['WITHDRAWAL AMT'] })
    const topMerchant = Object.entries(merchantSpend).sort((a,b)=>b[1]-a[1])[0]

    const daySpend = {}
    wd.forEach(t => { daySpend[t.DATE] = (daySpend[t.DATE]||0) + t['WITHDRAWAL AMT'] })
    const topDay = Object.entries(daySpend).sort((a,b)=>b[1]-a[1])[0]

    const monthly = {}
    yearTxns.forEach(t => {
      const m = t.DATE?.substring(0,7); if (!m) return
      if (!monthly[m]) monthly[m] = { spent:0, received:0 }
      monthly[m].spent    += t['WITHDRAWAL AMT'] || 0
      monthly[m].received += t['DEPOSIT AMT']    || 0
    })
    const months    = Object.entries(monthly).sort()
    const bigMonth   = [...months].sort((a,b)=>b[1].spent-a[1].spent)[0]
    const quietMonth = [...months].sort((a,b)=>a[1].spent-b[1].spent)[0]

    const anomalies  = yearTxns.filter(t=>t.ALERT_LEVEL>0).length
    const largest    = [...wd].sort((a,b)=>b['WITHDRAWAL AMT']-a['WITHDRAWAL AMT'])[0]
    const uniqueCats = new Set(wd.map(t=>t.CATEGORY)).size
    const avgTxn     = wd.length > 0 ? spent/wd.length : 0

    const catCount = {}
    wd.forEach(t => { catCount[t.CATEGORY] = (catCount[t.CATEGORY]||0) + 1 })
    const mostFreqCat = Object.entries(catCount).sort((a,b)=>b[1]-a[1])[0]

    return { spent, received, saved, savingsRate, topCat, topMerchant,
      topDay, bigMonth, quietMonth, anomalies, largest,
      txnCount: yearTxns.length, uniqueCats, avgTxn, mostFreqCat }
  }, [yearTxns])

  const monthlyData = useMemo(() => {
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const monthly = {}
    yearTxns.forEach(t => {
      const m = t.DATE?.substring(0,7); if (!m) return
      const label = MONTHS[parseInt(m.split('-')[1])-1]
      if (!monthly[m]) monthly[m] = { month: label, spent:0, received:0 }
      monthly[m].spent    += t['WITHDRAWAL AMT'] || 0
      monthly[m].received += t['DEPOSIT AMT']    || 0
    })
    return Object.entries(monthly).sort().map(([,v])=>v)
  }, [yearTxns])

  const categoryData = useMemo(() => {
    const catSpend = {}
    yearTxns.filter(t=>t['WITHDRAWAL AMT']>0).forEach(t => {
      catSpend[t.CATEGORY] = (catSpend[t.CATEGORY]||0) + t['WITHDRAWAL AMT']
    })
    return Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([cat,val])=>({ cat, val }))
  }, [yearTxns])

  // ── Empty state ──
  if (!transactions.length) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:16,
          background:'rgba(0,245,160,0.08)', border:'1px solid rgba(0,245,160,0.15)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <PieChart size={28} style={{ color:'#00f5a0' }}/>
        </div>
        <h2 style={{ fontSize:22, fontWeight:800, margin:0 }}>No data yet</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:14 }}>
          Upload a bank statement to see your dashboard
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth:1200, margin:'0 auto' }}>

      {/* Header + year selector */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom:32, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:800, margin:0, marginBottom:4 }}>Dashboard</h1>
          <p style={{ color:'rgba(255,255,255,0.35)', margin:0, fontSize:13 }}>
            {yearTxns.length} transactions · {years.length} year{years.length>1?'s':''} of data
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {years.map(y => (
            <button key={y} onClick={()=>setSelectedYear(y)}
              style={{ padding:'7px 18px', borderRadius:8, border:'none', cursor:'pointer',
                fontSize:13, fontWeight:600, fontFamily:'inherit', transition:'all 0.2s',
                background: selectedYear===y ? 'linear-gradient(135deg,#00f5a0,#00d4ff)' : 'rgba(255,255,255,0.05)',
                color: selectedYear===y ? '#000' : 'rgba(255,255,255,0.5)' }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* 15 stat cards */}
      <YearInReview stats={stats} yearTxns={yearTxns} currency={currency} />

      {/* Cash flow + Category side by side */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <CashFlowChart data={monthlyData} currency={currency} />
        <CategoryChart data={categoryData} currency={currency} />
      </div>

      {/* Monthly spend bar */}
      <MonthlyChart data={monthlyData} currency={currency} />

    </div>
  )
}