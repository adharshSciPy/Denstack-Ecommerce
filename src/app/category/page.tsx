'use client';
import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import { Search, ChevronRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import baseUrl from '../baseUrl';

// Define all interfaces at the top
interface CategoryBrowsePageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onFullStoreDirectoryClick?: () => void;
  likedProducts?: Set<string>;
  onToggleLike?: (productId: string) => void;
}

interface ProductVariant {
  _id: string;
  size?: string;
  color?: string;
  material?: string;
  price?: number;
  originalPrice?: number;
  clinicDiscountPrice?: number;
  doctorDiscountPrice?: number;
  stock?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock: boolean;
  productId?: string;
  subCategoryId?: string;
  variants?: ProductVariant[];
  originalPrice?: number;
  clinicDiscountPrice?: number;
  doctorDiscountPrice?: number;
  stock?: number;
}

interface Brand {
  _id?: string;
  name: string;
  image?: string;
  products?: any[];
}

interface SubCategory {
  _id?: string;
  categoryName: string;
  brands?: Brand[];
}

interface Category {
  _id?: string;
  categoryName: string;
  subCategories?: SubCategory[];
}

// Product Card Props
interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  isLoadingLike?: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
}

// Product Card Component
function ProductCard({ 
  product, 
  isLiked, 
  isLoadingLike = false, 
  onToggleLike, 
  onAddToCart,
  isAddingToCart = false 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock Badge */}
      {product.inStock && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          In Stock
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoadingLike) {
            onToggleLike();
          }
        }}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
          isLiked
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
        } ${isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoadingLike}
      >
        {isLoadingLike ? (
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        )}
      </button>

      {/* Product Image */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-image.png';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">{product.rating || 0}</span>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-blue-600 mb-3">
          ₹{product.price?.toLocaleString() || '-'}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          disabled={isAddingToCart}
          className={`
            w-full py-2 px-3 rounded-lg font-bold text-sm
            transition-all duration-300
            ${isHovered && !isAddingToCart
              ? 'bg-blue-700 text-white shadow-lg translate-y-[-2px]'
              : 'bg-blue-600 text-white shadow-md'
            }
            ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl active:scale-95'}
          `}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </div>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function CategoryBrowsePage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFullStoreDirectoryClick,
  likedProducts = new Set(),
  onToggleLike
}: CategoryBrowsePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(0);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<string>>(likedProducts);
  const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  
  const router = useRouter();
  const { isLoggedIn: userIsLoggedIn } = useAuth(); // Remove 'user' since it's not in the type

  // API state
  const [categoriesApi, setCategoriesApi] = useState<Category[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, SubCategory[]>>({});
  const [brandsMap, setBrandsMap] = useState<Record<string, Brand[]>>({});
  const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Helper to normalize IDs
  const getId = (val: any): string | undefined => {
    if (!val) return undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.$oid) return String(val.$oid);
      if (val._id && typeof val._id === 'string') return val._id;
      if (val._id && val._id.$oid) return String(val._id.$oid);
      if (val.id) return String(val.id);
    }
    return undefined;
  };

  // Load liked products from localStorage
  useEffect(() => {
    const savedLikedProducts = localStorage.getItem('likedProducts');
    if (savedLikedProducts) {
      try {
        setLocalLikedProducts(new Set(JSON.parse(savedLikedProducts)));
      } catch (error) {
        console.error('Error parsing liked products:', error);
      }
    }
  }, []);

  // Save liked products to localStorage
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
  }, [localLikedProducts]);

  // Map API product to Product interface
  const mapApiProductToProduct = (p: any): Product => {
    // Handle variants
    let variants: ProductVariant[] = [];
    let price = 0;
    let stock = 0;
    
    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      variants = p.variants;
      const firstVariant = p.variants[0];
      price = firstVariant.clinicDiscountPrice ?? 
              firstVariant.discountPrice1 ?? 
              firstVariant.originalPrice ?? 
              0;
      stock = firstVariant.stock || 0;
    } else {
      price = p.clinicDiscountPrice ?? 
              p.doctorDiscountPrice ?? 
              p.originalPrice ?? 
              p.price ?? 
              0;
      stock = p.stock || 0;
    }
    
    const imagePath = Array.isArray(p.image) && p.image.length > 0 
      ? p.image[0] 
      : (typeof p.image === 'string' ? p.image : '');

    const id = getId(p._id) || String(Math.random());

    return {
      _id: id,
      name: p.name || p.title || '',
      price: price,
      image: imagePath ? `${baseUrl.INVENTORY}${imagePath}` : '/placeholder-image.png',
      rating: p.rating || 0,
      inStock: stock > 0,
      productId: p.productId,
      subCategoryId: getId(p.subCategory),
      variants: variants,
      originalPrice: p.originalPrice,
      clinicDiscountPrice: p.clinicDiscountPrice,
      doctorDiscountPrice: p.doctorDiscountPrice,
      stock: stock
    };
  };

  // Fetch all categories with details
  useEffect(() => {
    const fetchAllWithDetails = async () => {
      setLoadingCategories(true);
      setApiError(null);
      try {
        const res = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/main/getWithDetails`);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const json = await res.json();
        const mainCats: Category[] = json.data || [];

        setCategoriesApi(mainCats);

        // Build maps
        const subMap: Record<string, SubCategory[]> = {};
        const brandMap: Record<string, Brand[]> = {};
        const prodMap: Record<string, Product[]> = {};

        for (const cat of mainCats) {
          const subCats: SubCategory[] = cat.subCategories || [];
          if (cat._id) {
            subMap[cat._id] = subCats;
          }

          for (const sub of subCats) {
            const brands: Brand[] = sub.brands || [];
            if (sub._id) {
              brandMap[sub._id] = brands;
            }

            const allProducts: Product[] = [];
            for (const brand of brands) {
              const brandProducts: any[] = brand.products || [];
              allProducts.push(...brandProducts.map(mapApiProductToProduct));
            }
            if (sub._id) {
              prodMap[sub._id] = allProducts;
            }
          }
        }

        setSubCategoriesMap(subMap);
        setBrandsMap(brandMap);
        setProductsMap(prodMap);
      } catch (err: any) {
        setApiError(err.message || 'Error fetching categories');
        toast.error(err.message || 'Error fetching categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchAllWithDetails();
  }, []);

  // Fetch cart count on mount and after auth changes
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token || !userIsLoggedIn) return;

    try {
      const response = await fetch(`${baseUrl.INVENTORY}/api/v1/cart/get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const cartData = data.data;
          const totalItems = cartData.totalItems || 
            cartData.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          onCartCountChange(totalItems);
        }
      } else if (response.status === 401) {
        // Token expired or invalid
        console.log('Auth required for cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [onCartCountChange, userIsLoggedIn]);

  // Fetch cart on mount and when login status changes
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount, userIsLoggedIn]);

  // Add to cart function
  const handleAddToCart = async (product: Product) => {
    try {
      setIsAddingToCart(product._id);

      // Check if user is logged in
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const isLoggedIn = !!token || userIsLoggedIn;

      if (!isLoggedIn) {
        toast.error('Login Required', {
          description: 'Please login to add items to cart',
          action: {
            label: 'Login',
            onClick: () => router.push('/login')
          }
        });
        return;
      }

      // Determine if product has variants
      const hasVariants = product.variants && product.variants.length > 0;
      
      // Create payload based on product type
      const payload: any = {
        productId: product._id,
        quantity: 1
      };

      // Only add variantId if product has variants AND we have a variant
      if (hasVariants && product.variants && product.variants[0]?._id) {
        payload.variantId = product.variants[0]._id;
      }

      console.log('Adding to cart with payload:', payload);

      const response = await fetch(`${baseUrl.INVENTORY}/api/v1/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Cart add response:', data);

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          toast.error('Session expired', {
            description: 'Please login again',
            action: {
              label: 'Login',
              onClick: () => router.push('/login')
            }
          });
          return;
        }
        
        if (response.status === 400) {
          if (data.message?.includes('stock')) {
            toast.error('Out of Stock', {
              description: data.message
            });
          } else {
            toast.error(data.message || 'Failed to add to cart');
          }
          return;
        }
        
        throw new Error(data.message || 'Failed to add to cart');
      }

      // Success - fetch updated cart count
      await fetchCartCount();
      
      toast.success(`${product.name} added to cart!`, {
        action: {
          label: 'View Cart',
          onClick: () => router.push('/cart')
        }
      });

    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(null);
    }
  };

  // Like/Unlike functions
  const handleToggleLike = async (productId: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn = !!token || userIsLoggedIn;

    if (!isLoggedIn) {
      toast.error('Login Required', {
        description: 'Please login to add to favorites',
        action: {
          label: 'Login',
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    const isCurrentlyLiked = localLikedProducts.has(productId);

    // Optimistic update
    setLocalLikedProducts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    setIsProcessingLike(productId);

    try {
      const endpoint = isCurrentlyLiked 
        ? `${baseUrl.INVENTORY}/api/v1/product/favorites/remove/${productId}`
        : `${baseUrl.INVENTORY}/api/v1/product/favorites/add/${productId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      toast.success(isCurrentlyLiked ? 'Removed from favorites' : 'Added to favorites');

    } catch (error) {
      // Revert on error
      setLocalLikedProducts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });
      toast.error('Failed to update favorites');
    } finally {
      setIsProcessingLike(null);
    }
  };

  // Filtered categories
  const filteredCategories = categoriesApi.filter(cat =>
    cat.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCategory = filteredCategories[selectedCategoryIndex];
  const currentSubCategories = currentCategory?._id ? (subCategoriesMap[currentCategory._id] || []) : [];
  const currentSubCategory = currentSubCategories[selectedSubCategoryIndex];
  const currentBrands = currentSubCategory?._id ? (brandsMap[currentSubCategory._id] || []) : [];
  const currentBrand = currentBrands[selectedBrandIndex];
  
  // Get products for current brand
  const productsForCurrentBrand = currentBrand && currentSubCategory?._id
    ? (productsMap[currentSubCategory._id] || [])
    : [];

  return (
    <div className="min-h-screen bg-gray-50 w-full px-0">
      <Toaster position="top-right" richColors />

      <Navigation
        currentPage="category"
        cartCount={cartCount}
        favoritesCount={localLikedProducts.size}
        onCartCountChange={onCartCountChange}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse Categories</h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loadingCategories && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {apiError && !loadingCategories && (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {apiError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Desktop: Four Column Layout */}
        {!loadingCategories && !apiError && (
          <div className="hidden lg:grid lg:grid-cols-12 gap-0 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Category Column */}
            <div className="col-span-2 bg-gray-50 border-r-2 border-gray-200">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-600 text-sm uppercase">Category</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                {filteredCategories.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>
                )}
                {filteredCategories.map((category, index) => (
                  <button
                    key={category._id || index}
                    onClick={() => {
                      if (category.categoryName === 'Full Store Directory' && onFullStoreDirectoryClick) {
                        onFullStoreDirectoryClick();
                      } else {
                        setSelectedCategoryIndex(index);
                        setSelectedSubCategoryIndex(0);
                        setSelectedBrandIndex(0);
                      }
                    }}
                    className={`
                      w-full text-left px-4 py-3 transition-all duration-200
                      ${selectedCategoryIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Category Column */}
            <div className="col-span-2 bg-gray-50 border-r-2 border-gray-200">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-600 text-sm uppercase">Sub Category</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                {currentSubCategories.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">No subcategories</div>
                )}
                {currentSubCategories.map((subCategory, index) => (
                  <button
                    key={subCategory._id || index}
                    onClick={() => {
                      setSelectedSubCategoryIndex(index);
                      setSelectedBrandIndex(0);
                    }}
                    className={`
                      w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200
                      ${selectedSubCategoryIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>{subCategory.categoryName}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Column */}
            <div className="col-span-2 bg-gray-50 border-r-2 border-gray-200">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-600 text-sm uppercase">Brand</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                {!currentSubCategory && (
                  <div className="px-4 py-3 text-sm text-gray-400">Select a subcategory</div>
                )}
                {currentSubCategory && currentBrands.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">No brands</div>
                )}
                {currentBrands.map((brand, index) => (
                  <button
                    key={brand._id || index}
                    onClick={() => setSelectedBrandIndex(index)}
                    className={`
                      w-full text-left px-4 py-3 flex items-center gap-2 transition-all duration-200
                      ${selectedBrandIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {brand.image && (
                      <img
                        src={`${baseUrl.INVENTORY}${brand.image}`}
                        alt={brand.name}
                        className="w-6 h-6 rounded object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <span className="truncate text-sm">{brand.name}</span>
                    <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                      {brand.products?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Column */}
            <div className="col-span-6 bg-white">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-800 text-sm uppercase">
                  {currentBrand?.name
                    ? `${currentBrand.name} Products`
                    : currentSubCategory?.categoryName || 'Products'}
                </h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] p-4 custom-scrollbar">
                {!currentBrand && currentBrands.length > 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    Select a brand to view products
                  </div>
                )}
                {currentBrand && productsForCurrentBrand.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No products in this brand
                  </div>
                )}
                {currentBrand && productsForCurrentBrand.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {productsForCurrentBrand.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isLiked={localLikedProducts.has(product._id)}
                        isLoadingLike={isProcessingLike === product._id}
                        isAddingToCart={isAddingToCart === product._id}
                        onToggleLike={() => handleToggleLike(product._id)}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">20,000+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">450+</div>
            <div className="text-sm text-gray-600">Trusted Brands</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Original</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600">Best</div>
            <div className="text-sm text-gray-600">Prices</div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}