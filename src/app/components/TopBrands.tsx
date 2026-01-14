import imgBrand1 from "../../assets/a491e9455977f6dfa59a6f7555fe2b6843bb86e0.png";
import imgBrand2 from "../../assets/d695ef4689082281baeaef28ce02ac0ad68955f1.png";
import imgBrand3 from "../../assets/0d5cfd7bd0c5bcd891cdf3c7697a2dd222e01471.png";
import Image from "next/image";

export default function TopBrands() {
  const brands = [
    { id: 1, name: 'Brand 1', image: imgBrand1 },
    { id: 2, name: 'Brand 2', image: imgBrand2 },
    { id: 3, name: 'Brand 3', image: imgBrand3 },
    { id: 4, name: 'Brand 4', image: imgBrand1 },
    { id: 5, name: 'Brand 5', image: imgBrand2 },
    { id: 6, name: 'Brand 6', image: imgBrand3 },
    { id: 7, name: 'Brand 7', image: imgBrand1 },
    { id: 8, name: 'Brand 8', image: imgBrand2 },
    { id: 9, name: 'Brand 9', image: imgBrand3 },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-md">
        <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">Top Brands</h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 lg:gap-6">
          {brands.map((brand, index) => (
            <div 
              key={brand.id}
              className="flex flex-col items-center gap-3 cursor-pointer group animate-fade-in-up"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 relative">
                <Image 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Border glow effect on hover */}
                <div className="absolute inset-0 border-2 border-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 text-center group-hover:text-blue-600 group-hover:font-medium transition-all duration-300">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}