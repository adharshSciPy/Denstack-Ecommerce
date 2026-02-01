'use client';
import { ChevronLeft, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import baseUrl from '../baseUrl';

interface Product {
  _id: string;
  productName: string;
  price: number;
  images: string[];
  stock: number;
  category?: string;
  discount?: number;
}

interface Brand {
  _id: string;
  name: string;
  description: string;
  brandLogo: string;
  status?: string;
}

interface BrandData {
  topBrand: {
    _id: string;
    order: number;
    brandId: Brand;
  };
  products: Product[];
  productCount: number;
}

interface BrandDetailPageProps {
  cartCount?: number;
  onCartCountChange?: (count: number) => void;
  onBackToBrands?: () => void;
  onCartClick?: () => void;
  likedProducts?: Set<string>;
  onToggleLike?: (id: string) => void;
  onProductClick?: (productId: string) => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  favoritesCount?: number;
}

export default function BrandDetailPage({
  cartCount = 0,
  onCartCountChange = () => { },
  onBackToBrands = () => { },
  onCartClick = () => { },
  likedProducts = new Set<string>(),
  onToggleLike = () => { },
  onProductClick,
  onBrandClick = () => { },
  onBuyingGuideClick = () => { },
  onEventsClick = () => { },
  onMembershipClick = () => { },
  onFreebiesClick = () => { },
  onBestSellerClick = () => { },
  onClinicSetupClick = () => { },
  onFavoritesClick = () => { },
  onOrdersClick = () => { },
  onAccountClick = () => { },
  favoritesCount = 0,
}: BrandDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const brandId = searchParams.get('brandId');

  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!brandId) {
      setError('Brand ID not found');
      setLoading(false);
      return;
    }

    // ✅ Add validation for ObjectId format
    if (brandId.length !== 24) {
      setError('Invalid Brand ID format');
      setLoading(false);
      return;
    }

    const fetchBrandData = async () => {
      try {
        setLoading(true);
        console.log('Fetching brand data for ID:', brandId); // Debug log

        // Try primary fetch by given id (expected to be a TopBrand _id)
        let response = await fetch(
          `${baseUrl.INVENTORY}/api/v1/landing/brands/getById/${brandId}`,
          { cache: 'no-store' }
        );

        // If not found, the caller may have passed a Brand _id (not TopBrand). Attempt fallback.
        if (!response.ok) {
          console.warn('Primary fetch returned', response.status, '— attempting fallback lookup for Brand _id');

          if (response.status === 404) {
            try {
              const listRes = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/top-brands/getAll`, { cache: 'no-store' });

              if (listRes.ok) {
                const listJson = await listRes.json();
                const list = Array.isArray(listJson?.data) ? listJson.data : [];

                // Find a TopBrand entry whose populated brandId._id matches the provided brandId
                const found = list.find((t: any) => {
                  const b = t?.brandId;
                  if (!b) return false;
                  if (typeof b === 'string') return b === brandId;
                  if (typeof b === 'object') {
                    return b._id === brandId || b.brandId === brandId || b.id === brandId;
                  }
                  return false;
                });

                if (found && found._id) {
                  console.log('Found matching TopBrand', found._id, 'for Brand', brandId, '— retrying fetch');
                  response = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/top-brands/${found._id}`, { cache: 'no-store' });
                }
              }
            } catch (fallbackErr) {
              console.warn('Fallback lookup failed:', fallbackErr);
            }
          }

          // If after fallback the response is still not ok, throw
          if (!response.ok) {
            console.error('Failed to fetch brand data, status:', response.status);
            throw new Error('Failed to fetch brand data');
          }
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.error('Expected JSON but received:', contentType);
          throw new Error('Invalid response from brand detail endpoint');
        }

        const result = await response.json();
        console.log('Brand data response:', result); // Debug log

        // Normalize different possible response shapes:
        // - { success: true, data: { topBrand: ..., products: [...] } }
        // - { _id, name, brandLogo, products: [...] } (Brand object)
        // - A TopBrand object directly
        let payload = result?.data ?? result;

        // If it's already the expected BrandData shape (has topBrand)
        if (payload && payload.topBrand && payload.products) {
          setBrandData(payload as BrandData);
          setError(null);
          return;
        }

        // If API directly returned a Brand object, normalize and use it
        if (payload && payload._id && (payload.name || payload.brandLogo)) {
          const normalized: BrandData = {
            topBrand: {
              _id: payload._id,
              order: 0,
              brandId: {
                _id: payload._id,
                name: payload.name,
                brandLogo: payload.brandLogo || '',
                description: payload.description || '',
              },
            },
            products: Array.isArray(payload.products) ? payload.products : [],
            productCount: typeof payload.productCount === 'number' ? payload.productCount : (Array.isArray(payload.products) ? payload.products.length : 0),
          };

          setBrandData(normalized);
          setError(null);
          return;
        }

        // If payload looks like a TopBrand object (brandId populated directly), wrap it
        if (payload && payload.brandId && payload.brandId._id) {
          const normalized: BrandData = {
            topBrand: payload,
            products: Array.isArray(payload.products) ? payload.products : [],
            productCount: typeof payload.productCount === 'number' ? payload.productCount : (Array.isArray(payload.products) ? payload.products.length : 0),
          };
          setBrandData(normalized);
          setError(null);
          return;
        }

        // If payload is empty or unexpected, try additional fallbacks:
        // 1) Search top-brands list for an entry whose populated brandId._id matches brandId
        // 2) Search brands/getAll for a Brand object matching brandId
        try {
          const listRes = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/top-brands/getAll`, { cache: 'no-store' });
          if (listRes.ok) {
            const listJson = await listRes.json();
            const list = Array.isArray(listJson?.data) ? listJson.data : [];

            const found = list.find((t: any) => {
              const b = t?.brandId;
              if (!b) return false;
              if (typeof b === 'string') return b === brandId;
              if (typeof b === 'object') return b._id === brandId || b.brandId === brandId || b.id === brandId;
              return false;
            });

            if (found && found._id) {
              console.log('Fallback: Found TopBrand mapping', found._id, 'for Brand', brandId);
              const tbRes = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/top-brands/${found._id}`, { cache: 'no-store' });
              if (tbRes.ok) {
                const tbJson = await tbRes.json();
                payload = tbJson?.data ?? tbJson;
                if (payload && payload.topBrand && payload.products) {
                  setBrandData(payload as BrandData);
                  setError(null);
                  return;
                }
              }
            }
          }
        } catch (e) {
          console.warn('Top-brands fallback failed:', e);
        }

        try {
          const brandsRes = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/brands/getAll?page=1&limit=1000`, { cache: 'no-store' });
          if (brandsRes.ok) {
            const brandsJson = await brandsRes.json();
            const brandsList = Array.isArray(brandsJson?.data) ? brandsJson.data : [];
            const foundBrand = brandsList.find((b: any) => b._id === brandId || String(b.brandId) === brandId || b.brandId === brandId);
            if (foundBrand) {
              const normalized: BrandData = {
                topBrand: {
                  _id: foundBrand._id,
                  order: 0,
                  brandId: {
                    _id: foundBrand._id,
                    name: foundBrand.name,
                    brandLogo: foundBrand.image || foundBrand.brandLogo || '',
                    description: foundBrand.description || '',
                  },
                },
                products: Array.isArray(foundBrand.products) ? foundBrand.products : [],
                productCount: typeof foundBrand.productCount === 'number' ? foundBrand.productCount : (Array.isArray(foundBrand.products) ? foundBrand.products.length : 0),
              };

              setBrandData(normalized);
              setError(null);
              return;
            }
          }
        } catch (e) {
          console.warn('Brands list fallback failed:', e);
        }

        // Nothing worked — show not found
        console.error('Unexpected brand detail response shape (no usable data):', payload);
        setError('Brand not found');
      } catch (err) {
        console.error('Error fetching brand data:', err);
        setError('Failed to load brand data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandId]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400';
    // ✅ Clean up the path properly
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl.INVENTORY}${cleanPath}`;
  };

  const addToCart = () => {
    onCartCountChange(cartCount + 1);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/productdetailpage/${productId}`);
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  const toggleLocalLike = (productId: string) => {
    setLocalLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    if (onToggleLike) {
      onToggleLike(productId);
    }
  };

  const getSortedProducts = () => {
    if (!brandData?.products) return [];

    const productsCopy = [...brandData.products];

    switch (sortBy) {
      case 'price-low':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-high':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'name':
        return productsCopy.sort((a, b) => a.productName.localeCompare(b.productName));
      case 'newest':
        return productsCopy;
      default:
        return productsCopy;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation currentPage="allbrands" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading brand details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !brandData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation currentPage="allbrands" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Brand not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const brand = brandData.topBrand.brandId;
  const sortedProducts = getSortedProducts();

  const convertedProducts = sortedProducts.map(product => ({
    id: product._id,
    name: product.productName,
    price: product.price,
    image: getImageUrl(product.images?.[0] || ''),
    stock: product.stock,
    category: product.category,
    discount: product.discount
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage="allbrands" />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Brand Header */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Brand Logo */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <Image
                  src={getImageUrl(brand.brandLogo)}
                  alt={brand.name}
                  fill
                  unoptimized // ✅ Added unoptimized
                  className="object-contain p-4"
                />
              </div>

              {/* Brand Info */}
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {brand.name}
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {brand.description || `${brand.name} is a leading manufacturer of high-quality dental equipment and supplies. With decades of experience, they provide innovative solutions for dental professionals worldwide.`}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Products:</span>
                    <span className="ml-2 font-semibold text-gray-900">{brandData.productCount}</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="ml-2 font-semibold text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Products by {brand.name}
              </h2>
              <p className="text-gray-600 mt-2">
                {brandData.productCount > 0
                  ? `Explore our complete range of ${brandData.productCount} products`
                  : 'No products available yet'}
              </p>
            </div>

            {/* Filter/Sort */}
            {brandData.productCount > 0 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="name">Name: A-Z</option>
              </select>
            )}
          </div>

          {/* Products Grid */}
          {brandData.productCount === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 text-lg">No products available for this brand yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6">
              {convertedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard
                    product={product}
                    isLiked={localLikedProducts.has(product.id)}
                    onToggleLike={() => toggleLocalLike(product.id)}
                    onAddToCart={addToCart}
                    onProductClick={() => handleProductClick(product.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {brandData.productCount > 24 && (
          <div className="mt-12 flex justify-center animate-fade-in">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95">
              Load More Products
            </button>
          </div>
        )}
      </main>
    </div>
  );
}