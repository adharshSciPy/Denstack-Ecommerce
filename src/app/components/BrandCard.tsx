import Image from "next/image";
import { StaticImageData } from "next/image";
import baseUrl from "../baseUrl";

type Brand = {
  id: number;
  name: string;
  image?: StaticImageData | string;
};

interface BrandCardProps {
  brand: Brand;
  index: number;
  onBrandClick?: (brandId: number, brandName: string) => void;
}

export default function BrandCard({ brand, index, onBrandClick }: BrandCardProps) {
  const handleClick = () => {
    if (onBrandClick) {
      onBrandClick(brand.id, brand.name);
    }
  };

  // Debug logs
  console.log("BrandCard - Received brand:", brand);
  console.log("BrandCard - Image value:", brand.image);
  console.log("BrandCard - Image type:", typeof brand.image);

  // Same image handling as ProductGrid
  const imagePath = brand.image;
  const imageUrl = imagePath && typeof imagePath === 'string'
    ? `${baseUrl}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`
    : imagePath || null;

  console.log("BrandCard - Final imageUrl:", imageUrl);

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-200 p-4 bg-white hover:scale-105"
    >
      {imageUrl ? (
        typeof imageUrl === 'string' ? (
          <>
            <img 
              src={imageUrl} 
              alt={brand.name}
              className="w-full h-32 object-contain mb-2"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.fallback-img');
                if (fallback) {
                  fallback.classList.remove('hidden');
                }
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", imageUrl);
              }}
            />
            <div className="fallback-img hidden w-full h-32 bg-gray-100 flex items-center justify-center mb-2 rounded">
              <span className="text-gray-400 text-xs text-center px-2 font-medium">{brand.name}</span>
            </div>
          </>
        ) : (
          <Image 
            src={imageUrl} 
            alt={brand.name}
            className="w-full h-32 object-contain mb-2"
          />
        )
      ) : (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center mb-2 rounded">
          <span className="text-gray-400 text-xs text-center px-2 font-medium">No Image</span>
        </div>
      )}
      
      <p className="text-center text-sm font-medium text-gray-800 truncate" title={brand.name}>
        {brand.name}
      </p>
    </div>
  );
}