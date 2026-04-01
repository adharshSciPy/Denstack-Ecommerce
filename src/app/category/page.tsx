'use client';
import { useEffect, useState, useCallback } from 'react';
import Navigation from '../components/Navigation';
import { Search, ChevronRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import baseUrl from '../baseUrl';
import { cartService } from '@/services/cartService';

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
  price: number;         // originalPrice — base display price
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

interface ProductCardProps {
  product: Product;
  displayPrice: number;       // ✅ role-based price passed in
  isLiked: boolean;
  isLoadingLike?: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
  onProductClick: () => void;
  isAddingToCart?: boolean;
}

function ProductCard({
  product,
  displayPrice,
  isLiked,
  isLoadingLike = false,
  onToggleLike,
  onAddToCart,
  onProductClick,
  isAddingToCart = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount = displayPrice < product.price && product.price > 0;
  const discountPct = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onProductClick}
    >
      {product.inStock && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          In Stock
        </div>
      )}
      {discountPct > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {discountPct}% OFF
        </div>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); if (!isLoadingLike) onToggleLike(); }}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
          isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
        } ${isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoadingLike}
      >
        {isLoadingLike ? (
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        )}
      </button>

      <div className="relative h-40 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">{product.rating || 0}</span>
        </div>

        {/* ✅ Show role-based price with original struck through if discounted */}
        <div className="mb-3">
          <span className="text-lg font-bold text-blue-600">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="ml-2 text-xs text-gray-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          disabled={isAddingToCart}
          className={`
            w-full py-2 px-3 rounded-lg font-bold text-sm transition-all duration-300
            ${isHovered && !isAddingToCart ? 'bg-blue-700 text-white shadow-lg translate-y-[-2px]' : 'bg-blue-600 text-white shadow-md'}
            ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl active:scale-95'}
          `}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding...
            </div>
          ) : (
            <><ShoppingCart className="w-4 h-4 inline mr-1" />Add to Cart</>
          )}
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
  onToggleLike,
}: CategoryBrowsePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(0);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<string>>(likedProducts);
  const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  const router = useRouter();
  const { isLoggedIn: userIsLoggedIn } = useAuth();

  const [categoriesApi, setCategoriesApi] = useState<Category[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, SubCategory[]>>({});
  const [brandsMap, setBrandsMap] = useState<Record<string, Brand[]>>({});
  const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
  const [priceMap, setPriceMap] = useState<Record<string, number>>({}); // ✅ productId → role-based price
  const [priceLoading, setPriceLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  useEffect(() => {
    const saved = localStorage.getItem('likedProducts');
    if (saved) { try { setLocalLikedProducts(new Set(JSON.parse(saved))); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
  }, [localLikedProducts]);

  const mapApiProductToProduct = (p: any): Product => {
    let price = 0, stock = 0;
    let variants: ProductVariant[] = [];

    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      variants = p.variants;
      const first = p.variants[0];
      price = first.originalPrice ?? first.clinicDiscountPrice ?? 0;
      stock = first.stock || 0;
    } else {
      price = p.originalPrice ?? p.price ?? p.clinicDiscountPrice ?? 0;
      stock = p.stock || 0;
    }

    const imagePath = Array.isArray(p.image) && p.image.length > 0
      ? p.image[0]
      : (typeof p.image === 'string' ? p.image : '');

    return {
      _id: getId(p._id) || String(Math.random()),
      name: p.name || p.title || '',
      price,
      image: imagePath ? `${baseUrl.INVENTORY}${imagePath}` : '/placeholder-image.png',
      rating: p.rating || 0,
      inStock: stock > 0,
      productId: p.productId,
      subCategoryId: getId(p.subCategory),
      variants,
      originalPrice: p.originalPrice,
      clinicDiscountPrice: p.clinicDiscountPrice,
      doctorDiscountPrice: p.doctorDiscountPrice,
      stock,
    };
  };

  // ✅ Batch fetch role-based prices for all products in one API call
  const fetchBatchPrices = async (allProducts: Product[]) => {
    if (allProducts.length === 0) return;
    setPriceLoading(true);
    try {
      const items = allProducts.map((p) => ({
        productId: p._id,
        quantity: 1,
        ...(p.variants?.[0]?._id ? { variantId: p.variants[0]._id } : {}),
      }));

      const res = await fetch(`${baseUrl.INVENTORY}/api/v1/ecom-order/price-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends cookie — works for all user types
        body: JSON.stringify({ items }),
      });

      if (!res.ok) return;
      const data = await res.json();

      if (data.success && Array.isArray(data.items)) {
        const map: Record<string, number> = {};
        data.items.forEach((i: any) => {
          if (i.productId && i.unitPrice != null) map[i.productId] = i.unitPrice;
        });
        setPriceMap(map);
      }
    } catch {
      // price-preview failed — fall back to originalPrice shown in cards
    } finally {
      setPriceLoading(false);
    }
  };

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

        const subMap: Record<string, SubCategory[]> = {};
        const brandMap: Record<string, Brand[]> = {};
        const prodMap: Record<string, Product[]> = {};
        const allProducts: Product[] = []; // ✅ collect all for batch price fetch

        for (const cat of mainCats) {
          const subCats = cat.subCategories || [];
          if (cat._id) subMap[cat._id] = subCats;
          for (const sub of subCats) {
            const brands = sub.brands || [];
            if (sub._id) brandMap[sub._id] = brands;
            const subProducts: Product[] = [];
            for (const brand of brands) {
              const mapped = (brand.products || []).map(mapApiProductToProduct);
              subProducts.push(...mapped);
              allProducts.push(...mapped);
            }
            if (sub._id) prodMap[sub._id] = subProducts;
          }
        }

        setSubCategoriesMap(subMap);
        setBrandsMap(brandMap);
        setProductsMap(prodMap);

        // ✅ Fetch role-based prices for all products after loading
        await fetchBatchPrices(allProducts);
      } catch (err: any) {
        setApiError(err.message || 'Error fetching categories');
        toast.error(err.message || 'Error fetching categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchAllWithDetails();
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        const total =
          response.data.totalItems ||
          response.data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        onCartCountChange(total);
      }
    } catch {}
  }, [onCartCountChange]);

  useEffect(() => { fetchCartCount(); }, [fetchCartCount, userIsLoggedIn]);

  const handleAddToCart = async (product: Product) => {
    try {
      setIsAddingToCart(product._id);
      const payload: any = { productId: product._id, quantity: 1 };
      if (product.variants?.length && product.variants[0]?._id) {
        payload.variantId = product.variants[0]._id;
      }
      await cartService.addToCart(payload);
      await fetchCartCount();
      toast.success(`${product.name} added to cart!`, {
        action: { label: 'View Cart', onClick: () => router.push('/cart') },
      });
    } catch (error: any) {
      const msg: string = error?.message || '';
      if (
        msg.toLowerCase().includes('authentication') ||
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('token') ||
        error?.status === 401
      ) {
        toast.error('Please login to add items to cart', {
          action: { label: 'Login', onClick: () => router.push('/login') },
        });
      } else if (msg.toLowerCase().includes('stock')) {
        toast.error('Out of Stock', { description: msg });
      } else {
        toast.error(msg || 'Failed to add to cart');
      }
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleToggleLike = async (productId: string) => {
    const isCurrentlyLiked = localLikedProducts.has(productId);
    setLocalLikedProducts(prev => {
      const next = new Set(prev);
      isCurrentlyLiked ? next.delete(productId) : next.add(productId);
      return next;
    });
    setIsProcessingLike(productId);
    try {
      const endpoint = isCurrentlyLiked
        ? `${baseUrl.INVENTORY}/api/v1/product/favorites/remove/${productId}`
        : `${baseUrl.INVENTORY}/api/v1/product/favorites/add/${productId}`;
      const res = await fetch(endpoint, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error();
      toast.success(isCurrentlyLiked ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      setLocalLikedProducts(prev => {
        const next = new Set(prev);
        isCurrentlyLiked ? next.add(productId) : next.delete(productId);
        return next;
      });
      toast.error('Failed to update favorites');
    } finally {
      setIsProcessingLike(null);
    }
  };

  const filteredCategories    = categoriesApi.filter(cat =>
    cat.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentCategory       = filteredCategories[selectedCategoryIndex];
  const currentSubCategories  = currentCategory?._id ? (subCategoriesMap[currentCategory._id] || []) : [];
  const currentSubCategory    = currentSubCategories[selectedSubCategoryIndex];
  const currentBrands         = currentSubCategory?._id ? (brandsMap[currentSubCategory._id] || []) : [];
  const currentBrand          = currentBrands[selectedBrandIndex];
  const productsForCurrentBrand = currentBrand && currentSubCategory?._id
    ? (productsMap[currentSubCategory._id] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50 w-full px-0">
      <Toaster position="top-right" richColors />
      <Navigation
        currentPage="category"
        cartCount={cartCount}
        favoritesCount={localLikedProducts.size}
        onCartCountChange={onCartCountChange}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse Categories</h1>
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

        {(loadingCategories || priceLoading) && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
            <p className="mt-2 text-gray-600">
              {loadingCategories ? 'Loading categories...' : 'Calculating your prices...'}
            </p>
          </div>
        )}

        {apiError && !loadingCategories && (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {apiError}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Retry
            </button>
          </div>
        )}

        {!loadingCategories && !priceLoading && !apiError && (
          <div className="hidden lg:grid lg:grid-cols-12 gap-0 bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Category Column */}
            <div className="col-span-2 bg-gray-50 border-r-2 border-gray-200">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-600 text-sm uppercase">Category</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                {filteredCategories.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>}
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
                    className={`w-full text-left px-4 py-3 transition-all duration-200
                      ${selectedCategoryIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'}`}
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
                {currentSubCategories.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">No subcategories</div>}
                {currentSubCategories.map((subCategory, index) => (
                  <button
                    key={subCategory._id || index}
                    onClick={() => { setSelectedSubCategoryIndex(index); setSelectedBrandIndex(0); }}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200
                      ${selectedSubCategoryIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'}`}
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
                {!currentSubCategory && <div className="px-4 py-3 text-sm text-gray-400">Select a subcategory</div>}
                {currentSubCategory && currentBrands.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">No brands</div>}
                {currentBrands.map((brand, index) => (
                  <button
                    key={brand._id || index}
                    onClick={() => setSelectedBrandIndex(index)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-all duration-200
                      ${selectedBrandIndex === index
                        ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'}`}
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
                    <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{brand.products?.length || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Column */}
            <div className="col-span-6 bg-white">
              <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
                <h2 className="font-bold text-gray-800 text-sm uppercase">
                  {currentBrand?.name ? `${currentBrand.name} Products` : currentSubCategory?.categoryName || 'Products'}
                </h2>
              </div>
              <div className="overflow-y-auto max-h-[600px] p-4 custom-scrollbar">
                {!currentBrand && currentBrands.length > 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">Select a brand to view products</div>
                )}
                {currentBrand && productsForCurrentBrand.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No products in this brand</div>
                )}
                {currentBrand && productsForCurrentBrand.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {productsForCurrentBrand.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        // ✅ Use role-based price from priceMap, fall back to originalPrice
                        displayPrice={priceMap[product._id] ?? product.price}
                        isLiked={localLikedProducts.has(product._id)}
                        isLoadingLike={isProcessingLike === product._id}
                        isAddingToCart={isAddingToCart === product._id}
                        onToggleLike={() => handleToggleLike(product._id)}
                        onAddToCart={() => handleAddToCart(product)}
                        onProductClick={() => router.push(`/productdetailpage/${product._id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '20,000+', label: 'Products',       color: 'text-blue-600'   },
            { value: '450+',    label: 'Trusted Brands', color: 'text-green-600'  },
            { value: '100%',    label: 'Original',       color: 'text-purple-600' },
            { value: 'Best',    label: 'Prices',         color: 'text-orange-600' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      `}</style>
    </div>
  );
}