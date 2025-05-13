import axios from 'axios';
import type { Product } from '../types/assistant';
import type { ProductFilters } from '../types/actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 'demo';

// Mock product data for development
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

/**
 * Fetches product recommendations from the backend API with automatic retry logic
 * @param query - The search query string
 * @param limit - Optional limit on number of recommendations to return
 * @returns Promise<Product[]> - Array of recommended products
 */
export async function getProductRecommendations({
  query,
  limit = 3,
  client_id = CLIENT_ID,
  filters = undefined
}: {
  query: string;
  limit?: number;
  client_id?: string;
  filters?: Record<string, any>;
}): Promise<Product[]> {
  try {
    const response = await axios.post(
      `${API_URL}/recommend`,
      {
        query,
        limit,
        client_id,
        filters
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    throw error;
  }
}

export async function getRecommendations(
  filters: ProductFilters,
  clientId?: string
): Promise<Product[]> {
  try {
    const response = await axios.post(
      `${API_URL}/recommend`,
      {
        filters,
        clientId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.products.map((product: any) => ({
      ...product,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price),
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get product recommendations');
  }
}

export async function searchProducts(
  query: string,
  clientId?: string
): Promise<Product[]> {
  try {
    const response = await axios.post(
      `${API_URL}/search`,
      {
        query,
        clientId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.products.map((product: any) => ({
      ...product,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price),
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
} 