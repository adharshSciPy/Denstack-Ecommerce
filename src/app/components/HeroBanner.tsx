import imgHero from "../../assets/c8ec12adbc9f613a5f0a89229b073feec22a9769.png";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-64 sm:h-96 lg:h-[500px] relative cursor-pointer">
        <Image 
          src={imgHero} 
          alt="Dentist examining patient" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-500" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="text-white max-w-xl transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
              Premium Dental Equipment
            </h1>
            <p className="text-lg sm:text-xl mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
              Quality instruments for professional care
            </p>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 delay-300 shadow-lg hover:shadow-xl">
              Shop Now
            </button>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </section>
  );
}