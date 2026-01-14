import BrandCard from './BrandCard';
import img3M from "../../assets/353638cadace1b5a5483420868b839885321d290.png";
import imgDplus from "../../assets/704b6190ea5f3e15788de7df03417a5db6f19c7d.png";
import { StaticImageData } from "next/image";

type Brand = {
  id: number;
  name: string;
  image: StaticImageData;
};

interface BrandGridProps {
  selectedLetter: string;
}

export default function BrandGrid({ selectedLetter }: BrandGridProps) {
  // Mock brand data organized by letter - using exact Figma images
  const brandsByLetter: Record<string, Brand[]> = {
    A: [
      { id: 1, name: '3M ESPE', image: img3M },
      { id: 2, name: 'Angelus', image: img3M },
      { id: 3, name: 'Acteon', image: img3M },
      { id: 4, name: 'Align Technology', image: img3M },
      { id: 5, name: 'Aseptico', image: img3M },
      { id: 6, name: 'A-dec', image: img3M },
      { id: 7, name: 'Astra Tech', image: img3M },
      { id: 8, name: 'Anthogyr', image: img3M },
    ],
    B: [
      { id: 9, name: 'Bien-Air', image: imgDplus },
      { id: 10, name: 'Biomet 3i', image: imgDplus },
      { id: 11, name: 'Brasseler', image: imgDplus },
      { id: 12, name: 'BioHorizons', image: imgDplus },
      { id: 13, name: 'Belmont', image: imgDplus },
      { id: 14, name: 'Bisco', image: imgDplus },
      { id: 15, name: 'Bovie Medical', image: imgDplus },
    ],
    C: [
      { id: 16, name: 'Carestream Dental', image: img3M },
      { id: 17, name: 'Cavitron', image: img3M },
      { id: 18, name: 'Coltene', image: img3M },
      { id: 19, name: 'Colgate', image: img3M },
      { id: 20, name: 'Curaden', image: img3M },
      { id: 21, name: 'Clinpro', image: img3M },
      { id: 22, name: 'Curaprox', image: img3M },
      { id: 23, name: 'Ceramco', image: img3M },
    ],
    D: [
      { id: 24, name: 'Dentsply Sirona', image: img3M },
      { id: 25, name: 'Dentsply', image: img3M },
      { id: 26, name: 'Durr Dental', image: img3M },
      { id: 27, name: 'DCI Equipment', image: img3M },
      { id: 28, name: 'DenMat', image: img3M },
      { id: 29, name: 'Dentatus', image: img3M },
      { id: 30, name: 'Dental Health', image: img3M },
      { id: 31, name: 'Dux Dental', image: img3M },
    ],
    E: [
      { id: 32, name: 'EMS Dental', image: imgDplus },
      { id: 33, name: 'Euronda', image: imgDplus },
      { id: 34, name: 'Envista', image: imgDplus },
      { id: 35, name: 'Evident', image: imgDplus },
      { id: 36, name: 'Endo Direct', image: imgDplus },
    ],
    F: [
      { id: 37, name: 'FKG Dentaire', image: img3M },
      { id: 38, name: 'Fotona', image: img3M },
      { id: 39, name: 'Forest Dental', image: img3M },
      { id: 40, name: 'Fuji', image: img3M },
    ],
    G: [
      { id: 41, name: 'GC America', image: imgDplus },
      { id: 42, name: 'Glidewell', image: imgDplus },
      { id: 43, name: 'Gendex', image: imgDplus },
      { id: 44, name: 'GSK', image: imgDplus },
      { id: 45, name: 'Garrison Dental', image: imgDplus },
    ],
    H: [
      { id: 46, name: 'Henry Schein', image: img3M },
      { id: 47, name: 'Hu-Friedy', image: img3M },
      { id: 48, name: 'Heraeus Kulzer', image: img3M },
      { id: 49, name: 'Hager & Werken', image: img3M },
    ],
    I: [
      { id: 50, name: 'Ivoclar Vivadent', image: imgDplus },
      { id: 51, name: 'iTero', image: imgDplus },
      { id: 52, name: 'Implant Direct', image: imgDplus },
      { id: 53, name: 'Intra-Lock', image: imgDplus },
    ],
    J: [
      { id: 54, name: 'J. Morita', image: img3M },
      { id: 55, name: 'Jiffy', image: img3M },
    ],
    K: [
      { id: 56, name: 'KaVo Kerr', image: imgDplus },
      { id: 57, name: 'Kodak Dental', image: imgDplus },
      { id: 58, name: 'Kulzer', image: imgDplus },
    ],
    L: [
      { id: 59, name: 'Lares Research', image: img3M },
      { id: 60, name: 'Lumident', image: img3M },
      { id: 61, name: 'LM Dental', image: img3M },
    ],
    M: [
      { id: 62, name: 'Midmark', image: imgDplus },
      { id: 63, name: 'Melag', image: imgDplus },
      { id: 64, name: 'Mectron', image: imgDplus },
      { id: 65, name: 'Medesy', image: imgDplus },
      { id: 66, name: 'Milestone Scientific', image: imgDplus },
    ],
    N: [
      { id: 67, name: 'NSK', image: img3M },
      { id: 68, name: 'Nobel Biocare', image: img3M },
      { id: 69, name: 'NuSmile', image: img3M },
    ],
    O: [
      { id: 70, name: 'Orascoptic', image: imgDplus },
      { id: 71, name: 'Oral-B', image: imgDplus },
      { id: 72, name: 'Osseodent', image: imgDplus },
    ],
    P: [
      { id: 73, name: 'Patterson Dental', image: img3M },
      { id: 74, name: 'Planmeca', image: img3M },
      { id: 75, name: 'Premier Dental', image: img3M },
      { id: 76, name: 'Procter & Gamble', image: img3M },
      { id: 77, name: 'Parkell', image: img3M },
    ],
    S: [
      { id: 78, name: 'Straumann', image: imgDplus },
      { id: 79, name: 'Septodont', image: imgDplus },
      { id: 80, name: 'Shofu', image: imgDplus },
      { id: 81, name: 'SDI', image: imgDplus },
      { id: 82, name: 'SybronEndo', image: imgDplus },
    ],
    T: [
      { id: 83, name: 'Tuttnauer', image: img3M },
      { id: 84, name: 'TePe', image: img3M },
      { id: 85, name: 'Tokuyama Dental', image: img3M },
    ],
    U: [
      { id: 86, name: 'Ultradent', image: imgDplus },
      { id: 87, name: 'Unident', image: imgDplus },
    ],
    V: [
      { id: 88, name: 'Voco', image: img3M },
      { id: 89, name: 'Vista Dental', image: img3M },
      { id: 90, name: 'VDW', image: img3M },
    ],
    W: [
      { id: 91, name: 'W&H Dentalwerk', image: imgDplus },
      { id: 92, name: 'Waldent', image: imgDplus },
      { id: 93, name: 'Woodpecker', image: imgDplus },
    ],
    Z: [
      { id: 94, name: 'Zimmer Biomet', image: img3M },
      { id: 95, name: 'Zirkonzahn', image: img3M },
    ],
  };

  // Get brands for selected letter
  const getBrandsToDisplay = (): [string, Brand[]][] => {
    if (!selectedLetter) {
      // Show all brands when no letter is selected
      return Object.entries(brandsByLetter) as [string, Brand[]][];
    }
    const brands = brandsByLetter[selectedLetter];
    return brands ? [[selectedLetter, brands]] : [];
  };

  const brandsToDisplay = getBrandsToDisplay();

  return (
    <div className="py-8 space-y-12">
      {brandsToDisplay.map(([letter, brands]) => (
        <div key={letter} className="animate-fade-in-up">
          {/* Letter Header */}
          <div className="mb-6 flex items-start">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-700">
              {letter}
            </h3>
          </div>

          {/* Brand Grid - responsive columns matching Figma proportions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
            {(brands as any[]).map((brand, index) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                index={index}
              />
            ))}
          </div>
        </div>
      ))}

      {brandsToDisplay.length === 0 && selectedLetter && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400 font-bold">{selectedLetter}</span>
          </div>
          <p className="text-gray-500 text-lg">No brands found for letter "{selectedLetter}"</p>
        </div>
      )}
    </div>
  );
}