'use client';
import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import {
  Package, CheckCircle, Download, Eye, Home, ChevronRight, Loader2, X,
  MapPin, CreditCard, RotateCcw, Truck, Clock, XCircle, RefreshCw,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import baseUrl from '../baseUrl';

interface OrderItem {
  product: { _id: string; name: string; image?: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId?: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryDate?: string;
}

interface TimelineStep {
  step: string;
  label: string;
  done: boolean;
  reason?: string;
}

interface OrderStatus {
  orderId: string;
  _id: string;
  currentStatus: string;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  placedAt: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  timeline: TimelineStep[];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

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

const ALL_STATUSES = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

const STATUS_COLOR: Record<string, string> = {
  PENDING:          'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED:        'bg-blue-100 text-blue-700 border-blue-200',
  PROCESSING:       'bg-purple-100 text-purple-700 border-purple-200',
  SHIPPED:          'bg-indigo-100 text-indigo-700 border-indigo-200',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700 border-orange-200',
  DELIVERED:        'bg-green-100 text-green-700 border-green-200',
  CANCELLED:        'bg-red-100 text-red-700 border-red-200',
  RETURNED:         'bg-gray-100 text-gray-700 border-gray-200',
};

const STATUS_ICON: Record<string, any> = {
  PENDING:          Clock,
  CONFIRMED:        CheckCircle,
  PROCESSING:       Package,
  SHIPPED:          Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED:        CheckCircle,
  CANCELLED:        XCircle,
  RETURNED:         RefreshCw,
};

const getClinicAuth = (): { clinicId: string; token: string } | null => {
  try {
    const token = localStorage.getItem('clinicToken');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const clinicId = payload.clinicId || payload.hospitalId || payload._id;
    if (!clinicId) return null;
    return { clinicId, token };
  } catch { return null; }
};

const getUserId = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/auth/check`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.id || null;
  } catch { return null; }
};

const getAuthHeaders = (): Record<string, string> => {
  const clinicAuth = getClinicAuth();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (clinicAuth) headers.Authorization = `Bearer ${clinicAuth.token}`;
  return headers;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrderHistoryPage({
  onBackToHome,
}: OrderHistoryPageProps) {
  const router = useRouter();

  const [allOrders, setAllOrders]       = useState<Order[]>([]);
  const [filtered, setFiltered]         = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [pagination, setPagination]     = useState<Pagination>({ currentPage: 1, totalPages: 1, totalOrders: 0 });
  const [currentPage, setCurrentPage]   = useState(1);
  const [loading, setLoading]           = useState(true);
  const [statusModal, setStatusModal]   = useState(false);
  const [statusData, setStatusData]     = useState<OrderStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const clinicAuth = getClinicAuth();
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      let url = '';
      let headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (clinicAuth) {
        // ✅ All orders for clinic (not /deliver/)
        url = `${baseUrl.INVENTORY}/api/v1/ecom-order/clinic/${clinicAuth.clinicId}?${params}`;
        headers.Authorization = `Bearer ${clinicAuth.token}`;
      } else {
        const userId = await getUserId();
        if (!userId) {
          toast.error('Please log in to view your orders.');
          router.push('/login');
          return;
        }
        // ✅ All orders for user (not /deliver/)
        url = `${baseUrl.INVENTORY}/api/v1/ecom-order/user/${userId}?${params}`;
      }

      const res = await fetch(url, { method: 'GET', credentials: 'include', headers });

      if (res.status === 401) {
        localStorage.removeItem('clinicToken');
        toast.error('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch orders');

      const data = await res.json();
      const fetched: Order[] = data.data ?? [];
      setAllOrders(fetched);
      setFiltered(fetched);
      setPagination({
        currentPage: data.currentPage ?? page,
        totalPages:  data.totalPages  ?? 1,
        totalOrders: data.totalOrders ?? fetched.length,
      });
    } catch (error: any) {
      toast.error(error.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Filter client-side whenever activeFilter or allOrders changes
  useEffect(() => {
    if (activeFilter === 'ALL') {
      setFiltered(allOrders);
    } else {
      setFiltered(allOrders.filter(o => o.orderStatus === activeFilter));
    }
  }, [activeFilter, allOrders]);

  const handleViewDetails = async (orderId: string) => {
    setStatusModal(true);
    setStatusLoading(true);
    setStatusData(null);
    try {
      const res = await fetch(
        `${baseUrl.INVENTORY}/api/v1/ecom-order/status/${orderId}`,
        { method: 'GET', credentials: 'include', headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch order status');
      const data = await res.json();
      setStatusData(data.data);
    } catch (error: any) {
      toast.error(error.message || 'Could not load order details');
      setStatusModal(false);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => { fetchOrders(1); }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page);
  };

  const handleDownloadInvoice = (orderId: string) => toast.success(`Invoice for ${orderId} — coming soon!`);
  const handleReorder = (_orderId: string) => toast.success('Items added to cart!');

  // Count per status for badge
  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? allOrders.length : allOrders.filter(o => o.orderStatus === s).length;
    return acc;
  }, {} as Record<string, number>);

  // Summary stats
  const summaryCards = [
    { label: 'Total Orders',  value: allOrders.length,                                                                                            color: 'from-blue-500 to-blue-600' },
    { label: 'Delivered',     value: allOrders.filter(o => o.orderStatus === 'DELIVERED').length,                                                  color: 'from-green-500 to-green-600' },
    { label: 'In Progress',   value: allOrders.filter(o => ['CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY'].includes(o.orderStatus)).length, color: 'from-purple-500 to-purple-600' },
    { label: 'Cancelled',     value: allOrders.filter(o => o.orderStatus === 'CANCELLED').length,                                                  color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navigation currentPage="orderhistory" />

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

        {/* Page Title */}
        <div className="mb-6 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage all your orders</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {ALL_STATUSES.map((status) => {
              const count    = statusCounts[status] || 0;
              const isActive = activeFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
                    ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {status === 'ALL' ? 'All Orders' : status.replace(/_/g, ' ')}
                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                      ${isActive ? 'bg-white text-blue-600' : 'bg-gray-300 text-gray-700'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {activeFilter === 'ALL'
                ? "You haven't placed any orders yet"
                : `No ${activeFilter.replace(/_/g, ' ')} orders`}
            </p>
            {activeFilter !== 'ALL' && (
              <button onClick={() => setActiveFilter('ALL')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const StatusIcon  = STATUS_ICON[order.orderStatus] || Package;
              const statusColor = STATUS_COLOR[order.orderStatus] || 'bg-gray-100 text-gray-700 border-gray-200';
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">

                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900">
                            {order.orderId || `#${order._id.slice(-8).toUpperCase()}`}
                          </p>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${statusColor}`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                        {order.deliveryDate && (
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            Delivered on {formatDate(order.deliveryDate)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-600">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.product?.image ? (
                              <img
                                src={`${baseUrl.INVENTORY}${item.product.image}`}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{item.product?.name ?? 'Product'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-900">₹{item.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all hover:scale-105"
                      >
                        <Download className="w-4 h-4" /> Invoice
                      </button>
                      {order.orderStatus === 'DELIVERED' && (
                        <button
                          onClick={() => handleReorder(order._id)}
                          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all hover:scale-105"
                        >
                          <RotateCcw className="w-4 h-4" /> Reorder
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 rounded-xl bg-white shadow font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all
                  ${currentPage === page ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 shadow hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === pagination.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 rounded-xl bg-white shadow font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && allOrders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map(({ label, value, color }) => (
              <div key={label} className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm opacity-90 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onBackToHome}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      >
        ← Back to Home
      </button>

      {/* Order Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                {statusData && <p className="text-sm text-gray-500">#{statusData.orderId}</p>}
              </div>
              <button onClick={() => setStatusModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {statusLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            ) : statusData ? (
              <div className="p-6 space-y-6">

                {/* Current Status + Tracking */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${STATUS_COLOR[statusData.currentStatus] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {statusData.currentStatus.replace(/_/g, ' ')}
                  </span>
                  {statusData.trackingNumber && (
                    <span className="text-sm text-gray-600">
                      Tracking: <span className="font-semibold text-gray-900">{statusData.trackingNumber}</span>
                    </span>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Order Timeline</h3>
                  {statusData.timeline.map((step, index) => (
                    <div key={step.step} className="flex gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2
                          ${step.done
                            ? step.step === 'CANCELLED' ? 'bg-red-500 border-red-500' : 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300'}`}>
                          {step.done
                            ? <CheckCircle className="w-4 h-4 text-white" />
                            : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                        </div>
                        {index < statusData.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`font-semibold text-sm ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                        {step.reason && <p className="text-xs text-red-500 mt-0.5">{step.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Order Placed</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDateTime(statusData.placedAt)}</p>
                  </div>
                  {statusData.estimatedDelivery && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                      <p className="text-sm font-semibold text-blue-700">{formatDate(statusData.estimatedDelivery)}</p>
                    </div>
                  )}
                  {statusData.deliveredAt && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Delivered On</p>
                      <p className="text-sm font-semibold text-green-700">{formatDateTime(statusData.deliveredAt)}</p>
                    </div>
                  )}
                  {statusData.cancelledAt && (
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Cancelled On</p>
                      <p className="text-sm font-semibold text-red-700">{formatDateTime(statusData.cancelledAt)}</p>
                    </div>
                  )}
                </div>

                {/* Cancellation Reason */}
                {statusData.cancellationReason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-xs text-red-500 font-bold mb-1">Cancellation Reason</p>
                    <p className="text-sm text-red-700">{statusData.cancellationReason}</p>
                  </div>
                )}

                {/* Payment */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {statusData.paymentMethod} —{' '}
                      <span className={statusData.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                        {statusData.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {statusData.shippingAddress && (
                  <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                      <p className="text-sm font-semibold text-gray-900">{statusData.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{statusData.shippingAddress.phone}</p>
                      <p className="text-sm text-gray-600">
                        {statusData.shippingAddress.addressLine1}
                        {statusData.shippingAddress.addressLine2 && `, ${statusData.shippingAddress.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {statusData.shippingAddress.city}, {statusData.shippingAddress.state} — {statusData.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Items</h3>
                  <div className="space-y-3">
                    {statusData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.product?.image ? (
                            <img
                              src={`${baseUrl.INVENTORY}${item.product.image}`}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.product?.name ?? 'Product'}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{item.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}