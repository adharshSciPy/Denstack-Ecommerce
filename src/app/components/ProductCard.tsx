import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: number) => void;
}

export default function ProductCard({ product, isLiked, onToggleLike, onAddToCart, onProductClick }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onToggleLike(product.id);
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group border-2 border-transparent hover:border-blue-600 rounded-2xl p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white cursor-pointer"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label={isLiked ? "Unlike product" : "Like product"}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked 
                ? 'fill-blue-600 stroke-blue-600 scale-110' 
                : 'stroke-gray-600 group-hover:stroke-blue-600'
            }`}
          />
          {isLiked && (
            <span className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
          )}
        </button>

        {/* Quick view badge on hover */}
        <div className="absolute bottom-2 left-2 right-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 text-center">
            Quick View
          </div>
        </div>
      </div>

      <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-gray-900 transition-colors">
        {product.name}
      </h3>

      <div className="flex items-center justify-between gap-2">
        <p className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`relative px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden ${
            isAdding 
              ? 'bg-green-600 text-white scale-95' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          <span className={`inline-block transition-all duration-300 ${isAdding ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
            Add
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            ✓
          </span>
          {isAdding && (
            <span className="absolute inset-0 bg-green-700 animate-ping rounded-full opacity-75" />
          )}
        </button>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}