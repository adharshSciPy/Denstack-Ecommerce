'use client';
import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import { Search, ChevronRight, Heart, ShoppingCart, Star, Filter } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth'; // Add this import
import baseUrl from '../baseUrl';

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

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock: boolean;
  productId?: string;
  subCategoryId?: string;
  variants?: any[];
} 

interface SubCategory {
  name: string;
  products: Product[];
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

const categoryData: Category[] = [];

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  isLoadingLike?: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
} 

function ProductCard({ product, isLiked, isLoadingLike = false, onToggleLike, onAddToCart }: ProductCardProps) {
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

      {/* Like Button - Updated with loading state */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoadingLike) {
            onToggleLike();
          }
        }}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${isLiked
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
          <span className="text-xs text-gray-600">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-blue-600 mb-3">
          {product.price ? `₹${product.price.toLocaleString()}` : '-'}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className={`
            w-full py-2 px-3 rounded-lg font-bold text-sm
            transition-all duration-300
            ${isHovered
              ? 'bg-blue-700 text-white shadow-lg translate-y-[-2px]'
              : 'bg-blue-600 text-white shadow-md'
            }
            hover:shadow-xl active:scale-95
          `}
        >
          <ShoppingCart className="w-4 h-4 inline mr-1" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

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
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<string>>(likedProducts);
  const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null);
  
  const router = useRouter();
  const { isLoggedIn: userIsLoggedIn } = useAuth(); // Get auth status

  const handleNavigation = (path: string, callback?: () => void) => {
    router.push(path);
    callback?.();
  };

  // API state: fetch main categories and subcategories on demand (cached)
  const [categoriesApi, setCategoriesApi] = useState<any[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, any[]>>({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Normalize ID values that may come as strings or MongoDB objects { $oid: '...' }
  const getId = (val: any): string | undefined => {
    if (!val) return undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.$oid) return String(val.$oid);
      if (val._id && typeof val._id === 'string') return val._id;
      if (val._id && val._id.$oid) return String(val._id.$oid);
      if (val.id) return String(val.id);
      if (val.subCategoryId) return String(val.subCategoryId);
    }
    return undefined;
  }; 

  // Load liked products from localStorage on component mount
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

  // Save liked products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
  }, [localLikedProducts]);

  useEffect(() => {
    const fetchMain = async () => {
      setLoadingCategories(true);
      setApiError(null);
      try {
        const res = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/main/getAll`);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const json = await res.json();
        setCategoriesApi(json.data || []);
        // prefetch subcategories for first category
        if (json.data && json.data.length > 0) {
          fetchSubCategories(json.data[0]._id);
        }
      } catch (err: any) {
        setApiError(err.message || 'Error fetching categories');
        toast.error(err.message || 'Error fetching categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubCategories = async (parentId: string) => {
    if (!parentId) return;
    if (subCategoriesMap[parentId]) return; // cached
    setLoadingSubcategories(true);
    setApiError(null);

    const candidates = [
      `${baseUrl.INVENTORY}/api/v1/landing/sub/getByParent/${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/main/getSub?parentId=${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/sub/getSub?parentId=${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/main/getSub?parentCategory=${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/main/getSub?parentCategoryId=${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/main/getSub?parent=${parentId}`,
      `${baseUrl.INVENTORY}/api/v1/landing/sub/getSub?parentCategoryId=${parentId}`,
    ];

    try {
      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const json = await res.json();
          if (json?.data && json.data.length > 0) {
            const normalized = json.data.map((item: any) => ({
              ...item,
              _id: getId(item._id ?? item.id ?? item.subCategoryId ?? item.categoryId ?? item._id) ?? (item._id ?? item.id ?? item.subCategoryId ?? item.categoryId)
            }));
            setSubCategoriesMap(prev => ({ ...prev, [parentId]: normalized }));
            return;
          }
        } catch (e) {
          // ignore and try next
        }
      }

      // Final fallback: fetch all and filter by parentCategory._id
      try {
        const allRes = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/main/getAll`);
        if (allRes.ok) {
          const allJson = await allRes.json();
          const allData = allJson?.data || [];
          // Consider multiple possible parent references (parentCategory, mainCategory, parent, etc.)
          const filtered = allData.filter((item: any) => {
            const possibleParent = item.parentCategory ?? item.mainCategory ?? item.parent ?? item.parentCategoryId ?? item.mainCategoryId ?? item.categoryId;
            if (!possibleParent) return false;
            const pId = getId(possibleParent);
            if (typeof possibleParent === 'string' && possibleParent === parentId) return true;
            if (pId && pId === parentId) return true;
            // also accept direct object equality
            if (possibleParent === parentId) return true;
            return false;
          });
          if (filtered.length > 0) {
            const normalized = filtered.map((item: any) => ({
              ...item,
              _id: getId(item._id ?? item.id ?? item.subCategoryId ?? item.categoryId ?? item._id) ?? (item._id ?? item.id ?? item.subCategoryId ?? item.categoryId)
            }));
            setSubCategoriesMap(prev => ({ ...prev, [parentId]: normalized }));
            console.debug('Found subcategories from getAll fallback', parentId, normalized.length);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      // If still no subcategories found, cache empty array
      setSubCategoriesMap(prev => ({ ...prev, [parentId]: [] }));
    } catch (err: any) {
      setApiError(err.message || 'Error fetching subcategories');
      toast.error(err.message || 'Error fetching subcategories');
      setSubCategoriesMap(prev => ({ ...prev, [parentId]: [] }));
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Products state & fetch helpers (cached by subcategory id)
  const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  // Debugging helpers
  const [lastFetchedJson, setLastFetchedJson] = useState<any | null>(null);
  const [showRawProducts, setShowRawProducts] = useState(false);

  const mapApiProductToProduct = (p: any): Product => {
    const variant = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null;
    const price = variant ? (variant.clinicDiscountPrice ?? variant.discountPrice1 ?? variant.originalPrice ?? 0) : 0;
    const imagePath = Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : '';

    const id = getId(p._id ?? p._id?.$oid ?? p.id);
    const productName = p.name ?? p.title ?? '';
    const subCategoryId = getId(p.subCategory ?? p.subCategoryId ?? p.subCategory?._id);

    return {
      _id: id ?? String(Math.random()), // fallback to avoid undefined
      name: productName,
      price,
      image: imagePath ? `${baseUrl.INVENTORY}${imagePath}` : '/uploads/placeholder.png',
      rating: p.rating ?? 0,
      inStock: Array.isArray(p.variants) ? p.variants.some((v: any) => v.stock && v.stock > 0) : (p.stock ?? true),
      productId: p.productId,
      subCategoryId,
      variants: p.variants
    };
  }; 

  const fetchProductsBySubCategory = async (subCategoryId: string, force = false) => {
    if (!subCategoryId) return;
    if (!force && productsMap[subCategoryId]) return; // cached
    setLoadingProducts(true);
    setProductsError(null);
    setLastFetchedJson(null);
    try {
      console.debug(`Fetching products for subCategoryId: ${subCategoryId}`);
      const res = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/products/bySubCategory/${subCategoryId}`);
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      const json = await res.json();
      setLastFetchedJson(json);
      const data = json?.data || [];
      console.debug(`Fetched ${data.length} products for ${subCategoryId}`, data?.[0]);
      const mapped = data.map(mapApiProductToProduct);

      // Cache under requested id
      setProductsMap(prev => ({ ...prev, [subCategoryId]: mapped }));

      // Also cache under any subCategory keys found in product.subCategory (e.g., subCategoryId, _id)
      if (data.length) {
        const altKeys = new Set<string>();
        // extract normalized ids from raw data
        data.forEach((p: any) => {
          const sId = getId(p.subCategory) ?? getId(p.subCategoryId);
          if (sId) altKeys.add(sId);
        });
        // also include any subCategoryId we added while mapping
        mapped.forEach((mp: Product) => {
          if (mp.subCategoryId) altKeys.add(mp.subCategoryId);
        });
        // remove the requested id (already set)
        altKeys.delete(subCategoryId);
        if (altKeys.size) {
          setProductsMap(prev => {
            const next = { ...prev };
            altKeys.forEach(k => { next[k] = mapped; });
            console.debug('Also caching products under alternative subcategory keys:', Array.from(altKeys));
            return next;
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching products for', subCategoryId, err);
      setProductsError(err.message || 'Error fetching products');
      toast.error(err.message || 'Error fetching products');
      setProductsMap(prev => ({ ...prev, [subCategoryId]: [] }));
    } finally {
      setLoadingProducts(false);
    }
  }; 

  // API function for adding/removing favorites
  const addToFavoritesAPI = useCallback(async (productId: string) => {
    try {
      setIsProcessingLike(productId);

      const response = await fetch(
        `${baseUrl.INVENTORY}/api/v1/product/favorites/add/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );  
      
      console.log(response);
      
      if (response.status === 401) {
        return { success: false, requiresLogin: true };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        liked: data.liked,
        message: data.message,
        data: data.data,
      };
    } catch (err) {
      console.error("Error adding to favorites:", err);
      return { success: false, error: err };
    } finally {
      setIsProcessingLike(null);
    }
  }, []);

  // Function to show login prompt
  const showLoginPrompt = useCallback((productId: string) => {
    // Store the product ID to like after login
    sessionStorage.setItem('productToLikeAfterLogin', productId);
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    
    toast.error('Login Required', {
      description: 'You need to login to add products to favorites',
      action: {
        label: 'Login',
        onClick: () => {
          router.push('/login');
        },
      },
      duration: 5000,
    });
  }, [router]);

  // Main like toggle handler
  const handleToggleLike = async (productId: string) => {
    // Check if user is logged in
    // Note: You need to implement your auth check logic here
    // const isLoggedIn = userIsLoggedIn; // Use your auth hook
    
    // For now, let's check if we have a token in localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn = !!token || userIsLoggedIn;

    if (!isLoggedIn) {
      showLoginPrompt(productId);
      return;
    }

    const isCurrentlyLiked = localLikedProducts.has(productId);

    // Optimistic UI update
    setLocalLikedProducts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    // Make API call
    const result = await addToFavoritesAPI(productId);

    if (!result.success) {
      // Revert optimistic update on failure
      setLocalLikedProducts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });

      if (result.requiresLogin) {
        showLoginPrompt(productId);
      } else {
        toast.error('Failed to update favorites. Please try again.');
      }
    } else {
      // Success - show appropriate message
      if (result.liked) {
        toast.success('Added to favorites!');
      } else {
        toast.info('Removed from favorites');
      }
    }
  };

  // Derived UI categories matching previous structure (no products yet)
  const uiCategories: Category[] = categoriesApi.map(c => ({
    name: c.categoryName,
    subCategories: (subCategoriesMap[c._id] || []).map((sc: any) => ({ name: sc.categoryName, products: [] }))
  }));

  const filteredCategories = uiCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApiCategories = categoriesApi.filter(cat =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // when selectedCategoryIndex changes, attempt to fetch its subcategories
    const filtered = categoriesApi.filter(cat => cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    const apiCat = filtered[selectedCategoryIndex];
    if (apiCat && apiCat._id) {
      fetchSubCategories(apiCat._id);
    }
    // reset subcategory index
    setSelectedSubCategoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryIndex, categoriesApi, searchQuery]);

  const selectedCategory = filteredCategories[selectedCategoryIndex] || filteredCategories[0];
  // API-aware helpers
  const filteredApi = filteredApiCategories;
  const currentApiCategory = filteredApi[selectedCategoryIndex];
  const currentSubcategoriesApi = currentApiCategory ? (subCategoriesMap[currentApiCategory._id] || []) : [];
  const currentSelectedSubCategory = currentSubcategoriesApi[selectedSubCategoryIndex];
  // keep a UI-compatible selectedSubCategory for legacy rendering
  const selectedSubCategory = currentSelectedSubCategory ? { name: currentSelectedSubCategory.categoryName, products: [] } : selectedCategory?.subCategories[selectedSubCategoryIndex];

  // When subcategory changes, fetch its products (if not cached)
  useEffect(() => {
    const raw = currentSelectedSubCategory?._id ?? currentSelectedSubCategory ?? currentSelectedSubCategory?.subCategoryId ?? currentSelectedSubCategory?.id;
    const subId = getId(raw);
    if (subId) fetchProductsBySubCategory(subId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedSubCategory, selectedSubCategoryIndex]);

  // Helper to retrieve products for a subcategory, trying multiple keys (_id, subCategoryId, or direct string)
  const getProductsForSub = (sub: any): Product[] => {
    if (sub == null) return [];

    // Build candidate keys depending on structure (string or object)
    const candidateKeys: Array<string | undefined> = [];
    if (typeof sub === 'string') {
      candidateKeys.push(sub);
    } else if (typeof sub === 'object') {
      candidateKeys.push(sub._id, sub.subCategoryId, sub.subCategory, sub.id);
    }

    // Normalize each candidate via getId and try to return the first matching cached products
    for (const k of candidateKeys) {
      if (!k) continue;
      const normalized = getId(k) ?? k;
      if (normalized && productsMap[normalized] && productsMap[normalized].length) return productsMap[normalized];
    }

    // Final fallbacks: return any cached entry even if empty (useful to indicate "no products")
    for (const k of candidateKeys) {
      if (!k) continue;
      const normalized = getId(k) ?? k;
      if (normalized && productsMap[normalized]) return productsMap[normalized];
    }

    return [];
  }; 

  const handleAddToCart = (productName: string) => {
    onCartCountChange(cartCount + 1);
    toast.success(`${productName} added to cart!`);
  };

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

        {/* Desktop: Three Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* CATEGORY Column */}
          <div className="col-span-3 bg-gray-50 border-r-2 border-gray-200">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-600 text-sm uppercase">Category</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {loadingCategories && (
                <div className="px-4 py-3 text-sm text-gray-500">Loading categories...</div>
              )}

              {!loadingCategories && filteredCategories.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>
              )}

              {filteredCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const apiCategory = filteredApiCategories[index];
                    // Check if Full Store Directory is clicked
                    if (apiCategory?.categoryName === 'Full Store Directory' && onFullStoreDirectoryClick) {
                      onFullStoreDirectoryClick();
                    } else {
                      setSelectedCategoryIndex(index);
                      setSelectedSubCategoryIndex(0);
                      if (apiCategory?._id) {
                        fetchSubCategories(apiCategory._id);
                      }
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
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* SUB CATEGORY Column */}
          <div className="col-span-3 bg-gray-50 border-r-2 border-gray-200">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-600 text-sm uppercase">Sub Category</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {loadingSubcategories && (
                <div className="px-4 py-3 text-sm text-gray-500">Loading subcategories...</div>
              )}

              {!loadingSubcategories && currentSubcategoriesApi.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">No subcategories</div>
              )}

              {currentSubcategoriesApi.map((subCategory, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedSubCategoryIndex(index);
                    // normalize subcategory id (handles string or object)
                    const sid = getId(subCategory?._id ?? subCategory ?? subCategory?.subCategoryId ?? subCategory?.id);
                    if (sid) fetchProductsBySubCategory(sid);
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

          {/* PRODUCTS Column */}
          <div className="col-span-6 bg-white">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-800 text-sm uppercase">
                {currentSelectedSubCategory?.categoryName || selectedSubCategory?.name || 'Products'}
              </h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] p-4 custom-scrollbar">
              {/* products for the selected subcategory */}
              {(() => {
                const productsForCurrent = getProductsForSub(currentSelectedSubCategory);

                const isLoadingView = loadingProducts && !productsForCurrent.length;
                if (isLoadingView) {
                  return <div className="text-sm text-gray-500 p-4">Loading products...</div>;
                }

                if (!loadingProducts && productsForCurrent.length === 0) {
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 text-center py-12 text-gray-500">No products available in this category</div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {productsForCurrent.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isLiked={localLikedProducts.has(product._id)}
                        isLoadingLike={isProcessingLike === product._id}
                        onToggleLike={() => handleToggleLike(product._id)}
                        onAddToCart={() => handleAddToCart(product.name)}
                      />
                    ))}
                  </div>
                );
              })()}
            </div> 
          </div>
        </div>

        {/* Mobile: Accordion Layout */}
        <div className="lg:hidden space-y-4">
          {filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => {
                  setSelectedCategoryIndex(catIndex);
                  setSelectedSubCategoryIndex(0);
                  const apiCategory = filteredApiCategories[catIndex];
                  if (apiCategory?._id) fetchSubCategories(apiCategory._id);
                }}
                className={`
                  w-full text-left px-4 py-4 font-semibold flex items-center justify-between
                  ${selectedCategoryIndex === catIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-800'}
                `}
              >
                {category.name}
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${selectedCategoryIndex === catIndex ? 'rotate-90' : ''
                    }`}
                />
              </button>

              {/* Subcategories */}
              {selectedCategoryIndex === catIndex && (
                <div className="border-t border-gray-200">
                  {(() => {
                    const apiCat = filteredApiCategories[catIndex];
                    const subApi = apiCat ? (subCategoriesMap[apiCat._id] || []) : [];

                    if (loadingSubcategories && apiCat && !subApi.length) {
                      return <div className="px-6 py-3 text-sm text-gray-500">Loading subcategories...</div>;
                    }

                    if (!loadingSubcategories && subApi.length === 0) {
                      return <div className="px-6 py-3 text-sm text-gray-500">No subcategories</div>;
                    }

                    return subApi.map((subCategory, subIndex) => (
                      <div key={subIndex}>
                        <button
                          onClick={() => {
                            setSelectedSubCategoryIndex(subIndex);
                            const sid = getId(subCategory?._id ?? subCategory ?? subCategory?.subCategoryId ?? subCategory?.id);
                            if (sid) fetchProductsBySubCategory(sid);
                          }}
                          className={`
                            w-full text-left px-6 py-3 text-sm flex items-center justify-between
                            ${selectedSubCategoryIndex === subIndex
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : 'text-gray-700 bg-gray-50'
                            }
                          `}
                        >
                          {subCategory.categoryName}
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${selectedSubCategoryIndex === subIndex ? 'rotate-90' : ''
                              }`}
                          />
                        </button>

                        {/* Products */}
                        {selectedSubCategoryIndex === subIndex && (
                          <div className="p-4 bg-white">
                            {(() => {
                              const productsForSub = getProductsForSub(subCategory);

                              if (loadingProducts && !productsForSub.length) {
                                return <div className="text-sm text-gray-500 p-2">Loading products...</div>;
                              }

                              if (!loadingProducts && productsForSub.length === 0) {
                                return <div className="text-center py-6 text-gray-500">No products available in this category</div>;
                              }

                              return (
                                <div className="grid grid-cols-2 gap-3">
                                  {productsForSub.map((product) => (
                                    <ProductCard
                                      key={product._id}
                                      product={product}
                                      isLiked={localLikedProducts.has(product._id)}
                                      isLoadingLike={isProcessingLike === product._id}
                                      onToggleLike={() => handleToggleLike(product._id)}
                                      onAddToCart={() => handleAddToCart(product.name)}
                                    />
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

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