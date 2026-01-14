import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import FeaturedBrands from './FeaturedBrands';
import BrandAlphabetNav from './BrandAlphabetNav';
import BrandGrid from './BrandGrid';
import Footer from './Footer';

interface BrandsPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
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

export default function BrandsPage({ 
  cartCount, 
  onCartCountChange, 
  onBackToHome, 
  onCartClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  favoritesCount
}: BrandsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartCount={cartCount} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={onCartClick}
        onLogoClick={onBackToHome}
        onFavoritesClick={onFavoritesClick}
        onOrdersClick={onOrdersClick}
        onAccountClick={onAccountClick}
        favoritesCount={favoritesCount}
      />
      <Navigation 
        currentPage="brands"
        onBrandClick={onBackToHome}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />
      
      <main className="container mx-auto px-4">
        <FeaturedBrands />
        
        <div className="mb-8">
          <h3 className="text-center text-xl mb-6">
            Explore the <span className="text-blue-600 font-semibold">complete</span> range of products
          </h3>
          
          <BrandAlphabetNav 
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />
        </div>

        <BrandGrid selectedLetter={selectedLetter} />
      </main>

      <Footer />
    </div>
  );
}