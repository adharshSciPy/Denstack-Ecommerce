'use client';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Plus, Minus, Check, ChevronRight, Home, ChevronDown, Package, CreditCard, Headphones, Gift, Tag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import baseUrl from "../../baseUrl"

interface ProductDetailPageProps {
    // optional prop when rendering the component directly
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

export default function ProductDetailPage({
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
    // prefer explicit prop `productId` when used as a child component, otherwise use route param
    const { id: routeParamId } = useParams<{ id: string }>();
    const routeId = productId != null ? String(productId) : routeParamId;

    // product: null = loading, undefined = not found/error, object = product data
    const [product, setProduct] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [liked, setLiked] = useState(isLiked);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Ensure hooks run in the same order every render
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${baseUrl.INVENTORY}/api/v1/product/getProduct/${routeId}`
                );
                const payload = res.data?.data ?? res.data;
                setProduct(payload);
            } catch (err) {
                console.error(err);
                toast.error('Error fetching product');
                setProduct(undefined);
            }
        };
        if (routeId) fetchProduct();
    }, [routeId]);

    const handleAddToCart = () => {
        onCartCountChange(cartCount + quantity);
        toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`, {
            description: product.name
        });
    };

    const handleBuyNow = () => {
        onCartCountChange(cartCount + quantity);
        if (onCheckoutClick) {
            onCheckoutClick();
        }
        toast.success('Proceeding to checkout...');
    };

    const handleToggleLike = () => {
        setLiked(!liked);
        if (onToggleLike && product) {
            onToggleLike(product.id || product._id);
        }
        toast.success(!liked ? 'Added to wishlist' : 'Removed from wishlist');
    };

    // Derived / normalized values (work with both old and new API shapes)
    // Normalize image URLs: absolute URLs left as-is; 
    // prefix '/uploads' paths with the Inventory server (where backend stores uploads), otherwise use IMAGE base.
    const rawImages = (product?.image || product?.images || []) as string[];
    const getImageUrl = (path?: string) => {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        const cleaned = path.startsWith('/') ? path : `/${path}`;
        // If backend serves uploads from INVENTORY, keep those on INVENTORY host
        if (cleaned.startsWith('/uploads')) return `${baseUrl.INVENTORY}${cleaned}`;
        // Otherwise use IMAGE base
        return `${baseUrl.AUTH}${cleaned}`;
    };
    const images = rawImages.map((p) => getImageUrl(p)).filter(Boolean) as string[];

    const variants = (product?.variants || []) as any[];
    const selectedVariant: any = variants[selectedVariantIndex] || {};
    const price = selectedVariant?.discountPrice1 ?? selectedVariant?.discountPrice2 ?? selectedVariant?.originalPrice ?? product?.price ?? 0;
    const originalPrice = selectedVariant?.originalPrice ?? product?.originalPrice ?? 0;
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const specifications = product?.specifications ?? {
        "Material": selectedVariant?.material,
        "Size": selectedVariant?.size,
        "Color": selectedVariant?.color,
    } as Record<string, any>;
    const displayBrand = typeof product?.brand === 'string' ? product.brand : product?.brand?.name ?? product?.brand ?? '';
    const inStock = (selectedVariant?.stock ?? product?.stockCount ?? 0) > 0;

