import { useEffect, useCallback } from 'react';
import { QuizStarter } from './QuizStarter';
import { ChatWindow } from './ChatWindow';
import { ProductGallery } from './ProductGallery';
import { useAssistantFlow } from '../hooks/useAssistantFlow';
import type { AssistantPhase } from '../types/assistant';

interface AssistantShellProps {
  clientId?: string;
}

export const AssistantShell = ({ clientId }: AssistantShellProps) => {
  const {
    phase,
    isLoading,
    error,
    messages,
    products,
    setPhase,
    addMessage,
    updateQuizAnswers,
    setProducts,
    setLoading,
    setError,
    sendMessage
  } = useAssistantFlow();

  // Prevent any navigation side effects
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase !== 'quiz') {
        e.preventDefault();
        return (e.returnValue = '');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  const handleRestart = useCallback(() => {
    setPhase('quiz');
    setProducts([]);
    addMessage({
      role: 'assistant',
      content: 'Starting new shopping session. How can I help you today?'
    });
  }, [setPhase, setProducts, addMessage]);

  const renderPhase = useCallback((currentPhase: AssistantPhase) => {
    console.log('AssistantShell - Rendering phase:', currentPhase);
    switch (currentPhase) {
      case 'quiz':
        return (
          <QuizStarter />
        );
      case 'chat':
        console.log('AssistantShell - Rendering ChatWindow with messages:', messages);
        return (
          <ChatWindow 
            messages={messages}
            sendMessage={sendMessage}
            isLoading={isLoading}
            products={products}
            setPhase={setPhase}
          />
        );
      case 'loading':
        console.log('AssistantShell - Rendering loading state');
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading product recommendations...</p>
          </div>
        );
      case 'results':
        console.log('AssistantShell - Rendering results with products:', products.length);
        return (
          <div className="h-full flex flex-col">
            <ProductGallery 
              products={products} 
              isLoading={isLoading}
              onBackToChat={() => setPhase('chat')}
              onAskQuestion={(productId) => {
                console.log(`[AssistantShell] Asking question about product: ${productId}`);
                const product = products.find(p => p.id === productId);
                if (product) {
                  const message = `Tell me more about ${product.name}`;
                  setPhase('chat');
                  // Only trigger GPT response, do not add message directly
                  sendMessage(message);
                }
              }}
            />
            <div className="p-4 border-t">
              <button
                onClick={handleRestart}
                className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start New Search
              </button>
            </div>
          </div>
        );
      default:
        return <QuizStarter />;
    }
  }, [messages, sendMessage, isLoading, handleRestart, products, setPhase, addMessage]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={handleRestart}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-white">
      {renderPhase(phase)}
    </div>
  );
}; 
