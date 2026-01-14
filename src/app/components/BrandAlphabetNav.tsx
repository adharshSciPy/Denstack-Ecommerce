import { Search } from 'lucide-react';
import { useState } from 'react';

interface BrandAlphabetNavProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function BrandAlphabetNav({ selectedLetter, onSelectLetter }: BrandAlphabetNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-center gap-2 bg-blue-700 rounded-full py-3 px-4 shadow-lg">
        {alphabet.map((letter, index) => (
          <button
            key={letter}
            onClick={() => onSelectLetter(letter)}
            className={`
              w-8 h-8 rounded-full font-medium text-sm transition-all duration-300 tracking-wider
              hover:scale-125 hover:bg-white hover:text-blue-700 active:scale-95
              animate-fade-in
              ${selectedLetter === letter 
                ? 'bg-white text-blue-700 scale-110 shadow-md' 
                : 'text-white hover:shadow-lg'
              }
            `}
            style={{
              animationDelay: `${index * 20}ms`,
              animationFillMode: 'both'
            }}
          >
            {letter}
          </button>
        ))}
        
        <button 
          onClick={() => setSearchOpen(!searchOpen)}
          className="ml-2 w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center hover:scale-125 transition-all duration-300 active:scale-95 shadow-md"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden flex-wrap items-center justify-center gap-2 bg-blue-700 rounded-2xl py-3 px-4 shadow-lg">
        {alphabet.map((letter, index) => (
          <button
            key={letter}
            onClick={() => onSelectLetter(letter)}
            className={`
              w-9 h-9 rounded-lg font-medium text-sm transition-all duration-300 tracking-wider
              hover:scale-110 hover:bg-white hover:text-blue-700 active:scale-95
              ${selectedLetter === letter 
                ? 'bg-white text-blue-700 scale-105 shadow-md' 
                : 'text-white'
              }
            `}
          >
            {letter}
          </button>
        ))}
        
        <button 
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 rounded-lg bg-white text-blue-700 flex items-center justify-center hover:scale-110 transition-all duration-300 active:scale-95 shadow-md"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Navigation - Scrollable */}
      <div className="md:hidden">
        <div className="bg-blue-700 rounded-full py-2 px-3 shadow-lg overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 min-w-max">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => onSelectLetter(letter)}
                className={`
                  w-8 h-8 rounded-full font-medium text-sm transition-all duration-300 tracking-wider
                  hover:scale-110 hover:bg-white hover:text-blue-700 active:scale-90
                  ${selectedLetter === letter 
                    ? 'bg-white text-blue-700 scale-105 shadow-md' 
                    : 'text-white'
                  }
                `}
              >
                {letter}
              </button>
            ))}
            
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="ml-1 w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center hover:scale-110 transition-all duration-300 active:scale-90 shadow-md"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl p-4 z-50 animate-fade-in-up">
          <input
            type="text"
            placeholder="Search brands..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}