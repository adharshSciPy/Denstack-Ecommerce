"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TopBrand {
  _id: string;
  order: number;
  brandId: {
    _id: string;
    name: string;
    brandLogo: string;
    description?: string;
  };
}

interface TopBrandsProps {
  onBrandClick?: (brandId: string, name: string) => void;
}

export default function TopBrands({ onBrandClick }: TopBrandsProps) {
  const [brands, setBrands] = useState<TopBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopBrands = async () => {
      try {
        const res = await fetch(
          "http://localhost:8004/api/v1/landing/top-brands/getAll",
          { cache: "no-store" }
        );

        const result = await res.json();

        if (result.success) {
          // 🔐 filter safety: remove null populated brands
          const validBrands = result.data.filter(
            (item: TopBrand) => item.brandId
          );

          setBrands(validBrands);
        }
      } catch (error) {
        console.error("Error fetching top brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBrands();
  }, []);

  const handleBrandClick = (item: TopBrand) => {
    // Call the callback if provided
    if (onBrandClick) {
      onBrandClick(item.brandId._id, item.brandId.name);
    }
    
    // Navigate to brand detail page with the TopBrand ID
    router.push(`/allbrands?brandId=${item._id}&brandName=${encodeURIComponent(item.brandId.name)}`);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-md">
          <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">
            Top Brands
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 lg:gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-md">
        <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">
          Top Brands
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 lg:gap-6">
          {brands.map((item, index) => {
            const imagePath = item.brandId.brandLogo;
            const imageUrl = imagePath
              ? `http://localhost:8004/${imagePath.replace(/^\//, "")}`
              : "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=400";

            return (
              <div
                key={item._id}
                className="flex flex-col items-center gap-3 cursor-pointer group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: "both",
                }}
                onClick={() => handleBrandClick(item)}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 relative">
                  <Image
                    src={imageUrl}
                    alt={item.brandId.name || "Brand logo"}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 11vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    unoptimized={!imagePath} // Use unoptimized for external URLs
                  />

                  {/* Hover border */}
                  <div className="absolute inset-0 border-2 border-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <p className="text-xs sm:text-sm text-gray-700 text-center group-hover:text-blue-600 group-hover:font-medium transition-all duration-300">
                  {item.brandId.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}