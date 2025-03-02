"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { SvgCopy } from "@/components/SVG/Copy";

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Send message to AI agent
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = message;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/ask-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ message: userMessage, chatId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Process the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is null");
      }

      let responseText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.substring(6);

          // Handle new chat ID
          if (data.startsWith("[new_chat]")) {
            const newChatId = data.substring(10).trim();
            setChatId(newChatId);
            continue;
          }

          // Handle end of stream
          if (data === "[DONE]") {
            break;
          }

          // Handle normal response text
          responseText += data;
          setCurrentResponse(responseText);
        }
      }

      // Add assistant's full response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setCurrentResponse("");
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render message content, with markdown for assistant messages
  const renderMessageContent = (
    content: string,
    role: "user" | "assistant"
  ) => {
    if (role === "user") {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
      <ReactMarkdown
        // className="markdown-content whitespace-pre-wrap"
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props as any}
                style={atomDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md text-sm"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                {...props}
                className={`${className} bg-gray-700 rounded-sm px-1 py-0.5`}
              >
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          p: ({ node, ...props }) => (
            <p {...props} className="mb-3 last:mb-0" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc pl-6 mb-3" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal pl-6 mb-3" />
          ),
          li: ({ node, ...props }) => <li {...props} className="mb-1" />,
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-xl font-bold mb-2 mt-3" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-lg font-bold mb-2 mt-3" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-md font-bold mb-2 mt-2" />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="pl-3 border-l-2 border-gray-500 italic text-gray-300 my-2"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-3">
              <table
                {...props}
                className="min-w-full text-sm border-collapse"
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="bg-gray-700 px-3 py-1 text-left border border-gray-600"
            />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-3 py-1 border border-gray-600" />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="border-gray-600 my-3" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-green-500 text-gray-900 rounded-full p-4 shadow-lg z-50 hover:bg-green-400 transition-all"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gray-800 rounded-lg shadow-xl z-50 flex flex-col"
            style={{ height: "min(30rem, calc(100vh - 10rem))" }}
          >
            {/* Chat header */}
            <div className="p-4 border-b border-gray-700 bg-gray-700 rounded-t-lg">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Admin Assistant
              </h3>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p>How can I help you today?</p>
                  <p className="text-sm mt-2">
                    Ask me about managing games, users, or any other admin
                    tasks.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex relative ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg py-2 px-4 ${
                          msg.role === "user"
                            ? "bg-green-600 text-white rounded-tr-none max-w-[80%]"
                            : "text-gray-100 rounded-tl-none"
                        }`}
                      >
                        {renderMessageContent(msg.content, msg.role)}
                      </div>
                      {msg.role !== "user" && (
                        <SvgCopy className="w-5 h-5 text-gray-400 ml-2 cursor-pointer absolute right-0 bottom-0" />
                      )}
                    </div>
                  ))}

                  {/* Typing indicator - Updated to match message design */}
                  {isLoading && (
                    <div className="flex relative justify-start">
                      <div className="bg-gray-700 rounded-lg py-2 px-4 text-gray-100 rounded-tl-none max-w-[80%]">
                        {currentResponse ? (
                          renderMessageContent(currentResponse, "assistant")
                        ) : (
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        )}
                      </div>
                      {currentResponse && (
                        <SvgCopy className="w-5 h-5 text-gray-400 ml-2 cursor-pointer absolute right-0 bottom-0" />
                      )}
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-green-500 resize-none overflow-hidden"
                  rows={1}
                  style={{ minHeight: "2.5rem", maxHeight: "8rem" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className={`px-4 py-2 rounded-md ${
                    !message.trim() || isLoading
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-gray-900 hover:bg-green-400"
                  }`}
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
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
