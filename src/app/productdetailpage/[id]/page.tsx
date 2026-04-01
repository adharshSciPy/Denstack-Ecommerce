'use client';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import {
  ShoppingCart, Truck, Shield, RotateCcw, Award,
  Plus, Minus, Check, ChevronRight, Home, Package,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import baseUrl from "../../baseUrl";
import { cartService } from '@/services/cartService';

// ── Auth helpers ──────────────────────────────────────────────────────────────
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

// ── Fetch discounted price ────────────────────────────────────────────────────
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
      method: 'POST', headers: getAuthHeaders(), credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && data.items?.[0] ? data.items[0].unitPrice : null;
  } catch { return null; }
};

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('cartCount');
    if (saved) setCartCount(parseInt(saved, 10) || 0);
  }, []);

  const handleCartCountChange = (n: number) => {
    setCartCount(n);
    localStorage.setItem('cartCount', n.toString());
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
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onCheckoutClick?: () => void;
}

// ── Selection mode: "main" or variant index ───────────────────────────────────
type Selection = { type: 'main' } | { type: 'variant'; index: number };

function ProductDetailPageComponent({
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
  productId,
}: ProductDetailPageProps) {
  const { id: routeParamId } = useParams<{ id: string }>();
  const routeId = productId != null ? String(productId) : routeParamId;

  const [product, setProduct]           = useState<any | null>(null);
  const [quantity, setQuantity]         = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selection, setSelection]       = useState<Selection>({ type: 'main' });
  const [addingToCart, setAddingToCart] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl.INVENTORY}/api/v1/product/getProduct/${routeId}`);
        setProduct(res.data?.product ?? res.data?.data ?? res.data);
      } catch {
        toast.error('Error fetching product');
        setProduct(undefined);
      }
    };
    if (routeId) fetchProduct();
  }, [routeId]);

  // Reset image index whenever selection changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [selection]);

  // Fetch discounted price whenever selection changes
  useEffect(() => {
    if (!product?._id) return;
    const variantId =
      selection.type === 'variant'
        ? product.variants?.[selection.index]?._id ?? null
        : null;
    setPriceLoading(true);
    fetchDiscountedPrice(product._id, variantId).then((p) => {
      setDiscountedPrice(p);
      setPriceLoading(false);
    });
  }, [product, selection]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      const payload: any = { productId: product._id, quantity };
      if (selection.type === 'variant') {
        const variantId = product.variants?.[selection.index]?._id;
        if (variantId) payload.variantId = variantId;
      }
      await cartService.addToCart(payload);
      onCartCountChange(cartCount + quantity);
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`, {
        description: product.name,
      });
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

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const cleaned = path.startsWith('/') ? path : `/${path}`;
    if (cleaned.startsWith('/uploads')) return `${baseUrl.INVENTORY}${cleaned}`;
    return `${baseUrl.AUTH}${cleaned}`;
  };

  // ── Derive current display values based on selection ─────────────────────
  const variants = (product?.variants || []) as any[];
  const activeVariant =
    selection.type === 'variant' ? variants[selection.index] : null;

  // Images: use variant images if a variant is selected and has images, else fall back to main
  const rawImages: string[] =
    selection.type === 'variant' &&
    activeVariant?.image &&
    activeVariant.image.length > 0
      ? activeVariant.image
      : product?.image || product?.images || [];
  const images = rawImages.map((p) => getImageUrl(p)).filter(Boolean) as string[];

  const originalPrice =
    selection.type === 'variant'
      ? activeVariant?.originalPrice ?? product?.originalPrice ?? 0
      : product?.originalPrice ?? 0;

  const displayPrice   = discountedPrice !== null ? discountedPrice : originalPrice;
  const hasDiscount    = discountedPrice !== null && discountedPrice < originalPrice;
  const discountPct    = hasDiscount
    ? Math.round(((originalPrice - discountedPrice!) / originalPrice) * 100)
    : 0;

  const currentStock =
    selection.type === 'variant'
      ? activeVariant?.stock ?? 0
      : product?.stock ?? 0;
  const inStock  = currentStock > 0;
  const maxStock = currentStock;

  const displayBrand =
    typeof product?.brand === 'string'
      ? product.brand
      : product?.brand?.name ?? product?.brand ?? '';

  // ── Build variant label ───────────────────────────────────────────────────
  const getVariantLabel = (v: any) => {
    const parts = [v.size, v.color, v.material].filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : 'Variant';
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (product === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Product not found</h1>
          <button
            onClick={onBackToHome}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Home
          </button>
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
        onCartClick={onCartClick}
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onBackToHome}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {product.category && (
              <>
                <span className="text-gray-500">{product.category}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            <span className="text-blue-600 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Images ───────────────────────────────────────────────── */}
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-20 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0
                      ${selectedImage === i
                        ? 'border-blue-600 shadow-md scale-105'
                        : 'border-gray-200 hover:border-blue-300 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`view ${i + 1}`}
                      className="w-full h-full object-contain bg-white p-1"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative">
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                <img
                  src={images[selectedImage] ?? images[0] ?? ''}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                />
                {discountPct > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                    {discountPct}% OFF
                  </div>
                )}
                {/* Variant badge on image */}
                {selection.type === 'variant' && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    {getVariantLabel(activeVariant)}
                  </div>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                    <span className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { icon: Truck,     color: 'text-blue-600',   label: 'Free Delivery' },
                  { icon: Shield,    color: 'text-green-600',  label: '2Y Warranty'   },
                  { icon: RotateCcw, color: 'text-orange-600', label: 'Easy Returns'  },
                  { icon: Award,     color: 'text-purple-600', label: 'Certified'     },
                ].map(({ icon: Icon, color, label }) => (
                  <div
                    key={label}
                    className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100"
                  >
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                    <p className="text-xs font-semibold text-gray-700 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Product Info ─────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">

              {displayBrand && (
                <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">
                  {displayBrand}
                </p>
              )}
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
                {selection.type === 'variant' && (
                  <span className="ml-2 text-base font-medium text-gray-500">
                    — {getVariantLabel(activeVariant)}
                  </span>
                )}
              </h1>

              {/* ── Price ── */}
              <div className="py-3 border-t border-b border-gray-100">
                {priceLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Calculating your price...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-4xl font-black text-blue-600">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-xl text-gray-400 line-through">
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                            {discountPct}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    {hasDiscount && (
                      <p className="text-sm text-green-600 font-semibold">
                        You save ₹{(originalPrice - displayPrice).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Stock ── */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-semibold text-sm">In Stock</span>
                  </>
                ) : (
                  <span className="text-red-600 font-semibold text-sm">Out of Stock</span>
                )}
              </div>

              {(product.productId || product.sku) && (
                <p className="text-xs text-gray-400">SKU: {product.productId ?? product.sku}</p>
              )}

              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {product.description}
                </p>
              )}

              {/* ── Selection: Main Product + Variants ── */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <label className="text-sm font-bold text-gray-700">
                  Select Option:
                </label>

                <div className="flex flex-wrap gap-2">

                  {/* Main product tile */}
                  <button
                    onClick={() => setSelection({ type: 'main' })}
                    className={`relative flex flex-col items-start gap-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all min-w-[100px]
                      ${selection.type === 'main'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>Base Product</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      ₹{product.originalPrice?.toLocaleString('en-IN') ?? '—'}
                    </span>
                    <span className={`text-xs ${(product.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {selection.type === 'main' && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>

                  {/* Variant tiles */}
                  {variants.map((v: any, i: number) => {
                    const isSelected = selection.type === 'variant' && selection.index === i;
                    const vStock = v.stock ?? 0;
                    const vImages: string[] = (v.image || []).map((p: string) => getImageUrl(p)).filter(Boolean);

                    return (
                      <button
                        key={i}
                        onClick={() => setSelection({ type: 'variant', index: i })}
                        className={`relative flex flex-col items-start gap-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all min-w-[100px] max-w-[160px]
                          ${isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-blue-300 bg-white'
                          }`}
                      >
                        {/* Variant thumbnail */}
                        {vImages[0] && (
                          <img
                            src={vImages[0]}
                            alt={getVariantLabel(v)}
                            className="w-12 h-12 object-contain rounded-lg bg-gray-50 mb-1"
                          />
                        )}
                        <span className="truncate w-full text-left">{getVariantLabel(v)}</span>
                        <span className="text-xs font-bold text-gray-800">
                          ₹{v.originalPrice?.toLocaleString('en-IN') ?? '—'}
                        </span>
                        <span className={`text-xs ${vStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {vStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active variant detail strip */}
                {selection.type === 'variant' && activeVariant && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-wrap gap-3 text-xs text-blue-800">
                    {activeVariant.size     && <span><b>Size:</b> {activeVariant.size}</span>}
                    {activeVariant.color    && <span><b>Color:</b> {activeVariant.color}</span>}
                    {activeVariant.material && <span><b>Material:</b> {activeVariant.material}</span>}
                  </div>
                )}
              </div>

              {/* ── Quantity ── */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <label className="text-sm font-bold text-gray-700">Quantity:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={addingToCart}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="px-6 py-2 font-bold text-gray-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      disabled={addingToCart || quantity >= maxStock}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── CTA Buttons ── */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !inStock}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || !inStock}
                  className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}