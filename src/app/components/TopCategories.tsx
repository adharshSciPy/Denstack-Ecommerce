"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import baseUrl from "../baseUrl";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  categoryId: {
    _id: string;
    categoryName: string;
    description?: string;
  };
  displayName: string;
  imageUrl: string;
  order: number;
}

interface TopCategoriesProps {
  onCategoryClick?: (categoryId: string) => void;
}

export default function TopCategories({
  onCategoryClick,
}: TopCategoriesProps = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${baseUrl.INVENTORY}/api/v1/landing/topCategories/getAll`,
        );

        if (!response.ok) {
          console.error("Failed to fetch categories, status:", response.status);
          throw new Error("Failed to fetch categories");
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Expected JSON but received:", contentType);
          throw new Error("Invalid response from categories endpoint");
        }

        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">
          Top Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">
        Top Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {categories.map((category, index) => {
          // Construct the image URL
          const imageUrl = `${baseUrl.INVENTORY}${category.imageUrl}`;

          return (
            <div
              key={category._id}
              className="group cursor-pointer animate-fade-in-up"
              onClick={() => router.push("/category")}
              style={{
                animationDelay: `${index * 75}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 mb-3 hover:-translate-y-2">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={category.displayName || "Category image"}
                    width={300}
                    height={300}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
                  />
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <p className="text-center text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors duration-300 font-medium">
                {category.displayName}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
