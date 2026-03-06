import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function ForecastTable({ data, currency, fmt }) {
  // Just use all table_data directly, because the backend fix we did
  // ensures this array ONLY contains the 6 future months.
  const futureForecasts = data.table_data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-[#0b0e14] border border-white/[0.04] rounded-2xl p-6 h-full">
      <h3 className="text-[11px] font-mono tracking-[0.2em] text-cyan-400 mb-8 uppercase">6-MONTH FORECAST TABLE</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 font-mono text-[10px] border-b border-white/[0.05]">
              <th className="text-left pb-4 font-medium uppercase tracking-[0.1em]">Month</th>
              <th className="text-right pb-4 font-medium uppercase tracking-[0.1em] text-cyan-400">Predicted</th>
              <th className="text-right pb-4 font-medium uppercase tracking-[0.1em]">Lowest</th>
              <th className="text-right pb-4 font-medium uppercase tracking-[0.1em]">Highest</th>
            </tr>
          </thead>
          <tbody>
            {futureForecasts.map((row, i) => (
              <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                <td className="py-5 text-gray-300 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" /> 
                  <span className="font-medium text-gray-200">{row.month}</span>
                </td>
                
                <td className="py-5 text-right font-mono font-bold text-white text-[15px]">
                  {fmt(row.predicted, currency)}
                </td>
                
                <td className="py-5 text-right font-mono text-gray-500 text-[13px]">
                  {fmt(row.lowest, currency)}
                </td>
                
                <td className="py-5 text-right font-mono text-gray-500 text-[13px]">
                  {fmt(row.highest, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
