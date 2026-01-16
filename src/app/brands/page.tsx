'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import FeaturedBrands from '../components/FeaturedBrands';
import BrandAlphabetNav from '../components/BrandAlphabetNav';
import BrandGrid from '../components/BrandGrid';


export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

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

        <BrandGrid selectedLetter={selectedLetter} />
      </main>

    </div>
  );
}