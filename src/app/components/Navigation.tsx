'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import imgCategoryIcon from '../../assets/a4d35fff5f39c96948ff5815ff167b65baee3160.png';

interface NavigationProps {
  currentPage?: string;
  cartCount?: number;
  favoritesCount?: number;
  mobileMenuOpen?: boolean;
  onCartCountChange?: (count: number) => void;

  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;

  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
}

export default function Navigation({
  currentPage = 'category',
  mobileMenuOpen: externalMobileMenuOpen,
}: NavigationProps) {
  const router = useRouter();

  const [activeItem, setActiveItem] = useState('Category');
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  const mobileMenuOpen =
    externalMobileMenuOpen !== undefined
      ? externalMobileMenuOpen
      : internalMobileMenuOpen;

  const setMobileMenuOpen =
    externalMobileMenuOpen !== undefined
      ? () => { }
      : setInternalMobileMenuOpen;

  /** ✅ Sync active tab from route */
  useEffect(() => {
    const map: Record<string, string> = {
      category: 'Category',
      membership: 'Membership',
      brands: 'Brand',
      'buying-guide': 'Buying Guide',
      detailbuyingguide: 'Buying Guide',
      freebies: 'Freebies',
      bestseller: 'Best Seller',
      events: 'Events',
      'clinic-setup': 'Clinic Setup',
    };

    setActiveItem(map[currentPage] || 'Category');
  }, [currentPage]);

  const menuItems = [
    { label: 'Category', path: '/category' },
    { label: 'Brand', path: '/brands' },
    { label: 'Buying Guide', path: '/buying-guide' },
    { label: 'Freebies', path: '/freebies' },
    { label: 'Best Seller', path: '/bestseller' },
    { label: 'Membership', path: '/membership' },
    { label: 'Events', path: '/events' },
    { label: 'Clinic Setup', path: '/clinic-setup' },
  ];

  const handleNavigation = (item: { label: string; path: string }) => {
    setActiveItem(item.label);
    router.push(item.path);
    setMobileMenuOpen(false);
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

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className={`relative py-2 transition-colors ${activeItem === item.label
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 font-semibold'
                    : 'text-gray-900 hover:text-cyan-600'
                  }`}
              >
                {item.label === 'Category' && (
                  <Image
                    src={imgCategoryIcon}
                    alt=""
                    className="inline-block w-5 h-5 mr-2"
                  />
                )}
                {item.label}
                {activeItem === item.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Active Label */}
          <div className="lg:hidden flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
            <Image src={imgCategoryIcon} alt="" className="w-5 h-5" />
            <span>{activeItem}</span>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className={`block w-full text-left px-4 py-2 rounded-lg ${activeItem === item.label
                    ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 font-semibold border border-cyan-200'
                    : 'text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
