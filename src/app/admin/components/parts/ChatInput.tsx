import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatInput({ onSendMessage, isLoading, inputRef: externalInputRef }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const internalInputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const newHeight = Math.min(
        Math.max(inputRef.current.scrollHeight, 24), // Minimum 24px height
        120 // Maximum 120px height
      );
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [message, inputRef]);

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;
    
    const currentMessage = message;
    setMessage("");
    await onSendMessage(currentMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="border-t border-gray-700/30 bg-gray-800/80 backdrop-blur-md px-4 md:px-8 lg:px-16 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-700/60 backdrop-blur-lg p-2 rounded-3xl border border-gray-600/30 shadow-inner">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message"
              className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none resize-none leading-tight"
              style={{ minHeight: "24px", maxHeight: "120px", overflow: message.length > 100 ? "auto" : "hidden" }}
            />
          </div>
          <motion.button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center transition-all ${
              !message.trim() || isLoading
                ? "bg-gray-500/50 text-gray-400"
                : "bg-green-500 text-white"
            }`}
            whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}