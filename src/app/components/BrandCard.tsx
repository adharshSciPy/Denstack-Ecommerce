import { useState } from 'react';
import decorativePattern from '../../assets/47e3e92f12de8645f1a099048d5244bbff05a1a1.png';
import Image from 'next/image';

interface Brand {
  id: number;
  name: string;
  image: string;
}

interface BrandCardProps {
  brand: Brand;
  index: number;
  onBrandClick?: (brandId: number, brandName: string) => void;
}

export default function BrandCard({ brand, index, onBrandClick }: BrandCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group animate-fade-in-up"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card with fixed aspect ratio matching Figma: width 176.916px / height 105.229px = 1.68:1 */}
      <div 
        className="bg-[#eaebfd] rounded-md transition-all duration-500 hover:shadow-[0px_-2px_10px_0px_rgba(89,29,221,0.5),0px_-2px_40px_0px_rgba(89,29,221,0.15),0px_-0.5px_0px_0px_rgba(255,255,255,0.5)] hover:-translate-y-2 cursor-pointer relative overflow-hidden shadow-[0px_-2px_10px_0px_rgba(89,29,221,0.5),0px_-2px_40px_0px_rgba(89,29,221,0.15),0px_-0.5px_0px_0px_rgba(255,255,255,0.5)]"
        style={{ aspectRatio: '1.68 / 1' }}
        onClick={() => onBrandClick?.(brand.id, brand.name)}
      >
        {/* Decorative pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image 
            src={decorativePattern} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Background gradient effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Brand Logo - centered with proper sizing */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image 
            src={brand.image} 
            alt={brand.name}
            className={`w-auto h-auto max-w-[70%] max-h-[50%] object-contain transition-all duration-700 ${
              isHovered ? 'scale-110 rotate-2' : 'scale-100'
            }`}
          />
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {/* Subtle pulse effect */}
        <div className={`absolute inset-0 rounded-md bg-purple-400/10 transition-opacity duration-500 ${
          isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
}