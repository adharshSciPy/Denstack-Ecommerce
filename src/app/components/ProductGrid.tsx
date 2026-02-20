import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import baseUrl from "../baseUrl";
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner";
import { useAuth } from "../hooks/useAuth"; // Add this import

interface ProductGridProps {
  likedProducts?: Set<string | number>;
  onToggleLike?: (id: string | number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: string | number) => void;
}

interface FeaturedProduct {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    originalPrice: number;           // ← actual field name in DB
    clinicDiscountPrice?: number;
    doctorDiscountPrice?: number;
    image: string[];
    variants: any[];
    stock: number;                   // ← root-level stock field
    status: string;                  // ← "Available" | "Out of Stock" | "Low Stock"
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
  };
  title: string;
  description: string;
  badge: string | null;
  order: number;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
}

interface TransformedProduct {
  id: string;
  mongoId: string;
  name: string;
  price: number;
  originalPrice: number;
  clinicDiscountPrice?: number;
  doctorDiscountPrice?: number;
  image: string;
  badge: string | null;
  description: string;
  stock?: number;
  inStock?: boolean;
  category?: string;
  discount?: number;
  status?: string;
}

export default function ProductGrid({
  likedProducts: externalLikedProducts,
  onToggleLike: externalOnToggleLike,
  onAddToCart,
  onProductClick,
}: ProductGridProps) {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<string | number>>(new Set());
  const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null);

  const router = useRouter()
  const { isLoggedIn: userIsLoggedIn } = useAuth();

  // Load liked products from localStorage on component mount
  useEffect(() => {
    const savedLikedProducts = localStorage.getItem('likedProducts');
    if (savedLikedProducts) {
      try {
        const parsedLikedProducts = JSON.parse(savedLikedProducts);
        setLocalLikedProducts(new Set(parsedLikedProducts));
      } catch (error) {
        console.error('Error parsing liked products:', error);
      }
    }
  }, []);

  // Save liked products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(Array.from(localLikedProducts)));
  }, [localLikedProducts]);

  // Use external likedProducts if provided, otherwise use local state
  const likedProducts = externalLikedProducts || localLikedProducts;

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${baseUrl.INVENTORY}/api/v1/landing/featured-products/getAll`,
      );

      console.log("Featured products response:", response);

      if (response.status !== 200) {
        throw new Error(`Unexpected status ${response.status} from featured-products endpoint`);
      }

      const contentType = (response.headers && (response.headers['content-type'] || response.headers['Content-Type'])) || '';
      if (!contentType.includes('application/json')) {
        console.error('Featured products endpoint returned non-JSON content-type:', contentType);
        throw new Error('Invalid response from featured products endpoint');
      }

      const payload = response.data;
      const items: FeaturedProduct[] = payload?.data || payload || [];

      const transformedProducts: TransformedProduct[] = items
        .filter((item: FeaturedProduct) => item.product !== null)
        .map((item: FeaturedProduct) => {
          const product = item.product;

          // ── FIX 1: PRICE ─────────────────────────────────────────────────────
          // API returns originalPrice (not basePrice). Fall through all price fields.
          const price =
            product.originalPrice ||
            product.clinicDiscountPrice ||
            (product as any).basePrice ||
            product.variants?.[0]?.originalPrice ||
            product.variants?.[0]?.clinicDiscountPrice ||
            0;

          // ── FIX 2: STOCK ─────────────────────────────────────────────────────
          // Stock lives on product root AND/OR in variants. Try root first, then variant.
          const rootStock = typeof product.stock === 'number' ? product.stock : null;
          const variantStock = product.variants?.reduce(
            (sum: number, v: any) => sum + (typeof v.stock === 'number' ? v.stock : 0),
            0
          ) ?? 0;
          const totalStock = rootStock !== null ? rootStock : variantStock;

          // ── FIX 3: inStock ────────────────────────────────────────────────────
          // Use product.status if present ("Available" = in stock),
          // otherwise fall back to stock > 0.
          const inStock =
            product.status === 'Available'
              ? true
              : product.status === 'Out of Stock'
              ? false
              : totalStock > 0;

          // ── IMAGE ─────────────────────────────────────────────────────────────
          const imagePath = product.image?.[0];
          const imageUrl = imagePath
            ? `${baseUrl.INVENTORY}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
            : 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';

          return {
            id: product._id,
            mongoId: product._id,
            name: product.name,
            price,
            originalPrice: product.originalPrice || 0,
            clinicDiscountPrice: product.clinicDiscountPrice,
            doctorDiscountPrice: product.doctorDiscountPrice,
            image: imageUrl,
            badge: item.badge,
            description: item.description,
            stock: totalStock,
            inStock,
            status: product.status,
            category: product.mainCategory?.categoryName,
            discount: product.variants?.[0]?.discount,
          };
        });

      setProducts(transformedProducts);

    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
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
  const handleToggleLike = async (productId: string | number) => {
    const productIdStr = String(productId);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn = !!token || userIsLoggedIn;

    if (!isLoggedIn) {
      showLoginPrompt(productIdStr);
      return;
    }

    const isCurrentlyLiked = likedProducts.has(productId) ||
      likedProducts.has(productIdStr) ||
      likedProducts.has(Number(productId));

    if (externalOnToggleLike) {
      externalOnToggleLike(productId);
      return;
    }

    setLocalLikedProducts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(productId);
        newSet.delete(productIdStr);
        newSet.delete(Number(productId));
      } else {
        newSet.add(productId);
        newSet.add(productIdStr);
        newSet.add(Number(productId));
      }
      return newSet;
    });

    const result = await addToFavoritesAPI(productIdStr);

    if (!result.success) {
      setLocalLikedProducts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(productId);
          newSet.add(productIdStr);
          newSet.add(Number(productId));
        } else {
          newSet.delete(productId);
          newSet.delete(productIdStr);
          newSet.delete(Number(productId));
        }
        return newSet;
      });

      if (result.requiresLogin) {
        showLoginPrompt(productIdStr);
      } else {
        toast.error('Failed to update favorites. Please try again.');
      }
    } else {
      if (result.liked) {
        toast.success('Added to favorites!');
      } else {
        toast.info('Removed from favorites');
      }
    }
  };

  const isProductLiked = (productId: string | number) => {
    return likedProducts.has(productId) ||
      likedProducts.has(String(productId)) ||
      likedProducts.has(Number(productId));
  };

  const isProductLoadingLike = (productId: string | number) => {
    return isProcessingLike === String(productId);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <Toaster position="top-right"/>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl text-gray-900 font-semibold">
            Featured Products
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchFeaturedProducts}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No featured products available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h2 className="text-3xl lg:text-4xl text-gray-900 font-semibold">
          Featured Products
        </h2>
        <button
          className="hidden sm:flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-300 group hover:gap-3"
          onClick={() => router.push("/allproducts")}
        >
          <span className="text-lg font-medium">View all</span>
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
          >
            <ProductCard
              product={product}
              isLiked={isProductLiked(product.id)}
              isLoadingLike={isProductLoadingLike(product.id)}
              onToggleLike={() => handleToggleLike(product.id)}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          </div>
        ))}
      </div>

      <button className="sm:hidden w-full mt-8 flex items-center justify-center gap-2 py-3 text-gray-900 hover:text-blue-600 transition-colors border border-gray-300 rounded-lg hover:border-blue-600 hover:shadow-md active:scale-95">
        <span className="font-medium">View all</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}