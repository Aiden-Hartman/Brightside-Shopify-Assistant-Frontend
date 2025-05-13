export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  image_url: string;
  product_url: string;
  score?: number;
  brand?: string;
  category?: string;
  tags?: string[];
  ingredients?: string[];
  nutritional_info?: Record<string, any>;
  allergens?: string[];
  dietary_info?: Record<string, boolean>;
  rating?: number;
  review_count?: number;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  role: string;
  content: string;
  recommend?: boolean;
  products?: Product[];
  function_called?: boolean;
  function_name?: string;
}

export type GPTAction = {
  type: string;
  payload?: any;
};

export type GPTResponse = {
  message: string;
  action?: GPTAction;
};

export type AssistantPhase = 'quiz' | 'chat' | 'results' | 'loading';

export type QuizQuestion = {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
};

export type QuizAnswers = {
  [key: string]: string;
};

export type AssistantState = {
  phase: AssistantPhase;
  messages: ChatMessage[];
  products: Product[];
  quizAnswers: QuizAnswers;
  isLoading: boolean;
  error: string | null;
}; 
