'use client';
import { useState } from 'react';
import Navigation from '../../components/Navigation';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Plus, Minus, Check, ChevronRight, Home, ChevronDown, Package, CreditCard, Headphones, Gift, Tag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

interface ProductDetailPageProps {
    productId: number;
    cartCount: number;
    onCartCountChange: (count: number) => void;
    onBackToHome: () => void;
    onCartClick: () => void;
    isLiked?: boolean;
    onToggleLike?: (productId: number) => void;
    onBrandClick?: () => void;
    onBuyingGuideClick?: () => void;
    onEventsClick?: () => void;
    onMembershipClick?: () => void;
    onFreebiesClick?: () => void;
    onBestSellerClick?: () => void;
    onClinicSetupClick?: () => void;
    onCheckoutClick?: () => void;
}

const productDatabase = {
    1: {
        id: 1,
        name: "Dental Impression Tray Kit",
        brand: "Premium Dental",
        price: 1299,
        originalPrice: 1599,
        rating: 4.8,
        reviews: 234,
        inStock: true,
        stockCount: 45,
        sku: "DIT-2024-001",
        materialType: "Medical-grade Stainless Steel",
        category: "General Dentistry",
        images: [
            "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        ],
        description: "Professional-grade dental impression tray kit designed for accurate and comfortable dental impressions. Includes multiple sizes and shapes to accommodate various patient needs.",
        features: [
            "Autoclavable stainless steel construction",
            "Ergonomic design for patient comfort",
            "Available in 12 different sizes",
            "Compatible with all impression materials",
            "Perforated design for better material retention",
            "Chemical resistant coating"
        ],
        specifications: {
            "Material": "Medical-grade stainless steel",
            "Sterilization": "Autoclavable up to 134°C",
            "Set Size": "12 pieces",
            "Weight": "850g",
            "Warranty": "2 years manufacturer warranty",
            "Certification": "FDA Approved, ISO 13485"
        }
    },
    2: {
        id: 2,
        name: "LED Dental Curing Light",
        brand: "BrightSmile Pro",
        price: 4599,
        originalPrice: 5999,
        rating: 4.9,
        reviews: 456,
        inStock: true,
        stockCount: 23,
        sku: "DCL-2024-002",
        materialType: "Aluminum Alloy & Polymer",
        category: "Equipments",
        images: [
            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
            "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
        ],
        description: "High-intensity LED curing light with multiple power modes for efficient and reliable polymerization of light-cured dental materials.",
        features: [
            "High-intensity LED technology (2000mW/cm²)",
            "Multiple curing modes: Standard, High Power, Ramp",
            "360° rotating head for easy access",
            "Built-in light meter for intensity monitoring",
            "Cordless operation with long battery life",
            "Automatic shutoff for safety"
        ],
        specifications: {
            "Light Intensity": "2000mW/cm² (High Power mode)",
            "Wavelength": "420-480nm",
            "Battery Life": "Up to 400 cycles per charge",
            "Charging Time": "2.5 hours",
            "Weight": "165g",
            "Warranty": "3 years"
        }
    },
    3: {
        id: 3,
        name: "Ultrasonic Scaler",
        brand: "SonicCare",
        price: 8999,
        originalPrice: 11999,
        rating: 4.7,
        reviews: 189,
        inStock: true,
        stockCount: 12,
        sku: "USC-2024-003",
        materialType: "Titanium & Ceramic",
        category: "Equipments",
        images: [
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
            "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
        ],
        description: "Professional ultrasonic scaler with piezoelectric technology for effective and gentle scaling procedures.",
        features: [
            "Piezoelectric ultrasonic technology",
            "Adjustable power settings (1-10)",
            "Auto-tuning frequency optimization",
            "Compatible with multiple tip types",
            "Detachable handpiece for easy sterilization",
            "Built-in water irrigation system"
        ],
        specifications: {
            "Technology": "Piezoelectric",
            "Frequency": "28-32kHz auto-tuning",
            "Power Levels": "10 adjustable settings",
            "Water Flow": "0-150ml/min",
            "Handpiece": "Detachable, autoclavable",
            "Warranty": "2 years + 1 year extended"
        }
    }
};

export default function ProductDetailPage({
    productId,
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
    onCheckoutClick
}: ProductDetailPageProps) {
    const product = productDatabase[productId as keyof typeof productDatabase] || productDatabase[1];

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [liked, setLiked] = useState(isLiked);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
        if (onToggleLike) {
            onToggleLike(product.id);
        }
        toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
    };

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    // Add early return with error message if product is undefined
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
                    <p className="text-gray-600 mt-2">Product ID: {productId}</p>
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

    const router = useRouter();

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
            // onBrandClick={onBrandClick}
            // onBuyingGuideClick={onBuyingGuideClick}
            // onEventsClick={onEventsClick}
            // onMembershipClick={onMembershipClick}
            // onFreebiesClick={onFreebiesClick}
            // onBestSellerClick={onBestSellerClick}
            // onClinicSetupClick={onClinicSetupClick}
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
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.originalPrice > product.price && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
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
                            <p className="text-sm text-blue-600 font-semibold uppercase">{product.brand}</p>

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
                                <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.inStock ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span className="text-green-600 font-semibold">In Stock ({product.stockCount} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-semibold">Out of Stock</span>
                                )}
                            </div>

                            {/* SKU */}
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>

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
                                            onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                            className="px-4 py-2 text-black bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-600">Max: {product.stockCount}</span>
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
                                {/* Variant Card 1 - Silver */}
                                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all">
                                    <div className="flex gap-3">
                                        {/* Small Product Image */}
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <ImageWithFallback
                                                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200"
                                                alt="Silver variant"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-bl">57%</div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 mb-2">
                                                Waldent External Water Spray Straight Handpiece - Silver (W-124 EI)
                                            </h3>

                                            {/* Specifications Grid */}
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-600">Material:</span>
                                                    <span className="font-semibold text-gray-900">Stainless Steel</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Size:</span>
                                                    <span className="font-semibold text-gray-900">Standard</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="font-semibold text-gray-900">165g</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Shade:</span>
                                                    <span className="font-semibold text-gray-900">Silver</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-lg font-bold text-blue-600">₹ 2,100</span>
                                                <span className="text-xs text-gray-400 line-through">₹ 4,900</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                                                <Tag className="w-3 h-3" />
                                                <span className="font-semibold">105 points</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                                                <RotateCcw className="w-3 h-3" />
                                                <span>10-Days Returnable</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onCartCountChange(cartCount + 1);
                                                    toast.success('Added Silver variant to cart!');
                                                }}
                                                className="w-full py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Variant Card 2 - Blue */}
                                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all">
                                    <div className="flex gap-3">
                                        {/* Small Product Image */}
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <ImageWithFallback
                                                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200"
                                                alt="Blue variant"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-bl">57%</div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 mb-2">
                                                Waldent External Water Spray Straight Handpiece - Blue (W-135 EI)
                                            </h3>

                                            {/* Specifications Grid */}
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-600">Material:</span>
                                                    <span className="font-semibold text-gray-900">Stainless Steel</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Size:</span>
                                                    <span className="font-semibold text-gray-900">Standard</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="font-semibold text-gray-900">162g</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Shade:</span>
                                                    <span className="font-semibold text-gray-900">Blue</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-lg font-bold text-blue-600">₹ 2,100</span>
                                                <span className="text-xs text-gray-400 line-through">₹ 4,900</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                                                <Tag className="w-3 h-3" />
                                                <span className="font-semibold">105 points</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                                                <RotateCcw className="w-3 h-3" />
                                                <span>10-Days Returnable</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onCartCountChange(cartCount + 1);
                                                    toast.success('Added Blue variant to cart!');
                                                }}
                                                className="w-full py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Variant Card 3 - Red */}
                                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all">
                                    <div className="flex gap-3">
                                        {/* Small Product Image */}
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <ImageWithFallback
                                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200"
                                                alt="Red variant"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-bl">57%</div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900 mb-2">
                                                Waldent External Water Spray Straight Handpiece - Red (W-146 EI)
                                            </h3>

                                            {/* Specifications Grid */}
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-3 h-3 text-gray-500" />
                                                    <span className="text-gray-600">Material:</span>
                                                    <span className="font-semibold text-gray-900">Stainless Steel</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Size:</span>
                                                    <span className="font-semibold text-gray-900">Standard</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="font-semibold text-gray-900">168g</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">Shade:</span>
                                                    <span className="font-semibold text-gray-900">Red</span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-lg font-bold text-blue-600">₹ 2,100</span>
                                                <span className="text-xs text-gray-400 line-through">₹ 4,900</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                                                <Tag className="w-3 h-3" />
                                                <span className="font-semibold">105 points</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                                                <RotateCcw className="w-3 h-3" />
                                                <span>10-Days Returnable</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onCartCountChange(cartCount + 1);
                                                    toast.success('Added Red variant to cart!');
                                                }}
                                                className="w-full py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                    {product.features.map((feature, index) => (
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
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex border-b border-gray-200 py-3">
                                        <span className="w-1/3 font-semibold text-gray-900">{key}:</span>
                                        <span className="w-2/3 text-gray-700">{value}</span>
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