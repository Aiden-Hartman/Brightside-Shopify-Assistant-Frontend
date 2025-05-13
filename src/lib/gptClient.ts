import axios from 'axios';

// Get the API URL from environment variable, defaulting to localhost
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/api/chat';

interface AssistantResponse {
  role: string;
  content: string;
  action?: {
    type: string;
    query: string;
  };
}

export async function sendMessageToAssistant(
  message: string,
  sessionId: string = 'test-session-001'
): Promise<{ assistantMessage: string; action?: { type: string; query: string } }> {
  console.log('Sending message to assistant:', { message, sessionId });
  
  try {
    const response = await axios.post<AssistantResponse>(
      CHAT_API_URL,
      {
        message,
        session_id: sessionId,
        client_id: 'demo'
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Received response from assistant:', response.data);

    return {
      assistantMessage: response.data.content,
      action: response.data.action
    };
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw error;
  }
} 