import { useState, useCallback } from 'react';
import { sendMessageToAssistant } from '@/lib/gptClient';
import { getProductRecommendations } from '@/lib/recommendClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function useAssistantFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    console.log('Starting message flow for:', message);
    setIsLoading(true);
    setError(null);

    try {
      // Add user message to conversation
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      // Send to GPT backend
      console.log('Sending message to GPT backend...');
      const { assistantMessage, action } = await sendMessageToAssistant(message);

      // Add assistant response to conversation
      console.log('Received assistant response:', assistantMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Handle any actions
      if (action) {
        console.log('Processing action:', action);
        if (action.type === 'product_recommendations') {
          console.log('Fetching product recommendations for query:', action.query);
          const products = await getProductRecommendations(action.query, 5);
          setRecommendations(products);
          console.log('Received recommendations:', products);
        }
      }
    } catch (err) {
      console.error('Error in assistant flow:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      // Add fallback assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to my backend. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    recommendations,
    sendMessage
  };
} 