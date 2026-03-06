import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { forecastAPI } from '../../api/client';
import ForecastCards from './ForecastCards';
import ForecastChart from './ForecastCharts';
import ForecastTable from './ForecastTable';

function fmt(amount, currency = 'IN') {
  if (amount == null) return '—';
  const cfg = {
    IN: { sym: '₹' }, US: { sym: '$' },
    UK: { sym: '£' }, CA: { sym: 'C$' }, AU: { sym: 'A$' },
  };
  const sym = cfg[currency]?.sym || '₹';
  if (currency === 'IN') {
    if (amount >= 1e7) return `${sym}${(amount/1e7).toFixed(1)}Cr`;
    if (amount >= 1e5) return `${sym}${(amount/1e5).toFixed(1)}L`;
    if (amount >= 1e3) return `${sym}${(amount/1e3).toFixed(1)}K`;
    return `${sym}${Math.round(amount).toLocaleString()}`;
  }
  if (amount >= 1e6) return `${sym}${(amount/1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `${sym}${(amount/1e3).toFixed(1)}K`;
  return `${sym}${Math.round(amount).toLocaleString()}`;
}

export default function Forecast() {
  const transactions = useStore(s => s.transactions);
  const currency = useStore(s => s.currency);
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchForecast() {
      if (!transactions || transactions.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await forecastAPI.forecast(transactions);
        if (res.data.success) {
          setData(res.data);
        } else {
          setError(res.data.error || 'Failed to generate forecast');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Forecast API error. Ensure backend is running.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchForecast();
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Analyzing spending patterns...
        </h2>
        <p className="text-gray-500 text-sm">Simulating 6-month AI projections</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold">Forecast Unavailable</h2>
        <p className="text-gray-500 text-sm max-w-md">{error || "Not enough data to generate a forecast."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <ForecastCards data={data} currency={currency} fmt={fmt} isHeadlineOnly={true} />
      
      <ForecastChart data={data} currency={currency} fmt={fmt} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ForecastCards data={data} currency={currency} fmt={fmt} isListOnly={true} />
        </div>
        <div className="lg:col-span-2">
          <ForecastTable data={data} currency={currency} fmt={fmt} />
        </div>
      </div>
    </div>
  );
}
