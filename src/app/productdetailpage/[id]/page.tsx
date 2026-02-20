'use client';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Plus, Minus, Check, ChevronRight, Home, ChevronDown, Package, CreditCard, Headphones, Gift, Tag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import baseUrl from "../../baseUrl"
import { cartService } from '@/services/cartService'; // ✅ Import cart service



// ✅ WRAPPER COMPONENT (Main Export)
export default function ProductPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('cartCount');
    if (savedCount) {
      setCartCount(parseInt(savedCount, 10) || 0);
    }
  }, []);

  // Save cart count to localStorage whenever it changes
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

// ✅ ACTUAL COMPONENT (Renamed)
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
    isLoadingLike = false,
    onToggleLike,
    onBrandClick,
    onBuyingGuideClick,
    onEventsClick,
    onMembershipClick,
    onFreebiesClick,
    onBestSellerClick,
    onClinicSetupClick,
    onCheckoutClick,
    productId
}: ProductDetailPageProps) {
    const { id: routeParamId } = useParams<{ id: string }>();
    const routeId = productId != null ? String(productId) : routeParamId;

    const [product, setProduct] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [liked, setLiked] = useState(isLiked);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${baseUrl.INVENTORY}/api/v1/product/getProduct/${routeId}`
                );
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

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            setAddingToCart(true);

            const variants = product.variants || [];
            const selectedVariant = variants[selectedVariantIndex];

            const payload: any = {
                productId: product._id,
                quantity: quantity,
            };

            if (variants.length > 0 && selectedVariant?._id) {
                payload.variantId = selectedVariant._id;
            }

            console.log('Adding to cart:', payload);

            await cartService.addToCart(payload);

            onCartCountChange(cartCount + quantity);

            toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`, {
                description: product.name
            });

        } catch (error: any) {
            console.error('Add to cart error:', error);
            
            if (error.message === 'Authentication required') {
                toast.error('Please login to add items to cart');
                router.push('/login');
            } else if (error.message?.includes('stock')) {
                toast.error(error.message || 'Not enough stock available');
            } else {
                toast.error(error.message || 'Failed to add to cart');
            }
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddVariantToCart = async (variantIndex: number) => {
        if (!product) return;

        try {
            const variants = product.variants || [];
            const variant = variants[variantIndex];

            if (!variant) {
                toast.error('Variant not found');
                return;
            }

            const payload: any = {
                productId: product._id,
                variantId: variant._id,
                quantity: 1,
            };

            await cartService.addToCart(payload);
            onCartCountChange(cartCount + 1);

            toast.success(`Added ${product.name} (${variant.size}/${variant.color}) to cart!`);
        } catch (error: any) {
            console.error('Add variant to cart error:', error);
            toast.error(error.message || 'Failed to add to cart');
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        router.push('/checkout');
    };

    const handleToggleLike = () => {
        setLiked(!liked);
        if (onToggleLike && product) {
            onToggleLike(product.id || product._id);
        }
        toast.success(!liked ? 'Added to wishlist' : 'Removed from wishlist');
    };

    const rawImages = (product?.image || product?.images || []) as string[];
    const getImageUrl = (path?: string) => {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        const cleaned = path.startsWith('/') ? path : `/${path}`;
        if (cleaned.startsWith('/uploads')) return `${baseUrl.INVENTORY}${cleaned}`;
        return `${baseUrl.AUTH}${cleaned}`;
    };
    const images = rawImages.map((p) => getImageUrl(p)).filter(Boolean) as string[];

    const variants = (product?.variants || []) as any[];
    const selectedVariant: any = variants[selectedVariantIndex] || {};
    
    const mainPricing = product?.mainProductPricing;
    const price = selectedVariant?.applicablePrice 
        ?? mainPricing?.applicablePrice 
        ?? selectedVariant?.originalPrice 
        ?? product?.originalPrice 
        ?? 0;
    
    const originalPrice = selectedVariant?.originalPrice 
        ?? product?.originalPrice 
        ?? 0;
    
    const discount = originalPrice && price < originalPrice 
        ? Math.round(((originalPrice - price) / originalPrice) * 100) 
        : 0;

    const specifications = product?.specifications ?? {
        "Material": selectedVariant?.material,
        "Size": selectedVariant?.size,
        "Color": selectedVariant?.color,
    } as Record<string, any>;
    
    const displayBrand = typeof product?.brand === 'string' 
        ? product.brand 
        : product?.brand?.name 
        ?? product?.brand 
        ?? '';
    
    const inStock = (selectedVariant?.stock ?? product?.stock ?? 0) > 0;
    const maxStock = selectedVariant?.stock ?? product?.stock ?? 0;

    if (product === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700">Loading...</h1>
                </div>
            </div>
        );
    }

    if (product === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
                    <p className="text-gray-600 mt-2">Product ID: {routeId}</p>
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

            {/* Keep ALL your existing JSX from here - images, product info, variants, etc. */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* All your existing content */}
                    <div className="space-y-4">
                        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                            <ImageWithFallback
                                src={images[selectedImage] ?? images[0] ?? ''}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`
                                        aspect-square rounded-lg overflow-hidden border-2 transition-all
                                        ${selectedImage === index ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-blue-400'}
                                    `}
                                >
                                    <ImageWithFallback
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-800">Free Delivery</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-800">2 Year Warranty</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <RotateCcw className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-800">Easy Returns</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-800">Certified</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <p className="text-sm text-blue-600 font-semibold uppercase">{displayBrand}</p>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{product.rating || 0}</span>
                                <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-blue-600">₹{price.toLocaleString('en-IN')}</span>
                                {originalPrice > price && (
                                    <span className="text-xl text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
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

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={addingToCart}
                                            className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-6 py-2 text-black font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                                            disabled={addingToCart}
                                            className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-600">Max: {maxStock}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || !inStock}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {addingToCart ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
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

                            <button
                                onClick={handleToggleLike}
                                className={`
                                    w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all
                                    ${liked
                                        ? 'bg-red-50 border-red-500 text-red-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                                    }
                                `}
                            >
                                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                                {liked ? 'Added to Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        {/* Keep all your other existing sections - variants, FAQ, etc. */}
                    </div>
                </div>
            </div>
        </div>
    );
}