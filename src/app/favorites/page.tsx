'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Navigation from '../components/Navigation';
import { Heart, ShoppingCart, Trash2, Star, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import baseUrl from '../baseUrl';

interface ApiFavoriteProduct {
    _id: string;
    product: {
        _id: string;
        name: string;
        description: string;
        // ✅ Correct field from ProductSchema (not basePrice, not price)
        originalPrice: number;
        clinicDiscountPrice: number | null;
        clinicDiscountPercentage: number | null;
        doctorDiscountPrice: number | null;
        doctorDiscountPercentage: number | null;
        stock: number; // ✅ flat field on product (not just in variants)
        image: string[];
        variants: Array<{
            _id: string;
            size: string;
            color: string;
            material: string;
            originalPrice: number;
            clinicDiscountPrice: number | null;
            clinicDiscountPercentage: number | null;
            doctorDiscountPrice: number | null;
            doctorDiscountPercentage: number | null;
            stock: number;
        }>;
        brand?: { name: string };
        mainCategory?: { categoryName?: string; name?: string };
        subCategory?: { categoryName?: string; name?: string };
        status: string;
        productId: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface FormattedProduct {
    id: string;
    favoriteId: string;
    productId: string;
    name: string;
    price: string;
    originalPrice?: string;
    discountPercentage?: number;
    image: string;
    rating: number;
    category: string;
    brand?: string;
    inStock: boolean;
    createdAt: string;
    variants: ApiFavoriteProduct['product']['variants'];
    numericPrice: number;
    numericOriginalPrice: number;
}

interface FavoriteProductCardProps {
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    discountPercentage?: number;
    image: string;
    rating: number;
    category: string;
    brand?: string;
    inStock: boolean;
    productId: string;
    favoriteId: string;
    isLoadingLike?: boolean;
    onRemove: () => void;
    onAddToCart: () => void;
    onProductClick?: () => void;
}

function FavoriteProductCard({
    name,
    price,
    originalPrice,
    discountPercentage,
    image,
    rating,
    category,
    brand,
    inStock,
    isLoadingLike = false,
    onRemove,
    onAddToCart,
    onProductClick,
}: FavoriteProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-red-400 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onProductClick}
        >
            {/* Remove Button */}
            <button
                onClick={(e) => { e.stopPropagation(); if (!isLoadingLike) onRemove(); }}
                className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isLoadingLike
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-red-500 hover:bg-red-500 hover:text-white hover:scale-110'
                }`}
                disabled={isLoadingLike}
            >
                {isLoadingLike
                    ? <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                    : <Trash2 className="w-5 h-5" />
                }
            </button>

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                {category}
            </div>

            {/* Brand Badge */}
            {brand && (
                <div className="absolute top-14 left-3 z-10 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {brand}
                </div>
            )}

            {/* ✅ Discount Badge — (discountPercentage ?? 0) > 0 prevents React rendering "0" */}
            {(discountPercentage ?? 0) > 0 && (
                <div className="absolute top-3 right-16 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {discountPercentage}% OFF
                </div>
            )}

            {/* Product Image */}
            <div className="relative bg-gray-100 aspect-square overflow-hidden p-4">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-contain transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    } ${!inStock ? 'opacity-50' : ''}`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';
                    }}
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
                            className={`w-4 h-4 ${
                                i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
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
                <div className="mb-3">
                    {originalPrice && (
                        <p className="text-gray-400 line-through text-sm">{originalPrice}</p>
                    )}
                    <p className="text-blue-600 font-bold text-lg">{price}</p>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={(e) => { e.stopPropagation(); if (inStock) onAddToCart(); }}
                    disabled={!inStock}
                    className={`
                        w-full py-2.5 px-4 rounded-xl font-bold text-sm
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
    );
}

