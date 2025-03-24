"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your administrative assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputText("");
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        text: "I understand you need help. I'm analyzing your request and will assist you shortly.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Handle textarea height adjustment
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize the textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg z-20 flex items-center justify-center transition-all"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Fullscreen chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-850 w-full max-w-5xl h-screen md:h-[80vh] rounded-xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col"
            >
              {/* Chat header */}
              <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white text-xl mr-3">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Admin Assistant</h3>
                    <p className="text-xs text-gray-400">
                      Powered by OpenAI
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isUser 
                          ? 'bg-green-600 text-white rounded-br-none' 
                          : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input area */}
              <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={handleTextAreaChange}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[2.5rem] max-h-[150px] transition-all"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors"
                    disabled={!inputText.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for a new line
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
