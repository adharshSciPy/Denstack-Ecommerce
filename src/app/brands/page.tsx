'use client';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import FeaturedBrands from '../components/FeaturedBrands';
import BrandAlphabetNav from '../components/BrandAlphabetNav';
import BrandGrid from '../components/BrandGrid';
import { useRouter } from 'next/navigation';

interface Brand {
  _id: string;
  name: string;
  brandId: string; // Changed from number to string
  image?: string;
  description?: string;
  mainCategory?: {
    categoryName: string;
    mainCategoryId: string;
    description?: string;
  };
  subCategory?: {
    categoryName: string;
    mainCategoryId: string;
    description?: string;
  };
  isActive: boolean;
}

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100,
  });

  const router = useRouter();

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:8004/api/v1/landing/brands/getAll?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const result = await response.json();
        
        setBrands(result.data);
        setPagination({
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems,
          itemsPerPage: result.pagination.itemsPerPage,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [pagination.currentPage]);

  const handleBrandClick = (brandId: number, brandName: string) => {
    router.push(`/allbrands?brandId=${brandId}&brandName=${encodeURIComponent(brandName)}`);
  };

  // Filter brands based on selected letter
  const filteredBrands = selectedLetter
    ? brands.filter(brand => brand.name.toUpperCase().startsWith(selectedLetter))
    : brands;

  // Filter brands based on search query
  const searchedBrands = searchQuery
    ? filteredBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredBrands;

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage="brands" />

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

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading brands...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <BrandGrid
              brands={searchedBrands}
              selectedLetter={selectedLetter}
              onBrandClick={handleBrandClick}
            />

            {searchedBrands.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No brands found {selectedLetter ? `starting with "${selectedLetter}"` : ''}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}