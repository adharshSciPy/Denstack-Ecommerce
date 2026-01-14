import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { Search, ChevronRight, Heart, ShoppingCart, Star, Filter } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface CategoryBrowsePageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onFullStoreDirectoryClick?: () => void;
  likedProducts?: Set<number>;
  onToggleLike?: (productId: number) => void;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface SubCategory {
  name: string;
  products: Product[];
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

const categoryData: Category[] = [
  {
    name: 'Dental Brands',
    subCategories: [
      {
        name: 'Premium Brands',
        products: [
          { id: 1, name: 'Dentsply Sirona Kit', price: '₹15,999', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 2, name: 'Kerr Dental Set', price: '₹12,499', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 3, name: '3M ESPE Collection', price: '₹18,999', image: 'https://via.placeholder.com/150', rating: 4.9, inStock: true },
          { id: 4, name: 'GC America Bundle', price: '₹14,799', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      },
      {
        name: 'Value Brands',
        products: [
          { id: 5, name: 'Waldent Essential Kit', price: '₹6,999', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
          { id: 6, name: 'GDC Basic Set', price: '₹5,499', image: 'https://via.placeholder.com/150', rating: 4.4, inStock: true },
          { id: 7, name: 'MANI Premium Pack', price: '₹7,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Pharmacy',
    subCategories: [
      {
        name: 'Antibiotics',
        products: [
          { id: 8, name: 'Amoxicillin 500mg', price: '₹299', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 9, name: 'Metronidazole 400mg', price: '₹199', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 10, name: 'Clindamycin 300mg', price: '₹399', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
        ]
      },
      {
        name: 'Pain Relief',
        products: [
          { id: 11, name: 'Ibuprofen 400mg', price: '₹149', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
          { id: 12, name: 'Paracetamol 650mg', price: '₹99', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 13, name: 'Aceclofenac SR', price: '₹249', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Offer Zone',
    subCategories: [
      {
        name: 'Clearance Sale',
        products: [
          { id: 14, name: 'Dental Mirror Set (20% OFF)', price: '₹799', image: 'https://via.placeholder.com/150', rating: 4.3, inStock: true },
          { id: 15, name: 'Glove Box Bundle (30% OFF)', price: '₹1,499', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
          { id: 16, name: 'Composite Kit (25% OFF)', price: '₹8,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      },
      {
        name: 'Buy 1 Get 1',
        products: [
          { id: 17, name: 'Prophy Paste Duo', price: '₹599', image: 'https://via.placeholder.com/150', rating: 4.4, inStock: true },
          { id: 18, name: 'Cotton Roll Pack', price: '₹299', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'General Dentistry',
    subCategories: [
      {
        name: 'Examination Instruments',
        products: [
          { id: 19, name: 'Dental Mirror #5', price: '₹299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 20, name: 'Explorer Probe', price: '₹349', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 21, name: 'Tweezers Set', price: '₹499', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
        ]
      },
      {
        name: 'Operative Instruments',
        products: [
          { id: 22, name: 'Excavator Spoon', price: '₹399', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 23, name: 'Burnisher Kit', price: '₹799', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 24, name: 'Filling Instruments Set', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Equipments',
    subCategories: [
      {
        name: 'Dental Chairs',
        products: [
          { id: 25, name: 'Hydraulic Dental Chair', price: '₹89,999', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 26, name: 'Electric Dental Chair', price: '₹1,29,999', image: 'https://via.placeholder.com/150', rating: 4.9, inStock: true },
        ]
      },
      {
        name: 'Autoclaves',
        products: [
          { id: 27, name: 'Class B Autoclave 18L', price: '₹45,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 28, name: 'Class N Autoclave 12L', price: '₹29,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      },
      {
        name: 'Ultrasonic Scalers',
        products: [
          { id: 29, name: 'Piezo Scaler Pro', price: '₹18,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 30, name: 'Magnetostrictive Scaler', price: '₹15,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Student Section',
    subCategories: [
      {
        name: 'Student Kits',
        products: [
          { id: 31, name: 'Complete Student Kit', price: '₹12,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 32, name: 'Basic Instrument Set', price: '₹6,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 33, name: 'Dissection Kit', price: '₹3,999', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
        ]
      },
      {
        name: 'Study Materials',
        products: [
          { id: 34, name: 'Anatomy Atlas', price: '₹1,999', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 35, name: 'Clinical Handbook', price: '₹1,499', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Restorative',
    subCategories: [
      {
        name: 'Composite Resins',
        products: [
          { id: 36, name: 'Universal Composite A2', price: '₹2,499', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 37, name: 'Flow Composite Kit', price: '₹1,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 38, name: 'Bulk Fill Composite', price: '₹2,999', image: 'https://via.placeholder.com/150', rating: 4.9, inStock: true },
        ]
      },
      {
        name: 'Bonding Agents',
        products: [
          { id: 39, name: '5th Gen Bonding', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 40, name: '7th Gen Universal Bond', price: '₹1,799', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Endodontics',
    subCategories: [
      {
        name: 'Rubber Dam Kits & Accessories',
        products: [
          { id: 41, name: 'Rubber Dam Kit', price: '₹1,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 42, name: 'Rubber Dam Sheet', price: '₹299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 43, name: 'Rubber Dam Clamps', price: '₹599', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
          { id: 44, name: 'Rubber Dam Template', price: '₹399', image: 'https://via.placeholder.com/150', rating: 4.4, inStock: true },
          { id: 45, name: 'Rubber Dam Frame', price: '₹499', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 46, name: 'Rubber Dam Punch Forceps', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
        ]
      },
      {
        name: 'Endo Diagnosis',
        products: [
          { id: 47, name: 'Apex Locator Digital', price: '₹8,999', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 48, name: 'Electric Pulp Tester', price: '₹4,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 49, name: 'Endo Ice Spray', price: '₹599', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
        ]
      },
      {
        name: 'Cavity Access',
        products: [
          { id: 50, name: 'Endo Access Bur Kit', price: '₹1,999', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 51, name: 'Gates Glidden Drills', price: '₹899', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 52, name: 'Peeso Reamers Set', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      },
      {
        name: 'Cleaning And Shaping',
        products: [
          { id: 53, name: 'Rotary File System', price: '₹3,999', image: 'https://via.placeholder.com/150', rating: 4.9, inStock: true },
          { id: 54, name: 'K-Files Stainless Steel', price: '₹599', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 55, name: 'H-Files Set', price: '₹649', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 56, name: 'Hedstrom Files', price: '₹699', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
        ]
      },
      {
        name: 'Intracanal Medicaments',
        products: [
          { id: 57, name: 'Calcium Hydroxide Paste', price: '₹499', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 58, name: 'Ledermix Paste', price: '₹899', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 59, name: 'Formocresol Solution', price: '₹299', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
        ]
      },
      {
        name: 'Post & Core',
        products: [
          { id: 60, name: 'Fiber Post Kit', price: '₹2,999', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 61, name: 'Metal Post Set', price: '₹1,999', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
          { id: 62, name: 'Core Build Up Material', price: '₹1,499', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
        ]
      },
      {
        name: 'Obturation',
        products: [
          { id: 63, name: 'Gutta Percha Points', price: '₹399', image: 'https://via.placeholder.com/150', rating: 4.7, inStock: true },
          { id: 64, name: 'Endodontic Sealer', price: '₹899', image: 'https://via.placeholder.com/150', rating: 4.8, inStock: true },
          { id: 65, name: 'Thermoplastic Obturator', price: '₹12,999', image: 'https://via.placeholder.com/150', rating: 4.9, inStock: true },
          { id: 66, name: 'Spreaders & Pluggers Set', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      }
    ]
  },
  {
    name: 'Full Store Directory',
    subCategories: [
      {
        name: 'Browse All Categories',
        products: [
          { id: 67, name: 'Featured Product 1', price: '₹999', image: 'https://via.placeholder.com/150', rating: 4.5, inStock: true },
          { id: 68, name: 'Featured Product 2', price: '₹1,299', image: 'https://via.placeholder.com/150', rating: 4.6, inStock: true },
        ]
      }
    ]
  }
];

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
}

function ProductCard({ product, isLiked, onToggleLike, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock Badge */}
      {product.inStock && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          In Stock
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike();
        }}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${isLiked
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-blue-600 mb-3">
          {product.price}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className={`
            w-full py-2 px-3 rounded-lg font-bold text-sm
            transition-all duration-300
            ${isHovered
              ? 'bg-blue-700 text-white shadow-lg translate-y-[-2px]'
              : 'bg-blue-600 text-white shadow-md'
            }
            hover:shadow-xl active:scale-95
          `}
        >
          <ShoppingCart className="w-4 h-4 inline mr-1" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function CategoryBrowsePage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFullStoreDirectoryClick,
  likedProducts = new Set(),
  onToggleLike
}: CategoryBrowsePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(7); // Default to Endodontics
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(0);
  const [localLikedProducts, setLocalLikedProducts] = useState<Set<number>>(likedProducts);

  const filteredCategories = categoryData.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategory = filteredCategories[selectedCategoryIndex] || filteredCategories[0];
  const selectedSubCategory = selectedCategory?.subCategories[selectedSubCategoryIndex];

  const handleToggleLike = (productId: number) => {
    if (onToggleLike) {
      onToggleLike(productId);
    } else {
      setLocalLikedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
          toast.success('Removed from favorites');
        } else {
          newSet.add(productId);
          toast.success('Added to favorites');
        }
        return newSet;
      });
    }
  };

  const handleAddToCart = (productName: string) => {
    onCartCountChange(cartCount + 1);
    toast.success(`${productName} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <Header
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => { }}
        onCartClick={onCartClick || onBackToHome}
        onFavoritesClick={onBackToHome}
        favoritesCount={localLikedProducts.size}
      />

      <Navigation
        currentPage="category"
        onBrandClick={onBrandClick || onBackToHome}
        onBuyingGuideClick={onBuyingGuideClick || onBackToHome}
        onEventsClick={onEventsClick || onBackToHome}
        onMembershipClick={onMembershipClick || onBackToHome}
        onFreebiesClick={onFreebiesClick || onBackToHome}
        onBestSellerClick={onBestSellerClick || onBackToHome}
        onClinicSetupClick={onClinicSetupClick || onBackToHome}
        onFullStoreDirectoryClick={onFullStoreDirectoryClick || onBackToHome}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse Categories</h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Desktop: Three Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* CATEGORY Column */}
          <div className="col-span-3 bg-gray-50 border-r-2 border-gray-200">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-600 text-sm uppercase">Category</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {filteredCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Check if Full Store Directory is clicked
                    if (category.name === 'Full Store Directory' && onFullStoreDirectoryClick) {
                      onFullStoreDirectoryClick();
                    } else {
                      setSelectedCategoryIndex(index);
                      setSelectedSubCategoryIndex(0);
                    }
                  }}
                  className={`
                    w-full text-left px-4 py-3 transition-all duration-200
                    ${selectedCategoryIndex === index
                      ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* SUB CATEGORY Column */}
          <div className="col-span-3 bg-gray-50 border-r-2 border-gray-200">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-600 text-sm uppercase">Sub Category</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {selectedCategory?.subCategories.map((subCategory, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSubCategoryIndex(index)}
                  className={`
                    w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200
                    ${selectedSubCategoryIndex === index
                      ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{subCategory.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS Column */}
          <div className="col-span-6 bg-white">
            <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b-2 border-gray-200">
              <h2 className="font-bold text-gray-800 text-sm uppercase">
                {selectedSubCategory?.name || 'Products'}
              </h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] p-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {selectedSubCategory?.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLiked={localLikedProducts.has(product.id)}
                    onToggleLike={() => handleToggleLike(product.id)}
                    onAddToCart={() => handleAddToCart(product.name)}
                  />
                ))}
              </div>

              {selectedSubCategory?.products.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No products available in this category
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Accordion Layout */}
        <div className="lg:hidden space-y-4">
          {filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => {
                  setSelectedCategoryIndex(catIndex);
                  setSelectedSubCategoryIndex(0);
                }}
                className={`
                  w-full text-left px-4 py-4 font-semibold flex items-center justify-between
                  ${selectedCategoryIndex === catIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-800'}
                `}
              >
                {category.name}
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${selectedCategoryIndex === catIndex ? 'rotate-90' : ''
                    }`}
                />
              </button>

              {/* Subcategories */}
              {selectedCategoryIndex === catIndex && (
                <div className="border-t border-gray-200">
                  {category.subCategories.map((subCategory, subIndex) => (
                    <div key={subIndex}>
                      <button
                        onClick={() => setSelectedSubCategoryIndex(subIndex)}
                        className={`
                          w-full text-left px-6 py-3 text-sm flex items-center justify-between
                          ${selectedSubCategoryIndex === subIndex
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-700 bg-gray-50'
                          }
                        `}
                      >
                        {subCategory.name}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${selectedSubCategoryIndex === subIndex ? 'rotate-90' : ''
                            }`}
                        />
                      </button>

                      {/* Products */}
                      {selectedSubCategoryIndex === subIndex && (
                        <div className="p-4 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subCategory.products.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                isLiked={localLikedProducts.has(product.id)}
                                onToggleLike={() => handleToggleLike(product.id)}
                                onAddToCart={() => handleAddToCart(product.name)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">20,000+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">450+</div>
            <div className="text-sm text-gray-600">Trusted Brands</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Original</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600">Best</div>
            <div className="text-sm text-gray-600">Prices</div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}