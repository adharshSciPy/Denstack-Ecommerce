import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { Play, CheckCircle, Phone, Mail, MapPin, User, Building, ChevronDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface ClinicSetupPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  favoritesCount?: number;
}

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function BenefitCard({ title, description, icon }: BenefitCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <div className="text-blue-600 group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ClinicSetupPage({ 
  cartCount, 
  onCartCountChange, 
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  favoritesCount
}: ClinicSetupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    city: '',
    address: '',
    specialization: ''
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const benefits = [
    {
      title: 'Installation Support',
      description: 'Receive Free Electricals Installation Assistance',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Certificate Support',
      description: 'Support in All Medical/ Dental Consent',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Clinic Setup Consultation',
      description: '100% Free Clinic Setup Consultation',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Upfront Payment Benefit',
      description: 'Exclusive Healthcare Set-Up Payment Options',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Post-Installation Care',
      description: 'Free Post-Installation Guarantee',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Flexible Customization',
      description: 'Easy Customization As Per Your Needs, Preferences And Budgets',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const faqs = [
    {
      question: 'Can I Wait A Basic Equipment Setup To Run A Dental Clinic?',
      answer: 'Yes, you can start with basic equipment. We offer flexible packages that include essential items like a dental chair, basic instruments, sterilization equipment, and necessary tools to begin your practice. Our consultants will help you prioritize based on your budget and expand as your practice grows.'
    },
    {
      question: 'Do You Provide Clinic Setup Customization, The Right Equipment?',
      answer: 'Absolutely! We provide complete customization based on your specialty, space, budget, and patient demographic. Our expert team will assess your requirements and design a setup that maximizes efficiency and patient comfort while staying within your budget.'
    },
    {
      question: 'Benefits of Our Clinic Setup Services Vs Doing It Myself?',
      answer: 'Our clinic setup services save you time, money, and hassle. We offer bulk pricing, expert consultation, installation support, warranty coordination, and post-setup service. You get access to our network of trusted suppliers, avoid common mistakes, and benefit from our years of experience in dental clinic setups.'
    },
    {
      question: 'How Can You Guarantee Best Prices When Purchasing A New Clinic Setup?',
      answer: 'We leverage our strong relationships with manufacturers and bulk purchasing power to negotiate the best prices. We pass these savings directly to you. Additionally, we offer price matching and transparent pricing with no hidden costs, ensuring you get the best value for your investment.'
    },
    {
      question: 'What Support Does DentalKart Offer After Purchasing A New Clinic Setup?',
      answer: 'We provide comprehensive post-purchase support including installation assistance, staff training, equipment maintenance guidance, warranty management, and technical support. Our team remains available to help you with any issues or questions even after your clinic is up and running.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('🎉 Call scheduled successfully!', {
      description: 'Our team will contact you shortly.',
      duration: 3000,
    });
    setFormData({
      name: '',
      contact: '',
      email: '',
      city: '',
      address: '',
      specialization: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <Header 
        cartCount={cartCount}
        onCartClick={onCartClick}
        onLogoClick={onBackToHome}
        onFavoritesClick={onFavoritesClick}
        onOrdersClick={onOrdersClick}
        onAccountClick={onAccountClick}
        favoritesCount={favoritesCount}
      />

      {/* Navigation */}
      <Navigation 
        currentPage="clinic-setup"
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        // onFavoritesClick={onFavoritesClick}
        onOrdersClick={onOrdersClick}
        onAccountClick={onAccountClick}
        favoritesCount={favoritesCount}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-100 to-blue-50 py-8 md:py-12 mt-6 animate-fade-in">
        <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-blue-600 font-semibold mb-2">New Dental</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Clinic Setup
                <span className="block text-blue-600 italic" style={{ fontFamily: 'cursive' }}>Guide</span>
              </h1>
              <p className="text-gray-700 text-lg mb-6">
                Step-by-step guidance to launch your dream dental clinic
              </p>
              <button 
                onClick={() => document.getElementById('schedule-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1764004450351-37fb72cb8e8c?w=1200"
                alt="Dental Clinic Setup"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            What Added Benefits Do You Get <span className="text-blue-600">With DentalKart's New Clinic Setup?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <BenefitCard {...benefit} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all hover:shadow-xl hover:scale-105 active:scale-95">
              Contact Now
            </button>
          </div>
        </div>
      </div>

      {/* Setup Description */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Setting Up A Dental Clinic? <span className="text-blue-600">We've Got You Covered!</span>
          </h2>
          <p className="text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            Starting a New Dental Clinic Can Be Stressful! Setting Up Soundly Won't Typical Of Guesswork, Making, Hunt, Where 
            Electrical Compute, Space Use? It Includes – Creating Time And A Lot Of Money! – Putting You To Choose The Right Suggestion 
            Arrangement/Layout Execution, Budgeting And Implementing. That's Why We Introduced Clinic Setup Service Which Help To Go 
            Smoothly.
          </p>
        </div>
      </div>

      {/* Schedule Form */}
      <div id="schedule-form" className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Schedule Your <span className="text-blue-600">Free Clinic Setup Call</span>
          </h2>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clinic Address
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter clinic address"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all resize-none"
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g., General Dentistry, Orthodontics, etc."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-12 py-4 bg-orange-500 text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Schedule Call
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Our team will contact you within 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Video Section */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            See how we set up your <span className="text-blue-600">perfect dental clinic</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1764004450351-37fb72cb8e8c?w=1200"
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-bold text-xl mb-1">New Dental Clinic Setup Guide</h3>
                <p className="text-white/80 text-sm">Complete walkthrough of our clinic setup process</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-6 max-w-2xl mx-auto">
            Watch our comprehensive guide on setting up a modern dental clinic. Learn about equipment selection, 
            layout optimization, and best practices from industry experts.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-[1760px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="text-blue-600">FAQ</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}