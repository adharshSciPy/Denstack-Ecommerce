'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import baseUrl from '../../baseUrl';

import { StaticImageData } from "next/image";
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
type ImageSource = string | StaticImageData;

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  featuredImage: ImageSource;
  products: {
    id: string;
    name: string;
    imageUrl: ImageSource;
  }[];
  selectedProducts: Set<string>;
  onToggleProduct: (id: string) => void;
  onSelectAll: () => void;
  onAddToCart: () => void;
  onExploreAll: () => void;
  allSelected: boolean;
}

function StepCard({
  stepNumber,
  title,
  description,
  featuredImage,
  products,
  selectedProducts,
  onToggleProduct,
  onSelectAll,
  onAddToCart,
  onExploreAll,
  allSelected
}: StepCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [featuredError, setFeaturedError] = useState(false);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());

  const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'>Image unavailable</text></svg>`;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${stepNumber * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0">
        {/* Left: Featured Image */}
        <div className="relative bg-gradient-to-br from-cyan-400 via-teal-400 to-green-400 p-6">
          {/* Step Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-lg">
              <span className="font-bold text-sm">
                STEP {stepNumber}
              </span>
            </div>
          </div>

          {/* Main Featured Image */}
          <div className="mt-10">
            {featuredError ? (
              <div className="w-full h-48 rounded-lg bg-gray-200 flex items-center justify-center text-sm text-gray-500">Image unavailable</div>
            ) : (
              <Image
                src={featuredImage}
                alt={title}
                width={800}
                height={600}
                unoptimized
                onError={() => setFeaturedError(true)}
                className={`w-full h-auto rounded-lg shadow-md transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
              />
            )}
          </div>

          {/* Caption */}
          <div className="mt-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-3 py-2.5 rounded-lg text-center shadow-md">
            <p className="text-xs font-semibold leading-tight">
              {title}
            </p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="p-6 lg:p-8 flex flex-col justify-between">
          {/* Title and Description */}
          <div className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Products Section */}
          <div className="space-y-4">
            {/* Products Header */}
            <h3 className="font-semibold text-gray-900">
              Products ({products.length})
            </h3>

            {/* Product Thumbnails */}
            <div className="flex flex-wrap gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative group"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleProduct(product.id)}
                    className={`
                      absolute -top-2 -right-2 z-10 w-5 h-5 rounded border-2
                      flex items-center justify-center transition-all
                      ${selectedProducts.has(product.id)
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 border-cyan-500'
                        : 'bg-white border-gray-400 hover:border-cyan-400'
                      }
                    `}
                  >
                    {selectedProducts.has(product.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Product Thumbnail */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden hover:border-cyan-400 transition-colors cursor-pointer flex items-center justify-center">
                    {failedThumbs.has(product.id) ? (
                      <img src={placeholderSvg} alt="thumb" width={80} height={80} className="object-contain p-2" />
                    ) : (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        unoptimized
                        onError={() => setFailedThumbs(prev => {
                          const n = new Set(prev);
                          n.add(product.id);
                          return n;
                        })}
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {/* Select All + Add to Cart Button */}
              <div className="flex gap-2">
                <button
                  onClick={onSelectAll}
                  className={`
                    px-4 py-3 border-2 rounded-lg font-semibold text-sm
                    transition-all hover:scale-105 flex items-center justify-center gap-2
                    ${allSelected
                      ? 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-500 text-cyan-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-400'
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center
                    ${allSelected ? 'bg-gradient-to-r from-cyan-500 to-teal-500 border-cyan-500' : 'border-gray-400'}
                  `}>
                    {allSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  Select All
                </button>

                <button
                  onClick={onAddToCart}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 hover:from-cyan-600 hover:via-teal-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                  {selectedProducts.size > 0 && (
                    <span className="bg-white text-cyan-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {selectedProducts.size}
                    </span>
                  )}
                </button>
              </div>

              {/* Explore All Products Button */}
              <button
                onClick={onExploreAll}
                className="border-2 border-cyan-500 text-cyan-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Explore All Products
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BuyingGuideDetailPageProps {
  cartCount: number;
  favoritesCount: number;
  onCartCountChange: (count: number) => void;
  onBackToGuide: () => void;
  guideTitle?: string;
  onCartClick?: () => void;
  onProductClick?: (productId: string) => void;
  onBrandClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onCategoryBrowseClick?: () => void;
}

export default function BuyingGuideDetailPage({
  cartCount,
  favoritesCount,
  onCartCountChange,
  onBackToGuide,
  guideTitle = "Maxillary Sinus Augmentation",
  onCartClick,
  onProductClick,
  onBrandClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onCategoryBrowseClick
}: BuyingGuideDetailPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams();
  const guideId = params?.id as string | undefined;
  const [currentGuideTitle, setCurrentGuideTitle] = useState(guideTitle);

  // Manage selected products per step (product ids are strings from API)
  const [selectedProductsByStep, setSelectedProductsByStep] = useState<Record<number, Set<string>>>({});

  // Steps fetched from API (mapped to local shape)
  type ApiProduct = { productId: string; name: string; image: string };
  type ApiStep = { stepNumber: number; stepLabel?: string; title: string; description: string; image: string; products: ApiProduct[] };

  const [steps, setSteps] = useState<Array<{
    stepNumber: number;
    title: string;
    description: string;
    featuredImage: ImageSource;
    products: { id: string; name: string; imageUrl: ImageSource }[];
  }>>([]);

  const [loadingSteps, setLoadingSteps] = useState(false);
  const [stepsError, setStepsError] = useState<string | null>(null);

  // Derived counts from backend-loaded steps
  const totalProducts = steps.reduce((acc, s) => acc + (s.products?.length ?? 0), 0);
  const uniqueProductsCount = new Set(steps.flatMap(s => s.products.map(p => p.id))).size;

  useEffect(() => {
    const fetchSteps = async () => {
      if (!guideId) {
        setStepsError('Missing guide id');
        setLoadingSteps(false);
        return;
      }

      setLoadingSteps(true);
      setStepsError(null);
      try {
        const res = await fetch(`${baseUrl.INVENTORY}/api/v1/buyingGuide/getBuyingGuideStepsById/${guideId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error('API reported failure');
        const mapped = (json.data as ApiStep[]).map(s => ({
          stepNumber: s.stepNumber,
          title: s.title,
          description: s.description,
          featuredImage: s.image,
          products: s.products.map(p => ({ id: p.productId, name: p.name, imageUrl: p.image }))
        }));
        setSteps(mapped);
      } catch (err: any) {
        console.error('Failed to fetch buying guide steps:', err);
        setStepsError(err?.message ?? 'Failed to load steps');
      } finally {
        setLoadingSteps(false);
      }
    };

    fetchSteps();
  }, [guideId]);

  // Handler functions for each step (using string product IDs)
  const getSelectedProducts = (stepNum: number) => {
    return selectedProductsByStep[stepNum] ?? new Set<string>();
  };

  const setSelectedProducts = (stepNum: number, products: Set<string>) => {
    setSelectedProductsByStep(prev => ({ ...prev, [stepNum]: products }));
  };

  const handleSelectAll = (stepNum: number) => {
    const step = steps.find(s => s.stepNumber === stepNum);
    if (!step) return;

    const currentSelected = getSelectedProducts(stepNum);
    if (currentSelected.size === step.products.length) {
      setSelectedProducts(stepNum, new Set<string>());
    } else {
      setSelectedProducts(stepNum, new Set(step.products.map(p => p.id)));
    }
  };

  const handleToggleProduct = (stepNum: number, productId: string) => {
    const currentSelected = getSelectedProducts(stepNum);
    const newSelected = new Set(currentSelected);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(stepNum, newSelected);
  };

  const handleAddToCart = (stepNum: number) => {
    const selectedCount = getSelectedProducts(stepNum).size;
    if (selectedCount > 0) {
      onCartCountChange(cartCount + selectedCount);
      setSelectedProducts(stepNum, new Set<string>());
      toast.success(`🎉 Successfully added ${selectedCount} product${selectedCount > 1 ? 's' : ''} from Step ${stepNum}!`, {
        description: `Your cart now has ${cartCount + selectedCount} items`,
        duration: 3000,
      });
    } else {
      toast.error('Please select at least one product', {
        description: 'Check the boxes on products you want to add',
        duration: 3000,
      });
    }
  };

  const router = useRouter();

  // Fetch guide metadata (title) from list endpoint if available
  useEffect(() => {
    if (!guideId) return;
    const fetchGuideMeta = async () => {
      try {
        const res = await fetch(`${baseUrl.INVENTORY}/api/v1/buyingGuide/getBuyingGuide`);
        if (!res.ok) return;
        const json = await res.json();
        const found = (json.data ?? []).find((g: any) => g._id === guideId);
        if (found && found.title) setCurrentGuideTitle(found.title);
      } catch (err) {
        console.warn('Failed to fetch guide meta', err);
      }
    };
    fetchGuideMeta();
  }, [guideId]);

  const handleExploreAll = () => {
    if (onProductClick) {
      onProductClick('');
    } else {
      router.push('/products');
    }
    toast.info('Exploring all products...', {
      duration: 2000,
    });
  };

  // Use guideId in steps fetch effect below by referencing guideId


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Navigation */}
      <Navigation
        currentPage="detailbuyingguide"
        cartCount={cartCount}
        favoritesCount={favoritesCount ?? 0}
      // onBrandClick={onBrandClick}
      // onBuyingGuideClick={onBackToGuide}
      // onEventsClick={onEventsClick}
      // onMembershipClick={onMembershipClick}
      // onFreebiesClick={onFreebiesClick}
      // onBestSellerClick={onBestSellerClick}
      // onClinicSetupClick={onClinicSetupClick}
      // onCategoryBrowseClick={onCategoryBrowseClick}
      />

      {/* Breadcrumb & Title Bar */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 text-white py-4 shadow-lg animate-fade-in">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-2">
            <button
              onClick={() => router.push('/buying-guide')}
              className="hover:underline transition-all hover:text-cyan-100"
            >
              Buying Guide
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold">Guide Details</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentGuideTitle}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Guide Introduction */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete Surgical Protocol</h2>
          <p className="text-gray-600 leading-relaxed">
            {loadingSteps ? (
              'Loading guide overview...'
            ) : stepsError ? (
              'Overview unavailable.'
            ) : (
              `This comprehensive ${steps.length}-step guide covers the complete ${currentGuideTitle} procedure, from initial diagnosis to post-operative care. Each step includes essential products and detailed instructions for optimal surgical outcomes.`
            )}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              {stepsError ? 'N/A' : (loadingSteps ? 'Loading steps...' : `${steps.length} Procedural Steps`)}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              {stepsError ? 'N/A' : (loadingSteps ? 'Loading products...' : `${totalProducts} Essential Products`)}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              {stepsError ? 'N/A' : (loadingSteps ? 'Loading list...' : `${uniqueProductsCount} Equipment Items`)}
            </span>
          </div>
        </div>

        {/* Step Cards */}
        {loadingSteps && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200 animate-fade-in">Loading buying guide steps...</div>
        )}
        {stepsError && (
          <div className="bg-red-50 rounded-xl p-6 mb-6 border border-red-200 text-red-700">{stepsError}</div>
        )}
        {!loadingSteps && steps.length === 0 && !stepsError && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">No steps available.</div>
        )}

        <div className="space-y-8">
          {steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              featuredImage={step.featuredImage}
              products={step.products}
              selectedProducts={getSelectedProducts(step.stepNumber)}
              onToggleProduct={(id) => handleToggleProduct(step.stepNumber, id)}
              onSelectAll={() => handleSelectAll(step.stepNumber)}
              onAddToCart={() => handleAddToCart(step.stepNumber)}
              onExploreAll={handleExploreAll}
              allSelected={getSelectedProducts(step.stepNumber).size === step.products.length}
            />
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-12 bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 rounded-xl p-8 border-2 border-cyan-200 animate-fade-in shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Surgical Kit</h3>
          <p className="text-gray-700 mb-6">
            All products from this 8-step protocol are available for purchase. Select the items you need from each step and add them to your cart for a complete maxillary sinus augmentation setup.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                toast.info('Contact our surgical specialists for expert guidance', {
                  duration: 3000,
                });
              }}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:scale-105"
            >
              Contact Specialist
            </button>
            <button
              onClick={handleExploreAll}
              className="border-2 border-cyan-600 text-cyan-700 px-8 py-4 rounded-xl font-bold hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 transition-all hover:scale-105"
            >
              View All Products
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}