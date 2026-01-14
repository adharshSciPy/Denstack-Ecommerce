import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import { Package, Truck, CheckCircle, XCircle, Clock, Download, Eye, Home, ChevronRight, Filter } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface OrderHistoryPageProps {
  cartCount: number;
  onBackToHome: () => void;
  onCartClick: () => void;
  onTrackOrder: (orderId: string) => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
}

const mockOrders = [
  {
    id: 'ORD20241220001',
    date: '20 Dec 2024',
    status: 'delivered',
    statusText: 'Delivered',
    total: 8492,
    items: [
      { name: 'Dental Impression Tray Kit', quantity: 2, price: 1299 },
      { name: 'LED Dental Curing Light', quantity: 1, price: 4599 }
    ],
    deliveryDate: '25 Dec 2024',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200'
  },
  {
    id: 'ORD20241215002',
    date: '15 Dec 2024',
    status: 'shipped',
    statusText: 'Out for Delivery',
    total: 12999,
    items: [
      { name: 'Ultrasonic Scaler', quantity: 1, price: 8999 },
      { name: 'Dental Handpiece', quantity: 1, price: 3500 }
    ],
    estimatedDelivery: '22 Dec 2024',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200'
  },
  {
    id: 'ORD20241210003',
    date: '10 Dec 2024',
    status: 'processing',
    statusText: 'Processing',
    total: 5499,
    items: [
      { name: 'Dental Mirror Set', quantity: 3, price: 1299 },
      { name: 'Composite Kit', quantity: 1, price: 2200 }
    ],
    estimatedDelivery: '24 Dec 2024',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200'
  },
  {
    id: 'ORD20241201004',
    date: '01 Dec 2024',
    status: 'delivered',
    statusText: 'Delivered',
    total: 15999,
    items: [
      { name: 'Dental Chair', quantity: 1, price: 15999 }
    ],
    deliveryDate: '07 Dec 2024',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200'
  },
  {
    id: 'ORD20241120005',
    date: '20 Nov 2024',
    status: 'cancelled',
    statusText: 'Cancelled',
    total: 3299,
    items: [
      { name: 'Dental Gloves Box', quantity: 5, price: 659 }
    ],
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200'
  }
];

export default function OrderHistoryPage({
  cartCount,
  onBackToHome,
  onCartClick,
  onTrackOrder,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick
}: OrderHistoryPageProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'shipped' | 'processing' | 'cancelled'>('all');

  const filteredOrders = mockOrders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast.success(`Invoice downloaded for ${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    toast.success('Items added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={onBackToHome}
        favoritesCount={0}
      />

      <Navigation 
        currentPage="orders"
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={onBackToHome} className="text-gray-500 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-semibold">My Orders</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage all your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Orders', count: mockOrders.length },
            { value: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
            { value: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
            { value: 'processing', label: 'Processing', count: mockOrders.filter(o => o.status === 'processing').length },
            { value: 'cancelled', label: 'Cancelled', count: mockOrders.filter(o => o.status === 'cancelled').length }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value as any)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${filterStatus === filter.value 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Filter className="w-4 h-4" />
              {filter.label}
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${filterStatus === filter.value ? 'bg-white text-blue-600' : 'bg-white text-gray-600'}
              `}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-bold text-gray-900">ORDER #{order.id}</p>
                        <span className={`
                          flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2
                          ${getStatusColor(order.status)}
                        `}>
                          {getStatusIcon(order.status)}
                          {order.statusText}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                      {order.status === 'delivered' && order.deliveryDate && (
                        <p className="text-sm text-green-600 font-semibold mt-1">
                          Delivered on {order.deliveryDate}
                        </p>
                      )}
                      {(order.status === 'shipped' || order.status === 'processing') && order.estimatedDelivery && (
                        <p className="text-sm text-blue-600 font-semibold mt-1">
                          Est. delivery: {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {(order.status === 'shipped' || order.status === 'processing') && (
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105"
                      >
                        <Truck className="w-4 h-4" />
                        Track Order
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <>
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all hover:scale-105"
                        >
                          <Package className="w-4 h-4" />
                          Reorder
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => toast.info(`Viewing details for ${order.id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => toast.error('Order cancellation requested')}
                        className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">No orders match your selected filter</p>
              <button
                onClick={() => setFilterStatus('all')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <CheckCircle className="w-8 h-8 mb-2" />
            <p className="text-3xl font-bold mb-1">{mockOrders.filter(o => o.status === 'delivered').length}</p>
            <p className="text-sm opacity-90">Delivered</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <Truck className="w-8 h-8 mb-2" />
            <p className="text-3xl font-bold mb-1">{mockOrders.filter(o => o.status === 'shipped').length}</p>
            <p className="text-sm opacity-90">In Transit</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-3xl font-bold mb-1">{mockOrders.filter(o => o.status === 'processing').length}</p>
            <p className="text-sm opacity-90">Processing</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <Package className="w-8 h-8 mb-2" />
            <p className="text-3xl font-bold mb-1">{mockOrders.length}</p>
            <p className="text-sm opacity-90">Total Orders</p>
          </div>
        </div>
      </div>

      <Footer />

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
