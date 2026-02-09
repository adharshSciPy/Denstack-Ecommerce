'use client';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string | number; // Support both string (MongoDB) and number IDs
  name: string;
  price: number;
  image: string;
  stock?: number;
  category?: string;
  discount?: number;
  productId?: string;
}

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  onToggleLike: (id: string | number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: string | number) => void;
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

  // Calculate final price with discount
  const price = product.price ?? 0;
  const finalPrice = product.discount
    ? price - (price * product.discount / 100)
    : price;

  const isOutOfStock = product.stock !== undefined && product.stock === 0;

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

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label={isLiked ? "Unlike product" : "Like product"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${isLiked
                ? 'fill-blue-600 stroke-blue-600 scale-110'
                : 'stroke-gray-600 group-hover:stroke-blue-600'
              }`}
          />
          {isLiked && (
            <span className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
          )}
        </button>

        {/* Quick view badge on hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 left-2 right-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 text-center">
              Quick View
            </div>
          </div>
        )}
      </div>

      <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-gray-900 transition-colors">
        {product.name}
      </h3>

      {/* Category */}
      {product.productId && (
        <p className="text-xs text-gray-500 mb-2">{product.productId}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <p className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
            ₹{finalPrice.toFixed(2)}
          </p>
          {product.discount && (
            <p className="text-xs text-gray-500 line-through">
              ₹{product.price.toFixed(2)}
            </p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={`relative px-4 py-1.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden ${isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
                ? 'bg-green-600 text-white scale-95'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95'
            }`}
        >
          <span className={`inline-block transition-all duration-300 ${isAdding ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            ✓
          </span>
          {isAdding && !isOutOfStock && (
            <span className="absolute inset-0 bg-green-700 animate-ping rounded-full opacity-75" />
          )}
        </button>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}