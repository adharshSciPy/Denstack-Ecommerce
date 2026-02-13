'use client';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Package } from 'lucide-react';
import imgWomanDoctor from "../../assets/4090c47841ffbcbb1eeab65e6cfd315c5ad57280.png";
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import baseUrl from '../baseUrl';

interface BuyingGuideCardProps {
    title: string;
    subtitle: string;
    description: string;
    buttonText?: string;
    productCount: number;
    index: number;
    imageSrc?: string | StaticImageData;
    onClick: () => void;
}

function BuyingGuideCard({ title, subtitle, description, buttonText, productCount, index, imageSrc, onClick }: BuyingGuideCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [hasImageError, setHasImageError] = useState(false);
    const isRemote = typeof imageSrc === 'string' && imageSrc?.startsWith('http');

    return (
        <div
            className="w-full max-w-7xl mx-auto animate-fade-in-up cursor-pointer"
            style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Card Container */}
            <div
                className={`
          relative bg-linear-to-br from-blue-50 via-cyan-50 to-purple-50 
          rounded-2xl overflow-hidden shadow-lg 
          transition-all duration-500 ease-out
          ${isHovered ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'}
        `}
            >
                {/* Product Count Badge - Top Right */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10">
                    <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-white shadow-lg border-2 border-blue-500
            transition-all duration-300
            ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
          `}>
                        <Package className="w-5 h-5 text-blue-700" />
                        <span className="text-sm font-bold text-blue-700">
                            {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 p-6 lg:p-8">
                    {/* Left Content Section */}
                    <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-2 lg:order-1">
                        {/* Title */}
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-700 leading-tight">
                                {title}
                            </h2>
                            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-700 leading-tight">
                                {subtitle}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm lg:text-base text-gray-700 leading-relaxed max-w-md">
                            {description}
                        </p>

                        {/* Decorative dots */}
                        <div className="flex gap-2 py-2">
                            <div className={`w-2 h-2 rounded-full bg-blue-700 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} />
                            <div className={`w-2 h-2 rounded-full bg-blue-500 transition-transform duration-300 delay-75 ${isHovered ? 'scale-125' : ''}`} />
                            <div className={`w-2 h-2 rounded-full bg-blue-300 transition-transform duration-300 delay-150 ${isHovered ? 'scale-125' : ''}`} />
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="relative order-1 lg:order-2">
                        {/* Decorative background circles */}
                        <div className="absolute top-4 right-4 w-32 h-32 bg-cyan-400 rounded-full opacity-30 blur-2xl animate-pulse" />
                        <div className="absolute bottom-4 left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-30 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

                        {/* Image container */}
                        <div
                            className={`
                relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl
                transition-transform duration-500
                ${isHovered ? 'scale-105 rotate-1' : 'scale-100 rotate-0'}
              `}
                        >
                            <Image
                                src={hasImageError ? imgWomanDoctor : (imageSrc ?? imgWomanDoctor)}
                                alt={`${title} ${subtitle}`}
                                fill
                                sizes="100vw"
                                className="object-contain"
                                onError={() => {
                                    console.warn('Guide image failed to load, falling back to local asset:', imageSrc);
                                    setHasImageError(true);
                                }}
                                unoptimized={isRemote}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Button Bar */}
            <div
                className={`
          mt-4 bg-blue-700 rounded-2xl px-6 lg:px-8 py-4 lg:py-5
          shadow-lg transition-all duration-500
          ${isHovered ? 'shadow-2xl -translate-y-1' : 'shadow-lg'}
        `}
            >
                <button className="w-full text-white text-sm lg:text-base font-semibold hover:text-blue-100 transition-colors duration-300 text-left">
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

interface BuyingGuidePageProps {
    cartCount: number;
    onCartCountChange: (count: number) => void;
    onBackToHome: () => void;
    onCardClick?: () => void;
    onCartClick?: () => void;
    onFavoritesClick?: () => void;
    onOrdersClick?: () => void;
    onAccountClick?: () => void;
    favoritesCount?: number;
}

export default function BuyingGuidePage({
    cartCount,
    onCartCountChange,
    onBackToHome,
    onCardClick,
    onCartClick,
    onFavoritesClick,
    onOrdersClick,
    onAccountClick,
    favoritesCount
}: BuyingGuidePageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const [guides, setGuides] = useState<{
        _id: string;
        title: string;
        subtitle: string;
        description: string;
        mainImage?: string;
        productCount: number;
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        const fetchGuides = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${baseUrl.INVENTORY}/api/v1/buyingGuide/getBuyingGuide`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (mounted) {
                    setGuides(json.data ?? []);
                }
            } catch (err: any) {
                console.error('Failed to fetch buying guides', err);
                if (mounted) setError(err.message ?? 'Failed to load guides');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchGuides();

        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navigation */}
            <Navigation
                currentPage="buying-guide"
                cartCount={cartCount}
                favoritesCount={favoritesCount ?? 0}
            />

            {/* Page Title */}
            <div className="bg-white border-b border-gray-200 py-8 animate-fade-in">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl lg:text-4xl text-black font-bold text-center">
                        Buying <span className="text-blue-700">Guide</span>
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="space-y-8 lg:space-y-12">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
                            <p className="mt-4 text-gray-600">Loading buying guides...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 py-12">{error}</div>
                    ) : guides.length === 0 ? (
                        <div className="text-center text-gray-600 py-12">No buying guides found.</div>
                    ) : (
                        guides.map((guide, index) => (
                            <BuyingGuideCard
                                key={guide._id}
                                title={guide.title}
                                subtitle={guide.subtitle}
                                description={guide.description}
                                buttonText={'View Guide'}
                                productCount={guide.productCount}
                                index={index}
                                imageSrc={guide.mainImage}
                                onClick={() => {
                                    onCardClick?.();
                                    router.push(`/detailbuyingguide/${guide._id}`);
                                }}
                            />
                        ))
                    )}
                </div>
            </main>

        </div>
    );
}