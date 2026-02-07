'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import baseUrl from '../baseUrl';

interface MainCategory {
  _id: string;
  categoryName: string;
  description?: string;
  image?: string;
  order: number;
}

interface FeaturedProductsProps {
  onCategoryClick?: (categoryId: string, categoryName: string) => void;
}

export default function FeaturedProducts({ onCategoryClick }: FeaturedProductsProps) {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/main/getAll?limit=5`);

        if (!response.ok) {
          console.error('Failed to fetch categories, status:', response.status);
          throw new Error('Failed to fetch categories');
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.error('Expected JSON but received:', contentType);
          throw new Error('Invalid response from categories endpoint');
        }

        const data = await response.json();
        // API might return { data: [...] } or directly an array
        setCategories(data?.data || data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: MainCategory) => {
    // Call callback if provided
    if (onCategoryClick) {
      onCategoryClick(category._id, category.categoryName);
    }
    
    // Navigate to category page with products
    router.push(`/category/${category._id}?name=${encodeURIComponent(category.categoryName)}`);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl lg:text-2xl text-gray-900 font-semibold">Shop by Collection</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-3">
          <div className="lg:col-span-5 lg:row-span-2 animate-pulse">
            <div className="h-full bg-gray-200 rounded-lg min-h-[260px]" />
          </div>
          <div className="lg:col-span-7 animate-pulse">
            <div className="h-full bg-gray-200 rounded-lg min-h-[125px]" />
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-2 lg:gap-3">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-lg min-h-[125px]" />
            </div>
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-lg min-h-[125px]" />
            </div>
          </div>
          <div className="lg:col-span-12 animate-pulse">
            <div className="bg-gray-200 rounded-lg min-h-[140px]" />
          </div>
        </div>
      </section>
    );
  }

  // Get exactly 5 categories for the layout
  const [cat1, cat2, cat3, cat4, cat5] = categories.slice(0, 5);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl text-gray-900 font-semibold">Shop by Collection</h2>
        <button 
          onClick={() => router.push('/allproducts')}
          className="hidden sm:flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-300 group hover:gap-3"
        >
          <span className="text-sm font-medium">View all</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-3">
        {/* Large featured item */}
        {cat1 && (
          <div 
            className="lg:col-span-5 lg:row-span-2 animate-fade-in-up cursor-pointer" 
            style={{ animationDelay: '0ms' }}
            onClick={() => handleCategoryClick(cat1)}
          >
            <div className="group h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 relative">
              <div className="h-full overflow-hidden">
                <Image 
                  src={cat1.image ? `${baseUrl.INVENTORY}${cat1.image}` : '/placeholder-category.jpg'}
                  alt={cat1.categoryName}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out min-h-[180px] lg:h-[260px]"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-sm font-semibold mb-1">{cat1.categoryName}</h3>
                <p className="text-white/90 text-xs">{cat1.description || 'Explore our premium collection'}</p>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000" />
            </div>
          </div>
        )}

        {/* Medium item */}
        {cat2 && (
          <div 
            className="lg:col-span-7 animate-fade-in-up cursor-pointer" 
            style={{ animationDelay: '100ms' }}
            onClick={() => handleCategoryClick(cat2)}
          >
            <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full relative hover:-translate-y-1">
              <div className="h-full overflow-hidden">
                <Image 
                  src={cat2.image ? `${baseUrl.INVENTORY}${cat2.image}` : '/placeholder-category.jpg'}
                  alt={cat2.categoryName}
                  width={700}
                  height={250}
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category name overlay */}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-sm font-semibold">{cat2.categoryName}</h3>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        )}

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
          {cat3 && (
            <div 
              className="animate-fade-in-up cursor-pointer" 
              style={{ animationDelay: '200ms' }}
              onClick={() => handleCategoryClick(cat3)}
            >
              <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 relative hover:-translate-y-1">
                <div className="overflow-hidden">
                  <Image 
                    src={cat3.image ? `${baseUrl.INVENTORY}${cat3.image}` : '/placeholder-category.jpg'}
                    alt={cat3.categoryName}
                    width={350}
                    height={250}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-sm font-semibold">{cat3.categoryName}</h3>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          )}
          
          {cat4 && (
            <div 
              className="animate-fade-in-up cursor-pointer" 
              style={{ animationDelay: '300ms' }}
              onClick={() => handleCategoryClick(cat4)}
            >
              <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 relative hover:-translate-y-1">
                <div className="overflow-hidden">
                  <Image 
                    src={cat4.image ? `${baseUrl.INVENTORY}${cat4.image}` : '/placeholder-category.jpg'}
                    alt={cat4.categoryName}
                    width={350}
                    height={250}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-sm font-semibold">{cat4.categoryName}</h3>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom wide item */}
        {cat5 && (
          <div 
            className="lg:col-span-12 animate-fade-in-up cursor-pointer" 
            style={{ animationDelay: '400ms' }}
            onClick={() => handleCategoryClick(cat5)}
          >
            <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 relative hover:-translate-y-1">
              <div className="overflow-hidden">
                <Image 
                  src={cat5.image ? `${baseUrl.INVENTORY}${cat5.image}` : '/placeholder-category.jpg'}
                  alt={cat5.categoryName}
                  width={1200}
                  height={280}
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[140px]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Center text overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-base font-bold mb-1">{cat5.categoryName}</h3>
                  <p className="text-xs">{cat5.description || 'Everything you need in one place'}</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}