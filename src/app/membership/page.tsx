'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Check, CreditCard, ShoppingBag, Award } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import imgDentistBanner from "../../assets/c8ec12adbc9f613a5f0a89229b073feec22a9769.png";
import Image from 'next/image';

interface MembershipPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
}

export default function MembershipPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick
}: MembershipPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixMonth' | 'annual'>('sixMonth');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const plans = {
    monthly: { price: '₹1,999', period: 'month', total: 1999, savings: 0 },
    sixMonth: { price: '₹4,999', period: 'month', total: 4999, savings: 15, bestValue: true },
    annual: { price: '₹10,999', period: 'month', total: 10999, savings: 30 },
  };

  const benefits = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Our Analytics Dashboard provides a clear and intuitive interface.',
      articles: '10 articles'
    },
    {
      icon: '💎',
      title: 'Double Reward Value',
      description: 'Our Analytics Dashboard provides a clear and intuitive interface.',
      articles: '10 articles'
    },
    {
      icon: '⚡',
      title: 'Priority Shipping',
      description: 'Reward your customers and incentivize faster delivery.',
      articles: '10 articles'
    },
    {
      icon: '🎓',
      title: 'Education Pass Discount',
      description: 'Our Analytics Dashboard provides a clear and intuitive interface.',
      articles: '10 articles'
    }
  ];

  const howItWorks = [
    {
      icon: <Check className="w-8 h-8" />,
      title: 'Select Your desired plan and click on continue.',
      step: 1
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Fill the required details and checkout.',
      step: 2
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Place an order and begin your rewarding journey.',
      step: 3
    }
  ];

  const handlePlanSelect = (plan: 'monthly' | 'sixMonth' | 'annual') => {
    setSelectedPlan(plan);
    toast.success(`${plan === 'sixMonth' ? '6-Month' : plan === 'annual' ? 'Annual' : 'Monthly'} plan selected!`);
  };

  const handleSubscribe = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('🎉 Subscription successful!', {
      description: `You've subscribed to the ${selectedPlan === 'sixMonth' ? '6-Month' : selectedPlan === 'annual' ? 'Annual' : 'Monthly'} plan`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" richColors />

      {/* Navigation */}
      <Navigation
        currentPage="membership"
      />

      {/* Hero Banner */}
      <div className="w-full px-4 md:px-6 lg:px-8 mt-6 animate-fade-in">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[3/1]">
            <Image
              src={imgDentistBanner}
              alt="Dental Membership"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />

            {/* Hero Text */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-4 drop-shadow-2xl">
                Elevate Your Dental Journey with Denstack
              </h1>
              <p className="text-blue-100 text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg">
                Membership
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Benefits */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{benefit.description}</p>
              <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                {benefit.articles} →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Choose Your Plan */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-20">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">
          Choose your Plan
        </h2>

        {/* Plan Selection Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => handlePlanSelect('monthly')}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${selectedPlan === 'monthly'
                ? 'bg-blue-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
              }
            `}
          >
            ₹1,999/month
          </button>
          <button
            onClick={() => handlePlanSelect('sixMonth')}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative
              ${selectedPlan === 'sixMonth'
                ? 'bg-blue-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
              }
            `}
          >
            ₹4,999/6 month
            {plans.sixMonth.bestValue && (
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                Best Value
              </span>
            )}
          </button>
          <button
            onClick={() => handlePlanSelect('annual')}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${selectedPlan === 'annual'
                ? 'bg-blue-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
              }
            `}
          >
            ₹10,999/year
          </button>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedPlan === 'monthly' ? 'Monthly Plan' : selectedPlan === 'sixMonth' ? '6 Month Plan' : 'Annual Plan'}
            </h3>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {plans[selectedPlan].price}
              <span className="text-2xl text-gray-600">/{plans[selectedPlan].period}</span>
            </div>
            {plans[selectedPlan].savings > 0 && (
              <p className="text-green-600 font-semibold text-lg">
                Save {plans[selectedPlan].savings}% with this plan!
              </p>
            )}
          </div>

          {/* Form */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Complete Your Subscription</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Plan Duration:</span>
                <span className="text-gray-900 font-bold">
                  {selectedPlan === 'monthly' ? '1 Month' : selectedPlan === 'sixMonth' ? '6 Months' : '12 Months'}
                </span>
              </div>
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">₹{plans[selectedPlan].total.toLocaleString()}</span>
              </div>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Award className="w-6 h-6" />
              Continue with {selectedPlan === 'sixMonth' ? '6 months' : selectedPlan === 'annual' ? 'annual' : 'monthly'} plan
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-20 mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {howItWorks.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up text-center relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {step.step}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4 text-blue-600">
                {step.icon}
              </div>

              {/* Title */}
              <p className="text-gray-900 font-bold text-lg leading-relaxed">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">What is DenStack's Membership?</h3>
              <p className="text-gray-600 text-sm">Get exclusive benefits including free shipping, double reward value, priority shipping, and education pass discounts.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">Can I cancel my membership?</h3>
              <p className="text-gray-600 text-sm">Yes, you can cancel anytime. Your benefits will remain active until the end of your billing period.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">Are there benefits specific to the Dental sector?</h3>
              <p className="text-gray-600 text-sm">Yes! We offer specialized benefits for dental professionals including educational discounts and priority support.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">How does the billing work?</h3>
              <p className="text-gray-600 text-sm">You'll be charged at the start of each billing cycle. We accept all major payment methods.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">Can I upgrade my membership?</h3>
              <p className="text-gray-600 text-sm">Absolutely! You can upgrade to a longer plan anytime and get better savings.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <h3 className="font-bold text-gray-900 mb-2">Is there a trial period?</h3>
              <p className="text-gray-600 text-sm">We offer a 7-day money-back guarantee so you can try the membership risk-free.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}