import axios from 'axios';
import type { ChatMessage, ChatResponse } from '../types/assistant';
import type { GPTAction } from '../types/actions';
import { SYSTEM_PROMPT } from '../utils/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_GPT_API_KEY;
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 'demo';
const SESSION_ID = process.env.NEXT_PUBLIC_SESSION_ID || 'test-session-001';

interface GPTResponse {
  role: string;
  content: string;
  recommend?: boolean;
}

interface LegacyGPTResponse {
  message: string;
  action?: GPTAction;
}

const MOCK_RESPONSE: ChatResponse = {
  role: 'assistant',
  content: 'This is a mock response for testing purposes.',
  recommend: false
};

export async function getGPTResponse(messages: ChatMessage[]): Promise<GPTResponse> {
  const systemMessage = { role: "system", content: SYSTEM_PROMPT };
  const allMessages = [systemMessage, ...messages];

  async function callGroqAPI() {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-8b-8192",
          messages: allMessages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
        }
      );

      const messageContent = response.data.choices[0].message.content;
      const action = await parseGPTResponse(messageContent);

      return {
        role: 'assistant',
        content: messageContent,
        recommend: (action as { type?: string })?.type === 'recommend_products'
      };
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }

  try {
    // First attempt
    return await callGroqAPI();
  } catch (error) {
    try {
      // Retry once
      console.log('Retrying Groq API call...');
      return await callGroqAPI();
    } catch (retryError) {
      console.error('Both API attempts failed:', retryError);
      // Return mock response as fallback
      return MOCK_RESPONSE;
    }
  }
}

export async function sendMessage({
  message,
  chat_history = [],
  quiz_answers = undefined,
  client_id = CLIENT_ID,
  session_id = SESSION_ID
}: {
  message: string;
  chat_history?: ChatMessage[];
  quiz_answers?: any;
  client_id?: string;
  session_id?: string;
}): Promise<ChatResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat`,
      {
        message,
        client_id,
        session_id,
        chat_history,
        quiz_answers
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message to backend:', error);
    throw error;
  }
}

// Mock function for testing
export async function mockSendMessage(
  messages: ChatMessage[],
  clientId?: string
): Promise<ChatResponse> {
  return MOCK_RESPONSE;
}

async function parseGPTResponse(response: string): Promise<Partial<ChatResponse>> {
  try {
    // Look for JSON-like structure in the response
    const match = response.match(/\{[\s\S]*\}/);
    if (!match) return {};

    const parsed = JSON.parse(match[0]);
    
    // Extract function call information if present
    if (parsed.function_call) {
      return {
        function_called: true,
        function_name: parsed.function_call.name,
        recommend: parsed.function_call.name === 'recommend_products',
        products: parsed.function_call.arguments?.products || []
      };
    }

    return {
      recommend: parsed.recommend || false,
      products: parsed.products || []
    };
  } catch (error) {
    console.error('Error parsing GPT response:', error);
    return {};
  }
} 
