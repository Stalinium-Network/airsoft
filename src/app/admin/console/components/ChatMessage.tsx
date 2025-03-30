import React from "react";
import { motion } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { SvgCopy } from "@/components/SVG/Copy";

export interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  index: number;
  copySuccess: number | null;
  onCopy: (content: string, index: number) => void;
}

export default function ChatMessage({ 
  content, 
  role, 
  index, 
  copySuccess, 
  onCopy 
}: ChatMessageProps) {
  const isUser = role === "user";

  // Render message content
  const renderContent = () => {
    if (isUser) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    return <MarkdownRenderer content={content} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative group max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "bg-gradient-to-br from-green-500/90 to-emerald-600/90 text-white shadow-lg shadow-green-500/20 border border-green-400/30 backdrop-blur-sm"
            : "text-gray-100"
        }`}
      >
        {!isUser && (
          <button
            onClick={() => onCopy(content, index)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gray-700/70 hover:bg-gray-600/70 rounded-md backdrop-blur-sm z-10"
            aria-label="Copy message content"
          >
            {copySuccess === index ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <SvgCopy className="w-4 h-4 text-gray-300" />
            )}
          </button>
        )}
        {renderContent()}
      </div>
    </motion.div>
  );
}