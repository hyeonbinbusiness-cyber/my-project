import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Terminal initialized. Ask me about aflow.', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    setLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 font-bold p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center w-14 h-14"
        style={{ backgroundColor: '#DBDFE8', color: '#7c3aed' }}
      >
        {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden font-mono text-sm" style={{ backgroundColor: '#DBDFE8' }}>
          <div className="px-4 py-3 border-b border-purple-200/50 flex justify-between items-center" style={{ backgroundColor: '#DBDFE8' }}>
            <span className="text-purple-700 flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600 animate-pulse shadow-[0_0_10px_rgba(155,89,182,0.6)]"></span>
              aflow_bot v1.0
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/80 text-gray-800 border border-purple-200/50'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/80 text-purple-700 p-2 rounded-md text-xs animate-pulse border border-purple-200/50">
                  typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 flex gap-2 border-t border-purple-200/50" style={{ backgroundColor: '#DBDFE8' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about motion..."
              className="flex-1 bg-white/90 border border-purple-200/50 text-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder-gray-400"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 font-semibold"
            >
              ↵
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default GeminiChat;