import imgFeatured1 from "../../assets/ef94a89ad56ec5cad74e343f739ed094ad97afeb.png";
import imgFeatured2 from "../../assets/2937239b5154a780b43b5f6c8eb3d9c7b63264ad.png";
import imgFeatured3 from "../../assets/6e46f3ffcddb8655555d98af899822f274328790.png";
import imgFeatured4 from "../../assets/47026aa9cfb072a8fa58340b68c0f700b027b076.png";
import imgFeatured5 from "../../assets/55cd8c220056066e6b45920e2f579fe8b348d1b9.png";
import Image from "next/image";

interface FeaturedProductsProps {
  likedProducts: Set<number>;
  onToggleLike: (id: number) => void;
  onAddToCart: () => void;
  onProductClick?: (productId: number) => void;
}

export default function FeaturedProducts({ likedProducts, onToggleLike, onAddToCart, onProductClick }: FeaturedProductsProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl text-gray-900 font-semibold">Shop by Collection</h2>
        <button className="hidden sm:flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-300 group hover:gap-3">
          <span className="text-sm font-medium">View all</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-3">
        {/* Large featured item */}
        <div className="lg:col-span-5 lg:row-span-2 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="group h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer relative">
            <div className="h-full overflow-hidden">
              <Image 
                src={imgFeatured1} 
                alt="Featured collection" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out min-h-[180px] lg:h-[260px]"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white text-sm font-semibold mb-1">Dental Instruments</h3>
              <p className="text-white/90 text-xs">Explore our premium collection</p>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000" />
          </div>
        </div>

        {/* Medium items */}
        <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-full relative hover:-translate-y-1">
            <div className="h-full overflow-hidden">
              <Image 
                src={imgFeatured2} 
                alt="Featured collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer relative hover:-translate-y-1">
              <div className="overflow-hidden">
                <Image 
                  src={imgFeatured5} 
                  alt="Featured collection" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer relative hover:-translate-y-1">
              <div className="overflow-hidden">
                <Image 
                  src={imgFeatured4} 
                  alt="Featured collection" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[125px]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* Bottom wide item */}
        <div className="lg:col-span-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer relative hover:-translate-y-1">
            <div className="overflow-hidden">
              <Image 
                src={imgFeatured3} 
                alt="Featured collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[120px] lg:h-[140px]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Center text overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-base font-bold mb-1">Complete Clinic Setup</h3>
                <p className="text-xs">Everything you need in one place</p>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}