import { Heart } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  likedProducts: Set<number>;
  onToggleLike: (id: number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: number) => void;
}

export default function ProductGrid({ likedProducts, onToggleLike, onAddToCart, onProductClick }: ProductGridProps) {
  const products = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: 'Rovena Riva Series 6 Pcs. Wide Seating Claret Red Chair',
    price: 789.67,
    image: "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400",
  }));

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h2 className="text-3xl lg:text-4xl text-gray-900 font-semibold">Featured Products</h2>
        <button className="hidden sm:flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-300 group hover:gap-3">
          <span className="text-lg font-medium">View all</span>
          <svg 
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <ProductCard
              product={product}
              isLiked={likedProducts.has(product.id)}
              onToggleLike={onToggleLike}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          </div>
        ))}
      </div>

      <button className="sm:hidden w-full mt-8 flex items-center justify-center gap-2 py-3 text-gray-900 hover:text-blue-600 transition-colors border border-gray-300 rounded-lg hover:border-blue-600 hover:shadow-md active:scale-95">
        <span className="font-medium">View all</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}