export default function FavoritesPage() {
    const [sortBy, setSortBy] = useState('Recently Added');
    const [filterCategory, setFilterCategory] = useState('All Categories');
    const [showSortFilter, setShowSortFilter] = useState(false);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null);
    const [localLikedProducts, setLocalLikedProducts] = useState<Set<string>>(new Set());
    const [favoriteProducts, setFavoriteProducts] = useState<FormattedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [filterBrand, setFilterBrand] = useState('All Brands');
    const [showBrandFilter, setShowBrandFilter] = useState(false);
    const [showInStockOnly, setShowInStockOnly] = useState(false);

    const router = useRouter();
    const { isLoggedIn: userIsLoggedIn } = useAuth();

    const sortOptions = ['Recently Added', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Name: A-Z'];

    const categories = useMemo(() => {
        const all = ['All Categories'];
        favoriteProducts.forEach((p) => { if (p.category && !all.includes(p.category)) all.push(p.category); });
        return all.sort();
    }, [favoriteProducts]);

    const brands = useMemo(() => {
        const all = ['All Brands'];
        favoriteProducts.forEach((p) => { if (p.brand && !all.includes(p.brand)) all.push(p.brand); });
        return all.sort();
    }, [favoriteProducts]);

    const hasFetchedRef = useRef(false);
    const initialLikedProductsLoadedRef = useRef(false);

    useEffect(() => {
        if (initialLikedProductsLoadedRef.current) return;
        const saved = localStorage.getItem('likedProducts');
        if (saved) {
            try { setLocalLikedProducts(new Set(JSON.parse(saved))); } catch {}
        }
        initialLikedProductsLoadedRef.current = true;
    }, []);

    useEffect(() => {
        localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
    }, [localLikedProducts]);

    const fetchFavoriteProducts = useCallback(async () => {
        if (hasFetchedRef.current && !isInitialLoad) return;

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token && !userIsLoggedIn) {
                setError('Please login to view favorites');
                setLoading(false);
                setIsInitialLoad(false);
                return;
            }

            const response = await fetch(`${baseUrl.INVENTORY}/api/v1/product/favorites`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.status === 401) {
                setError('Session expired. Please login again.');
                router.push('/login');
                return;
            }

            if (!response.ok) throw new Error(`Failed to fetch favorites: ${response.status}`);

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const formattedProducts: FormattedProduct[] = data.data
                    .filter((item: ApiFavoriteProduct) => item.product != null)
                    .map((item: ApiFavoriteProduct) => {
                        const product = item.product;

                        // ✅ Price logic using EXACT ProductSchema field names:
                        // Priority: doctorDiscountPrice > clinicDiscountPrice > originalPrice
                        // All three are at product level (or in each variant if variants exist)
                        const firstVariant = product.variants?.[0];

                        const bestPrice =
                            // Check variant prices first if variants exist
                            firstVariant?.doctorDiscountPrice ||
                            firstVariant?.clinicDiscountPrice ||
                            firstVariant?.originalPrice ||
                            // Fall back to product-level prices
                            product.doctorDiscountPrice ||
                            product.clinicDiscountPrice ||
                            product.originalPrice ||
                            0;

                        const baseOriginalPrice =
                            firstVariant?.originalPrice || product.originalPrice || 0;

                        const discountPercentage =
                            firstVariant?.doctorDiscountPercentage ||
                            firstVariant?.clinicDiscountPercentage ||
                            product.doctorDiscountPercentage ||
                            product.clinicDiscountPercentage ||
                            0;

                        // ✅ Stock: product.stock is the flat field in schema (82 in your example)
                        // Also add variant stocks if any variants exist
                        const variantStock = product.variants?.reduce(
                            (sum: number, v) => sum + (v.stock || 0), 0
                        ) ?? 0;
                        const totalStock = (product.stock || 0) + variantStock;
                        const inStock = totalStock > 0;

                        // ✅ Image: avoid double-prefixing absolute URLs
                        const imageUrl = product.image?.[0]
                            ? product.image[0].startsWith('http')
                                ? product.image[0]
                                : `${baseUrl.INVENTORY}${product.image[0]}`
                            : 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';

                        // ✅ Category: backend uses "categoryName" in your MainCategory schema
                        const categoryName =
                            product.mainCategory?.categoryName ||
                            product.mainCategory?.name ||
                            'General';

                        const brandName = product.brand?.name;

                        const hash = product._id.split('').reduce(
                            (acc: number, char: string) => acc + char.charCodeAt(0), 0
                        );
                        const rating = 3 + (hash % 3);

                        return {
                            id: item._id,
                            favoriteId: item._id,
                            productId: product._id,
                            name: product.name,
                            price: `₹${bestPrice.toFixed(2)}`,
                            // ✅ Only show originalPrice if there's actually a discount
                            originalPrice:
                                discountPercentage > 0 && baseOriginalPrice !== bestPrice
                                    ? `₹${baseOriginalPrice.toFixed(2)}`
                                    : undefined,
                            discountPercentage: discountPercentage || undefined,
                            image: imageUrl,
                            rating,
                            category: categoryName,
                            brand: brandName,
                            inStock,
                            createdAt: item.createdAt,
                            variants: product.variants || [],
                            numericPrice: bestPrice,
                            numericOriginalPrice: baseOriginalPrice,
                        };
                    });

                setFavoriteProducts(formattedProducts);

                const likedIds = formattedProducts.map((p) => p.productId);
                setLocalLikedProducts((prev) => {
                    const newSet = new Set(prev);
                    likedIds.forEach((id) => newSet.add(id));
                    return newSet;
                });

                hasFetchedRef.current = true;
            } else {
                setFavoriteProducts([]);
            }
        } catch (err) {
            console.error('Error fetching favorite products:', err);
            setError(err instanceof Error ? err.message : 'Failed to load favorites');
            toast.error('Failed to load favorite products');
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [router, userIsLoggedIn, isInitialLoad]);

    useEffect(() => {
        fetchFavoriteProducts();
        return () => { hasFetchedRef.current = false; };
    }, [fetchFavoriteProducts]);

    const removeFavoriteByIdAPI = useCallback(async (favoriteId: string) => {
        try {
            setIsProcessingLike(favoriteId);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(
                `${baseUrl.INVENTORY}/api/v1/product/favorites/remove/${favoriteId}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    credentials: 'include',
                }
            );
            if (response.status === 401) return { success: false, requiresLogin: true };
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return { success: true, message: data.message };
        } catch (err) {
            return { success: false, error: err };
        } finally {
            setIsProcessingLike(null);
        }
    }, []);

    const addToFavoritesAPI = useCallback(async (productId: string) => {
        try {
            setIsProcessingLike(productId);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(
                `${baseUrl.INVENTORY}/api/v1/product/favorites/add/${productId}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include',
                }
            );
            if (response.status === 401) return { success: false, requiresLogin: true };
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return { success: true, liked: data.liked, message: data.message };
        } catch (err) {
            return { success: false, error: err };
        } finally {
            setIsProcessingLike(null);
        }
    }, []);

    const showLoginPrompt = useCallback((productId: string) => {
        sessionStorage.setItem('productToLikeAfterLogin', productId);
        sessionStorage.setItem('redirectAfterLogin', '/favorites');
        toast.error('Login Required', {
            description: 'You need to login to manage favorites',
            action: { label: 'Login', onClick: () => router.push('/login') },
            duration: 5000,
        });
    }, [router]);

    const handleToggleLike = async (productId: string | number, favoriteId?: string) => {
        const productIdStr = String(productId);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token && !userIsLoggedIn) { showLoginPrompt(productIdStr); return; }

        const isCurrentlyLiked = localLikedProducts.has(productIdStr);

        if (favoriteId && isCurrentlyLiked) {
            // Optimistic remove
            setLocalLikedProducts((prev) => { const s = new Set(prev); s.delete(productIdStr); return s; });
            setFavoriteProducts((prev) => prev.filter((p) => p.favoriteId !== favoriteId));

            const result = await removeFavoriteByIdAPI(favoriteId);
            if (!result.success) {
                setLocalLikedProducts((prev) => new Set([...prev, productIdStr]));
                hasFetchedRef.current = false;
                fetchFavoriteProducts();
                if (result.requiresLogin) showLoginPrompt(productIdStr);
                else toast.error('Failed to remove from favorites. Please try again.');
            } else {
                toast.success('Removed from favorites');
            }
            return;
        }

        // Fallback toggle
        setLocalLikedProducts((prev) => {
            const s = new Set(prev);
            isCurrentlyLiked ? s.delete(productIdStr) : s.add(productIdStr);
            return s;
        });
        if (isCurrentlyLiked) {
            setFavoriteProducts((prev) => prev.filter((p) => p.productId !== productIdStr));
        }

        const result = await addToFavoritesAPI(productIdStr);
        if (!result.success) {
            setLocalLikedProducts((prev) => {
                const s = new Set(prev);
                isCurrentlyLiked ? s.add(productIdStr) : s.delete(productIdStr);
                return s;
            });
            if (isCurrentlyLiked) { hasFetchedRef.current = false; fetchFavoriteProducts(); }
            if (result.requiresLogin) showLoginPrompt(productIdStr);
            else toast.error('Failed to update favorites. Please try again.');
        } else {
            if (result.liked) {
                toast.success('Added to favorites!');
                hasFetchedRef.current = false;
                fetchFavoriteProducts();
            } else {
                toast.info('Removed from favorites');
            }
        }
    };

    const handleRemoveFavorite = (favoriteId: string, productId: string) =>
        handleToggleLike(productId, favoriteId);

    const handleAddToCart = (productName: string) => {
        toast.success('🎉 Added to cart!', {
            description: `${productName.slice(0, 40)}...`,
            duration: 2000,
        });
    };

    const handleProductClick = (productId: string) => router.push(`/productdetailpage/${productId}`);

    const resetFilters = () => {
        setFilterCategory('All Categories');
        setFilterBrand('All Brands');
        setShowInStockOnly(false);
    };

    const filteredProducts = useMemo((): FormattedProduct[] => {
        let filtered = [...favoriteProducts];
        if (filterCategory !== 'All Categories') filtered = filtered.filter((p) => p.category === filterCategory);
        if (filterBrand !== 'All Brands') filtered = filtered.filter((p) => p.brand === filterBrand);
        if (showInStockOnly) filtered = filtered.filter((p) => p.inStock);

        switch (sortBy) {
            case 'Price: Low to High': return filtered.sort((a, b) => a.numericPrice - b.numericPrice);
            case 'Price: High to Low': return filtered.sort((a, b) => b.numericPrice - a.numericPrice);
            case 'Highest Rated': return filtered.sort((a, b) => b.rating - a.rating);
            case 'Name: A-Z': return filtered.sort((a, b) => a.name.localeCompare(b.name));
            default: return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [favoriteProducts, filterCategory, filterBrand, showInStockOnly, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation currentPage="favorites" cartCount={0} favoritesCount={localLikedProducts.size} onCartCountChange={() => {}} />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Loading your favorites...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation currentPage="favorites" cartCount={0} favoritesCount={localLikedProducts.size} onCartCountChange={() => {}} />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Favorites</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        {error.includes('login') ? (
                            <button onClick={() => router.push('/login')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Go to Login
                            </button>
                        ) : (
                            <button onClick={() => { hasFetchedRef.current = false; fetchFavoriteProducts(); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />
            <Navigation currentPage="favorites" cartCount={0} favoritesCount={localLikedProducts.size} onCartCountChange={() => {}} />

            {/* Hero */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white py-12 md:py-16 mt-6">
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-12 h-12 fill-white" />
                        <h1 className="text-4xl md:text-5xl font-bold">My Favorites</h1>
                    </div>
                    <p className="text-white/90 text-lg md:text-xl">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>
            </div>

            {/* Empty States */}
            {filteredProducts.length === 0 && favoriteProducts.length === 0 ? (
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Favorites Yet</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Start adding products by clicking the heart icon on any product
                        </p>
                        <button onClick={() => router.push('/')} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Products Match Your Filters</h2>
                        <button onClick={resetFilters} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105">
                            Reset Filters
                        </button>
                    </div>
                </div>
            ) : null}

            {filteredProducts.length > 0 && (
                <>
                    {/* Filters */}
                    <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
                        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700 font-semibold text-sm md:text-base">FILTER & SORT</span>
                                </div>
                                <button onClick={resetFilters} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium">
                                    Reset Filters
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {/* Category */}
                                <div className="relative">
                                    <button onClick={() => setShowCategoryFilter(!showCategoryFilter)} className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 flex items-center gap-2">
                                        <span>{filterCategory}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showCategoryFilter && (
                                        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
                                            {categories.map((cat) => (
                                                <button key={cat} onClick={() => { setFilterCategory(cat); setShowCategoryFilter(false); }}
                                                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 ${filterCategory === cat ? 'bg-blue-100 font-semibold' : ''}`}>
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Brand */}
                                {brands.length > 1 && (
                                    <div className="relative">
                                        <button onClick={() => setShowBrandFilter(!showBrandFilter)} className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 flex items-center gap-2">
                                            <span>{filterBrand}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showBrandFilter ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showBrandFilter && (
                                            <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
                                                {brands.map((b) => (
                                                    <button key={b} onClick={() => { setFilterBrand(b); setShowBrandFilter(false); }}
                                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 ${filterBrand === b ? 'bg-blue-100 font-semibold' : ''}`}>
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* In Stock */}
                                <button onClick={() => setShowInStockOnly(!showInStockOnly)}
                                    className={`px-4 py-2.5 border-2 rounded-xl font-medium text-sm flex items-center gap-2 ${
                                        showInStockOnly ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full ${showInStockOnly ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    In Stock Only
                                </button>

                                {/* Sort */}
                                <div className="relative">
                                    <button onClick={() => setShowSortFilter(!showSortFilter)} className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 flex items-center gap-2">
                                        <span>Sort: {sortBy}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showSortFilter ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showSortFilter && (
                                        <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[220px]">
                                            {sortOptions.map((opt) => (
                                                <button key={opt} onClick={() => { setSortBy(opt); setShowSortFilter(false); }}
                                                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 ${sortBy === opt ? 'bg-blue-100 font-semibold' : ''}`}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <span>{filteredProducts.filter((p) => p.inStock).length} In Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                                    <span>{filteredProducts.filter((p) => !p.inStock).length} Out of Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span>{filteredProducts.length} Products</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <main className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {filteredProducts.map((product, index) => (
                                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                    <FavoriteProductCard
                                        {...product}
                                        isLoadingLike={isProcessingLike === product.favoriteId}
                                        onRemove={() => handleRemoveFavorite(product.favoriteId, product.productId)}
                                        onAddToCart={() => handleAddToCart(product.name)}
                                        onProductClick={() => handleProductClick(product.productId)}
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