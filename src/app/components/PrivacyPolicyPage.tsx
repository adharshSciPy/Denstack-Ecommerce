'use client';
import { useState } from 'react';
import Navigation from './Navigation';
import { Shield, Lock, Eye, FileText, UserCheck, Mail } from 'lucide-react';

interface PrivacyPolicyPageProps {
  cartCount: number;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onAccountClick?: () => void;
  favoritesCount?: number;
  onPrivacyPolicyClick?: () => void;
  onTermsClick?: () => void;
}

export default function PrivacyPolicyPage({
  cartCount,
  onBackToHome,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  onFavoritesClick,
  onOrdersClick,
  onAccountClick,
  favoritesCount,
  onPrivacyPolicyClick,
  onTermsClick
}: PrivacyPolicyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={onCartClick}
        onLogoClick={onBackToHome}
        onFavoritesClick={onFavoritesClick}
        onOrdersClick={onOrdersClick}
        onAccountClick={onAccountClick}
        favoritesCount={favoritesCount}
      /> */}

      {/* Navigation */}
      <Navigation
        // onBrandClick={onBrandClick}
        // onBuyingGuideClick={onBuyingGuideClick}
        // onEventsClick={onEventsClick}
        // onMembershipClick={onMembershipClick}
        // onFreebiesClick={onFreebiesClick}
        // onBestSellerClick={onBestSellerClick}
        // onClinicSetupClick={onClinicSetupClick}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 py-16 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <p className="text-white/80 text-sm mt-4">Last Updated: January 3, 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-cyan-600" />
              <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Welcome to DentalKart. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may collect personal identification information including your name, email address, phone number, shipping address, billing address, and payment information when you place an order or create an account with us.
                </p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Technical Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  We collect information about your device, browser type, IP address, time zone setting, operating system, and other technology on the devices you use to access our website.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  We collect information about how you use our website, products, and services, including pages viewed, links clicked, and time spent on our site.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-cyan-100 rounded-xl p-6 hover:border-cyan-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600 text-sm">
                  To process and deliver your orders, manage payments, and communicate with you about your purchases.
                </p>
              </div>
              <div className="border-2 border-teal-100 rounded-xl p-6 hover:border-teal-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Customer Service</h3>
                <p className="text-gray-600 text-sm">
                  To provide customer support, respond to your inquiries, and resolve any issues you may have.
                </p>
              </div>
              <div className="border-2 border-green-100 rounded-xl p-6 hover:border-green-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Marketing Communications</h3>
                <p className="text-gray-600 text-sm">
                  To send you promotional materials, newsletters, and updates about our products and services (with your consent).
                </p>
              </div>
              <div className="border-2 border-cyan-100 rounded-xl p-6 hover:border-cyan-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Website Improvement</h3>
                <p className="text-gray-600 text-sm">
                  To analyze usage patterns and improve our website, products, and services.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl">
              <p className="text-gray-600 leading-relaxed mb-4">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
              <p className="text-gray-600 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Access:</strong> Request access to your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Correction:</strong> Request correction of inaccurate or incomplete data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Deletion:</strong> Request deletion of your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Object:</strong> Object to processing of your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Portability:</strong> Request transfer of your personal data</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-cyan-600" />
              <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-8 rounded-xl">
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@dentalkart.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Dental Street, Healthcare City, HC 12345</p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      {/* <Footer 
        onPrivacyPolicyClick={onPrivacyPolicyClick}
        onTermsClick={onTermsClick}
      /> */}
    </div>
  );
}