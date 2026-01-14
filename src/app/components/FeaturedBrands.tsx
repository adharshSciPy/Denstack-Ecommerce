import imgBrand1 from "../../assets/65d1d77f57d8678c9ead0c955ab5a54715d0b896.png";
import imgBrand2 from "../../assets/ef062af9490be97dd7bbdb3a8c2aba45cae7ce62.png";
import imgBrand3 from "../../assets/d0d8883b0bef54f87cbf9827c1acb3a49770a44a.png";
import Image from "next/image";

export default function FeaturedBrands() {
  const brandIcons = [
    { id: 1, image: imgBrand1, color: 'blue', delay: 0 },
    { id: 2, image: imgBrand2, color: 'purple', delay: 100 },
    { id: 3, image: imgBrand3, color: 'blue', delay: 200 },
    { id: 4, image: imgBrand1, color: 'blue', delay: 300 },
    { id: 5, image: imgBrand2, color: 'purple', delay: 400 },
    { id: 6, image: imgBrand3, color: 'blue', delay: 500 },
    { id: 7, image: imgBrand1, color: 'blue', delay: 600 },
    { id: 8, image: imgBrand2, color: 'purple', delay: 700 },
  ];

  // Scattered positions for different screen sizes
  const positions = [
    'top-8 left-[5%]',
    'top-20 left-[15%]',
    'top-12 left-[30%]',
    'top-32 left-[25%]',
    'top-4 left-[45%]',
    'top-24 left-[55%]',
    'top-8 right-[15%]',
    'top-28 right-[8%]',
  ];

  return (
    <section className="py-12 mb-8">
      <h2 className="text-center text-3xl lg:text-4xl font-bold mb-12">
        Featured <span className="text-blue-600">Brands</span>
      </h2>

      {/* Floating Brand Icons - Desktop */}
      <div className="hidden md:block relative h-64 mb-8">
        {brandIcons.map((brand, index) => (
          <div
            key={brand.id}
            className={`absolute ${positions[index]} animate-fade-in-up`}
            style={{
              animationDelay: `${brand.delay}ms`,
              animationFillMode: 'both'
            }}
          >
            <div 
              className={`
                group cursor-pointer transform hover:scale-125 transition-all duration-500
                ${brand.color === 'blue' ? 'hover:rotate-12' : 'hover:-rotate-12'}
                animate-float
              `}
              style={{
                animationDelay: `${brand.delay}ms`
              }}
            >
              <div 
                className={`
                  w-16 h-16 lg:w-20 lg:h-20 rounded-2xl shadow-lg hover:shadow-2xl 
                  flex items-center justify-center transition-all duration-500
                  bg-white
                  relative overflow-hidden
                `}
              >
                <Image 
                  src={brand.image} 
                  alt="Brand" 
                  className="w-full h-full object-cover"
                />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-4 gap-4 max-w-sm mx-auto">
        {brandIcons.map((brand, index) => (
          <div
            key={brand.id}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${brand.delay}ms`,
              animationFillMode: 'both'
            }}
          >
            <div 
              className={`
                group cursor-pointer transform hover:scale-110 transition-all duration-500
                animate-float
              `}
              style={{
                animationDelay: `${brand.delay}ms`
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-500 bg-white relative overflow-hidden"
              >
                <Image 
                  src={brand.image} 
                  alt="Brand" 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}