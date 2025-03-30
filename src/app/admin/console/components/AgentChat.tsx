"use client";
import { useState, useEffect, useRef, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
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
  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/ask-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ message, chatId }),
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

  // Function to copy message content with success indicator
  const copyMessageContent = (content: string, index: number) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopySuccess(index);
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Chat toggle button variants
  const buttonVariants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 1, rotate: 180 },
  };

  return (
    <>
      {/* Chat toggle button - glass morphism style */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-sm text-white rounded-full p-4 shadow-lg shadow-emerald-600/20 z-50 hover:shadow-emerald-500/30 transition-all duration-300 border border-green-400/20"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={buttonVariants}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
      </motion.button>

      {/* Full screen chat interface with animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex flex-col"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="border-b border-gray-700/80 bg-gray-800/90 px-6 py-4 shadow-lg shadow-black/20 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full mr-3 shadow-inner shadow-green-400/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Admin AI Assistant
                </h2>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none bg-gray-700/50 hover:bg-gray-700 p-2 rounded-full"
                aria-label="Close chat"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
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
              </motion.button>
            </motion.div>

            {/* Chat messages container with subtle background pattern */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6 bg-gradient-to-b from-gray-900/90 to-gray-800/90">
              <div
                className="max-w-4xl mx-auto space-y-6"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.01) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.01) 2%, transparent 0%)",
                  backgroundSize: "100px 100px",
                }}
              >
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/10 backdrop-blur-md shadow-inner">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-2">
                      How can I help you today?
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Ask me about managing games, users, locations, gallery
                      images, or any other admin tasks.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Display chat messages */}
                    <div className="space-y-6">
                      {messages.map((msg, index) => (
                        <ChatMessage
                          key={index}
                          content={msg.content}
                          role={msg.role}
                          index={index}
                          copySuccess={copySuccess}
                          onCopy={copyMessageContent}
                        />
                      ))}
                    </div>

                    {/* Typing indicator with improved animations */}
                    {isLoading && (
                      currentResponse ? (
                        <ChatMessage
                          content={currentResponse}
                          role="assistant"
                          index={-1}
                          copySuccess={copySuccess}
                          onCopy={copyMessageContent}
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex justify-start"
                        >
                          <div className="px-5 py-3.5 text-gray-100">
                            <div className="flex space-x-2 py-2">
                              <motion.div
                                className="w-3 h-3 rounded-full bg-green-500/60"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0,
                                }}
                              />
                              <motion.div
                                className="w-3 h-3 rounded-full bg-green-500/60"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0.2,
                                }}
                              />
                              <motion.div
                                className="w-3 h-3 rounded-full bg-green-500/60"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0.4,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Use the ChatInput component */}
            <ChatInput 
              onSendMessage={sendMessage}
              isLoading={isLoading}
              inputRef={inputRef as RefObject<HTMLTextAreaElement>}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}