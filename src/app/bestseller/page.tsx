'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import { Heart, ChevronDown, Star, TrendingUp, Award, Zap } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface BestSellerPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onClinicSetupClick?: () => void;
  onProductClick?: (productId: number) => void;
  favoritesCount?: number;
}

interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  material: string;
  originalPrice: number;
  clinicDiscountPrice: number;
  clinicDiscountPercentage: number;
  doctorDiscountPrice: number;
  doctorDiscountPercentage: number;
  stock: number;
}

interface MainCategory {
  _id: string;
  categoryName: string;
  description: string;
  parentCategory: null;
  level: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mainCategoryId: string;
  __v: number;
}

interface SubCategory {
  _id: string;
  categoryName: string;
  description: string;
  mainCategory: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subCategoryId: string;
  __v: number;
}

interface Brand {
  _id: string;
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  __v: number;
}

interface ApiProduct {
  _id: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalOrders: number;
  productId: string;
  name: string;
  description: string;
  variants: ProductVariant[];
  image: string[];
  status: string;
  mainCategory: MainCategory;
  brand: Brand;
  subCategory?: SubCategory;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  image: string;
  isLiked: boolean;
  rating: number;
  salesCount: number;
  badge?: 'trending' | 'top-rated' | 'best-value';
  onToggleLike: () => void;
  onAddToCart: () => void;
  onProductClick: () => void;
}

