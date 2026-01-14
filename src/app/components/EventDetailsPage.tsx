import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { 
  Heart, Calendar, MapPin, Users, Clock, ArrowLeft, Share2, 
  CheckCircle, Star, User, Mail, Phone, Building, Globe, Download
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface EventDetailsPageProps {
  eventId: number;
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToEvents: () => void;
  onRegisterClick: (eventId: number) => void;
  onCartClick?: () => void;
}

interface Speaker {
  name: string;
  title: string;
  company: string;
  bio: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

export default function EventDetailsPage({
  eventId,
  cartCount,
  onCartCountChange,
  onBackToEvents,
  onRegisterClick,
  onCartClick
}: EventDetailsPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'speakers'>('overview');

  // Event data (in real app, this would come from API/props)
  const eventData = {
    0: {
      title: "Advanced Dental Implant Techniques Workshop",
      date: "Jan 15, 2026",
      time: "9:00 AM - 5:00 PM",
      location: "Grand Medical Center, New York",
      fullAddress: "1234 Medical Plaza, Suite 500, New York, NY 10001",
      attendees: 85,
      maxAttendees: 100,
      category: "Workshops",
      imageUrl: "https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?w=800",
      isFeatured: true,
      spotsLeft: 15,
      description: "Join us for an intensive, hands-on workshop focusing on the latest advancements in dental implant techniques. This full-day event is designed for dental professionals seeking to enhance their skills in implantology with cutting-edge methods and technologies.",
      highlights: [
        "Hands-on practice with state-of-the-art equipment",
        "Live surgical demonstrations by expert surgeons",
        "Digital planning and guided surgery techniques",
        "Case studies and interactive Q&A sessions",
        "CE Credits: 8 hours continuing education",
        "Comprehensive workshop materials and resources"
      ],
      speakers: [
        {
          name: "Dr. Sarah Johnson",
          title: "Lead Implantologist",
          company: "NYU College of Dentistry",
          bio: "20+ years of experience in advanced implant procedures with over 500 published papers."
        },
        {
          name: "Dr. Michael Chen",
          title: "Oral Surgeon",
          company: "Advanced Dental Institute",
          bio: "Pioneering expert in digital implant planning and minimally invasive techniques."
        },
        {
          name: "Dr. Emily Rodriguez",
          title: "Prosthodontist",
          company: "Smile Restoration Center",
          bio: "Specialist in full-mouth rehabilitation and complex implant cases."
        }
      ],
      schedule: [
        {
          time: "8:30 AM - 9:00 AM",
          title: "Registration & Welcome Coffee",
          description: "Check-in, networking, and light refreshments"
        },
        {
          time: "9:00 AM - 10:30 AM",
          title: "Modern Implant Planning & Digital Workflow",
          description: "Introduction to advanced digital planning tools and 3D imaging",
          speaker: "Dr. Sarah Johnson"
        },
        {
          time: "10:30 AM - 10:45 AM",
          title: "Coffee Break",
          description: "Networking opportunity"
        },
        {
          time: "10:45 AM - 12:30 PM",
          title: "Guided Surgery Techniques - Live Demo",
          description: "Watch expert surgeons perform live procedures with guided technology",
          speaker: "Dr. Michael Chen"
        },
        {
          time: "12:30 PM - 1:30 PM",
          title: "Lunch Break",
          description: "Catered lunch provided"
        },
        {
          time: "1:30 PM - 3:00 PM",
          title: "Hands-On Practice Session",
          description: "Work with dental models and implant systems under expert guidance",
          speaker: "All Speakers"
        },
        {
          time: "3:00 PM - 3:15 PM",
          title: "Afternoon Break",
          description: "Refreshments"
        },
        {
          time: "3:15 PM - 4:30 PM",
          title: "Complex Case Studies & Problem Solving",
          description: "Interactive discussion of challenging cases and solutions",
          speaker: "Dr. Emily Rodriguez"
        },
        {
          time: "4:30 PM - 5:00 PM",
          title: "Q&A and Closing Remarks",
          description: "Open forum for questions and networking"
        }
      ],
      organizer: {
        name: "American Dental Association",
        phone: "+1 (555) 123-4567",
        email: "events@ada.org",
        website: "www.ada.org/events"
      }
    }
  };

  const event = eventData[eventId as keyof typeof eventData] || eventData[0];

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  const handleRegister = () => {
    onRegisterClick(eventId);
  };

  const isFull = event.spotsLeft === 0;
  const isAlmostFull = event.spotsLeft <= 10;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <Header 
        cartCount={cartCount}
        onCartClick={onCartClick}
      />

      {/* Navigation */}
      <Navigation 
        currentPage="events"
        onBrandClick={onBackToEvents}
        onBuyingGuideClick={onBackToEvents}
        onEventsClick={onBackToEvents}
      />

      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-6">
        <button
          onClick={onBackToEvents}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Category & Featured Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {event.category}
                </div>
                {event.isFeatured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    Featured
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={toggleLike}
                  className={`
                    w-10 h-10 rounded-full bg-white flex items-center justify-center
                    transition-all duration-300 shadow-lg
                    ${isLiked ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500 hover:scale-110'}
                  `}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : 'fill-none'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white text-gray-700 hover:text-blue-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-8 lg:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {event.title}
              </h1>

              {/* Key Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{event.date}</div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900">{event.location}</div>
                    <div className="text-gray-600 text-sm">{event.fullAddress}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900">
                      {event.attendees}/{event.maxAttendees} Registered
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.spotsLeft > 0 ? `${event.spotsLeft} spots remaining` : 'Event is full'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? 'bg-red-500' :
                      isAlmostFull ? 'bg-orange-500' : 
                      'bg-blue-600'
                    }`}
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  />
                </div>
              </div>

              {/* Status Alert */}
              {isAlmostFull && !isFull && (
                <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-2 text-orange-700 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Only {event.spotsLeft} spots left! Register soon.
                  </div>
                </div>
              )}

              {isFull && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Event is full - Join the waitlist
                  </div>
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg
                  transition-all duration-300 shadow-lg
                  ${isFull 
                    ? 'bg-gray-400 text-white hover:bg-gray-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl hover:scale-[1.02]'
                  }
                  active:scale-95
                `}
              >
                {isFull ? 'Join Waitlist' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`
                  flex-1 py-4 px-6 font-semibold text-lg transition-all
                  ${activeTab === 'overview' 
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`
                  flex-1 py-4 px-6 font-semibold text-lg transition-all
                  ${activeTab === 'schedule' 
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('speakers')}
                className={`
                  flex-1 py-4 px-6 font-semibold text-lg transition-all
                  ${activeTab === 'speakers' 
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                Speakers
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Organizer</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{event.organizer.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <a href={`tel:${event.organizer.phone}`} className="text-blue-600 hover:underline">
                        {event.organizer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a href={`mailto:${event.organizer.email}`} className="text-blue-600 hover:underline">
                        {event.organizer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <a href={`https://${event.organizer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {event.organizer.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Event Schedule</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Schedule
                  </button>
                </div>
                
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg text-center min-w-[180px]">
                            {item.time}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h4>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          {item.speaker && (
                            <div className="flex items-center gap-2 text-blue-600 font-semibold">
                              <User className="w-4 h-4" />
                              {item.speaker}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === 'speakers' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="font-bold text-gray-900 text-xl text-center mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-center mb-1">
                        {speaker.title}
                      </p>
                      <p className="text-gray-600 text-sm text-center mb-4">
                        {speaker.company}
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {speaker.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 shadow-2xl mt-12 animate-fade-in">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
              <p className="text-gray-600">{event.date} • {event.location}</p>
            </div>
            <button
              onClick={handleRegister}
              className={`
                px-8 py-3 rounded-xl font-bold text-lg w-full md:w-auto
                transition-all duration-300 shadow-lg
                ${isFull 
                  ? 'bg-gray-400 text-white hover:bg-gray-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                }
                active:scale-95
              `}
            >
              {isFull ? 'Join Waitlist' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}