import React from 'react';
import { User } from 'lucide-react';

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';
  
  // Basic Regex for Markdown Bold (**text**) and Line Breaks
  const formatText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
    formatted = formatted.replace(/\n/g, '<br/>');
    formatted = formatted.replace(/- (.*?)(?:<br\/>|$)/g, '<li class="ml-4 mb-2 list-disc">$1</li>');
    return { __html: formatted };
  };

  return (
    <div className={`flex gap-4 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'} items-end group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-lg ${
        isUser 
          ? 'bg-gradient-to-tr from-[#00f5a0] to-[#00d4ff] text-black' 
          : 'bg-[#0f141e] border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
      }`}>
        {isUser ? <User className="w-4 h-4" strokeWidth={3} /> : <span className="text-[12px]">✨</span>}
      </div>

      {/* Bubble */}
      <div className={`px-6 py-4 relative shadow-xl ${
        isUser 
          ? 'bg-gradient-to-br from-[#00f5a0]/10 to-[#00d4ff]/10 border border-[#00f5a0]/30 rounded-2xl rounded-br-sm text-cyan-50' 
          : 'bg-[#151a26] border border-white/[0.08] rounded-2xl rounded-bl-sm text-gray-300 leading-relaxed font-sans text-[14.5px]'
      }`}>
        <p dangerouslySetInnerHTML={formatText(content)} className="break-words" />
      </div>
    </div>
  );
}