function ProductCard({ 
  name, 
  price, 
  originalPrice,
  discountPercentage,
  image, 
  isLiked, 
  rating,
  salesCount,
  badge,
  onToggleLike, 
  onAddToCart,
  onProductClick
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeConfig = () => {
    switch (badge) {
      case 'trending':
        return {
          icon: TrendingUp,
          text: 'TRENDING',
          gradient: 'from-orange-500 to-red-600',
          color: 'text-orange-600'
        };
      case 'top-rated':
        return {
          icon: Award,
          text: 'TOP RATED',
          gradient: 'from-purple-500 to-indigo-600',
          color: 'text-purple-600'
        };
      case 'best-value':
        return {
          icon: Zap,
          text: 'BEST VALUE',
          gradient: 'from-green-500 to-emerald-600',
          color: 'text-green-600'
        };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig();

  return (
    <div 
      className="group relative bg-white rounded-2xl border-2 border-blue-600 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] animate-fade-in cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onProductClick}
    >
      {/* Badge */}
      {badgeConfig && (
        <div className={`absolute top-3 left-3 z-10 bg-gradient-to-r ${badgeConfig.gradient} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
          <badgeConfig.icon className="w-3 h-3" />
          {badgeConfig.text}
        </div>
      )}

      {/* Discount Badge */}
      {discountPercentage && discountPercentage > 0 && (
        <div className="absolute top-3 right-12 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
          {discountPercentage}% OFF
        </div>
      )}

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
          onError={(e) => {
            // Fallback image if the URL is invalid
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating & Sales */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
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
          </div>
          <span className="text-xs text-gray-600 font-medium">{salesCount.toLocaleString()}+ sold</span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-medium text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          {originalPrice && (
            <p className="text-gray-400 line-through text-sm">
              {originalPrice}
            </p>
          )}
          <p className="text-blue-600 font-bold text-lg">{price}</p>
        </div>

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

export default function BestSellerPage({ 
  cartCount, 
  onCartCountChange, 
  onBackToHome,
  onCartClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onClinicSetupClick,
  onProductClick,
  favoritesCount
}: BestSellerPageProps) {
  const router = useRouter();
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceRanges = ['All Prices', 'Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Over ₹2000'];
  const ratings = ['All Ratings', '5 Stars', '4+ Stars', '3+ Stars'];
  const sortOptions = [
    'Recommended', 
    'Best Selling', 
    'Price: Low to High', 
    'Price: High to Low', 
    'Top Rated',
    'Newest First'
  ];

  // Fetch bestseller products from API
  useEffect(() => {
    fetchBestSellerProducts();
  }, []);

  // Extract unique brands from products
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach(product => {
      if (product.brand?.name) {
        brands.add(product.brand.name);
      }
    });
    return ['All Brands', ...Array.from(brands).sort()];
  }, [allProducts]);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Apply brand filter
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => 
        product.brand?.name === selectedBrand
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== 'All Prices') {
      filtered = filtered.filter(product => {
        if (!product.variants || product.variants.length === 0) return false;
        
        const firstVariant = product.variants[0];
        const bestPrice = firstVariant.doctorDiscountPrice || firstVariant.clinicDiscountPrice || firstVariant.originalPrice;
        
        switch (selectedPriceRange) {
          case 'Under ₹500':
            return bestPrice < 500;
          case '₹500 - ₹1000':
            return bestPrice >= 500 && bestPrice <= 1000;
          case '₹1000 - ₹2000':
            return bestPrice >= 1000 && bestPrice <= 2000;
          case 'Over ₹2000':
            return bestPrice > 2000;
          default:
            return true;
        }
      });
    }

    // Apply rating filter
    if (selectedRating !== 'All Ratings') {
      filtered = filtered.filter(product => {
        // Since we don't have actual ratings in API, we'll use the random rating from convertToProductCardProps
        // For now, we'll filter based on a simulated rating
        const rating = 4 + Math.floor(Math.random() * 2); // Same as in convertToProductCardProps
        
        switch (selectedRating) {
          case '5 Stars':
            return rating === 5;
          case '4+ Stars':
            return rating >= 4;
          case '3+ Stars':
            return rating >= 3;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Best Selling':
          return b.totalQuantitySold - a.totalQuantitySold;
        case 'Price: Low to High':
          const priceA = a.variants[0]?.doctorDiscountPrice || a.variants[0]?.clinicDiscountPrice || a.variants[0]?.originalPrice || 0;
          const priceB = b.variants[0]?.doctorDiscountPrice || b.variants[0]?.clinicDiscountPrice || b.variants[0]?.originalPrice || 0;
          return priceA - priceB;
        case 'Price: High to Low':
          const priceA2 = a.variants[0]?.doctorDiscountPrice || a.variants[0]?.clinicDiscountPrice || a.variants[0]?.originalPrice || 0;
          const priceB2 = b.variants[0]?.doctorDiscountPrice || b.variants[0]?.clinicDiscountPrice || b.variants[0]?.originalPrice || 0;
          return priceB2 - priceA2;
        case 'Top Rated':
          // Since we don't have actual ratings, sort by sales count
          return b.totalQuantitySold - a.totalQuantitySold;
        case 'Newest First':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Recommended':
        default:
          // Default: sort by sales count (best sellers first)
          return b.totalQuantitySold - a.totalQuantitySold;
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, selectedBrand, selectedPriceRange, selectedRating, sortBy]);

  const fetchBestSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8004/api/v1/landing/topSelling/getAll');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data exists and has the expected structure
      if (data && data.data) {
        setAllProducts(data.data);
        setFilteredProducts(data.data);
        toast.success(data.message || 'Products loaded successfully');
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.error('Error fetching bestseller products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const convertToProductCardProps = (apiProduct: ApiProduct, index: number): ProductCardProps => {
    // Get the first variant for pricing
    const firstVariant = apiProduct.variants[0];
    
    // Get the best price (doctor discount price if available, otherwise clinic discount price)
    const bestPrice = firstVariant.doctorDiscountPrice || firstVariant.clinicDiscountPrice || firstVariant.originalPrice;
    const originalPrice = firstVariant.originalPrice;
    const discountPercentage = firstVariant.doctorDiscountPercentage || firstVariant.clinicDiscountPercentage || 0;
    
    // Get the first image or use a fallback
    const imageUrl = apiProduct.image && apiProduct.image.length > 0 
      ? `http://localhost:8004${apiProduct.image[0]}`
      : 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';

    // Determine badge based on total quantity sold
    const getBadgeType = (): 'trending' | 'top-rated' | 'best-value' | undefined => {
      const totalSold = apiProduct.totalQuantitySold;
      if (totalSold > 50) return 'trending';
      if (totalSold > 30) return 'top-rated';
      if (totalSold > 20) return 'best-value';
      return undefined;
    };

    return {
      id: apiProduct._id,
      name: apiProduct.name,
      price: `₹${bestPrice.toFixed(2)}`,
      originalPrice: discountPercentage > 0 ? `₹${originalPrice.toFixed(2)}` : undefined,
      discountPercentage,
      image: imageUrl,
      isLiked: likedProducts.has(apiProduct._id),
      rating: 4 + Math.floor(Math.random() * 2), // Random 4-5 stars for bestsellers
      salesCount: apiProduct.totalQuantitySold,
      badge: getBadgeType(),
      onToggleLike: () => toggleLike(apiProduct._id),
      onAddToCart: () => handleAddToCart(apiProduct.name, bestPrice),
      onProductClick: () => handleProductClick(apiProduct._id)
    };
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(productId);
        toast.success('Added to favorites!');
      }
      return newSet;
    });
  };

  const handleAddToCart = (productName: string, price: number) => {
    onCartCountChange(cartCount + 1);
    toast.success('🎉 Added to cart!', {
      description: `${productName.slice(0, 40)}... - ₹${price.toFixed(2)}`,
      duration: 2000,
    });
  };

  const handleProductClick = (productId: string) => {
    router.push(`/productdetailpage/${productId}`);
  };

  const handleLoadMore = () => {
    // For now, just reload the data
    // In a real app, you would implement pagination
    fetchBestSellerProducts();
    toast.info('Loading more products...');
  };

  const clearAllFilters = () => {
    setSelectedBrand('All Brands');
    setSelectedPriceRange('All Prices');
    setSelectedRating('All Ratings');
    setSortBy('Recommended');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading bestseller products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">Error: {error}</p>
          <button 
            onClick={fetchBestSellerProducts}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Navigation */}
      <Navigation 
        currentPage="bestseller"
      />

      {/* Hero Banner */}
      <div className="w-full px-4 md:px-6 lg:px-8 mt-6 animate-fade-in">
        <div className="max-w-[1760px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[3.5/1]">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200" 
              alt="Best Sellers & Hot Products"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent" />
            
            {/* Hero Text */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <span className="text-white font-bold">TRENDING NOW</span>
                </div>
              </div>
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                Hot Selling Products
              </h1>
              <p className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-3xl drop-shadow-lg">
                Top-rated dental products trusted by professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8">
        <div className="bg-blue-600 rounded-2xl shadow-2xl p-6 md:p-12 animate-fade-in">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            Hot Selling Home Offer Zone
          </h2>
          <div className="text-white/95 text-sm md:text-base space-y-4">
            <p className="font-semibold">
              Welcome to Dentalkart's exclusive "Hot Selling" category, curated to meet the dynamic needs of dental professionals.
            </p>
            <p>
              Our meticulously selected range includes products from renowned dental brands such as Dentsply, Waldent, GDC, IDENTical, 
              Zhermack, Endoking, Mani, 3M, Ivoclar, and many more. Designed to cater to various fields of dentistry, this collection 
              embodies excellence, innovation, and reliability.
            </p>
            
            <h3 className="text-white text-xl font-bold mt-6 mb-3">Why Choose Our Hot Selling Products?</h3>
            
            <div className="space-y-3">
              <p><strong className="text-white">Unmatched Quality:</strong> Our hot selling products boast uncompromised quality, 
              ensuring that you receive instruments, materials, and equipment that meet the highest industry standards.</p>
              
              <p><strong className="text-white">Diverse Range:</strong> From diagnostics to treatment and beyond, our curated 
              selection spans across diverse fields of dentistry, providing you with a comprehensive array of solutions for your practice.</p>
              
              <p><strong className="text-white">Top Dental Brands:</strong> Elevate your practice with products from top dental 
              brands globally. Each item is handpicked to enhance your professional capabilities and contribute to the success of your 
              dental procedures.</p>
              
              <p><strong className="text-white">Innovation at Its Core:</strong> Stay ahead in the ever-evolving field of dentistry. 
              Our hot selling category features cutting-edge innovations, keeping you at the forefront of the latest advancements.</p>
            </div>

            <h3 className="text-white text-xl font-bold mt-6 mb-3">Frequently Asked Questions (FAQs):</h3>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-white">Q1: Are these products suitable for all dental practices?</p>
                <p>A1: Absolutely! Our hot selling category is curated to cater to the diverse needs of dental professionals across 
                various practice sizes and specialties.</p>
              </div>
              
              <div>
                <p className="font-semibold text-white">Q2: How can I be assured of the quality of the products?</p>
                <p>A2: Dentalkart is committed to excellence. We source our products from trusted dental brands, ensuring that each 
                item meets stringent quality standards. Additionally, customer reviews and ratings offer insights into the experiences 
                of your peers.</p>
              </div>
              
              <div>
                <p className="font-semibold text-white">Q3: Can I find exclusive deals or promotions in the hot selling category?</p>
                <p>A3: Yes, indeed! Dentalkart frequently runs promotions and exclusive deals on products within the hot selling category. 
                Keep an eye on our promotions section for limited-time offers and discounts.</p>
              </div>
            </div>

            <p className="mt-6">
              Explore Dentalkart's "Hot Selling" category today and revolutionize your dental practice with the best-in-class products. 
              Elevate your patient care, streamline your procedures, and stay at the forefront of dental innovation.
            </p>
            
            <button className="text-white underline font-semibold hover:text-blue-200 transition-colors mt-4">
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-semibold text-sm md:text-base">FILTERS BY</span>
              <span className="text-gray-500 text-sm">{filteredProducts.length} products found</span>
            </div>
            {(selectedBrand !== 'All Brands' || selectedPriceRange !== 'All Prices' || selectedRating !== 'All Ratings') && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Brands Filter */}
            <div className="relative">
              <button
                onClick={() => setShowBrandFilter(!showBrandFilter)}
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-xl text-gray-900 font-medium text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span className="truncate">Brand: {selectedBrand}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBrandFilter ? 'rotate-180' : ''}`} />
              </button>
              {showBrandFilter && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-600 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                  {allBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setShowBrandFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-black text-left hover:bg-blue-50 transition-colors ${
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
                <span className="truncate">Price: {selectedPriceRange}</span>
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
                      className={`w-full px-4 py-2.5 text-black text-left hover:bg-blue-50 transition-colors ${
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
                <span className="truncate">Rating: {selectedRating}</span>
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
                      className={`w-full px-4 py-2.5 text-black text-left hover:bg-blue-50 transition-colors ${
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
                      className={`w-full px-4 py-2.5 text-black text-left hover:bg-blue-50 transition-colors ${
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
                  Brand: {selectedBrand}
                  <button 
                    onClick={() => setSelectedBrand('All Brands')} 
                    className="hover:text-blue-900 ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedPriceRange !== 'All Prices' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Price: {selectedPriceRange}
                  <button 
                    onClick={() => setSelectedPriceRange('All Prices')} 
                    className="hover:text-blue-900 ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedRating !== 'All Ratings' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Rating: {selectedRating}
                  <button 
                    onClick={() => setSelectedRating('All Ratings')} 
                    className="hover:text-blue-900 ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found with the selected filters</p>
            <button 
              onClick={clearAllFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard
                    {...convertToProductCardProps(product, index)}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button - Only show if there are products */}
            <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: '1000ms' }}>
              <button 
                onClick={handleLoadMore}
                className="px-12 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                Load More Products
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}