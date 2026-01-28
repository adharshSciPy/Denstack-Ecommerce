import BrandCard from './BrandCard';

// Update Brand type to match API response
type Brand = {
  _id: string;
  name: string;
  brandId: string;
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
};

interface BrandGridProps {
  brands: Brand[];
  selectedLetter: string;
  onBrandClick?: (brandId: number, brandName: string) => void;
}

export default function BrandGrid({ brands, selectedLetter, onBrandClick }: BrandGridProps) {
  // Debug: Log the brands data
  console.log("BrandGrid - All brands:", brands);
  console.log("BrandGrid - First brand:", brands[0]);
  console.log("BrandGrid - First brand image:", brands[0]?.image);

  // Group brands by first letter
  const groupBrandsByLetter = (brands: Brand[]): Record<string, Brand[]> => {
    const grouped: Record<string, Brand[]> = {};
    
    brands.forEach(brand => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(brand);
    });
    
    // Sort brands within each letter group
    Object.keys(grouped).forEach(letter => {
      grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  };

  const brandsByLetter = groupBrandsByLetter(brands);

  // Get brands for selected letter
  const getBrandsToDisplay = (): [string, Brand[]][] => {
    if (!selectedLetter) {
      // Show all brands when no letter is selected, sorted by letter
      return Object.entries(brandsByLetter).sort(([a], [b]) => a.localeCompare(b));
    }
    const brandsForLetter = brandsByLetter[selectedLetter];
    return brandsForLetter ? [[selectedLetter, brandsForLetter]] : [];
  };

  const brandsToDisplay = getBrandsToDisplay();

  return (
    <div className="py-8 space-y-12">
      {brandsToDisplay.map(([letter, letterBrands]) => (
        <div key={letter} className="animate-fade-in-up">
          {/* Letter Header */}
          <div className="mb-6 flex items-start">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-700">
              {letter}
            </h3>
          </div>

          {/* Brand Grid - responsive columns matching Figma proportions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
            {letterBrands.map((brand, index) => {
              // Debug: Log each brand being passed to BrandCard
              console.log("Passing to BrandCard:", {
                id: parseInt(brand.brandId.replace('BRAND_', '')) || 0,
                name: brand.name,
                image: brand.image,
              });
              
              return (
                <BrandCard
                  key={brand._id}
                  brand={{
                    id: parseInt(brand.brandId.replace('BRAND_', '')) || 0,
                    name: brand.name,
                    image: brand.image || undefined,
                  }}
                  index={index}
                  onBrandClick={onBrandClick}
                />
              );
            })}
          </div>
        </div>
      ))}

      {brandsToDisplay.length === 0 && selectedLetter && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400 font-bold">{selectedLetter}</span>
          </div>
          <p className="text-gray-500 text-lg">No brands found for letter "{selectedLetter}"</p>
        </div>
      )}
    </div>
  );
}