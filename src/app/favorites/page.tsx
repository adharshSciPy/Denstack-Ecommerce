'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Navigation from '../components/Navigation';
import { Heart, ShoppingCart, Trash2, Star, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import baseUrl from '../baseUrl';

interface ApiFavoriteProduct {
    _id: string; // This is the favoriteId
    product: {
        _id: string; // This is the productId
        name: string;
        description: string;
        basePrice: number;
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
        brand?: {
            name: string;
            brandId: string;
        };
        mainCategory?: {
            categoryName: string;
            mainCategoryId: string;
        };
        subCategory?: {
            categoryName: string;
            subCategoryId: string;
        };
        status: string;
        productId: string;
        createdAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface FormattedProduct {
    id: string; // This is the favoriteId
    favoriteId: string; // Added this field to store the favorite ID
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
    favoriteId: string; // Added this prop
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
    productId,
    favoriteId,
    isLoadingLike = false,
    onRemove,
    onAddToCart,
    onProductClick
}: FavoriteProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleCardClick = () => {
        if (onProductClick) {
            onProductClick();
        }
    };

    return (
        <div
            className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-red-400 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Remove Button with loading state */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoadingLike) {
                        onRemove();
                    }
                }}
                className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-lg ${isLoadingLike
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-500 hover:text-white hover:scale-110'
                    }`}
                disabled={isLoadingLike}
            >
                {isLoadingLike ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                ) : (
                    <Trash2 className="w-5 h-5" />
                )}
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

            {/* Discount Badge */}
            {discountPercentage && discountPercentage > 0 && (
                <div className="absolute top-3 right-16 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {discountPercentage}% OFF
                </div>
            )}

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
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';
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
                <div className="mb-3">
                    {originalPrice && (
                        <p className="text-gray-400 line-through text-sm">
                            {originalPrice}
                        </p>
                    )}
                    <p className="text-blue-600 font-bold text-lg">{price}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (inStock) {
                                onAddToCart();
                            }
                        }}
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
    
    // Filter states
    const [filterBrand, setFilterBrand] = useState('All Brands');
    const [showBrandFilter, setShowBrandFilter] = useState(false);
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [availablePriceRange, setAvailablePriceRange] = useState<[number, number]>([0, 100000]);
    
    const router = useRouter();
    const { isLoggedIn: userIsLoggedIn } = useAuth();

    const sortOptions = ['Recently Added', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Name: A-Z'];
    
    // Generate categories and brands from data
    const categories = useMemo(() => {
        const allCategories = ['All Categories'];
        favoriteProducts.forEach(product => {
            if (product.category && !allCategories.includes(product.category)) {
                allCategories.push(product.category);
            }
        });
        return allCategories.sort();
    }, [favoriteProducts]);
    
    const brands = useMemo(() => {
        const allBrands = ['All Brands'];
        favoriteProducts.forEach(product => {
            if (product.brand && !allBrands.includes(product.brand)) {
                allBrands.push(product.brand);
            }
        });
        return allBrands.sort();
    }, [favoriteProducts]);

    const hasFetchedRef = useRef(false);
    const initialLikedProductsLoadedRef = useRef(false);

    // Load liked products from localStorage
    useEffect(() => {
        if (initialLikedProductsLoadedRef.current) return;
        
        const savedLikedProducts = localStorage.getItem('likedProducts');
        if (savedLikedProducts) {
            try {
                setLocalLikedProducts(new Set(JSON.parse(savedLikedProducts)));
            } catch (error) {
                console.error('Error parsing liked products:', error);
            }
        }
        initialLikedProductsLoadedRef.current = true;
    }, []);

    // Save liked products to localStorage
    useEffect(() => {
        localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
    }, [localLikedProducts]);

    const likedProducts = localLikedProducts;

    // Fetch favorite products from API
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
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                setError('Session expired. Please login again.');
                router.push('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch favorites: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const formattedProducts: FormattedProduct[] = data.data.map((item: ApiFavoriteProduct) => {
                    const product = item.product;
                    const firstVariant = product.variants?.[0];
                    
                    // Calculate price
                    const bestPrice = firstVariant?.doctorDiscountPrice || 
                                     firstVariant?.clinicDiscountPrice || 
                                     firstVariant?.originalPrice || 
                                     product.basePrice || 0;
                    
                    const originalPriceValue = firstVariant?.originalPrice || product.basePrice || 0;
                    const discountPercentage = firstVariant?.doctorDiscountPercentage || 
                                              firstVariant?.clinicDiscountPercentage || 0;
                    
                    // Get image URL
                    const imageUrl = product.image?.[0] 
                        ? `${baseUrl.INVENTORY}${product.image[0]}`
                        : 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';
                    
                    // Check stock
                    const totalStock = product.variants?.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0) || 0;
                    const inStock = totalStock > 0;
                    
                    // Generate consistent rating
                    const hash = product._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const rating = 3 + (hash % 3);

                    return {
                        id: item._id,
                        favoriteId: item._id, // Store the favorite ID
                        productId: product._id,
                        name: product.name,
                        price: `₹${bestPrice.toFixed(2)}`,
                        originalPrice: discountPercentage > 0 ? `₹${originalPriceValue.toFixed(2)}` : undefined,
                        discountPercentage,
                        image: imageUrl,
                        rating,
                        category: product.mainCategory?.categoryName || 'Uncategorized',
                        brand: product.brand?.name,
                        inStock,
                        createdAt: item.createdAt,
                        variants: product.variants || [],
                        numericPrice: bestPrice,
                        numericOriginalPrice: originalPriceValue
                    };
                });

                setFavoriteProducts(formattedProducts);
                                
                // Update liked products
                const likedIds = formattedProducts.map(p => p.productId);
                setLocalLikedProducts(prev => {
                    const newSet = new Set(prev);
                    likedIds.forEach(id => newSet.add(id));
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
    }, [router, userIsLoggedIn]);

    // Load favorite products on component mount
    useEffect(() => {
        fetchFavoriteProducts();
        
        return () => {
            hasFetchedRef.current = false;
        };
    }, [fetchFavoriteProducts]);

    // NEW: API function for removing favorites by favoriteId
    const removeFavoriteByIdAPI = useCallback(async (favoriteId: string) => {
        try {
            setIsProcessingLike(favoriteId);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const response = await fetch(
                `${baseUrl.INVENTORY}/api/v1/product/favorites/remove/${favoriteId}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                }
            );  
            
            if (response.status === 401) {
                return { success: false, requiresLogin: true };
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message,
                productId: data.data?.productId,
            };
        } catch (err) {
            console.error("Error removing favorite by ID:", err);
            return { success: false, error: err };
        } finally {
            setIsProcessingLike(null);
        }
    }, []);

    // OLD: API function for adding/removing favorites (still used for toggle)
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
        sessionStorage.setItem('productToLikeAfterLogin', productId);
        sessionStorage.setItem('redirectAfterLogin', '/favorites');
        
        toast.error('Login Required', {
            description: 'You need to login to manage favorites',
            action: {
                label: 'Login',
                onClick: () => {
                    router.push('/login');
                },
            },
            duration: 5000,
        });
    }, [router]);

    // Main like toggle handler - UPDATED to use removeFavoriteByIdAPI
    const handleToggleLike = async (productId: string | number, favoriteId?: string) => {
        const productIdStr = String(productId);
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const isLoggedIn = !!token || userIsLoggedIn;

        if (!isLoggedIn) {
            showLoginPrompt(productIdStr);
            return;
        }

        const isCurrentlyLiked = likedProducts.has(productIdStr);

        // If we have a favoriteId (from the favorites page), use the DELETE endpoint
        if (favoriteId && isCurrentlyLiked) {
            // Optimistic UI update
            setLocalLikedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(productIdStr);
                return newSet;
            });

            // Remove from favorites list immediately
            setFavoriteProducts(prev => prev.filter(p => p.favoriteId !== favoriteId));

            // Make DELETE API call
            const result = await removeFavoriteByIdAPI(favoriteId);

            if (!result.success) {
                // Revert optimistic update on failure
                setLocalLikedProducts(prev => {
                    const newSet = new Set(prev);
                    newSet.add(productIdStr);
                    return newSet;
                });

                // Re-fetch to restore the product
                hasFetchedRef.current = false;
                fetchFavoriteProducts();

                if (result.requiresLogin) {
                    showLoginPrompt(productIdStr);
                } else {
                    toast.error('Failed to remove from favorites. Please try again.');
                }
            } else {
                toast.success('Removed from favorites');
                // Update local liked products
                setLocalLikedProducts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productIdStr);
                    return newSet;
                });
            }
            return;
        }

        // For adding or when no favoriteId is provided, use the toggle endpoint
        // Optimistic UI update for local state
        setLocalLikedProducts(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyLiked) {
                newSet.delete(productIdStr);
            } else {
                newSet.add(productIdStr);
            }
            return newSet;
        });

        // Remove from favorites list immediately if removing
        if (isCurrentlyLiked) {
            setFavoriteProducts(prev => prev.filter(p => p.productId !== productIdStr));
        }

        // Make API call to toggle favorite
        const result = await addToFavoritesAPI(productIdStr);

        if (!result.success) {
            // Revert optimistic update on failure
            setLocalLikedProducts(prev => {
                const newSet = new Set(prev);
                if (isCurrentlyLiked) {
                    newSet.add(productIdStr);
                } else {
                    newSet.delete(productIdStr);
                }
                return newSet;
            });

            if (isCurrentlyLiked) {
                // Re-fetch to restore the product in the list
                hasFetchedRef.current = false;
                fetchFavoriteProducts();
            }

            if (result.requiresLogin) {
                showLoginPrompt(productIdStr);
            } else {
                toast.error('Failed to update favorites. Please try again.');
            }
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

    // NEW: Specific handler for removing from favorites page (with favoriteId)
    const handleRemoveFavorite = async (favoriteId: string, productId: string) => {
        await handleToggleLike(productId, favoriteId);
    };

    const handleAddToCart = (productName: string) => {
        // This would typically update a global cart state
        toast.success('🎉 Added to cart!', {
            description: `${productName.slice(0, 40)}...`,
            duration: 2000,
        });
    };

    // const handleAddAllToCart = () => {
    //     const inStockCount = favoriteProducts.filter((p: FormattedProduct) => p.inStock).length;

    //     if (inStockCount > 0) {
    //         toast.success(`🎉 Added ${inStockCount} items to cart!`);
    //     } else {
    //         toast.error('No items in stock to add');
    //     }
    // };

    const handleProductClick = (productId: string) => {
        router.push(`/productdetailpage/${productId}`);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilterCategory('All Categories');
        setFilterBrand('All Brands');
        setShowInStockOnly(false);
        setPriceRange(availablePriceRange);
    };

    // Apply filtering and sorting
    const getFilteredAndSortedProducts = useCallback((): FormattedProduct[] => {
        let filtered = [...favoriteProducts];

        // Apply category filter
        if (filterCategory !== 'All Categories') {
            filtered = filtered.filter(product => product.category === filterCategory);
        }

        // Apply brand filter
        if (filterBrand !== 'All Brands') {
            filtered = filtered.filter(product => product.brand === filterBrand);
        }

        // Apply stock filter
        if (showInStockOnly) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Apply sorting
        switch (sortBy) {
            case 'Price: Low to High':
                return filtered.sort((a, b) => a.numericPrice - b.numericPrice);
            case 'Price: High to Low':
                return filtered.sort((a, b) => b.numericPrice - a.numericPrice);
            case 'Highest Rated':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'Name: A-Z':
                return filtered.sort((a, b) => a.name.localeCompare(b.name));
            case 'Recently Added':
            default:
                return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [favoriteProducts, filterCategory, filterBrand, priceRange, showInStockOnly, sortBy]);

    const filteredProducts = getFilteredAndSortedProducts();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation
                    currentPage="favorites"
                    cartCount={0}
                    favoritesCount={likedProducts.size}
                    onCartCountChange={() => {}}
                />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Loading your favorites...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation
                    currentPage="favorites"
                    cartCount={0}
                    favoritesCount={likedProducts.size}
                    onCartCountChange={() => {}}
                />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Favorites</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        {error.includes('login') ? (
                            <button
                                onClick={() => router.push('/login')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Go to Login
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    hasFetchedRef.current = false;
                                    fetchFavoriteProducts();
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
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

            {/* Navigation */}
            <Navigation
                currentPage="favorites"
                cartCount={0}
                favoritesCount={likedProducts.size}
                onCartCountChange={() => {}}
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
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>

                        {/* {filteredProducts.length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddAllToCart}
                                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add All to Cart
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && favoriteProducts.length === 0 ? (
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center animate-fade-in">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Favorites Yet</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Start adding products to your favorites by clicking the heart icon on any product
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center animate-fade-in">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Products Match Your Filters</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Try adjusting your filters to see more products
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Filters & Products */}
            {filteredProducts.length > 0 && (
                <>
                    {/* Filters Section */}
                    <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
                        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700 font-semibold text-sm md:text-base">FILTER & SORT</span>
                                </div>

                                <button
                                    onClick={resetFilters}
                                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
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
                                        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
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

                                {/* Brand Filter */}
                                {brands.length > 1 && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowBrandFilter(!showBrandFilter)}
                                            className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <span>{filterBrand}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showBrandFilter ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showBrandFilter && (
                                            <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
                                                {brands.map((brand) => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => {
                                                            setFilterBrand(brand);
                                                            setShowBrandFilter(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${filterBrand === brand ? 'bg-blue-100 font-semibold' : ''
                                                            }`}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Stock Filter */}
                                <button
                                    onClick={() => setShowInStockOnly(!showInStockOnly)}
                                    className={`px-4 py-2.5 border-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 ${showInStockOnly
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${showInStockOnly ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    In Stock Only
                                </button>

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

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>{filteredProducts.filter(p => p.inStock).length} In Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>{filteredProducts.filter(p => !p.inStock).length} Out of Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>{filteredProducts.length} Products</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <main className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {filteredProducts.map((product, index) => (
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
                                        favoriteId={product.favoriteId} // Pass the favoriteId
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