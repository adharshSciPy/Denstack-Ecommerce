'use client';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import baseUrl from '../baseUrl';

// Define the product interface based on your API response
interface ProductVariant {
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
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  basePrice?: number;
  mainCategory: string;
  subCategory: string;
  description: string;
  originalPrice?: number;
  clinicDiscountPrice: number | null;
  clinicDiscountPercentage: number | null;
  doctorDiscountPrice: number | null;
  doctorDiscountPercentage: number | null;
  stock: number;
  variants: ProductVariant[];
  image: string[];
  expiryDate: string | null;
  status: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
  __v: number;
}

interface ApiResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  search: string;
  data: Product[];
}

// Category and Brand types based on your actual data structure
interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface AllProductsPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick: () => void;
  likedProducts: Set<string>;
  onToggleLike: (id: string | number) => void;
  onProductClick?: (productId: string | number) => void;
  onBrandClick: () => void;
  onBuyingGuideClick: () => void;
  onEventsClick: () => void;
  onMembershipClick: () => void;
  onFreebiesClick: () => void;
  onBestSellerClick: () => void;
  onClinicSetupClick: () => void;
  onFavoritesClick: () => void;
  onOrdersClick: () => void;
  onAccountClick: () => void;
  favoritesCount: number;
}

export default function AllProductsPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  likedProducts = new Set<string>(),
  onToggleLike,
  onProductClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  favoritesCount,
}: AllProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filter states
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Store available categories and brands from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [statuses, setStatuses] = useState<string[]>(['Available', 'Out of Stock']);

  const router = useRouter();

  // Calculate total stock from variants
  const calculateTotalStock = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) {
      return product.stock || 0;
    }
    return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  };

  // Determine if product is in stock
  const isProductInStock = (product: Product): boolean => {
    // Check both product stock and variants stock
    if (product.stock > 0) return true;
    if (product.variants && product.variants.length > 0) {
      return product.variants.some(variant => variant.stock > 0);
    }
    return false;
  };

  // Determine product status based on stock and isLowStock
  const getProductStatus = (product: Product): string => {
    const totalStock = calculateTotalStock(product);
    
    if (totalStock === 0) {
      return 'Out of Stock';
    } else if (product.isLowStock || totalStock < 10) {
      return 'Low Stock';
    } else {
      return 'Available';
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl.INVENTORY}/api/v1/product/productsDetails`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        // Process products to calculate actual stock and status
        const processedProducts = data.data.map(product => ({
          ...product,
          // Calculate actual stock from variants
          actualStock: calculateTotalStock(product),
          // Determine real status
          realStatus: getProductStatus(product),
          // Determine if actually in stock
          isActuallyInStock: isProductInStock(product)
        }));
        
        // Store all products for client-side filtering
        setAllProducts(processedProducts);
        setProducts(processedProducts); // Initially show all products
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
        
        // Extract unique categories and brands from products
        extractFiltersFromProducts(processedProducts);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract filters from products data
  const extractFiltersFromProducts = (productsData: Product[]) => {
    // Extract unique categories (mainCategory)
    const uniqueCategories = Array.from(
      new Map(productsData.map(product => [product.mainCategory, product.mainCategory])).values()
    ).map(id => ({ id, name: `Category ${id.slice(-4)}` })); // Simplified name
    
    // Extract unique brands
    const uniqueBrands = Array.from(
      new Map(productsData.map(product => [product.brand, product.brand])).values()
    ).map(id => ({ id, name: `Brand ${id.slice(-4)}` })); // Simplified name
    
    // Extract unique statuses based on calculated status
    const uniqueStatuses = Array.from(
      new Set(productsData.map(product => getProductStatus(product)))
    ).filter(status => status); // Remove empty/null values
    
    setCategories(uniqueCategories);
    setBrands(uniqueBrands);
    setStatuses(['all', ...uniqueStatuses]);
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.mainCategory === selectedCategory
      );
    }
    
    // Apply brand filter
    if (selectedBrand !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.brand === selectedBrand
      );
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => getProductStatus(product) === selectedStatus
      );
    }
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sortBy);
    
    setProducts(filteredProducts);
    
  }, [selectedCategory, selectedBrand, selectedStatus, sortBy, allProducts]);

  // Sort products based on selected sort option
  const sortProducts = (productsToSort: Product[], sortOption: string): Product[] => {
    const sorted = [...productsToSort];
    
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.variants?.[0]?.originalPrice || a.originalPrice || a.basePrice || 0;
          const priceB = b.variants?.[0]?.originalPrice || b.originalPrice || b.basePrice || 0;
          return priceA - priceB;
        });
        
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.variants?.[0]?.originalPrice || a.originalPrice || a.basePrice || 0;
          const priceB = b.variants?.[0]?.originalPrice || b.originalPrice || b.basePrice || 0;
          return priceB - priceA;
        });
        
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
      case 'best-selling':
        // Sort by total stock (assuming higher stock = better selling)
        return sorted.sort((a, b) => 
          calculateTotalStock(b) - calculateTotalStock(a)
        );
        
      case 'stock-high':
        // Sort by stock (high to low)
        return sorted.sort((a, b) => 
          calculateTotalStock(b) - calculateTotalStock(a)
        );
        
      case 'stock-low':
        // Sort by stock (low to high)
        return sorted.sort((a, b) => 
          calculateTotalStock(a) - calculateTotalStock(b)
        );
        
      case 'featured':
      default:
        // Default sort - by productId or in-stock first
        return sorted.sort((a, b) => {
          // Put in-stock products first
          const aInStock = isProductInStock(a);
          const bInStock = isProductInStock(b);
          if (aInStock && !bInStock) return -1;
          if (!aInStock && bInStock) return 1;
          
          // Then sort by productId
          return b.productId.localeCompare(a.productId);
        });
    }
  };

  // Format product for ProductCard component
  const formatProductForCard = (product: Product) => {
    // Get the first variant or use product level prices
    const firstVariant = product.variants?.[0];
    
    // Determine the price to display - use variant price if available
    const displayPrice = firstVariant?.originalPrice || 
                        product.originalPrice || 
                        product.basePrice || 
                        0;
    
    // Determine discounted price if available - prefer variant discounts
    const discountedPrice = firstVariant?.clinicDiscountPrice || 
                           firstVariant?.doctorDiscountPrice || 
                           product.clinicDiscountPrice || 
                           product.doctorDiscountPrice || 
                           null;
    
    // Calculate discount percentage if available
    const discountPercentage = discountedPrice && displayPrice > 0
      ? Math.round(((displayPrice - discountedPrice) / displayPrice) * 100)
      : null;
    
    // Get the first image URL
    const imageUrl = product.image?.[0] 
      ? `${baseUrl.INVENTORY}${product.image[0]}`
      : "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400";
    
    // Get available variants summary
    const availableVariants = product.variants
      ?.filter(v => v.stock > 0)
      .map(v => v.size)
      .join(', ') || '';
    
    // Calculate total available stock
    const totalStock = calculateTotalStock(product);
    
    // Determine actual status
    const actualStatus = getProductStatus(product);
    
    // Check if product has any stock
    const hasStock = isProductInStock(product);
    
    return {
      id: product._id,
      productId: product.productId,
      name: product.name,
      price: displayPrice,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      image: imageUrl,
      description: product.description,
      brand: product.brand,
      variants: product.variants,
      availableVariants: availableVariants,
      totalStock: totalStock,
      status: actualStatus,
      isLowStock: product.isLowStock || totalStock < 10,
      isInStock: hasStock,
      category: product.mainCategory
    };
  };

  const addToCart = () => {
    onCartCountChange(cartCount + 1);
  };

  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedStatus('all');
    setSortBy('featured');
  };

  // Check if any filter is active
  const isFilterActive = useMemo(() => {
    return selectedCategory !== 'all' || 
           selectedBrand !== 'all' || 
           selectedStatus !== 'all' || 
           sortBy !== 'featured';
  }, [selectedCategory, selectedBrand, selectedStatus, sortBy]);

  // Count in-stock products
  const inStockCount = useMemo(() => {
    return allProducts.filter(product => isProductInStock(product)).length;
  }, [allProducts]);

  // Count low stock products
  const lowStockCount = useMemo(() => {
    return allProducts.filter(product => {
      const totalStock = calculateTotalStock(product);
      return totalStock > 0 && (product.isLowStock || totalStock < 10);
    }).length;
  }, [allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading products</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            All Products
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-gray-600 text-lg">
                {isFilterActive ? (
                  <>
                    Showing {products.length} of {totalProducts} products
                  </>
                ) : (
                  `Discover our complete collection of ${totalProducts} products`
                )}
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {inStockCount} In Stock
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  {lowStockCount} Low Stock
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {totalProducts - inStockCount} Out of Stock
                </span>
              </div>
            </div>
            
            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors self-start"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Sort Filter */}
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="best-selling">Best Selling</option>
            <option value="stock-high">Stock: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
          </select>

          {/* Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select 
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found matching your filters.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard
                    product={formatProductForCard(product)}
                    isLiked={likedProducts.has(product._id)}
                    onToggleLike={onToggleLike}
                    onAddToCart={addToCart}
                    onProductClick={()=> router.push(`/productdetailpage/${product._id}`)}
                  />
                </div>
              ))}
            </div>

            {/* Note: For server-side pagination, you would fetch more products */}
            {/* For client-side filtering, we're showing all filtered products */}
            {!isFilterActive && currentPage < totalPages && (
              <div className="mt-12 flex justify-center animate-fade-in">
                <button 
                  onClick={() => {
                    // You would implement actual pagination here
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}