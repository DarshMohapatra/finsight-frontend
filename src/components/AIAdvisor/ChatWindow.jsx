import React, { useEffect } from 'react';
import ChatBubble from './ChatBubble';

export default function ChatWindow({ messages, isTyping, windowRef }) {
  
  // Auto scroll to bottom
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.scrollTop = windowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={windowRef} className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 custom-scrollbar scroll-smooth">
      {messages.map((msg, i) => (
        <ChatBubble key={i} role={msg.role} content={msg.content} />
      ))}
      
      {isTyping && (
        <div className="flex gap-4 self-start max-w-[80%] items-end">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mb-1">
            <span className="text-[12px]">✨</span>
          </div>
          <div className="bg-[#151a26] border border-cyan-500/20 rounded-2xl rounded-bl-sm px-6 py-5 flex items-center gap-2 h-12">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  );
}
