import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

interface ProductGridProps {
  likedProducts: Set<string | number>;
  onToggleLike: (id: string | number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: string | number) => void;
}

interface FeaturedProduct {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    image: string[];
    variants: any[];
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
  id: string; // Changed to string to use MongoDB _id
  mongoId: string;
  name: string;
  price: number;
  image: string;
  badge: string | null;
  description: string;
  stock?: number;
  category?: string;
  discount?: number;
}

export default function ProductGrid({
  likedProducts,
  onToggleLike,
  onAddToCart,
  onProductClick,
}: ProductGridProps) {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await axios.get(
        "http://localhost:8004/api/v1/landing/featured-products/getAll",
      );
      console.log(data);

      console.log("API Response:", data);

      if (data) {
        console.log(data);

        const transformedProducts: TransformedProduct[] = data.data.data
          .filter((item: FeaturedProduct) => item.product !== null)
          .map((item: FeaturedProduct) => {
            const product = item.product;

            const imagePath = product.image?.[0];
            const imageUrl = imagePath
              ? `http://localhost:8004/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`
              : "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400";

            return {
              id: product._id, // Use MongoDB _id instead of index
              mongoId: product._id,
              name: item.title || product.name,
              price: product.variants?.[0]?.price || 0,
              image: imageUrl,
              badge: item.badge,
              description: item.description,
              stock: product.variants?.[0]?.stock || 0,
              category: product.mainCategory?.categoryName,
              discount: product.variants?.[0]?.discount,
            };
          });

        console.log("Transformed products:", transformedProducts);
        setProducts(transformedProducts);
      } else {
        setError("Failed to fetch featured products");
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if product is liked (handles both string and number IDs)
  const isProductLiked = (productId: string | number) => {
    return likedProducts.has(productId) || 
           likedProducts.has(String(productId)) || 
           likedProducts.has(Number(productId));
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl text-gray-900 font-semibold">
            Featured Products
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-lg h-80"
            ></div>
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
          <p className="text-gray-600 text-lg">
            No featured products available
          </p>
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
        <button className="hidden sm:flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-300 group hover:gap-3">
          <span className="text-lg font-medium">View all</span>
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={product}
              isLiked={isProductLiked(product.id)}
              onToggleLike={onToggleLike}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          </div>
        ))}
      </div>

      <button className="sm:hidden w-full mt-8 flex items-center justify-center gap-2 py-3 text-gray-900 hover:text-blue-600 transition-colors border border-gray-300 rounded-lg hover:border-blue-600 hover:shadow-md active:scale-95">
        <span className="font-medium">View all</span>
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}