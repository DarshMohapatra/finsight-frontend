import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, currency, fmt }) => {
  if (!active || !payload?.length) return null;
  
  const actPoint = payload.find(p => p.dataKey === 'actual');
  const predPoint = payload.find(p => p.dataKey === 'predicted');
  const rangePoint = payload.find(p => p.dataKey === 'range');

  return (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.95)', // Sleek, professional slate dark navy
      border: '1px solid rgba(148, 163, 184, 0.1)', 
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
      borderRadius: 12, 
      padding: '16px', 
      minWidth: 200 
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </div>
      
      {actPoint && actPoint.value != null && (
        <div style={{ fontSize: 13, color: '#f8fafc', display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#cbd5e1' }}>Historical Spend</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{fmt(actPoint.value, currency)}</span>
        </div>
      )}

      {predPoint && predPoint.value != null && (
        <div style={{ fontSize: 13, color: '#38bdf8', display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#7dd3fc' }}>Projected Spend</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{fmt(predPoint.value, currency)}</span>
        </div>
      )}

      {rangePoint && rangePoint.value && (
        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between', gap: 24, paddingTop: 12, marginTop: 8, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <span>95% Confidence Range</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{fmt(rangePoint.value[0], currency)} - {fmt(rangePoint.value[1], currency)}</span>
        </div>
      )}
    </div>
  )
}

export default function ForecastChart({ data, currency, fmt }) {
  let chartData = [...(data.chart_data || [])];
  
  const transitionIndex = chartData.findIndex((d, i) => 
    i > 0 && chartData[i-1].actual != null && d.actual == null && d.predicted != null
  );

  if (transitionIndex > 0) {
    const prevActual = chartData[transitionIndex - 1].actual;
    chartData[transitionIndex - 1] = {
      ...chartData[transitionIndex - 1],
      predicted: prevActual,
      range: [prevActual, prevActual]
    };
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-[#0f172a] border border-slate-800/60 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h3 className="text-[17px] font-semibold flex items-center gap-2.5 text-slate-100 font-sans tracking-tight">
          <Activity className="w-5 h-5 text-sky-400" />
          6-Month Spending Trajectory
        </h3>
        
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800/80">
          <span className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> Historical
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div> Projected
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sky-900/40 border border-sky-800/50"></div> Range
          </span>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Elegant, muted gradient definition */}
            <defs>
              <linearGradient id="predictGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0}/>
              </linearGradient>
            </defs>

            {/* Very faint, elegant grid */}
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.05)" vertical={false}/>
            
            <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={12}/>
            <YAxis tick={{ fill:'#64748b', fontSize:11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v,currency)} dx={-10}/>
            
            <Tooltip content={<CustomTooltip currency={currency} fmt={fmt} />} cursor={{ stroke: 'rgba(148, 163, 184, 0.15)', strokeWidth: 1 }} />
            
            {/* Smooth, subtle background area behind the future projection */}
            <Area type="monotone" dataKey="range" stroke="none" fill="url(#predictGradient)" />
            
            {/* Muted Slate color for history. Smooth, solid line, no dashes, no blur filters. */}
            <Line type="monotone" dataKey="actual" stroke="#cbd5e1" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0f172a', stroke: '#cbd5e1', strokeWidth: 2 }} connectNulls={false} />
            
            {/* Sky Blue for projection. Thinner, solid line. No harsh dashes. */}
            <Line type="monotone" dataKey="predicted" stroke="#38bdf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2 }} connectNulls={false} isAnimationActive={true} animationDuration={1000} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
