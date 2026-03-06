import React from 'react';
import { Sparkles, AlertTriangle, TrendingDown } from 'lucide-react';

export default function SuggestedQuestions({ onSelect }) {
  const suggestions = [
    { text: "What is my biggest spending category?", icon: TrendingDown },
    { text: "Are there any suspicious anomalies?", icon: AlertTriangle },
    { text: "Give me a 3-step plan to save more.", icon: Sparkles }
  ];

  return (
    <div className="px-6 pb-4 flex flex-wrap gap-3">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.text)}
          className="px-4 py-2.5 bg-cyan-950/30 hover:bg-cyan-900/40 border border-[#00f5a0]/20 hover:border-[#00f5a0]/50 rounded-full flex items-center gap-2 text-[13px] text-cyan-100 transition-all hover:-translate-y-0.5"
        >
          <s.icon className="w-4 h-4 text-[#00f5a0]" />
          {s.text}
        </button>
      ))}
    </div>
  );
}
