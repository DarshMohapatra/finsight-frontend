import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';

export default function AIAdvisor() {
  const transactions = useStore((state) => state.transactions);
  const currency = useStore((state) => state.currency);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm FinSight AI, your personal financial advisor. I've analyzed your bank data. What would you like to know about your spending habits, budget, or anomalies?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const windowRef = useRef(null);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    
    // Add User Message
    const userMsg = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      // Pass the previous history (excluding system prompt & the new msg) to backend
      const historyToSend = messages.filter(m => m.role === 'user' || m.role === 'assistant');
      
      // Inline Fetch Call directly to your local FastAPI backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          transactions, 
          history: historyToSend, 
          message: text, 
          currency 
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to get AI response");
      
      setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newHistory, { role: 'assistant', content: "I'm currently experiencing high connection traffic. Please try asking your question again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[11px] font-mono tracking-[0.2em] text-[#00f5a0] mb-2">AI FINANCIAL ADVISOR</h2>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="w-6 h-6 md:w-8 md:h-8 text-[#00d4ff]" /> Ask FinSight
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-[#0b0e14]/80 backdrop-blur-md border border-white/[0.04] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <ChatWindow messages={messages} isTyping={isTyping} windowRef={windowRef} />
        
        {messages.length <= 2 && !isTyping && (
          <SuggestedQuestions onSelect={handleSendMessage} />
        )}
        
        <ChatInput onSend={handleSendMessage} isTyping={isTyping} />
      </div>
    </motion.div>
  );
}
