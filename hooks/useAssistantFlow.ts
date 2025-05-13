import { create } from 'zustand';
import type { AssistantState, ChatMessage, Product, QuizAnswers } from '../types/assistant';
import { sendMessage } from '../lib/gptClient';
import { getProductRecommendations } from '../lib/recommendClient';
import type { StoreApi } from 'zustand';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 'demo';
const SESSION_ID = process.env.NEXT_PUBLIC_SESSION_ID || 'test-session-001';

// Mock data for fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock1',
    name: 'Mock Product 1',
    description: 'A fallback product when API fails',
    price: '99.99',
    currency: 'USD',
    image_url: 'https://via.placeholder.com/150',
    product_url: '#',
  }
];

interface AssistantStore extends AssistantState {
  setPhase: (phase: AssistantState['phase']) => void;
  addMessage: (message: ChatMessage) => void;
  setProducts: (products: Product[]) => void;
  updateQuizAnswers: (answers: Partial<QuizAnswers>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  sendMessage: (userInput: string) => Promise<void>;
  restart: () => void;
}

const initialState: Omit<AssistantState, keyof Omit<AssistantStore, keyof AssistantState>> = {
  phase: 'quiz',
  messages: [],
  products: [],
  quizAnswers: {},
  isLoading: false,
  error: null,
};

// Normalization function for product data
function normalizeProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name || product.title || '',
    description: product.description || '',
    price: product.price || '',
    currency: product.currency || '',
    image_url: product.image_url || product.image || '',
    product_url: product.product_url || product.link || '',
    category: product.category || '',
    brand: product.brand || '',
    tags: product.tags || [],
    ingredients: product.ingredients || [],
    nutritional_info: product.nutritional_info || {},
    allergens: product.allergens || [],
    dietary_info: product.dietary_info || {},
    rating: product.rating,
    review_count: product.review_count,
    metadata: product.metadata || {},
  };
}

export const useAssistantFlow = create<AssistantStore>((set, get: StoreApi<AssistantStore>['getState']) => ({
  ...initialState,
  
  setPhase: (phase: AssistantState['phase']) => {
    console.log(`[AssistantFlow] Phase transition to: ${phase}`);
    set({ phase });
  },
  
  addMessage: (message: ChatMessage) => {
    console.log(`[AssistantFlow] Adding message: ${message.role} - ${message.content?.substring(0, 50) || 'No content'}...`);
    set((state) => ({ 
      messages: [...state.messages, message] 
    }));
  },
  
  setProducts: (products: Product[]) => {
    console.log(`[AssistantFlow] Setting ${products.length} products`);
    set({ products: products.map(normalizeProduct) });
  },
  
  updateQuizAnswers: (answers: Partial<QuizAnswers>) => {
    console.log('[AssistantFlow] Updating quiz answers:', answers);
    set((state) => {
      const validAnswers: QuizAnswers = {};
      Object.entries(answers).forEach(([key, value]) => {
        if (value !== undefined) {
          validAnswers[key] = value;
        }
      });
      return {
        quizAnswers: { ...state.quizAnswers, ...validAnswers }
      };
    });
  },
  
  setLoading: (isLoading: boolean) => {
    console.log(`[AssistantFlow] Setting loading state to: ${isLoading}`);
    set({ isLoading });
  },
  
  setError: (error: string | null) => {
    console.log(`[AssistantFlow] Setting error: ${error}`);
    set({ error });
  },

  sendMessage: async (userInput: string) => {
    const store = get();
    store.setLoading(true);
    store.setError(null);

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };
    console.log('[AssistantFlow] Adding user message:', userMessage);
    store.addMessage(userMessage);

    try {
      console.log('[AssistantFlow] Sending message to backend');
      const response = await sendMessage({
        message: userInput,
        chat_history: [...store.messages, userMessage],
        quiz_answers: store.quizAnswers,
        client_id: CLIENT_ID,
        session_id: SESSION_ID
      });
      console.log('[AssistantFlow] Received response:', response);

      const validRole = response.role === 'user' || response.role === 'assistant' ? response.role : 'assistant';
      const assistantMessage: ChatMessage = {
        role: validRole,
        content: response.content,
        timestamp: Date.now(),
      };
      store.addMessage(assistantMessage);

      // Handle products if they exist in the response
      if (response.products && response.products.length > 0) {
        console.log('[AssistantFlow] Products received in response:', response.products);
        store.setProducts(response.products.map(normalizeProduct));
      }
      // If recommend is true but no products, fetch them
      else if (response.recommend) {
        try {
          const products = await getProductRecommendations({
            query: userInput,
            limit: 3,
            client_id: CLIENT_ID
          });
          store.setProducts(products.map(normalizeProduct));
        } catch (error) {
          store.setError('Failed to fetch product recommendations');
        }
      }

      // Always stay in chat phase unless explicitly requested
      store.setPhase('chat');
    } catch (error) {
      console.error('[AssistantFlow] Error in sendMessage:', error);
      store.setError('Failed to get response from assistant');
    } finally {
      store.setLoading(false);
    }
  },
  
  restart: () => {
    console.log('[AssistantFlow] Restarting assistant flow');
    set(initialState);
  },
})); 
