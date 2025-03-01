# Admin Agent API Guide

## Authentication
All requests to the `/api/admin/ask-agent` endpoint require authentication:
- Include a valid JWT token in the Authorization header
- Format: `Authorization: Bearer your_jwt_token`

## Making Requests

### Endpoint
```
POST /api/admin/ask-agent
```

### Headers
```
Content-Type: application/json
Authorization: Bearer your_jwt_token
```

### Request Body
```json
{
  "message": "Your question or prompt here",
  "chatId": "optional-chat-id-for-continuing-conversation"
}
```

- For a new conversation, omit `chatId` or pass an empty string
- For continuing a conversation, include the `chatId` received from a previous response

## Handling Responses

Responses are streamed using Server-Sent Events (SSE) format:

### Response Types
1. **New Chat Notification**: Sent when a new chat session is created
   ```
   data: [new_chat] chat-uuid-here
   ```

2. **AI Response Chunks**: Sent as individual tokens during generation
   ```
   data: token text here
   ```

3. **End of Stream Marker**: Indicates the response is complete
   ```
   data: [DONE]
   ```

### Example Client Implementation (JavaScript)

```javascript
async function askAgent(message, chatId = null) {
  const response = await fetch('/api/admin/ask-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${yourAuthToken}`
    },
    body: JSON.stringify({ message, chatId })
  });

  // Create a new event source from the response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let currentChatId = chatId;
  let fullResponse = '';

  // Process the stream
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.substring(6);
        
        // Handle new chat ID
        if (data.startsWith('[new_chat]')) {
          currentChatId = data.substring(10).trim();
          console.log(`New chat created with ID: ${currentChatId}`);
          continue;
        }
        
        // Handle end of stream
        if (data === '[DONE]') {
          console.log('Response complete');
          break;
        }
        
        // Handle normal response text
        console.log(data); // Text token
        fullResponse += data;
        
        // Update your UI here with each token for a typing effect
        updateUI(data);
      }
    }
  }
  
  return {
    chatId: currentChatId,
    response: fullResponse
  };
}

// Example usage
const result = await askAgent("What's the weather like today?");
console.log(`Chat ID: ${result.chatId}`);
console.log(`Full response: ${result.response}`);

// For continuing the conversation later:
const followup = await askAgent("How about tomorrow?", result.chatId);
```

## Notes

- Chat sessions expire after 2 hours of inactivity
- For security reasons, always validate the user's authentication before making requests
- The streaming format allows for creating a natural typing effect in the UI
