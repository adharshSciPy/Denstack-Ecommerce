'use client';
import { useState } from 'react';
import Navigation from './Navigation';
import { FileText, Scale, AlertCircle, Package, CreditCard, RefreshCw } from 'lucide-react';

interface TermsAndConditionsPageProps {
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

export default function TermsAndConditionsPage({
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
}: TermsAndConditionsPageProps) {
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
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-16 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our website and services.
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
              <FileText className="w-8 h-8 text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Welcome to DentalKart. These Terms and Conditions govern your use of our website and the purchase of products from us. By accessing our website and placing an order, you accept and agree to be bound by these Terms and Conditions.
            </p>
          </section>

          {/* Agreement to Terms */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Agreement to Terms</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-xl">
              <p className="text-gray-600 leading-relaxed mb-4">
                By using DentalKart, you represent that you are at least 18 years of age and have the legal capacity to enter into these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.
              </p>
            </div>
          </section>

          {/* Products and Orders */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Products and Orders</h2>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-pink-100 rounded-xl p-6 hover:border-pink-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Product Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We make every effort to display our products and their colors as accurately as possible. However, we cannot guarantee that your computer monitor's display of colors will be accurate. All products are subject to availability, and we reserve the right to discontinue any product at any time.
                </p>
              </div>

              <div className="border-2 border-purple-100 rounded-xl p-6 hover:border-purple-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="text-gray-600 leading-relaxed">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product or pricing information, or problems identified by our fraud detection systems.
                </p>
              </div>

              <div className="border-2 border-indigo-100 rounded-xl p-6 hover:border-indigo-400 transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Order Confirmation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you place an order, you will receive an email confirmation. This email is only an acknowledgment that we have received your order and does not constitute acceptance of your order. We will send you a separate email once your order has been dispatched.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Pricing and Payment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All prices are listed in USD and are subject to change without notice. We strive to ensure all pricing information is accurate, but errors may occur. If we discover an error in the price of products you have ordered, we will inform you and give you the option to reconfirm your order at the correct price or cancel it.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Payment Methods</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We accept major credit cards, debit cards, PayPal, Google Pay, and other payment methods as displayed on our website. Payment must be received in full before your order is processed. All payment information is encrypted and securely processed.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping and Delivery</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Shipping Times</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Delivery times vary depending on your location and the shipping method selected. Estimated delivery times are provided at checkout and are not guaranteed. We are not responsible for delays caused by customs, weather, or carrier issues.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Shipping Charges</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shipping charges are calculated based on the weight, size, and destination of your order. These charges will be displayed before you complete your purchase. Free shipping may be available for orders meeting certain criteria.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Returns and Refunds</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-gray-700">You may return unused products in their original packaging within 30 days of delivery for a full refund.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-gray-700">To initiate a return, contact our customer service team with your order number and reason for return.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-gray-700">Certain products, such as customized items or opened sterile products, are not eligible for return.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-gray-700">Refunds will be processed to the original payment method within 7-10 business days after we receive the returned item.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-xl border-2 border-red-200">
              <p className="text-gray-600 leading-relaxed mb-4">
                To the fullest extent permitted by law, DentalKart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Your use or inability to use our services</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from our services</li>
                <li>Any bugs, viruses, or other harmful components</li>
                <li>Any errors or omissions in content or for any loss or damage incurred</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl">
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> support@dentalkart.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Dental Street, Healthcare City, HC 12345</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
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