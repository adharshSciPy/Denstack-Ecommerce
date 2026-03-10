'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, MapPin, Calendar, Download, Share2, Home, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  totalCost: number;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  currentStatus: string;
  placedAt: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export default function OrderConfirmationPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const orderId      = searchParams.get('orderId');

  const [order, setOrder]                   = useState<Order | null>(null);
  const [loading, setLoading]               = useState(true);
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    setTimeout(() => setConfettiActive(false), 3000);
  }, []);

  useEffect(() => {
    if (!orderId) {
      toast.error('No order ID found');
      router.push('/');
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res  = await fetch(`${API}/api/v1/ecom-order/status/${orderId}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        const items        = data.data.items || [];
        const subtotal     = items.reduce((sum: number, i: any) => sum + (i.totalCost || 0), 0);
        const tax          = parseFloat((subtotal * 0.18).toFixed(2));
        const shippingCharge = subtotal > 500 ? 0 : 50;
        const totalAmount  = subtotal + tax + shippingCharge;

        setOrder({
          ...data.data,
          subtotal,
          tax,
          shippingCharge,
          totalAmount,
        });
      } else {
        toast.error('Could not load order details');
      }
    } catch {
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-700 mb-4">Order not found</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const timelineSteps = [
    {
      icon: CheckCircle,
      label: 'Order Placed',
      sub: formatDate(order.placedAt),
      desc: 'Your order has been placed successfully',
      done: true,
      colorClass: 'bg-green-100',
      iconClass: 'text-green-600',
    },
    {
      icon: CheckCircle,
      label: 'Order Confirmed',
      sub: formatDate(order.placedAt),
      desc: 'Your order has been confirmed and is being processed',
      done: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.currentStatus),
      colorClass: 'bg-green-100',
      iconClass: 'text-green-600',
    },
    {
      icon: Package,
      label: 'Processing',
      sub: 'Expected within 1-2 business days',
      desc: "We're preparing your items for shipment",
      done: ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.currentStatus),
      colorClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
    },
    {
      icon: Truck,
      label: 'Out for Delivery',
      sub: 'Pending',
      desc: '',
      done: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.currentStatus),
      colorClass: 'bg-orange-100',
      iconClass: 'text-orange-500',
    },
    {
      icon: MapPin,
      label: 'Delivered',
      sub: order.estimatedDelivery ? `Expected: ${formatDate(order.estimatedDelivery)}` : '',
      desc: '',
      done: order.currentStatus === 'DELIVERED',
      colorClass: 'bg-green-100',
      iconClass: 'text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-right" richColors />

      {/* Confetti */}
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
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Order Reference</p>
            <p className="text-xl font-bold text-blue-600 mb-1">{order.orderId}</p>
            <p className="text-xs text-gray-400 mb-4 break-all">{order._id}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => toast.success('Invoice download coming soon!')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(order._id); toast.success('Order ID copied!'); }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Copy ID
              </button>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Timeline</h2>
          <div className="space-y-6">
            {timelineSteps.map(({ icon: Icon, label, sub, desc, done, colorClass, iconClass }) => (
              <div key={label} className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${done ? colorClass : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${done ? iconClass : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
                  {sub  && <p className={`text-sm ${done ? 'text-gray-600' : 'text-gray-400'}`}>{sub}</p>}
                  {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

          <div className="space-y-3 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                <div className="flex items-center gap-3 flex-1">
                  {item.image && (
                    <img
                      src={`${API}${item.image}`}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">₹{item.totalCost?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">
                {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18%)</span>
              <span className="font-semibold">₹{order.tax?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-gray-200 pt-2 mt-2">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold text-blue-600">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Payment Status</span>
            <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
            <p className="text-gray-700 mt-1">{order.shippingAddress.phone}</p>
            <p className="text-gray-700 mt-1">{order.shippingAddress.addressLine1}</p>
            <p className="text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-gray-700">PIN: {order.shippingAddress.pincode}</p>
            <p className="text-gray-700">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/ordertracking')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
          >
            <Truck className="w-5 h-5" />
            Track Order
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-gray-900 mb-2">What's Next?</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Track your order status in real-time</li>
                {order.estimatedDelivery && (
                  <li>• Expected delivery: {formatDate(order.estimatedDelivery)}</li>
                )}
                <li>• Contact support if you have any questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti linear forwards; }
      `}</style>
    </div>
  );
}