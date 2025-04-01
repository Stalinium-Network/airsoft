'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// Message type for chat history
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll when there are messages AND user has interacted
  useEffect(() => {
    if (hasInteracted && (messages.length > 0 || streamingResponse)) {
      scrollToBottom();
    }
  }, [messages, streamingResponse, hasInteracted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Mark that the user has interacted with the chat
    setHasInteracted(true);
    setIsLoading(true);
    setError(null);
    setStreamingResponse('');

    const userQuestion = question;
    setQuestion('');

    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: userQuestion }
    ]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuestion,
          chatId: chatId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);

              if (data === '[DONE]') {
                // Response is complete
                // Check if response contains !ask_human
                if (responseText.includes('!ask_human')) {
                  console.log('TODO: Ask Human');
                }

                // Add complete AI response to chat history
                setMessages(prevMessages => [
                  ...prevMessages,
                  { role: 'assistant', content: responseText }
                ]);

                // Clear streaming response since it's now in the chat history
                setStreamingResponse('');
              } else if (data.startsWith('[new_chat]')) {
                // New chat session
                const newChatId = data.substring(10).trim();
                setChatId(newChatId);
              } else {
                // Update current response text
                responseText += data;
                // Show streaming response in real-time
                setStreamingResponse(responseText);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching answer:', err);
      setError('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Also mark interaction when user starts typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasInteracted && e.target.value.length > 0) {
      setHasInteracted(true);
    }
    setQuestion(e.target.value);
  };

  return (
    <div className="max-w-3xl mx-auto border border-zone-dark-brown/40 rounded-xl overflow-hidden bg-zone-dark/70 backdrop-blur-sm">
      <div className="p-6 bg-zone-dark-brown/30 flex items-center space-x-4">
        <div className="w-8 h-8 rounded-full bg-zone-gold flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zone-dark-brown">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium">AI Assistant</h3>
      </div>

      <div className="p-6">
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Ask me anything about our STALKER-themed airsoft events!
            </div>
          ) : (
            <>
              {/* Display all previous messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-zone-blue/20 border border-zone-blue/30 ml-10'
                      : 'bg-zone-dark-brown/30 mr-10'
                  }`}
                >
                  <div className="flex items-start mb-1">
                    <span className={`text-sm font-semibold ${
                      msg.role === 'user' ? 'text-zone-blue' : 'text-zone-gold'
                    }`}>
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              ))}

              {/* Display current streaming response */}
              {streamingResponse && (
                <div className="p-4 rounded-lg bg-zone-dark-brown/30 mr-10">
                  <div className="flex items-start mb-1">
                    <span className="text-sm font-semibold text-zone-gold">
                      AI Assistant
                    </span>
                  </div>
                  <MarkdownRenderer content={streamingResponse} />
                </div>
              )}
            </>
          )}

          {isLoading && !streamingResponse && (
            <div className="flex items-center space-x-2 text-gray-400 p-4">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800 p-4 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="Ask me anything about our STALKER-themed airsoft events..."
            className="w-full p-4 pr-16 bg-zone-dark/50 border border-zone-dark-brown/40 rounded-lg focus:ring-2 focus:ring-zone-gold focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-3 top-3 p-2 rounded-md bg-zone-gold text-zone-dark-brown hover:bg-zone-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Our AI assistant is here to help answer your questions about our events, equipment, and STALKER lore.
        </p>
      </div>
    </div>
  );
}
