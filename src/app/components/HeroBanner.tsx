'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import baseUrl from "../baseUrl";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8004';

interface CarouselSlide {
  _id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  order: number;
}

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch carousel slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl.INVENTORY}/api/v1/landing/carousel/getAll`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch carousel slides");
        }
        
        const data = await response.json();
        console.log("Fetched carousel slides:", data);
        
        // Get the slides array
        const slidesData = data.data || data || [];
        
        // ACTUALLY transform and store the full URLs
        const transformedSlides = slidesData.map((slide: CarouselSlide) => ({
          ...slide,
          // This is the key fix: Store the full URL, not just log it
          imageUrl: slide.imageUrl.startsWith('http') 
            ? slide.imageUrl 
            : `${BACKEND_URL}${slide.imageUrl}`
        }));
        
        console.log("Transformed slides:", transformedSlides);
        setSlides(transformedSlides); // Store the transformed slides
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-96 lg:h-[500px] bg-gray-200 animate-pulse" />
      </section>
    );
  }

  if (error || slides.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-96 lg:h-[500px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">{error || "No carousel slides available"}</p>
        </div>
      </section>
    );
  }

  const currentSlide = slides[current];
  
  // Now this should be the full URL
  const imageUrl = currentSlide?.imageUrl || null;
  
  // Add a debug log
  console.log("Current slide image URL:", imageUrl);

  // Don't render if image URL is empty or invalid
  if (!imageUrl) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-96 lg:h-[500px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">Image not available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-64 sm:h-96 lg:h-[500px] relative cursor-pointer">
        <Image
          src={imageUrl}
          alt={currentSlide.title || "Carousel slide"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          fill
          priority
          unoptimized={true} // Add this for debugging
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-500" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="text-white max-w-xl transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
              {currentSlide.title}
            </h1>
            <p className="text-lg sm:text-xl mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
              {currentSlide.subtitle}
            </p>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 delay-300 shadow-lg hover:shadow-xl">
              Shop Now
            </button>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}