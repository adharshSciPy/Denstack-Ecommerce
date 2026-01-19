'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import FeaturedBrands from '../components/FeaturedBrands';
import BrandAlphabetNav from '../components/BrandAlphabetNav';
import BrandGrid from '../components/BrandGrid';
import { useRouter } from 'next/navigation';

interface BrandsPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick: () => void;
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
  onBrandDetailClick: (brandId: number, brandName: string) => void;
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
  favoritesCount,
  onBrandDetailClick,
}: BrandsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  const router = useRouter();

  const handleBrandClick = (brandId: number, brandName: string) => {
    router.push(`/allbrands?brandId=${brandId}&brandName=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage="brands"
      />

      <main className="container mx-auto px-4">
        <FeaturedBrands />

        <div className="mb-8">
          <h3 className="text-center text-black text-xl mb-6">
            Explore the <span className="text-blue-600 font-semibold">complete</span> range of products
          </h3>

          <BrandAlphabetNav
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />
        </div>

        <BrandGrid
          selectedLetter={selectedLetter}
          onBrandClick={handleBrandClick}
        />
      </main>

    </div>
  );
}