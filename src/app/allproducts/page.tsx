'use client';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useRouter } from 'next/navigation';

interface AllProductsPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick: () => void;
  likedProducts: Set<string>;
  // Accept string|number to remain compatible with ProductCard callbacks
  onToggleLike: (id: string | number) => void;
  onProductClick?: (productId: string | number) => void;
  onBrandClick: () => void;
  onBuyingGuideClick: () => void;
  onEventsClick: () => void;
  onMembershipClick: () => void;
  onFreebiesClick: () => void;
  onBestSellerClick: () => void;
  onClinicSetupClick: () => void;
  onFavoritesClick: () => void;
  onOrdersClick: () => void;
  onAccountClick: () => void;
  favoritesCount: number;
}

export default function AllProductsPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  likedProducts = new Set<string>(),
  onToggleLike,
  onProductClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  favoritesCount,
}: AllProductsPageProps) {
  const products = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    name: 'Rovena Riva Series 6 Pcs. Wide Seating Claret Red Chair',
    price: 789.67,
    image: "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400",
  }));

  const addToCart = () => {
    onCartCountChange(cartCount + 1);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            All Products
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our complete collection of {products.length} products
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <select className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Best Selling</option>
          </select>

          <select className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors">
            <option>All Categories</option>
            <option>Dental Equipment</option>
            <option>Surgical Instruments</option>
            <option>Medical Supplies</option>
            <option>Laboratory Equipment</option>
          </select>

          <select className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors">
            <option>All Brands</option>
            <option>Brand A</option>
            <option>Brand B</option>
            <option>Brand C</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard
                product={product}
                isLiked={likedProducts.has(String(product.id))}
                onToggleLike={onToggleLike}
                onAddToCart={addToCart}
                onProductClick={onProductClick}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 flex justify-center animate-fade-in">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95">
            Load More Products
          </button>
        </div>
      </main>

    </div>
  );
}
