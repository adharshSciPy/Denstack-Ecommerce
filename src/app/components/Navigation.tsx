import { useState } from 'react';
import { Menu } from 'lucide-react';
import imgCategoryIcon from "../../assets/a4d35fff5f39c96948ff5815ff167b65baee3160.png";
import Image from 'next/image';

interface NavigationProps {
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onCategoryBrowseClick?: () => void;
  onFullStoreDirectoryClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  favoritesCount?: number;
  mobileMenuOpen?: boolean;
  currentPage?: string;
}

export default function Navigation({ onBrandClick, onBuyingGuideClick, onEventsClick, onMembershipClick, onFreebiesClick, onBestSellerClick, onClinicSetupClick, onCategoryBrowseClick, onFullStoreDirectoryClick, mobileMenuOpen: externalMobileMenuOpen, currentPage }: NavigationProps = {}) {
  const [activeItem, setActiveItem] = useState(
    currentPage === 'buying-guide' ? 'Buying Guide' :
      currentPage === 'brands' ? 'Brand' :
        currentPage === 'events' ? 'Events' :
          currentPage === 'membership' ? 'Membership' :
            currentPage === 'freebies' ? 'Freebies' :
              currentPage === 'bestseller' ? 'Best Seller' :
                currentPage === 'favorites' ? 'Favorites' :
                  currentPage === 'clinic-setup' ? 'Clinic Setup' :
                    currentPage === 'category-browse' ? 'Category' :
                      currentPage === 'category' ? 'Category' :
                        'Category'
  );
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  const mobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = externalMobileMenuOpen !== undefined ? () => { } : setInternalMobileMenuOpen;

  const menuItems = [
    'Category',
    'Brand',
    'Buying Guide',
    'Freebies',
    'Best Seller',
    'Membership',
    'Events',
    'Clinic Setup'
  ];

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === 'Brand' && onBrandClick) {
      onBrandClick();
    }
    if (item === 'Buying Guide' && onBuyingGuideClick) {
      onBuyingGuideClick();
    }
    if (item === 'Events' && onEventsClick) {
      onEventsClick();
    }
    if (item === 'Membership' && onMembershipClick) {
      onMembershipClick();
    }
    if (item === 'Freebies' && onFreebiesClick) {
      onFreebiesClick();
    }
    if (item === 'Best Seller' && onBestSellerClick) {
      onBestSellerClick();
    }
    if (item === 'Clinic Setup' && onClinicSetupClick) {
      onClinicSetupClick();
    }
    if (item === 'Category' && onCategoryBrowseClick) {
      onCategoryBrowseClick();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between lg:justify-center py-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className={`relative py-2 transition-colors ${activeItem === item
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 font-semibold'
                  : 'text-gray-900 hover:text-cyan-600'
                  }`}
              >
                {item === 'Category' && (
                  <Image src={imgCategoryIcon} alt="" className="inline-block w-5 h-5 mr-2" />
                )}
                {item}
                {activeItem === item && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Category indicator */}
          <div className="lg:hidden flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 font-semibold">
            <Image src={imgCategoryIcon} alt="" className="w-5 h-5" />
            <span>{activeItem}</span>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  handleItemClick(item);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${activeItem === item
                  ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 font-semibold border border-cyan-200'
                  : 'text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}