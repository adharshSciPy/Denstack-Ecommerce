'use client';
import { useState } from 'react';
import { Package, Truck, MapPin, CheckCircle, Clock, Phone, Mail, Home, ChevronRight, Search } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface OrderTrackingPageProps {
  orderId?: string;
  cartCount: number;
  onBackToHome: () => void;
  onCartClick: () => void;
}

const mockOrders = {
  'ORD123': {
    orderId: 'ORD123',
    status: 'delivered',
    orderDate: '15 Dec 2024',
    deliveryDate: '20 Dec 2024',
    currentStatus: 'Delivered',
    items: [
      { name: 'Dental Impression Tray Kit', quantity: 2 },
      { name: 'LED Dental Curing Light', quantity: 1 }
    ],
    timeline: [
      { status: 'Order Placed', date: '15 Dec 2024, 10:30 AM', completed: true, icon: CheckCircle },
      { status: 'Order Confirmed', date: '15 Dec 2024, 11:00 AM', completed: true, icon: CheckCircle },
      { status: 'Shipped', date: '16 Dec 2024, 09:15 AM', completed: true, icon: Package },
      { status: 'Out for Delivery', date: '20 Dec 2024, 08:00 AM', completed: true, icon: Truck },
      { status: 'Delivered', date: '20 Dec 2024, 02:45 PM', completed: true, icon: MapPin }
    ],
    shippingAddress: {
      name: 'Dr. Rajesh Kumar',
      address: '123, MG Road, Dental Clinic',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210'
    },
    carrier: 'Blue Dart Express',
    trackingNumber: 'BD123456789IN',
    estimatedDelivery: '18-20 Dec 2024'
  }
};

export default function OrderTrackingPage({
  orderId: initialOrderId,
  cartCount,
  onBackToHome,
  onCartClick
}: OrderTrackingPageProps) {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState(initialOrderId ? mockOrders['ORD123'] : null);

  const handleTrackOrder = () => {
    if (!searchOrderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    // Simulate order lookup
    if (mockOrders[searchOrderId as keyof typeof mockOrders]) {
      setCurrentOrder(mockOrders['ORD123']); // Using mock data
      toast.success('Order found!');
    } else {
      // For demo purposes, still show mock order
      setCurrentOrder(mockOrders['ORD123']);
      toast.success('Order found!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={onBackToHome}
        favoritesCount={0}
      /> */}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={onBackToHome} className="text-gray-500 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-semibold">Track Order</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-3">Track Your Order</h1>
          <p className="mb-6 opacity-90">Enter your order ID to track your shipment</p>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
                placeholder="Enter Order ID (e.g., ORD123)"
              />
            </div>
            <button
              onClick={handleTrackOrder}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              Track
            </button>
          </div>
        </div>

        {currentOrder ? (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{currentOrder.orderId}</h2>
                  <p className="text-gray-600">Placed on {currentOrder.orderDate}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`
                    inline-block px-6 py-3 rounded-full font-bold text-lg
                    ${currentOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      currentOrder.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'}
                  `}>
                    {currentOrder.currentStatus}
                  </span>
                </div>
              </div>

              {/* Tracking Info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Carrier</p>
                  <p className="font-bold text-gray-900">{currentOrder.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-bold text-gray-900">{currentOrder.trackingNumber}</p>
                </div>
                {currentOrder.status !== 'delivered' && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                    <p className="font-bold text-blue-600">{currentOrder.estimatedDelivery}</p>
                  </div>
                )}
                {currentOrder.status === 'delivered' && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Delivered On</p>
                    <p className="font-bold text-green-600">{currentOrder.deliveryDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h3>
              
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />

                {/* Timeline Items */}
                <div className="space-y-8">
                  {currentOrder.timeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="relative flex items-start gap-4">
                        <div className={`
                          relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg
                          ${item.completed 
                            ? 'bg-gradient-to-br from-green-400 to-green-600' 
                            : 'bg-gray-300'}
                        `}>
                          <Icon className={`w-6 h-6 ${item.completed ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        
                        <div className="flex-1 pt-1">
                          <p className={`font-bold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {item.status}
                          </p>
                          <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                            {item.date}
                          </p>
                          {index === 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Your order has been received
                            </p>
                          )}
                          {item.status === 'Delivered' && item.completed && (
                            <div className="mt-2 bg-green-50 rounded-lg p-3 border border-green-200">
                              <p className="text-sm text-green-800 font-semibold">
                                ✓ Package delivered successfully
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                Signed by: {currentOrder.shippingAddress.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900">{currentOrder.shippingAddress.name}</p>
                    <p className="text-gray-700 mt-1">{currentOrder.shippingAddress.address}</p>
                    <p className="text-gray-700">
                      {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}
                    </p>
                    <p className="text-gray-700">PIN: {currentOrder.shippingAddress.pincode}</p>
                    <p className="text-gray-700 mt-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {currentOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="mb-4 opacity-90">Our customer support team is here to assist you</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  <Phone className="w-5 h-5" />
                  Call Support
                </button>
                <button className="flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  <Mail className="w-5 h-5" />
                  Email Us
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Order Selected</h3>
            <p className="text-gray-600">Enter your order ID above to track your shipment</p>
          </div>
        )}
      </div>

      {/* <Footer /> */}

      {/* Floating Back Button */}
      <button
        onClick={onBackToHome}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      >
        ← Back to Home
      </button>
    </div>
  );
}
