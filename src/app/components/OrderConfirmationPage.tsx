import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { CheckCircle, Package, Truck, MapPin, Calendar, Download, Share2, Home } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface OrderConfirmationPageProps {
  orderId: string;
  cartCount: number;
  onBackToHome: () => void;
  onTrackOrder: (orderId: string) => void;
  onCartClick: () => void;
}

export default function OrderConfirmationPage({
  orderId,
  cartCount,
  onBackToHome,
  onTrackOrder,
  onCartClick
}: OrderConfirmationPageProps) {
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    setTimeout(() => setConfettiActive(false), 3000);
  }, []);

  const orderDetails = {
    orderId: orderId,
    orderDate: new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    items: [
      { name: 'Dental Impression Tray Kit', quantity: 2, price: 1299 },
      { name: 'LED Dental Curing Light', quantity: 1, price: 4599 },
    ],
    subtotal: 7197,
    shipping: 0,
    tax: 1295,
    total: 8492,
    shippingAddress: {
      name: 'Dr. Rajesh Kumar',
      address: '123, MG Road, Dental Clinic',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded successfully!');
  };

  const handleShareOrder = () => {
    toast.success('Order details copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-right" richColors />
      
      {/* Confetti Animation */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={onBackToHome}
        favoritesCount={0}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-3xl font-bold text-blue-600 mb-4 tracking-wide">{orderDetails.orderId}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button
                onClick={handleShareOrder}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Timeline</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">{orderDetails.orderDate}</p>
                <p className="text-sm text-gray-500 mt-1">Your order has been confirmed and is being processed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">Expected within 1-2 business days</p>
                <p className="text-sm text-gray-500 mt-1">We're preparing your items for shipment</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-400">Out for Delivery</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-400">Delivered</p>
                <p className="text-sm text-gray-400">Expected: {orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-6">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18%)</span>
              <span className="font-semibold">₹{orderDetails.tax}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-gray-200 pt-2 mt-2">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold text-blue-600">₹{orderDetails.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{orderDetails.shippingAddress.name}</p>
            <p className="text-gray-700 mt-2">{orderDetails.shippingAddress.address}</p>
            <p className="text-gray-700">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
            <p className="text-gray-700">PIN: {orderDetails.shippingAddress.pincode}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onTrackOrder(orderDetails.orderId)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
          >
            <Truck className="w-5 h-5" />
            Track Order
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Info Message */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-gray-900 mb-2">What's Next?</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Track your order status in real-time</li>
                <li>• Expected delivery: {orderDetails.estimatedDelivery}</li>
                <li>• Contact support if you have any questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
