import { useState, useEffect } from 'react';
import { GalleryProductCard } from './ProductCard';
import { Product } from '../types/assistant';

interface ProductGalleryProps {
  products: Product[];
  isLoading?: boolean;
  onBackToChat?: () => void;
  onAskQuestion?: (productId: string) => void;
}

export const ProductGallery = ({ 
  products, 
  isLoading = false, 
  onBackToChat, 
  onAskQuestion 
}: ProductGalleryProps) => {
  // State to track how many products to display
  const [displayCount, setDisplayCount] = useState(3);
  
  // Log when products change
  useEffect(() => {
    console.log(`[ProductGallery] Products updated: ${products.length} products available`);
    
    if (products.length === 0) {
      console.log('[ProductGallery] Empty product list received');
    }
    
    // Reset display count when products change
    setDisplayCount(3);
  }, [products]);
  
  // Log when loading state changes
  useEffect(() => {
    if (isLoading) {
      console.log('[ProductGallery] Loading products...');
    } else {
      console.log('[ProductGallery] Loading complete');
    }
  }, [isLoading]);
  
  // Get the products to display based on current display count
  const displayedProducts = products.slice(0, displayCount);
  const hasMoreProducts = products.length > displayCount;
  
  const handleLoadMore = () => {
    const newCount = displayCount + 3;
    console.log(`[ProductGallery] Loading more products: ${newCount} of ${products.length}`);
    setDisplayCount(newCount);
  };
  
  const handleAskQuestion = (productId: string) => {
    if (!onAskQuestion) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    onAskQuestion(productId);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Recommended Products
        </h2>
        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-primary hover:text-blue-600 transition-colors"
            aria-label="Back to chat"
          >
            Back to Chat
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-center px-4">
          No products found. Try adjusting your preferences.
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0 flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <GalleryProductCard
                  key={product.id}
                  product={product}
                  onAskQuestion={handleAskQuestion}
                />
              ))}
            </div>
          </div>
          
          {hasMoreProducts && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 