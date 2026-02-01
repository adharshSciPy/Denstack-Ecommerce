'use client';
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useRouter } from 'next/navigation';
import baseUrl from "../baseUrl";

type Brand = {
  id: string; // use the MongoDB ObjectId string (24 chars)
  name: string;
  image?: StaticImageData | string | { url?: string; src?: string; path?: string };
};

interface BrandCardProps {
  brand: Brand;
  index: number;
  onBrandClick?: (brandId: string, brandName: string) => void;
} 

export default function BrandCard({ brand, index, onBrandClick }: BrandCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onBrandClick) {
      onBrandClick(brand.id, brand.name);
      return;
    }

    // Fallback: navigate directly to allbrands with query params (brand.id is an ObjectId string)
    try {
      router.push(`/allbrands?brandId=${brand.id}&brandName=${encodeURIComponent(brand.name)}`);
    } catch (err) {
      console.error('Navigation failed:', err);
    }
  };

  // Debug logs
  console.log("BrandCard - Received brand:", brand);
  console.log("BrandCard - Image value:", brand.image);
  console.log("BrandCard - Image type:", typeof brand.image);

  // Normalize image path: accept string, StaticImageData, or object { url|src|path }
  const imagePath = brand.image;
  const getStringPath = (p: any): string | null => {
    if (!p) return null;
    if (typeof p === 'string') return p;
    if (typeof p === 'object') {
      if (typeof p.url === 'string') return p.url;
      if (typeof p.src === 'string') return p.src;
      if (typeof p.path === 'string') return p.path;
    }
    return null;
  };

  const pathStr = getStringPath(imagePath);
  const imageUrl = pathStr
    ? (() => {
        const clean = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
        // Use INVENTORY host for '/uploads' paths (server-provided assets), otherwise use IMAGE host
        const host = pathStr.startsWith('/uploads') ? baseUrl.INVENTORY : baseUrl.IMAGE;
        return `${host}/${clean}`;
      })()
    : null;

  // If image is a static import (StaticImageData) and not a string path, keep it for next/image
  const importedImage = !pathStr && imagePath && typeof imagePath === 'object' ? imagePath as StaticImageData : null;

  console.log("BrandCard - Final imageUrl:", imageUrl, "importedImage:", importedImage);

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-200 p-4 bg-white hover:scale-105"
    >
      {typeof imageUrl === 'string' ? (
        <>
          <img 
            src={imageUrl} 
            alt={brand.name}
            className="w-full h-32 object-contain mb-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;

              // If image was served from INVENTORY and we haven't tried IMAGE host yet, preflight the IMAGE host via HEAD then switch
              try {
                const triedAlt = target.dataset.triedAlt === 'true';
                if (!triedAlt && typeof imageUrl === 'string' && imageUrl.startsWith(baseUrl.INVENTORY)) {
                  const altSrc = imageUrl.replace(baseUrl.INVENTORY, baseUrl.IMAGE);
                  target.dataset.triedAlt = 'true';

                  // Perform a HEAD request to avoid triggering another broken <img> load if the alternate is missing
                  fetch(altSrc, { method: 'HEAD' })
                    .then(res => {
                      if (res.ok) {
                        console.warn(`Inventory image missing — using IMAGE host for "${brand.name}" -> ${altSrc}`);
                        target.src = altSrc;
                      } else {
                        console.warn(`Alt image not available (status ${res.status}) for "${brand.name}", showing fallback`);
                        if (target) target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.fallback-img');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    })
                    .catch(fetchErr => {
                      // Network or CORS error when checking alt host — show fallback
                      console.warn(`HEAD check failed for alt image of "${brand.name}":`, fetchErr);
                      if (target) target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-img');
                      if (fallback) fallback.classList.remove('hidden');
                    });

                  return;
                }
              } catch (err) {
                // ignore dataset errors
              }

              // Final fallback: hide broken <img> and show placeholder
              const srcStr = typeof imageUrl === 'string' ? imageUrl : (imageUrl ? JSON.stringify(imageUrl) : String(imageUrl));
              console.warn(`Image failed to load for "${brand.name}" — src: ${srcStr} (type: ${typeof imageUrl})`);
              if (target) target.style.display = 'none';
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
      ) : importedImage ? (
        <Image 
          src={importedImage as StaticImageData} 
          alt={brand.name}
          className="w-full h-32 object-contain mb-2"
        />
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