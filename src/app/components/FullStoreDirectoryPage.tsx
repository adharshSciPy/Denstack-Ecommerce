import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Search, Home, ExternalLink, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface FullStoreDirectoryPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onCategoryClick?: (category: string) => void;
  onBrandClick?: (brand: string) => void;
}

interface Brand {
  name: string;
  icon: string;
  category: string;
}

const categories = [
  { id: 'dental-brands', name: 'Dental Brands', icon: '🦷' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
  { id: 'offer-zone', name: 'Offer Zone', icon: '🎁' },
  { id: 'general-dentistry', name: 'General Dentistry', icon: '🔧' },
  { id: 'equipments', name: 'Equipments', icon: '⚙️' },
  { id: 'student-section', name: 'Student Section', icon: '🎓' },
  { id: 'restorative', name: 'Restorative', icon: '🦴' },
  { id: 'endodontics', name: 'Endodontics', icon: '🏥' },
];

const brands: Brand[] = [
  // 3M Series
  { name: '3A Medes', icon: '🏢', category: 'dental-brands' },
  { name: '3M Unitek', icon: '🏢', category: 'dental-brands' },
  { name: '3M ESPE', icon: '🏢', category: 'dental-brands' },
  
  // A Series
  { name: 'AAA', icon: '🔵', category: 'dental-brands' },
  { name: 'Abgel', icon: '🔴', category: 'pharmacy' },
  { name: 'Microtek', icon: '🟦', category: 'equipments' },
  { name: 'Advanced Biotech', icon: '🔺', category: 'dental-brands' },
  { name: 'Aidite', icon: '🔷', category: 'dental-brands' },
  { name: 'A.J. Wilcock', icon: '🟩', category: 'dental-brands' },
  { name: 'Alerio', icon: '🟡', category: 'dental-brands' },
  { name: 'American Eagle', icon: '🦅', category: 'dental-brands' },
  { name: 'Ammdent', icon: '🟦', category: 'dental-brands' },
  { name: 'Anabond Stedman', icon: '🔴', category: 'dental-brands' },
  { name: 'Anand', icon: '🔵', category: 'dental-brands' },
  { name: 'Angelus', icon: '⬅️', category: 'endodontics' },
  { name: 'API', icon: '🟡', category: 'dental-brands' },
  { name: 'Apple Dental', icon: '🍎', category: 'dental-brands' },
  { name: 'Astek Innovations', icon: '🏢', category: 'equipments' },
  
  // B Series
  { name: 'Baolai Medical', icon: '🔵', category: 'dental-brands' },
  { name: 'Baot', icon: '🟦', category: 'equipments' },
  { name: 'Bausch', icon: '🟦', category: 'dental-brands' },
  { name: 'Bego', icon: '🔹', category: 'dental-brands' },
  { name: 'Being Foshan', icon: '🔴', category: 'equipments' },
  { name: 'Bestodent', icon: '🦷', category: 'dental-brands' },
  { name: 'Bien Air', icon: '🔵', category: 'equipments' },
  { name: 'Bio-Art', icon: '🟢', category: 'dental-brands' },
  { name: 'Blossom', icon: '🌸', category: 'dental-brands' },
  { name: 'Bode', icon: '⬛', category: 'dental-brands' },
  { name: 'Bonart', icon: '🟦', category: 'equipments' },
  { name: 'B-Ostin', icon: '🟦', category: 'dental-brands' },
  
  // C Series
  { name: 'Capri', icon: '🔶', category: 'dental-brands' },
  { name: 'Captain Ortho', icon: '🟦', category: 'dental-brands' },
  { name: 'Carestream', icon: '🟦', category: 'equipments' },
  { name: 'Centrino', icon: '🟢', category: 'dental-brands' },
  { name: 'Cerkamed', icon: '🟢', category: 'dental-brands' },
  { name: 'Chinese', icon: '🟦', category: 'dental-brands' },
  { name: 'Coltene Whaledent', icon: '🟦', category: 'dental-brands' },
  { name: 'Confident', icon: '🏢', category: 'dental-brands' },
  { name: 'Cologenesis Healthcare', icon: '🔹', category: 'dental-brands' },
  { name: 'Corident', icon: '🟦', category: 'dental-brands' },
  { name: 'Cotisen', icon: '🟦', category: 'dental-brands' },
  { name: 'Dentsply', icon: '🟦', category: 'dental-brands' },
  
  // D-G Series
  { name: 'Diadent', icon: '💎', category: 'dental-brands' },
  { name: 'Diaswiss', icon: '🇨🇭', category: 'dental-brands' },
  { name: 'Dline', icon: '📏', category: 'dental-brands' },
  { name: 'DMG', icon: '🏢', category: 'dental-brands' },
  { name: 'ドリームデンタル', icon: '🎌', category: 'dental-brands' },
  { name: 'Dürr Dental', icon: '🔵', category: 'equipments' },
  { name: 'Dux Dental', icon: '🟦', category: 'dental-brands' },
  { name: 'Elsodent', icon: '🟦', category: 'dental-brands' },
  { name: 'Endo Technic', icon: '🔧', category: 'endodontics' },
  { name: 'EMS', icon: '🟥', category: 'equipments' },
  { name: 'Fanta Dental', icon: '🍊', category: 'dental-brands' },
  { name: 'FGM', icon: '🟩', category: 'dental-brands' },
  { name: 'Fine Science', icon: '🔬', category: 'dental-brands' },
  { name: 'First Medica', icon: '⚕️', category: 'pharmacy' },
  { name: 'Formlabs', icon: '🔷', category: 'equipments' },
  { name: 'GC Corporation', icon: '🏢', category: 'dental-brands' },
  { name: 'GDC', icon: '🔵', category: 'dental-brands' },
  { name: 'Geistlich', icon: '🟦', category: 'dental-brands' },
  { name: 'Glidewell', icon: '↔️', category: 'dental-brands' },
  
  // H-K Series
  { name: 'ハーツデンタル', icon: '❤️', category: 'dental-brands' },
  { name: 'Henry Schein', icon: '🏢', category: 'dental-brands' },
  { name: 'Hu-Friedy', icon: '🔧', category: 'dental-brands' },
  { name: 'iDent', icon: '🆔', category: 'equipments' },
  { name: 'Ivoclar Vivadent', icon: '🟦', category: 'dental-brands' },
  { name: 'J. Morita', icon: '🏢', category: 'equipments' },
  { name: 'Jainco', icon: '🟦', category: 'dental-brands' },
  { name: 'Johnson & Johnson', icon: '🏢', category: 'pharmacy' },
  { name: 'KAVO', icon: '⚙️', category: 'equipments' },
  { name: 'Kerr', icon: '🟦', category: 'dental-brands' },
  { name: 'Komet', icon: '☄️', category: 'dental-brands' },
  
  // L-O Series
  { name: 'Lascod', icon: '🔷', category: 'dental-brands' },
  { name: 'Lifecore', icon: '❤️', category: 'dental-brands' },
  { name: 'Litex', icon: '💡', category: 'dental-brands' },
  { name: 'MANI', icon: '🔧', category: 'dental-brands' },
  { name: 'Medicept', icon: '⚕️', category: 'pharmacy' },
  { name: 'Medin', icon: '🏥', category: 'dental-brands' },
  { name: 'Mediray', icon: '📡', category: 'equipments' },
  { name: 'Meta Biomed', icon: '🔬', category: 'dental-brands' },
  { name: 'Microdent', icon: '🔬', category: 'dental-brands' },
  { name: 'Miltex', icon: '🔧', category: 'dental-brands' },
  { name: 'Nobel Biocare', icon: '🏆', category: 'dental-brands' },
  { name: 'NSK', icon: '⚙️', category: 'equipments' },
  { name: 'Opalescence', icon: '💎', category: 'dental-brands' },
  { name: 'Optident', icon: '👁️', category: 'dental-brands' },
  
  // P-S Series
  { name: 'Patterson Dental', icon: '🏢', category: 'dental-brands' },
  { name: 'Pentron', icon: '🔷', category: 'dental-brands' },
  { name: 'Piezon', icon: '🔊', category: 'equipments' },
  { name: 'Planmeca', icon: '📐', category: 'equipments' },
  { name: 'Premier Dental', icon: '⭐', category: 'dental-brands' },
  { name: 'Prime Dental', icon: '🏆', category: 'dental-brands' },
  { name: 'Pulpdent', icon: '🦷', category: 'dental-brands' },
  { name: 'Queensgate', icon: '👑', category: 'dental-brands' },
  { name: 'Railroadent', icon: '🚂', category: 'dental-brands' },
  { name: 'Renfert', icon: '🔧', category: 'equipments' },
  { name: 'Roeko', icon: '🔵', category: 'endodontics' },
  { name: 'Saremco', icon: '🟦', category: 'dental-brands' },
  { name: 'Satelec', icon: '📡', category: 'equipments' },
  { name: 'Schütz Dental', icon: '🛡️', category: 'dental-brands' },
  { name: 'SDI', icon: '🔵', category: 'dental-brands' },
  { name: 'Septodont', icon: '💉', category: 'pharmacy' },
  { name: 'Shofu', icon: '🏢', category: 'dental-brands' },
  { name: 'Sirona', icon: '⚙️', category: 'equipments' },
  { name: 'SmileLine', icon: '😊', category: 'dental-brands' },
  { name: 'Straumann', icon: '🏢', category: 'dental-brands' },
  { name: 'Sultan', icon: '👑', category: 'dental-brands' },
  { name: 'Sunstar', icon: '⭐', category: 'dental-brands' },
  
  // T-Z Series
  { name: 'TDV Dental', icon: '📺', category: 'dental-brands' },
  { name: 'Tepe', icon: '🦷', category: 'dental-brands' },
  { name: 'Tokuyama', icon: '🏢', category: 'dental-brands' },
  { name: 'Tubli-Seal', icon: '🔒', category: 'endodontics' },
  { name: 'Ultradent', icon: '🦷', category: 'dental-brands' },
  { name: 'Unident', icon: '🔵', category: 'dental-brands' },
  { name: 'Voco', icon: '🟦', category: 'dental-brands' },
  { name: 'W&H', icon: '⚙️', category: 'equipments' },
  { name: 'Waldent', icon: '🌲', category: 'dental-brands' },
  { name: 'Woodpecker', icon: '🐦', category: 'equipments' },
  { name: 'Xinxiang', icon: '🏢', category: 'dental-brands' },
  { name: 'Yamahachi', icon: '🏢', category: 'dental-brands' },
  { name: 'Young Dental', icon: '👶', category: 'dental-brands' },
  { name: 'Zeramex', icon: '💎', category: 'dental-brands' },
  { name: 'Zest Dental', icon: '🍋', category: 'dental-brands' },
  { name: 'Zhermack', icon: '🏢', category: 'dental-brands' },
  { name: 'Zimmer Biomet', icon: '🏢', category: 'dental-brands' },
];

export default function FullStoreDirectoryPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onCategoryClick,
  onBrandClick
}: FullStoreDirectoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBrandClick = (brandName: string) => {
    if (onBrandClick) {
      onBrandClick(brandName);
    } else {
      toast.success(`Viewing ${brandName} products`);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setMobileMenuOpen(false);
    if (categoryId && onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <Header 
        cartCount={cartCount} 
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick || onBackToHome}
        onFavoritesClick={onBackToHome}
        favoritesCount={0}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={onBackToHome}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-500 font-semibold uppercase">Category</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Category Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-between"
          >
            <span>Categories</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Sidebar - Categories */}
          <aside className={`
            lg:block lg:w-64 flex-shrink-0
            ${mobileMenuOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* All Items */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`
                  w-full text-left px-4 py-4 flex items-center justify-between
                  transition-all duration-200
                  ${!selectedCategory 
                    ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏪</span>
                  <span>All Items</span>
                </div>
              </button>

              {/* Category List */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    w-full text-left px-4 py-4 flex items-center justify-between
                    transition-all duration-200 border-t border-gray-100
                    ${selectedCategory === category.id 
                      ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search By Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Items Count */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {filteredBrands.length} Items
                </h2>
              </div>

              {/* Brands Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrands.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() => handleBrandClick(brand.name)}
                    className="group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white text-left animate-fade-in"
                    style={{
                      animationDelay: `${index * 20}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Brand Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {brand.icon}
                    </div>
                    
                    {/* Brand Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {brand.name}
                      </h3>
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* No Results */}
              {filteredBrands.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No brands found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">{brands.length}+</div>
                <div className="text-sm opacity-90">Trusted Brands</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-90">Authentic</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-90">Support</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">Fast</div>
                <div className="text-sm opacity-90">Delivery</div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      >
        ← Back to Home
      </button>
    </div>
  );
}
