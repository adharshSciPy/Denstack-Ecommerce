'use client';
import { Heart } from 'lucide-react';

interface Product {
  id: string | number;
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
  isLoadingLike?: boolean;
  onToggleLike: (id: string | number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: string | number) => void;
}

export default function ProductCard({
  product,
  isLiked,
  isLoadingLike = false,
  onToggleLike,
  onProductClick,
}: ProductCardProps) {

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoadingLike) return;
    onToggleLike(product.id);
  };

  const handleCardClick = () => {
    if (onProductClick) onProductClick(product.id);
  };

  const price      = product.price ?? 0;
  const finalPrice = product.discount ? price - (price * product.discount / 100) : price;
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

        {/* Overlay */}
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
          disabled={isLoadingLike}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300
            ${isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'}
            ${isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoadingLike ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          )}
        </button>

        {/* View Details hint on hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 left-2 right-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 text-center">
              View Details
            </div>
          </div>
        )}
      </div>

      <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-gray-900 transition-colors">
        {product.name}
      </h3>

      {product.productId && (
        <p className="text-xs text-gray-500 mb-2">{product.productId}</p>
      )}

      {/* Price only — no Add button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <p className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
            ₹{finalPrice.toFixed(2)}
          </p>
          {product.discount && (
            <p className="text-xs text-gray-500 line-through">₹{price.toFixed(2)}</p>
          )}
        </div>
        {isOutOfStock ? (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200">
            Sold Out
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            View →
          </span>
        )}
      </div>
    </div>
  );
}