'use client';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Navigation from '../components/Navigation';

interface BrandDetailPageProps {
  brandId: number;
  brandName: string;
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToBrands: () => void;
  onCartClick: () => void;
  likedProducts: Set<number>;
  onToggleLike: (id: number) => void;
  onProductClick?: (productId: number) => void;
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

export default function BrandDetailPage({
  brandId = 0,
  brandName = 'Brand',
  cartCount = 0,
  onCartCountChange = () => {},
  onBackToBrands = () => {},
  onCartClick = () => {},
  likedProducts = new Set(),
  onToggleLike = () => {},
  onProductClick,
  onBrandClick = () => {},
  onBuyingGuideClick = () => {},
  onEventsClick = () => {},
  onMembershipClick = () => {},
  onFreebiesClick = () => {},
  onBestSellerClick = () => {},
  onClinicSetupClick = () => {},
  onFavoritesClick = () => {},
  onOrdersClick = () => {},
  onAccountClick = () => {},
  favoritesCount = 0,
}: BrandDetailPageProps) {
  // Mock products for this brand
  const products = Array.from({ length: 24 }, (_, i) => ({
    id: brandId * 100 + i + 1,
    name: `${brandName} Premium Dental Equipment ${i + 1}`,
    price: 789.67 + (i * 50),
    image: "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400",
  }));

  const addToCart = () => {
    onCartCountChange(cartCount + 1);
  };

  // Brand information
  const brandInfo = {
    description: `${brandName} is a leading manufacturer of high-quality dental equipment and supplies. With decades of experience, they provide innovative solutions for dental professionals worldwide.`,
    founded: '1985',
    country: 'USA',
    specialties: ['Dental Instruments', 'Surgical Equipment', 'Implants', 'Orthodontics'],
    certifications: ['ISO 13485', 'FDA Approved', 'CE Certified'],
  };

  return (
    <div className="min-h-screen bg-white">
    
      <Navigation 
        currentPage="allbrands"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBackToBrands}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Brands</span>
        </button>

        {/* Brand Header */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Brand Logo */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center p-6 flex-shrink-0">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {brandName.charAt(0)}
                </div>
              </div>

              {/* Brand Info */}
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {brandName}
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {brandInfo.description}
                </p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Founded:</span>
                    <span className="ml-2 font-semibold text-gray-900">{brandInfo.founded}</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Origin:</span>
                    <span className="ml-2 font-semibold text-gray-900">{brandInfo.country}</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Products:</span>
                    <span className="ml-2 font-semibold text-gray-900">{products.length}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties & Certifications */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Specialties */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {brandInfo.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {brandInfo.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Products by {brandName}
              </h2>
              <p className="text-gray-600 mt-2">
                Explore our complete range of {products.length} products
              </p>
            </div>

            {/* Filter/Sort */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Best Selling</option>
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
                  isLiked={likedProducts.has(product.id)}
                  onToggleLike={onToggleLike}
                  onAddToCart={addToCart}
                  onProductClick={onProductClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center animate-fade-in">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95">
            Load More Products
          </button>
        </div>
      </main>

    
    </div>
  );
}
