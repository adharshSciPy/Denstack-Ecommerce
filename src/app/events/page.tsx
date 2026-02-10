'use client';
import { useState, useEffect } from 'react';
import baseUrl from '../baseUrl';
import Navigation from '../components/Navigation';
import { Calendar, MapPin, Heart, ChevronDown, Clock, Users, TrendingUp, Filter, Search } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EventsPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onEventClick: (eventId: number) => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  onEventsClick?: () => void;
  favoritesCount?: number;
}

export default function EventsPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onEventClick,
  onBrandClick,
  onBuyingGuideClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  onEventsClick,
  favoritesCount
}: EventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const categories = [
    'All Events',
    'Workshops',
    'Conferences',
    'Training',
    'Webinars',
    'Networking',
    'Product Launch'
  ];

  // Events loaded from API
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl.INVENTORY}/api/v1/event/allEvents`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const json = await res.json();
        if (!json.success) throw new Error('API returned unsuccessful response');
        const mapped = json.data.map((ev: any, idx: number) => {
          const total = ev.totalSeats ?? 0;
          const registered = ev.registeredCount ?? 0;
          const normalizedType = (ev.eventType || '').toLowerCase();
          return {
            id: ev._id ?? String(idx),
            title: ev.title || 'Untitled Event',
            date: ev.date ? new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            time: `${ev.startTime || ''}${ev.endTime ? ' - ' + ev.endTime : ''}`,
            location: [ev.venue, ev.city, ev.state, ev.country].filter(Boolean).join(', '),
            attendees: registered,
            maxAttendees: total,
            eventType: normalizedType,
            category: normalizedType || 'Other',
            imageUrl: ev.bannerImage ? (ev.bannerImage.startsWith('/') ? `${baseUrl.INVENTORY}${ev.bannerImage}` : ev.bannerImage) : 'https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?w=600',
            isFeatured: !!ev.isFeatured,
            spotsLeft: Math.max(0, total - registered),
          };
        });
        if (mounted) setEvents(mapped);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Error loading events');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => { mounted = false; };
  }, []);

  const filteredEvents = events.filter(event => {
    const selected = selectedCategory.toLowerCase();

    const matchesCategory =
      selected === 'all events' ||
      event.eventType?.includes(selected.slice(0, -1));
    // removes last 's' → workshops → workshop

    const matchesSearch =
      event.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(localSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });


  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const newSet = new Set(prev);
      let message = 'Added to favorites!';
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
        message = 'Removed from favorites';
      } else {
        newSet.add(eventId);
      }
      toast.success(message);
      return newSet;
    });
  };

  const handleRegister = (eventTitle: string, isFull: boolean) => {
    if (isFull) {
      toast.info('Added to waitlist', {
        description: 'We\'ll notify you if a spot opens up!',
        duration: 3000,
      });
    } else {
      toast.success('🎉 Registration successful!', {
        description: `You're registered for: ${eventTitle}`,
        duration: 3000,
      });
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Navigation */}
      <Navigation
        currentPage="events"
        cartCount={cartCount}
        favoritesCount={favoritesCount ?? 0}

      />

      {/* Hero Banner */}
      <div className="w-full px-4 md:px-6 lg:px-8 mt-6 animate-fade-in">
        <div className="max-w-[1760px] mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[3.5/1]">
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"
              alt="Dental Events & Conferences"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-transparent" />

            {/* Hero Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                Dental Events & Conferences
              </h1>
              <p className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-2xl drop-shadow-lg">
                Join industry-leading workshops, seminars, and networking events
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name or location..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 text-black border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-bold text-blue-600">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All Events' && ` in ${selectedCategory}`}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
        {error ? (
          <div className="text-center py-20 text-red-600">Failed to load events: {error}</div>
        ) : loading ? (
          <div className="text-center py-20">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
                onClick={() => router.push(`/eventsdetail/${event.id}`)}
              >
                <EventCard
                  {...event}
                  isLiked={likedEvents.has(event.id)}
                  onToggleLike={() => toggleLike(event.id)}
                  onRegister={() => handleRegister(event.title, event.spotsLeft === 0)}
                  onCardClick={() => router.push(`/eventsdetail/${event.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && (
          <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: '800ms' }}>
            <button className="px-12 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all hover:shadow-2xl hover:scale-105 active:scale-95">
              Load More Events
            </button>
          </div>
        )}
      </main>

    </div>
  );
}

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  eventType?: string;
  imageUrl: string;
  isLiked: boolean;
  isFeatured: boolean;
  spotsLeft: number;
  onToggleLike: () => void;
  onRegister: () => void;
  onCardClick: () => void;
}

function EventCard({
  id,
  title,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  category,
  eventType,
  imageUrl,
  isLiked,
  isFeatured,
  spotsLeft,
  onToggleLike,
  onRegister,
  onCardClick
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  useEffect(() => { setImgSrc(imageUrl); }, [imageUrl]);
  const isAlmostFull = spotsLeft <= 10;
  const isFull = spotsLeft === 0;

  const getCategoryBadge = (evtType?: string, cat?: string) => {
    const key = ((evtType || '') + ' ' + (cat || '')).toLowerCase();
    if ((evtType || '').toLowerCase().includes('workshop')) return { label: evtType || 'Workshop', className: 'bg-green-600 text-white' };
    if ((evtType || '').toLowerCase().includes('conference')) return { label: evtType || 'Conference', className: 'bg-purple-600 text-white' };
    if ((evtType || '').toLowerCase().includes('training')) return { label: evtType || 'Training', className: 'bg-indigo-600 text-white' };
    if ((evtType || '').toLowerCase().includes('webinar')) return { label: evtType || 'Webinar', className: 'bg-teal-600 text-white' };
    if ((evtType || '').toLowerCase().includes('network')) return { label: evtType || 'Networking', className: 'bg-amber-400 text-black' };
    if ((evtType || '').toLowerCase().includes('product')) return { label: evtType || 'Product Launch', className: 'bg-pink-600 text-white' };
    if ((cat || '').toLowerCase().includes('featured')) return { label: 'Featured', className: 'bg-yellow-500 text-black' };
    return { label: evtType || cat || 'Other', className: 'bg-blue-600 text-white' };
  };

  const categoryBadge = getCategoryBadge(eventType, category);

  const router = useRouter();

  return (
    <div
      onClick={onCardClick}
      className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Type Badge */}
      {eventType && (
        <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${categoryBadge.className}`}>
          {categoryBadge.label}
        </div>
      )}



      {/* Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike();
        }}
        className={`
          absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white
          flex items-center justify-center transition-all duration-300 shadow-lg
          ${isLiked
            ? 'text-red-500 scale-110'
            : 'text-gray-400 hover:text-red-500 hover:scale-110'
          }
        `}
      >
        <Heart
          className={`w-5 h-5 transition-all ${isLiked ? 'fill-red-500' : 'fill-none'
            }`}
        />
      </button>

      {/* Event Image */}
      <div className="relative bg-gray-100 aspect-[4/3] overflow-hidden">
        <Image
          src={imgSrc}
          alt={title}
          fill
          unoptimized
          onError={() => setImgSrc('https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?w=600')}
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


      </div>

      {/* Event Info */}
      <div className="p-5">
        <h3 className="text-gray-900 font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        {/* Event Details Grid */}
        <div className="space-y-2.5 mb-4">
          {/* Date & Time */}
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900">{date}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {time}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <span className="font-medium text-gray-900">{attendees}/{maxAttendees} registered</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${spotsLeft === 0 ? 'bg-red-500' :
                isAlmostFull ? 'bg-orange-500' :
                  'bg-blue-600'
                }`}
              style={{ width: `${maxAttendees ? Math.min(100, (attendees / maxAttendees) * 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={() => router.push(`/eventsdetail/${id}`)}
          disabled={isFull}
          className={`
            w-full py-3.5 px-4 rounded-xl font-bold text-base
            transition-all duration-300
            ${isFull
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isHovered
                ? 'bg-blue-700 text-white shadow-xl translate-y-[-2px]'
                : 'bg-blue-600 text-white shadow-lg'
            }
            hover:shadow-2xl active:scale-95
          `}
        >
          {isFull ? 'Event Full - Waitlist' : 'Register Now'}
        </button>
      </div>
    </div>
  );
}