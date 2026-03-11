'use client';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Plus, Minus, Check, ChevronRight, Home, ChevronDown, Package, CreditCard, Headphones, Gift, Tag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import baseUrl from "../../baseUrl";
import { cartService } from '@/services/cartService';

// ── Auth helpers (same as CartPage) ─────────────────────────────────────────
const getClinicAuth = (): { clinicId: string; token: string } | null => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('clinicToken') : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const clinicId = payload.clinicId || payload.hospitalId || payload._id;
    return clinicId ? { clinicId, token } : null;
  } catch { return null; }
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const clinicAuth = getClinicAuth();
  if (clinicAuth) headers['Authorization'] = `Bearer ${clinicAuth.token}`;
  return headers;
};

// ── Fetch discounted price for a single product ───────────────────────────────
const fetchDiscountedPrice = async (
  productId: string,
  variantId: string | null
): Promise<number | null> => {
  try {
    const clinicAuth = getClinicAuth();
    const body: any = {
      items: [{ productId, quantity: 1, ...(variantId ? { variantId } : {}) }],
      ...(clinicAuth ? { clinicId: clinicAuth.clinicId } : {}),
    };

    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/ecom-order/price-preview`, {
      method:      'POST',
      headers:     getAuthHeaders(),
      credentials: 'include',
      body:        JSON.stringify(body),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.items?.[0]) {
      return data.items[0].unitPrice;
    }
    return null;
  } catch { return null; }
};

// ✅ WRAPPER COMPONENT
export default function ProductPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) setCartCount(parseInt(savedCount, 10) || 0);
  }, []);

  const handleCartCountChange = (newCount: number) => {
    setCartCount(newCount);
    localStorage.setItem('cartCount', newCount.toString());
  };

  return (
    <ProductDetailPageComponent
      cartCount={cartCount}
      onCartCountChange={handleCartCountChange}
      onBackToHome={() => router.push('/')}
      onCartClick={() => router.push('/cart')}
      onCheckoutClick={() => router.push('/checkout')}
      onBrandClick={() => router.push('/brands')}
      onBuyingGuideClick={() => router.push('/buying-guide')}
      onEventsClick={() => router.push('/events')}
      onMembershipClick={() => router.push('/membership')}
      onFreebiesClick={() => router.push('/freebies')}
      onBestSellerClick={() => router.push('/bestsellers')}
      onClinicSetupClick={() => router.push('/clinic-setup')}
    />
  );
}

interface ProductDetailPageProps {
  productId?: number | string;
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick: () => void;
  isLiked?: boolean;
  isLoadingLike?: boolean;
  onToggleLike?: (productId: number | string) => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onCheckoutClick?: () => void;
}

function ProductDetailPageComponent({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  isLiked = false,
  onToggleLike,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  productId,
}: ProductDetailPageProps) {
  const { id: routeParamId } = useParams<{ id: string }>();
  const routeId = productId != null ? String(productId) : routeParamId;

  const [product, setProduct]                       = useState<any | null>(null);
  const [quantity, setQuantity]                     = useState(1);
  const [selectedImage, setSelectedImage]           = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [liked, setLiked]                           = useState(isLiked);
  const [activeTab, setActiveTab]                   = useState<'description' | 'specifications' | 'reviews'>('description');
  const [addingToCart, setAddingToCart]             = useState(false);
  const [discountedPrice, setDiscountedPrice]       = useState<number | null>(null);
  const [priceLoading, setPriceLoading]             = useState(false);

  const router = useRouter();

  // ── Fetch product ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl.INVENTORY}/api/v1/product/getProduct/${routeId}`);
        const payload = res.data?.product ?? res.data?.data ?? res.data;
        setProduct(payload);
      } catch (err) {
        console.error(err);
        toast.error('Error fetching product');
        setProduct(undefined);
      }
    };
    if (routeId) fetchProduct();
  }, [routeId]);

  // ── Fetch discounted price whenever product or variant changes ─────────────
  useEffect(() => {
    if (!product?._id) return;

    const variants      = product.variants || [];
    const selectedVariant = variants[selectedVariantIndex];
    const variantId     = selectedVariant?._id || null;

    setPriceLoading(true);
    fetchDiscountedPrice(product._id, variantId).then((p) => {
      setDiscountedPrice(p);
      setPriceLoading(false);
    });
  }, [product, selectedVariantIndex]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      const variants        = product.variants || [];
      const selectedVariant = variants[selectedVariantIndex];
      const payload: any    = { productId: product._id, quantity };
      if (variants.length > 0 && selectedVariant?._id) payload.variantId = selectedVariant._id;

      await cartService.addToCart(payload);
      onCartCountChange(cartCount + quantity);
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`, { description: product.name });
    } catch (error: any) {
      if (error.message === 'Authentication required') {
        toast.error('Please login to add items to cart');
        router.push('/login');
      } else {
        toast.error(error.message || 'Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const handleToggleLike = () => {
    setLiked(!liked);
    if (onToggleLike && product) onToggleLike(product.id || product._id);
    toast.success(!liked ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const rawImages   = (product?.image || product?.images || []) as string[];
  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const cleaned = path.startsWith('/') ? path : `/${path}`;
    if (cleaned.startsWith('/uploads')) return `${baseUrl.INVENTORY}${cleaned}`;
    return `${baseUrl.AUTH}${cleaned}`;
  };
  const images = rawImages.map((p) => getImageUrl(p)).filter(Boolean) as string[];

  const variants        = (product?.variants || []) as any[];
  const selectedVariant: any = variants[selectedVariantIndex] || {};

  // ── Pricing ────────────────────────────────────────────────────────────────
  const originalPrice = selectedVariant?.originalPrice ?? product?.originalPrice ?? 0;

  // Use discounted price from price-preview if available, else fall back to original
  const displayPrice = discountedPrice !== null ? discountedPrice : originalPrice;

  const hasDiscount   = discountedPrice !== null && discountedPrice < originalPrice;
  const discountPct   = hasDiscount
    ? Math.round(((originalPrice - discountedPrice!) / originalPrice) * 100)
    : 0;

  const specifications = product?.specifications ?? {
    "Material": selectedVariant?.material,
    "Size":     selectedVariant?.size,
    "Color":    selectedVariant?.color,
  } as Record<string, any>;

  const displayBrand = typeof product?.brand === 'string'
    ? product.brand
    : product?.brand?.name ?? product?.brand ?? '';

  const inStock  = (selectedVariant?.stock ?? product?.stock ?? 0) > 0;
  const maxStock = selectedVariant?.stock ?? product?.stock ?? 0;

  if (product === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><h1 className="text-2xl font-bold text-gray-700">Loading...</h1></div>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
          <p className="text-gray-600 mt-2">Product ID: {routeId}</p>
          <button onClick={onBackToHome} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <Navigation
        currentPage="productdetailpage/[id]"
        cartCount={cartCount}
        favoritesCount={liked ? 1 : 0}
        onCartClick={onCartClick}
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={onBackToHome} className="text-gray-500 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{product.category}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
              <ImageWithFallback
                src={images[selectedImage] ?? images[0] ?? ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPct > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  {discountPct}% OFF
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((image: string, index: number) => (
                <button key={index} onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-blue-400'}`}>
                  <ImageWithFallback src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Truck,     color: 'text-blue-600',   label: 'Free Delivery' },
                { icon: Shield,    color: 'text-green-600',  label: '2 Year Warranty' },
                { icon: RotateCcw, color: 'text-orange-600', label: 'Easy Returns' },
                { icon: Award,     color: 'text-purple-600', label: 'Certified' },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="bg-white rounded-xl p-4 text-center shadow">
                  <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                  <p className="text-xs font-semibold text-gray-800">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <p className="text-sm text-blue-600 font-semibold uppercase">{displayBrand}</p>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating || 0}</span>
                <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
              </div>

              {/* ✅ Price with strikethrough and discount badge */}
              <div className="space-y-1">
                {priceLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Calculating your price...</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {discountPct}% OFF
                        </span>
                      </>
                    )}
                  </div>
                )}
                {hasDiscount && (
                  <p className="text-sm text-green-600 font-semibold">
                    You save ₹{(originalPrice - displayPrice).toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-semibold">In Stock ({maxStock} available)</span>
                  </>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              <p className="text-sm text-gray-600">SKU: {product.productId ?? product.sku}</p>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Variant:</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: any, i: number) => (
                      <button key={i} onClick={() => setSelectedVariantIndex(i)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${selectedVariantIndex === i ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                        {v.size || v.color || v.material || `Variant ${i + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={addingToCart}
                      className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 text-black font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} disabled={addingToCart}
                      className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">Max: {maxStock}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={handleAddToCart} disabled={addingToCart || !inStock}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {addingToCart ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" />Add to Cart</>
                  )}
                </button>
                <button onClick={handleBuyNow} disabled={addingToCart || !inStock}
                  className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  Buy Now
                </button>
              </div>

              <button onClick={handleToggleLike}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all ${liked ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-4 border-b border-gray-200 mb-4">
                {(['description', 'specifications', 'reviews'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'description' && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-2">
                  {Object.entries(specifications).filter(([, v]) => v).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-600 font-semibold">{key}</span>
                      <span className="text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}