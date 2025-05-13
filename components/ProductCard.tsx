import type { Product } from '../types/assistant';

interface ProductCardProps {
  product: Product;
  onAskQuestion?: (productId: string) => void;
}

export const ChatProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden shadow-sm bg-white p-2 space-x-3 max-w-xs">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 text-sm truncate mb-1">{product.name}</h3>
        <span className="text-base font-semibold text-gray-900 mb-2">{product.price} {product.currency}</span>
        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors w-fit"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export const GalleryProductCard = ({ product, onAskQuestion }: ProductCardProps) => {
  return (
    <div className="flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative pt-[100%]">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              {product.price} {product.currency}
            </span>
            {product.category && (
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {product.category}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Details
            </a>
            {onAskQuestion && (
              <button
                onClick={() => onAskQuestion(product.id)}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ask Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
