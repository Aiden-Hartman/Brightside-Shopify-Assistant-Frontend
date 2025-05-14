import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, Product, ChatResponse, AssistantPhase } from '../types/assistant';
import { ChatProductCard } from './ProductCard';

export interface ChatWindowProps {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  products?: Product[];
  setPhase?: (phase: AssistantPhase) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  sendMessage, 
  isLoading, 
  products = [], 
  setPhase 
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input.trim());
    setInput('');
  };

  const renderProductCard = (product: Product) => (
    <ChatProductCard key={product.id} product={product} />
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={message.timestamp ?? index} message={message} />
        ))}
        {products.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Products</h3>
            {products.map((product) => renderProductCard(product))}
          </div>
        )}
        <TypingIndicator isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>
      {products.length > 0 && setPhase && (
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={() => setPhase('results')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow; 
