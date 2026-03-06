import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ForecastCards({ data, currency, fmt, isHeadlineOnly, isListOnly }) {
  const isIncrease = data.headline_trend === 'increase';
  const TrendIcon = isIncrease ? TrendingUp : TrendingDown;
  // Use Dashboard-matching Neon Colors
  const trendColor = isIncrease ? 'text-[#ff3c64]' : 'text-[#00f5a0]';
  const bgGrad = isIncrease 
    ? 'bg-gradient-to-br from-[#ff3c64]/10 to-transparent border-[#ff3c64]/20'
    : 'bg-gradient-to-br from-[#00f5a0]/10 to-transparent border-[#00f5a0]/20';

  if (isHeadlineOnly) {
    return (
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Forecast</h1>
          <p className="text-gray-400 text-sm">Predictive 6-month spending analysis based on your history.</p>
        </div>
        
        {/* Neon Dashboard Style Headline Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-5 px-6 py-4 rounded-xl border ${bgGrad}`}>
          <div className={`p-3 rounded-lg ${isIncrease ? 'bg-[#ff3c64]/20' : 'bg-[#00f5a0]/20'}`}>
            <TrendIcon className={`w-6 h-6 ${trendColor}`} />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase mb-1">Next Month Projection</p>
            <p className="text-xl font-bold text-white">
              Spending will <span className={trendColor}>{data.headline_trend} by {data.headline_percentage}%</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isListOnly) {
    // Array of neon accent colors for variety (like the Dashboard cards)
    const neonAccents = ['text-[#a55eea]', 'text-[#00d4ff]', 'text-[#f59e0b]', 'text-[#ff4d6d]'];

    return (
      <div className="space-y-4">
        <h3 className="text-[11px] font-mono tracking-[0.2em] text-cyan-400 mb-6 uppercase">CATEGORY WATCHLIST</h3>
        
        {data.top_categories?.map((cat, i) => {
          const accentColor = neonAccents[i % neonAccents.length];
          const isUp = cat.trend === 'increase';
          const ArrowIcon = isUp ? ArrowUpRight : ArrowDownRight;
          const arrowColor = isUp ? 'text-[#ff3c64]' : 'text-[#00f5a0]';
          
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i*0.1) }}
              className="bg-[#0b0e14] border border-white/[0.04] rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-4">
                {/* Colored Category Name so it stands out! */}
                <p className={`text-sm font-bold tracking-wide ${accentColor}`}>{cat.name}</p>
                
                {/* Status Indicator */}
                <div className={`flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 ${arrowColor}`}>
                  <ArrowIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono font-bold">{cat.percentage}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold font-mono text-white tracking-tight">{fmt(cat.predicted, currency)}</p>
                {/* FIXED CLARITY HERE */}
                <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mt-2">Next Month's Est. Spend</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    );
  }

  return null;
}