    // Loading
    if (product === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700">Loading...</h1>
                </div>
            </div>
        );
    }

    // Not found / error
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

            {/* <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={onBackToHome}
        onLogoClick={onBackToHome}
        favoritesCount={0}
      /> */}

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


            {/* Breadcrumb */}
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                            <ImageWithFallback
                                src={images[selectedImage] ?? images[0] ?? ''}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {originalPrice > price && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
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

                        {/* Trust Badges */}
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

                    {/* Right - Product Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            {/* Brand */}
                            <p className="text-sm text-blue-600 font-semibold uppercase">{displayBrand}</p>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-blue-600">₹{price}</span>
                                {originalPrice > price && (
                                    <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {inStock ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span className="text-green-600 font-semibold">In Stock ({selectedVariant.stock ?? product.stockCount ?? 0} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-semibold">Out of Stock</span>
                                )}
                            </div>

                            {/* SKU */}
                            <p className="text-sm text-gray-600">SKU: {product.productId ?? product.sku}</p>
                            {/* Material Type */}
                            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                <Package className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-xs text-gray-600">Material Type</p>
                                    <p className="text-sm font-bold text-gray-900">{product.materialType}</p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-6 py-2 text-black font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant.stock ?? product.stockCount ?? 1, quantity + 1))}
                                            className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-600">Max: {selectedVariant.stock ?? product.stockCount ?? 0}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Wishlist Button */}
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

                        {/* Available Variants - Compact Cards */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h2 className="font-bold text-gray-900 text-lg">Available Variants</h2>

                            <div className="space-y-3">
                                {variants.length ? variants.map((v: any, idx: number) => (
                                    <div key={idx} className={`border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all ${selectedVariantIndex === idx ? 'ring-2 ring-blue-100' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                <ImageWithFallback
                                                    src={images[idx] ?? images[0] ?? ''}
                                                    alt={`${product.name} variant ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {(v.originalPrice && (v.discountPrice1 ?? v.discountPrice2) && (v.originalPrice > (v.discountPrice1 ?? v.discountPrice2))) && (
                                                    <div className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-bl">
                                                        {Math.round(((v.originalPrice - (v.discountPrice1 ?? v.discountPrice2)) / v.originalPrice) * 100)}%
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-gray-900 mb-2">
                                                    {product.name} - {v.size} / {v.color}
                                                </h3>

                                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Package className="w-3 h-3 text-gray-500" />
                                                        <span className="text-gray-600">Material:</span>
                                                        <span className="font-semibold text-gray-900">{v.material}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-600">Size:</span>
                                                        <span className="font-semibold text-gray-900">{v.size}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-600">Stock:</span>
                                                        <span className="font-semibold text-gray-900">{v.stock}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-600">Color:</span>
                                                        <span className="font-semibold text-gray-900">{v.color}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <span className="text-lg font-bold text-blue-600">₹ {v.discountPrice1 ?? v.discountPrice2 ?? v.originalPrice}</span>
                                                    {(v.originalPrice > (v.discountPrice1 ?? v.discountPrice2 ?? 0)) && (
                                                        <span className="text-xs text-gray-400 line-through">₹ {v.originalPrice}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                                                    <Tag className="w-3 h-3" />
                                                    <span className="font-semibold">Points</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                                                    <RotateCcw className="w-3 h-3" />
                                                    <span>10-Days Returnable</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVariantIndex(idx);
                                                            toast.success('Selected variant');
                                                        }}
                                                        className="py-1 px-2 bg-white border rounded text-xs"
                                                    >
                                                        Select
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onCartCountChange(cartCount + 1);
                                                            toast.success(`Added ${product.name} (${v.size}/${v.color}) to cart!`);
                                                        }}
                                                        className="ml-auto w-full py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-600">No variants available for this product.</p>
                                )}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h2 className="font-bold text-gray-900 text-lg">Frequently Asked Questions</h2>

                            <div className="space-y-3">
                                {/* FAQ Item 1 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">Is this product autoclavable?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 0 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 0 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                Yes, this product is fully autoclavable and can withstand sterilization temperatures up to 134°C. It's made from medical-grade materials designed for repeated sterilization cycles.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ Item 2 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">What is the warranty period?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 1 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 1 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                This product comes with a 2-year manufacturer warranty covering manufacturing defects. Extended warranty options are available at checkout.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ Item 3 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">How long does delivery take?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 2 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 2 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                Standard delivery takes 3-5 business days. Express delivery options are available at checkout for same-day or next-day delivery in select cities.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ Item 4 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">Is this product FDA approved?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 3 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 3 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                Yes, this product is FDA approved and ISO 13485 certified. All our dental products meet international quality and safety standards.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ Item 5 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">Can I return this if I'm not satisfied?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 4 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 4 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                Yes, we offer a 30-day hassle-free return policy. If you're not completely satisfied, you can return the product for a full refund or exchange within 30 days of purchase.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FAQ Item 6 */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 text-left">Do you provide bulk order discounts?</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openFaqIndex === 5 ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaqIndex === 5 && (
                                        <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                                            <p className="text-sm text-gray-700">
                                                Yes! We offer special discounts on bulk orders (5+ items). Contact our sales team or check out with multiple quantities to see your discount automatically applied.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Available Offers */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg">Available Offers</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <Gift className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Bank Offer</p>
                                        <p className="text-xs text-gray-600">10% instant discount on HDFC Bank Credit Cards, up to ₹1500</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">No Cost EMI</p>
                                        <p className="text-xs text-gray-600">Available on orders above ₹3000. No extra charges!</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Package className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Special Offer</p>
                                        <p className="text-xs text-gray-600">Get extra 5% off on bulk orders (5+ items)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg">Delivery Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Truck className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                                        <p className="text-xs text-gray-600">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">7 Days Replacement</p>
                                        <p className="text-xs text-gray-600">If you receive damaged or defective product</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <RotateCcw className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                                        <p className="text-xs text-gray-600">Return within 30 days for full refund</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg">Payment Options</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Card</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <Headphones className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">UPI</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <Package className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Net Banking</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <Gift className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">COD</span>
                                </div>
                            </div>
                        </div>

                        {/* Specialized Benefits */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 space-y-4 border border-blue-200">
                            <h3 className="font-bold text-gray-900 text-lg">Specialized Benefits</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-gray-900">Authentic Product</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-gray-900">Certified Quality</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <Headphones className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-gray-900">24/7 Support</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-gray-900">Secure Packaging</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`
                flex-1 px-6 py-4 font-semibold transition-all
                ${activeTab === 'description'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }
              `}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`
                flex-1 px-6 py-4 font-semibold transition-all
                ${activeTab === 'specifications'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }
              `}
                        >
                            Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`
                flex-1 px-6 py-4 font-semibold transition-all
                ${activeTab === 'reviews'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }
              `}
                        >
                            Reviews ({product.reviews})
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-6">Key Features:</h3>
                                <ul className="space-y-2">
                                    {(product.features || []).map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="space-y-3">
                                {Object.entries(specifications as Record<string, any>).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex border-b border-gray-200 py-3">
                                        <span className="w-1/3 font-semibold text-gray-900">{key}:</span>
                                        <span className="w-2/3 text-gray-700">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                {/* Review Summary */}
                                <div className="bg-blue-50 rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-5xl font-bold text-blue-600">{product.rating}</p>
                                            <div className="flex mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{product.reviews} reviews</p>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {[5, 4, 3, 2, 1].map((stars) => (
                                                <div key={stars} className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold w-8">{stars}★</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full"
                                                            style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">{stars === 5 ? '75%' : stars === 4 ? '20%' : '5%'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sample Reviews */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                                JD
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900">Dr. John Doe</span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Verified Purchase • 2 weeks ago</p>
                                                <p className="text-gray-700">Excellent product! Very durable and easy to use. Highly recommended for professional use.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                                SM
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900">Dr. Sarah Miller</span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Verified Purchase • 1 month ago</p>
                                                <p className="text-gray-700">Great quality and fast delivery. Worth the investment for my clinic.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
}