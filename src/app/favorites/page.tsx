'use client';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Heart, ShoppingCart, Trash2, Star, Filter, ChevronDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface FavoritesPageProps {
    cartCount: number;
    onCartCountChange: (count: number) => void;
    onBackToHome: () => void;
    onCartClick?: () => void;
    likedProducts: Set<string>;
    // Accept string|number for flexibility with different product id types
    onToggleLike: (productId: string | number) => void;
    onBrandClick?: () => void;
    onBuyingGuideClick?: () => void;
    onEventsClick?: () => void;
    onMembershipClick?: () => void;
    onFreebiesClick?: () => void;
    onBestSellerClick?: () => void;
    onClinicSetupClick?: () => void;
}

interface FavoriteProductCardProps {
    id: number;
    name: string;
    price: string;
    image: string;
    rating: number;
    category: string;
    inStock: boolean;
    onRemove: () => void;
    onAddToCart: () => void;
}

function FavoriteProductCard({
    name,
    price,
    image,
    rating,
    category,
    inStock,
    onRemove,
    onAddToCart
}: FavoriteProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-red-400 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-lg text-red-500 hover:bg-red-500 hover:text-white hover:scale-110"
            >
                <Trash2 className="w-5 h-5" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                {category}
            </div>

            {/* Stock Status */}
            {!inStock && (
                <div className="absolute top-14 left-3 z-10 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Out of Stock
                </div>
            )}

            {/* Product Image */}
            <div className="relative bg-gray-100 aspect-square overflow-hidden p-4">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-contain transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
                        } ${!inStock ? 'opacity-50' : ''}`}
                />
                {!inStock && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                        <span className="text-white font-bold text-lg bg-red-500 px-4 py-2 rounded-lg">
                            UNAVAILABLE
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                                }`}
                        />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({rating}.0)</span>
                </div>

                {/* Product Name */}
                <h3 className="text-gray-900 font-medium text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {name}
                </h3>

                {/* Price */}
                <p className="text-blue-600 font-bold text-lg mb-3">{price}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onAddToCart}
                        disabled={!inStock}
                        className={`
              flex-1 py-2.5 px-4 rounded-xl font-bold text-sm
              transition-all duration-300 flex items-center justify-center gap-2
              ${inStock
                                ? isHovered
                                    ? 'bg-blue-700 text-white shadow-xl translate-y-[-2px]'
                                    : 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
              hover:shadow-2xl active:scale-95 disabled:scale-100 disabled:translate-y-0
            `}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FavoritesPage({
    cartCount,
    onCartCountChange,
    onBackToHome,
    onCartClick,
    likedProducts,
    onToggleLike,
    onBrandClick,
    onBuyingGuideClick,
    onEventsClick,
    onMembershipClick,
    onFreebiesClick,
    onBestSellerClick,
    onClinicSetupClick
}: FavoritesPageProps) {
    const [sortBy, setSortBy] = useState('Recently Added');
    const [filterCategory, setFilterCategory] = useState('All Categories');
    const [showSortFilter, setShowSortFilter] = useState(false);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    const sortOptions = ['Recently Added', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Name: A-Z'];
    const categories = ['All Categories', 'Dental Chairs', 'Instruments', 'Equipment', 'Consumables', 'Sterilization'];

    const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);

    // Generate favorite products based on liked IDs
    useEffect(() => {
        const products = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: `${['Rovena Riva Series', 'Premium Dental', 'Professional', 'Elite Medical', 'Advanced'][i % 5]} ${i + 1} Pcs. Wide Seating Claret Red Chair`,
            price: `$${(789 + i * 50).toFixed(2)}`,
            image: "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400",
            rating: Math.floor(Math.random() * 2) + 4,
            category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
            inStock: Math.random() > 0.2,
        }));

        setFavoriteProducts(products);
    }, []);


    const handleRemove = (productId: number) => {
        onToggleLike(String(productId));
        toast.success('Removed from favorites');
    };

    const handleAddToCart = (productName: string) => {
        onCartCountChange(cartCount + 1);
        toast.success('🎉 Added to cart!', {
            description: `${productName.slice(0, 40)}...`,
            duration: 2000,
        });
    };

    const handleAddAllToCart = () => {
        const inStockCount = favoriteProducts.filter(p => p.inStock).length;

        if (!onCartCountChange) {
            console.error('onCartCountChange not provided');
            return;
        }

        if (inStockCount > 0) {
            onCartCountChange(cartCount + inStockCount);
            toast.success(`🎉 Added ${inStockCount} items to cart!`);
        } else {
            toast.error('No items in stock to add');
        }
    };


    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to remove all favorites?')) {
            favoriteProducts.forEach(product => onToggleLike(String(product.id)));
            toast.success('All favorites cleared');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />



            {/* Navigation */}
            <Navigation
                currentPage="favorites"
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white py-12 md:py-16 mt-6 animate-fade-in">
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="w-12 h-12 fill-white" />
                                <h1 className="text-4xl md:text-5xl font-bold">My Favorites</h1>
                            </div>
                            <p className="text-white/90 text-lg md:text-xl">
                                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>

                        {favoriteProducts.length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddAllToCart}
                                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add All to Cart
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {favoriteProducts.length === 0 && (
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center animate-fade-in">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Favorites Yet</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Start adding products to your favorites by clicking the heart icon on any product
                        </p>
                        <button
                            onClick={onBackToHome}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            {/* Filters & Products */}
            {favoriteProducts.length > 0 && (
                <>
                    {/* Filters Section */}
                    <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
                        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700 font-semibold text-sm md:text-base">FILTER & SORT</span>
                                </div>

                                <div className="flex gap-3 flex-wrap">
                                    {/* Category Filter */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                            className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <span>{filterCategory}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showCategoryFilter && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[200px]">
                                                {categories.map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            setFilterCategory(category);
                                                            setShowCategoryFilter(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${filterCategory === category ? 'bg-blue-100 font-semibold' : ''
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort By */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSortFilter(!showSortFilter)}
                                            className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <span>Sort: {sortBy}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showSortFilter ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showSortFilter && (
                                            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[220px]">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            setShowSortFilter(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${sortBy === option ? 'bg-blue-100 font-semibold' : ''
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>{favoriteProducts.filter(p => p.inStock).length} In Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>{favoriteProducts.filter(p => !p.inStock).length} Out of Stock</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <main className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {favoriteProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <FavoriteProductCard
                                        {...product}
                                        onRemove={() => handleRemove(product.id)}
                                        onAddToCart={() => handleAddToCart(product.name)}
                                    />
                                </div>
                            ))}
                        </div>
                    </main>
                </>
            )}


        </div>
    );
}