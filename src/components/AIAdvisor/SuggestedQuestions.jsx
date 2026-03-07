import React from 'react';
import { Sparkles, AlertTriangle, TrendingDown, BarChart3, GitCompare, User } from 'lucide-react';

export default function SuggestedQuestions({ onSelect }) {
  const suggestions = [
    { text: "What is my biggest spending category?", icon: TrendingDown },
    { text: "Compare my last 3 months — am I spending more or less?", icon: BarChart3 },
    { text: "Are there any suspicious anomalies in my data?", icon: AlertTriangle },
    { text: "Compare my different bank statements side by side", icon: GitCompare },
    { text: "Based on my profile and data, give me a savings plan", icon: User },
    { text: "Which categories grew the most recently?", icon: Sparkles },
  ];

  return (
    <div className="px-3 md:px-6 pb-4 flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.text)}
          className="px-3 py-2 sm:px-4 sm:py-2.5 bg-cyan-950/30 hover:bg-cyan-900/40 border border-[#00f5a0]/20 hover:border-[#00f5a0]/50 rounded-full flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-cyan-100 transition-all hover:-translate-y-0.5"
        >
          <s.icon className="w-4 h-4 text-[#00f5a0]" />
          {s.text}
        </button>
      ))}
    </div>
  );
}
