import { useState, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatProps {
  apiUrl?: string;
}

interface UseChatReturn {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
  chatId: string | null;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}

export default function useChat({ apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/ask-agent` }: UseChatProps = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Reset chat function
  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentResponse('');
    setChatId(null);
  }, []);

  // Send message to AI agent
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ message, chatId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Process the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is null');
      }

      let responseText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          const data = line.substring(6);

          // Handle new chat ID
          if (data.startsWith('[new_chat]')) {
            const newChatId = data.substring(10).trim();
            setChatId(newChatId);
            continue;
          }

          // Handle end of stream
          if (data === '[DONE]') {
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
        { role: 'assistant', content: responseText },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, there was an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  }, [apiUrl, chatId, isLoading]);

  return {
    messages,
    currentResponse,
    isLoading,
    chatId,
    sendMessage,
    resetChat,
  };
}