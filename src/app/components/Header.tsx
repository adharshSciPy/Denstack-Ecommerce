import { Search, User, ShoppingBag, Heart, Package } from 'lucide-react';
import imgLogo from "../../assets/5676604e0b77f8f7fab1059f85830e7e1f6769d8.png";
import Image from 'next/image';

interface HeaderProps {
  cartCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onLogoClick?: () => void;
  onAccountClick?: () => void;
  favoritesCount?: number;
}

export default function Header({ cartCount = 0, searchQuery, onSearchChange, onCartClick, onFavoritesClick, onOrdersClick, onLogoClick, onAccountClick, favoritesCount = 0 }: HeaderProps) {
  return (
    <header className="border-b border-gray-300 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
          {/* Logo */}
          <div className="w-32 lg:w-36 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300">
            <Image src={imgLogo} alt="Logo" className="w-full h-auto" onClick={onLogoClick} />
          </div>

          {/* Search Bar */}
          <div className="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 lg:max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 hover:shadow-md"
              />
            </div>
          </div>

          {/* Account & Shopping */}
          <div className="order-2 lg:order-3 flex items-center gap-6">
            <button
              onClick={onAccountClick}
              className="flex items-center gap-2 hover:text-cyan-600 transition-all duration-300 group hover:scale-105 active:scale-95"
            >
              <User className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors" />
              <span className="hidden sm:inline text-sm text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-teal-600 transition-colors">Account</span>
            </button>

            <button
              onClick={onCartClick}
              className="flex items-center gap-2 hover:text-cyan-600 transition-all duration-300 group relative hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in font-medium shadow-lg">
                    {cartCount}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-sm text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-teal-600 transition-colors">Shopping</span>
            </button>

            <button
              onClick={onFavoritesClick}
              className="flex items-center gap-2 hover:text-cyan-600 transition-all duration-300 group relative hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <Heart className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors" />
                {favoritesCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in font-medium shadow-lg">
                    {favoritesCount}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-sm text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 transition-colors">Favorites</span>
            </button>

            <button
              onClick={onOrdersClick}
              className="flex items-center gap-2 hover:text-cyan-600 transition-all duration-300 group relative hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <Package className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors" />
              </div>
              <span className="hidden sm:inline text-sm text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-teal-600 transition-colors">Orders</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}