import imgCategory1 from "../../assets/e56ac69c8d9d7eb0a6a920fd214cfc912ba109f3.png";
import imgCategory2 from "../../assets/45ab667970e1b7e246b11d4a8fb08627de60860d.png";
import imgCategory3 from "../../assets/997c74cd85fa52858987d15bb7d3045fee09107b.png";
import imgCategory4 from "../../assets/29a2256808b4dedcc25a53ea48a19eeabf35a295.png";
import imgCategory5 from "../../assets/2c30766eaaa11ed3c933efda5bfee1f8ed9822bd.png";
import imgCategory6 from "../../assets/cc416a3ca5f8ab30cb41fddf394798ec716f3631.png";
import imgCategory7 from "../../assets/10b059783c81f44b13da759c506a7ddc95cc3579.png";
import imgCategory8 from "../../assets/f35fde0f384edf3be33dadd7864d05cde70cc9d1.png";
import imgCategory9 from "../../assets/b1e934a41a8b9242a1594d4b6eb100132a91d0e0.png";
import imgCategory10 from "../../assets/58089ab3363685f385328d34b6f12dcd2c83b4c9.png";
import Image from "next/image";

interface TopCategoriesProps {
  onCategoryClick?: () => void;
}

export default function TopCategories({ onCategoryClick }: TopCategoriesProps = {}) {
  const categories = [
    { id: 1, name: 'Implant Prosthetics', image: imgCategory1 },
    { id: 2, name: 'Airotor', image: imgCategory2 },
    { id: 3, name: 'Composite', image: imgCategory3 },
    { id: 4, name: 'Intraoral Camera', image: imgCategory4 },
    { id: 5, name: 'Endo Motor', image: imgCategory5 },
    { id: 6, name: 'Rotary Files', image: imgCategory6 },
    { id: 7, name: 'Cements', image: imgCategory7 },
    { id: 8, name: 'Impression Material', image: imgCategory8 },
    { id: 9, name: 'Brackets', image: imgCategory9 },
    { id: 10, name: 'Sutures & Needles', image: imgCategory10 },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 font-semibold">Top Categories</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="group cursor-pointer animate-fade-in-up"
            onClick={onCategoryClick}
            style={{
              animationDelay: `${index * 75}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 mb-3 hover:-translate-y-2">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
                />
              </div>
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            <p className="text-center text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors duration-300 font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}