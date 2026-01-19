'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import imgFeatured from "../../assets/c775787539b7df72edc4d91a8047b6d271239a40.png";
import img33211 from "../../assets/0815c4dbb681f7ea1c9955cfaec5ad8e6de976af.png";
import { StaticImageData } from "next/image";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
type ImageSource = string | StaticImageData;

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  featuredImage: ImageSource;
  products: {
    id: number;
    name: string;
    imageUrl: ImageSource;
  }[];
  selectedProducts: Set<number>;
  onToggleProduct: (id: number) => void;
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
            <Image 
              src={featuredImage} 
              alt={title}
              width={800}
              height={600}
              className={`w-full h-auto rounded-lg shadow-md transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
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
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden hover:border-cyan-400 transition-colors cursor-pointer">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
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
  onCartCountChange: (count: number) => void;
  onBackToGuide: () => void;
  guideTitle?: string;
  onCartClick?: () => void;
  onProductClick?: (productId: number) => void;
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
  
  // State management for each step
  const [selectedProductsStep1, setSelectedProductsStep1] = useState<Set<number>>(new Set());
  const [selectedProductsStep2, setSelectedProductsStep2] = useState<Set<number>>(new Set());
  const [selectedProductsStep3, setSelectedProductsStep3] = useState<Set<number>>(new Set());
  const [selectedProductsStep4, setSelectedProductsStep4] = useState<Set<number>>(new Set());
  const [selectedProductsStep5, setSelectedProductsStep5] = useState<Set<number>>(new Set());
  const [selectedProductsStep6, setSelectedProductsStep6] = useState<Set<number>>(new Set());
  const [selectedProductsStep7, setSelectedProductsStep7] = useState<Set<number>>(new Set());
  const [selectedProductsStep8, setSelectedProductsStep8] = useState<Set<number>>(new Set());

  // Define steps with their products
  const steps = [
    {
      stepNumber: 1,
      title: "Diagnostic Evaluation and Treatment Planning",
      description: "Use CBCT to assess sinus membrane thickness, residual alveolar bone height, septa, and any sinus pathology. Accurate diagnostics dictate approach and graft type.",
      featuredImage: imgFeatured,
      products: [
        {
          id: 0,
          name: "Woodpecker RTA Smart Ray Portable DC Xray Machine",
          imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200"
        },
        {
          id: 1,
          name: "Digital CBCT Scanner System",
          imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=200"
        }
      ]
    },
    {
      stepNumber: 2,
      title: "Anesthesia and Patient Preparation",
      description: "Administer local anesthesia (e.g., posterior superior alveolar nerve block). Ensure patient comfort and prepare the surgical field with proper sterilization.",
      featuredImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500",
      products: [
        {
          id: 2,
          name: "Anesthesia Syringe Set",
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200"
        },
        {
          id: 3,
          name: "Surgical Drape Kit",
          imageUrl: img33211
        },
        {
          id: 4,
          name: "Sterilization Solution",
          imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200"
        }
      ]
    },
    {
      stepNumber: 3,
      title: "Crestal or Lateral Window Access",
      description: "Choose between lateral window (classic) or crestal approach based on residual bone height. Create precise access to the sinus membrane using specialized instruments.",
      featuredImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500",
      products: [
        {
          id: 5,
          name: "Waldent PMT Set Instrument Kit",
          imageUrl: img33211
        },
        {
          id: 6,
          name: "Piezoelectric Surgery Device",
          imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=200"
        }
      ]
    },
    {
      stepNumber: 4,
      title: "Membrane Elevation",
      description: "Carefully elevate the Schneiderian membrane using curettes or balloon technique. Avoid perforations while creating adequate space for graft material.",
      featuredImage: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=500",
      products: [
        {
          id: 7,
          name: "Sinus Membrane Elevator Set",
          imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=200"
        },
        {
          id: 8,
          name: "Balloon Sinus Lift Kit",
          imageUrl: img33211
        },
        {
          id: 9,
          name: "Dental Curette Set",
          imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200"
        }
      ]
    },
    {
      stepNumber: 5,
      title: "Graft Material Placement",
      description: "Fill the elevated space with bone graft material (autogenous, xenograft, or synthetic). Ensure proper density and coverage for optimal bone regeneration.",
      featuredImage: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500",
      products: [
        {
          id: 10,
          name: "Bone Graft Material - Xenograft",
          imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=200"
        },
        {
          id: 11,
          name: "Bone Graft Delivery System",
          imageUrl: img33211
        }
      ]
    },
    {
      stepNumber: 6,
      title: "Membrane Placement (Optional)",
      description: "Place a resorbable or non-resorbable membrane over the window to protect the graft and guide bone regeneration. Secure with tacks if needed.",
      featuredImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500",
      products: [
        {
          id: 12,
          name: "Collagen Membrane",
          imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=200"
        },
        {
          id: 13,
          name: "Membrane Fixation Tacks",
          imageUrl: img33211
        },
        {
          id: 14,
          name: "Membrane Scissors",
          imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200"
        }
      ]
    },
    {
      stepNumber: 7,
      title: "Wound Closure",
      description: "Close the surgical site with tension-free primary closure using resorbable sutures. Ensure proper flap adaptation to prevent complications and promote healing.",
      featuredImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500",
      products: [
        {
          id: 15,
          name: "Resorbable Suture Kit",
          imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200"
        },
        {
          id: 16,
          name: "Surgical Needle Holder",
          imageUrl: img33211
        }
      ]
    },
    {
      stepNumber: 8,
      title: "Post-Operative Care and Healing",
      description: "Prescribe antibiotics and analgesics. Provide patient instructions for oral hygiene, diet restrictions, and follow-up appointments. Monitor healing for 6-9 months before implant placement.",
      featuredImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
      products: [
        {
          id: 17,
          name: "Antibiotic Prescription Pack",
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200"
        },
        {
          id: 18,
          name: "Post-Op Care Kit",
          imageUrl: img33211
        },
        {
          id: 19,
          name: "Healing Assessment Tools",
          imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200"
        }
      ]
    }
  ];

  // Handler functions for each step
  const getSelectedProducts = (stepNum: number) => {
    switch(stepNum) {
      case 1: return selectedProductsStep1;
      case 2: return selectedProductsStep2;
      case 3: return selectedProductsStep3;
      case 4: return selectedProductsStep4;
      case 5: return selectedProductsStep5;
      case 6: return selectedProductsStep6;
      case 7: return selectedProductsStep7;
      case 8: return selectedProductsStep8;
      default: return new Set<number>();
    }
  };

  const setSelectedProducts = (stepNum: number, products: Set<number>) => {
    switch(stepNum) {
      case 1: setSelectedProductsStep1(products); break;
      case 2: setSelectedProductsStep2(products); break;
      case 3: setSelectedProductsStep3(products); break;
      case 4: setSelectedProductsStep4(products); break;
      case 5: setSelectedProductsStep5(products); break;
      case 6: setSelectedProductsStep6(products); break;
      case 7: setSelectedProductsStep7(products); break;
      case 8: setSelectedProductsStep8(products); break;
    }
  };

  const handleSelectAll = (stepNum: number) => {
    const step = steps.find(s => s.stepNumber === stepNum);
    if (!step) return;
    
    const currentSelected = getSelectedProducts(stepNum);
    if (currentSelected.size === step.products.length) {
      setSelectedProducts(stepNum, new Set());
    } else {
      setSelectedProducts(stepNum, new Set(step.products.map(p => p.id)));
    }
  };

  const handleToggleProduct = (stepNum: number, productId: number) => {
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
      setSelectedProducts(stepNum, new Set());
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

  const handleExploreAll = () => {
    if (onProductClick) {
      onProductClick(0);
    }
    toast.info('Exploring all products...', {
      duration: 2000,
    });
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Navigation */}
      <Navigation 
        currentPage="detailbuyingguide"
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
              onClick={()=>router.push('/buying-guide')}
              className="hover:underline transition-all hover:text-cyan-100"
            >
              Buying Guide
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold">Guide Details</span>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold">
            {guideTitle}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Guide Introduction */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete Surgical Protocol</h2>
          <p className="text-gray-600 leading-relaxed">
            This comprehensive 8-step guide covers the complete maxillary sinus augmentation procedure, from initial diagnosis to post-operative care. Each step includes essential products and detailed instructions for optimal surgical outcomes.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              8 Procedural Steps
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              20 Essential Products
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              Complete Equipment List
            </span>
          </div>
        </div>

        {/* Step Cards */}
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