'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Heart, ChevronDown, Star, Gift, Tag } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface FreebiesPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onProductClick?: (productId: number) => void;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  isLiked: boolean;
  freebie: string;
  rating: number;
  onToggleLike: () => void;
  onAddToCart: () => void;
  onProductClick: () => void;
}

function ProductCard({ 
  name, 
  price, 
  image, 
  isLiked, 
  freebie,
  rating,
  onToggleLike, 
  onAddToCart,
  onProductClick
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-2xl border-2 border-blue-600 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] animate-fade-in cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onProductClick}
    >
      {/* Free Gift Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg pointer-events-none">
        <Gift className="w-3 h-3" />
        FREE GIFT
      </div>

      {/* Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike();
        }}
        className={`
          absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white
          flex items-center justify-center transition-all duration-300 shadow-lg
          ${isLiked 
            ? 'text-red-500 scale-110' 
            : 'text-gray-400 hover:text-red-500 hover:scale-110'
          }
        `}
      >
        <Heart 
          className={`w-5 h-5 transition-all ${
            isLiked ? 'fill-red-500' : 'fill-none'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden p-4">
        <img 
          src={image} 
          alt={name}
          className={`w-full h-full object-contain transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`w-4 h-4 ${
                i < rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({rating}.0)</span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Freebie Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
          <div className="flex items-start gap-1.5">
            <Tag className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-green-700 font-medium line-clamp-2">{freebie}</p>
          </div>
        </div>

        {/* Price */}
        <p className="text-blue-600 font-bold text-lg mb-3">{price}</p>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className={`
            w-full py-2.5 px-4 rounded-xl font-bold text-sm
            transition-all duration-300
            ${isHovered 
              ? 'bg-blue-700 text-white shadow-xl translate-y-[-2px]' 
              : 'bg-blue-600 text-white shadow-lg'
            }
            hover:shadow-2xl active:scale-95
          `}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function FreebiesPage({ 
  cartCount, 
  onCartCountChange, 
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onBestSellerClick,
  onClinicSetupClick,
  onProductClick
}: FreebiesPageProps) {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set([0, 2, 5, 8]));
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const brands = ['All Brands', 'Rovena', 'DentalPro', 'MediEquip', 'HealthCare', 'DentalTech'];
  const priceRanges = ['All Prices', 'Under $500', '$500 - $1000', '$1000 - $2000', 'Over $2000'];
  const ratings = ['All Ratings', '5 Stars', '4+ Stars', '3+ Stars'];
  const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Most Popular'];

  // Sample products with freebies
  const freebieProducts = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Rovena Riva Series ${i + 1} Pcs. Wide Seating Claret Red Chair with Premium Comfort`,
    price: `$${(789 + i * 50).toFixed(2)}`,
    image: "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400",
    freebie: i % 3 === 0 
      ? 'Free Premium Dental Kit worth $150' 
      : i % 3 === 1 
        ? 'Free Maintenance Service for 1 Year'
        : 'Free Installation + 2 Year Warranty',
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
  }));

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
    toast.success(likedProducts.has(productId) ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleAddToCart = (productName: string) => {
    onCartCountChange(cartCount + 1);
    toast.success('🎉 Added to cart!', {
      description: `${productName.slice(0, 40)}...`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
    

      {/* Navigation */}
      <Navigation 
        currentPage="freebies"
      />

      {/* Hero Banner */}
      <div className="w-full px-4 md:px-6 lg:px-8 mt-6 animate-fade-in">
        <div className="max-w-[1760px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[3.5/1]">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200" 
              alt="Freebies & Special Offers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />
            
            {/* Hero Text */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                Exclusive Freebies Collection
              </h1>
              <p className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-3xl drop-shadow-lg">
                Get amazing free gifts with premium dental products!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8">
        <div className="bg-blue-600 rounded-2xl shadow-2xl p-6 md:p-12 animate-fade-in">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            Freebies Home Offer Zone
          </h2>
          <div className="text-white/95 text-sm md:text-base space-y-4">
            <p className="font-semibold">
              Dentalkart's Exclusive Freebies Collection: Elevate Your Practice with Extra Perks!
            </p>
            <p>
              Dentalkart's newest innovation, where dental professionals like you can unlock a world of bonuses and complimentary delights! 
              We're thrilled to present our latest addition: the Freebies Category – your gateway to unparalleled value and unbeatable rewards.
            </p>
            <p>
              At Dentalkart, we understand the importance of going the extra mile to support our valued customers in their quest for excellence. 
              That's why we've curated a diverse array of premium dental products, each accompanied by enticing freebies designed to enhance 
              your practice and elevate your professional journey.
            </p>
            <p>
              Picture this: You're browsing through our Freebies Category, and your eyes are met with a treasure trove of must-have dental essentials. 
              From cutting-edge instruments to top-of-the-line consumables, every item in this collection comes with an irresistible bonus – absolutely free!
            </p>
            <p>
              Whether you're restocking your clinic or exploring innovative tools to enhance patient care, Dentalkart's Freebies Category 
              has something special in store for you.
            </p>
            <button className="text-white underline font-semibold hover:text-blue-200 transition-colors mt-2">
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-700 font-semibold text-sm md:text-base">FILTERS BY</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Brands Filter */}
            <div className="relative">
              <button
                onClick={() => setShowBrandFilter(!showBrandFilter)}
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl text-gray-900 font-medium text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span>Brands</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBrandFilter ? 'rotate-180' : ''}`} />
              </button>
              {showBrandFilter && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-600 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setShowBrandFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        selectedBrand === brand ? 'bg-blue-100 font-semibold' : ''
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl text-gray-900 font-medium text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span>Price Range</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`} />
              </button>
              {showPriceFilter && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-600 rounded-xl shadow-xl z-20">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setSelectedPriceRange(range);
                        setShowPriceFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        selectedPriceRange === range ? 'bg-blue-100 font-semibold' : ''
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <button
                onClick={() => setShowRatingFilter(!showRatingFilter)}
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl text-gray-900 font-medium text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span>Rating</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showRatingFilter ? 'rotate-180' : ''}`} />
              </button>
              {showRatingFilter && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-600 rounded-xl shadow-xl z-20">
                  {ratings.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setSelectedRating(rating);
                        setShowRatingFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        selectedRating === rating ? 'bg-blue-100 font-semibold' : ''
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By */}
            <div className="relative">
              <button
                onClick={() => setShowSortFilter(!showSortFilter)}
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl text-gray-900 font-medium text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span className="truncate">Sort by - {sortBy}</span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${showSortFilter ? 'rotate-180' : ''}`} />
              </button>
              {showSortFilter && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-600 rounded-xl shadow-xl z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        sortBy === option ? 'bg-blue-100 font-semibold' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBrand !== 'All Brands' || selectedPriceRange !== 'All Prices' || selectedRating !== 'All Ratings') && (
            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedBrand !== 'All Brands' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('All Brands')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {selectedPriceRange !== 'All Prices' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('All Prices')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {selectedRating !== 'All Ratings' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {selectedRating}
                  <button onClick={() => setSelectedRating('All Ratings')} className="hover:text-blue-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {freebieProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard
                {...product}
                isLiked={likedProducts.has(product.id)}
                onToggleLike={() => toggleLike(product.id)}
                onAddToCart={() => handleAddToCart(product.name)}
                onProductClick={() => onProductClick?.(product.id)}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <button className="px-12 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all hover:shadow-2xl hover:scale-105 active:scale-95">
            Load More Products
          </button>
        </div>
      </main>

    </div>
  );
}