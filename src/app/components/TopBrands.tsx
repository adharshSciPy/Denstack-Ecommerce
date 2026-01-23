"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface TopBrand {
  _id: string;
  order: number;
  brandId: {
    _id: string;
    brandName: string;
    brandLogo: string;
    description?: string;
  };
}

interface TopBrandsProps {
  onBrandClick?: (brandId: string, brandName: string) => void;
}

export default function TopBrands({ onBrandClick }: TopBrandsProps) {
  const [brands, setBrands] = useState<TopBrand[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-10">Loading brands...</div>;
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
                onClick={() =>
                  onBrandClick?.(
                    item.brandId._id,
                    item.brandId.brandName
                  )
                }
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 relative">
                  <Image
                    src={imageUrl}
                    alt={item.brandId.brandName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Hover border */}
                  <div className="absolute inset-0 border-2 border-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <p className="text-xs sm:text-sm text-gray-700 text-center group-hover:text-blue-600 group-hover:font-medium transition-all duration-300">
                  {item.brandId.brandName}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
