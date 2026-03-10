'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock, Check, ChevronRight, Home, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

declare global {
  interface Window { Razorpay: any; }
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId: string | null;
}

interface CheckoutPageProps {
  cartCount?: number;
  onCartCountChange?: (count: number) => void;
  onBackToCart?: () => void;
  onProceedToPayment?: (amount: number, orderId: string) => void;
  onCartClick?: () => void;
  orderPayload?: any;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const API = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const clinicToken = typeof window !== 'undefined' ? localStorage.getItem('clinicToken') : null;
  if (clinicToken) headers['Authorization'] = `Bearer ${clinicToken}`;
  return headers;
};

export default function CheckoutPage({ orderPayload }: CheckoutPageProps) {
  const [currentStep, setCurrentStep]     = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isProcessing, setIsProcessing]   = useState(false);
  const [cartItems, setCartItems]         = useState<CartItem[]>([]);

  const [billingInfo, setBillingInfo] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });

  const [shippingInfo, setShippingInfo] = useState({
    sameAsBilling: true,
    fullName: '', phone: '', address: '', city: '', state: '', pincode: '',
  });

  const router = useRouter();

  // ── Load real cart items from localStorage ──────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('checkoutItems');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        toast.error('Failed to load cart items');
        router.push('/cart');
      }
    } else {
      toast.error('No items in cart');
      router.push('/cart');
    }
    loadRazorpayScript();
  }, []);

  const subtotal  = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping  = subtotal > 5000 ? 0 : 150;
  const tax       = Math.round(subtotal * 0.18);
  const codCharge = paymentMethod === 'COD' ? 50 : 0;
  const total     = subtotal + shipping + tax + codCharge;

  const getShippingAddress = () => {
    const src = shippingInfo.sameAsBilling ? billingInfo : shippingInfo;
    return {
      fullName:     shippingInfo.sameAsBilling ? billingInfo.fullName : shippingInfo.fullName,
      phone:        shippingInfo.sameAsBilling ? billingInfo.phone    : shippingInfo.phone,
      addressLine1: shippingInfo.sameAsBilling ? billingInfo.address  : shippingInfo.address,
      city:    src.city,
      state:   src.state,
      pincode: src.pincode,
      country: 'India',
    };
  };

  // ─── MAIN HANDLER ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const headers = getAuthHeaders();

    try {
      toast.loading('Creating your order...', { id: 'order' });

      const orderBody = orderPayload || {
        items: cartItems.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          ...(i.variantId ? { variantId: i.variantId } : {}),
        })),
        shippingAddress: getShippingAddress(),
        paymentMethod,
        orderNotes: '',
      };

      const orderRes  = await fetch(`${API}/api/v1/ecom-order/create`, {
        method: 'POST', headers, credentials: 'include',
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error(orderData.message || 'Failed to create order', { id: 'order' });
        setIsProcessing(false);
        return;
      }

      const dbOrderId = orderData.data._id;

      if (paymentMethod === 'COD') {
        localStorage.removeItem('checkoutItems');
        toast.success('Order placed! Pay on delivery.', { id: 'order' });
        router.push(`/orderconfirmation?orderId=${dbOrderId}`);
        return;
      }

      toast.loading('Initialising payment...', { id: 'order' });

      const rzpRes  = await fetch(`${API}/api/v1/payment/create-razorpay-order`, {
        method: 'POST', headers, credentials: 'include',
        body: JSON.stringify({ orderId: dbOrderId }),
      });
      const rzpData = await rzpRes.json();

      if (!rzpData.success) {
        toast.error('Could not initialise payment. Try again.', { id: 'order' });
        setIsProcessing(false);
        return;
      }

      toast.dismiss('order');

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway.');
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key:         rzpData.razorpay.key_id,
        amount:      rzpData.razorpay.amount,
        currency:    rzpData.razorpay.currency,
        name:        'Your Store Name',
        description: 'Order Payment',
        order_id:    rzpData.razorpay.order_id,
        prefill: {
          name:    billingInfo.fullName,
          email:   billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: { color: '#2563eb' },
        handler: async (response: any) => {
          toast.loading('Verifying payment...', { id: 'verify' });
          const verifyRes  = await fetch(`${API}/api/v1/payment/verify`, {
            method: 'POST', headers, credentials: 'include',
            body: JSON.stringify({
              orderId:             dbOrderId,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            localStorage.removeItem('checkoutItems');
            toast.success('Payment successful! Order confirmed.', { id: 'verify' });
            router.push(`/orderconfirmation?orderId=${dbOrderId}`);
          } else {
            toast.error('Payment verification failed. Contact support.', { id: 'verify' });
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => { toast.warning('Payment cancelled.'); setIsProcessing(false); },
        },
      });

      rzp.on('payment.failed', (r: any) => {
        toast.error(`Payment failed: ${r.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();

    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Something went wrong. Please try again.', { id: 'order' });
      setIsProcessing(false);
    }
  };

  const inp = 'w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none';

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-gray-500" />
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button onClick={() => router.push('/cart')} className="text-gray-500 hover:text-blue-600">Cart</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 max-w-3xl mx-auto flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {currentStep > step ? <Check className="w-6 h-6" /> : step}
                </div>
                <span className={`mt-2 text-sm font-semibold ${currentStep >= step ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step === 1 ? 'Billing' : step === 2 ? 'Shipping' : 'Payment'}
                </span>
              </div>
              {step < 3 && <div className={`h-1 flex-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><User className="w-4 h-4 inline mr-1" />Full Name *</label>
                    <input type="text" value={billingInfo.fullName} onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })} className={inp} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-1" />Email *</label>
                    <input type="email" value={billingInfo.email} onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })} className={inp} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-1" />Phone *</label>
                    <input type="tel" value={billingInfo.phone} onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })} className={inp} placeholder="+91 98765 43210" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" />Address *</label>
                    <textarea value={billingInfo.address} onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })} className={inp} rows={3} placeholder="Street address, building name, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <input type="text" value={billingInfo.city} onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })} className={inp} placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <input type="text" value={billingInfo.state} onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })} className={inp} placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                    <input type="text" value={billingInfo.pincode} onChange={(e) => setBillingInfo({ ...billingInfo, pincode: e.target.value })} className={inp} placeholder="123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <select value={billingInfo.country} onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })} className={inp}>
                      <option>India</option><option>USA</option><option>UK</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => {
                  if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || !billingInfo.address || !billingInfo.city || !billingInfo.state || !billingInfo.pincode) {
                    toast.error('Please fill in all required fields'); return;
                  }
                  setCurrentStep(2);
                }} className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Continue to Shipping
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input type="checkbox" checked={shippingInfo.sameAsBilling}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, sameAsBilling: e.target.checked })} className="w-5 h-5" />
                  <span className="font-semibold text-gray-700">Same as billing address</span>
                </label>
                {!shippingInfo.sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} className={inp} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input type="tel" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} className={inp} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <textarea value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} className={inp} rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input type="text" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <input type="text" value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} className={inp} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                      <input type="text" value={shippingInfo.pincode} onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })} className={inp} />
                    </div>
                  </div>
                )}
                <div className="mt-6 flex gap-4">
                  <button onClick={() => setCurrentStep(1)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all">Back</button>
                  <button onClick={() => setCurrentStep(3)} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">Continue to Payment</button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-5 rounded-xl border-2 transition-all ${paymentMethod === 'RAZORPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-bold text-gray-900">Pay Online</p>
                    <p className="text-xs text-gray-500 mt-1">Card, UPI, Net Banking, Wallet</p>
                    {paymentMethod === 'RAZORPAY' && <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />}
                  </button>
                  <button onClick={() => setPaymentMethod('COD')}
                    className={`p-5 rounded-xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                    <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">₹50 extra charges</p>
                    {paymentMethod === 'COD' && <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />}
                  </button>
                </div>

                {paymentMethod === 'RAZORPAY' && (
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mb-6">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Secure Payment via Razorpay</p>
                        <p className="text-sm text-gray-600">Razorpay's secure checkout will open. Pay using Card, UPI, Net Banking, or Wallet.</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {['Visa', 'Mastercard', 'UPI', 'Paytm', 'Google Pay', 'PhonePe'].map((m) => (
                            <span key={m} className="px-2 py-1 bg-white rounded-md text-xs font-semibold text-gray-700 border border-blue-200">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="bg-yellow-50 rounded-xl p-5 border-2 border-yellow-300 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay ₹{total.toLocaleString()} (includes ₹50 COD charges) when your order arrives.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setCurrentStep(2)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all">Back</button>
                  <button onClick={handlePlaceOrder} disabled={isProcessing}
                    className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'}`}>
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      paymentMethod === 'RAZORPAY' ? `Pay ₹${total.toLocaleString()}` : `Place Order - ₹${total.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="font-semibold text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (18%)</span><span className="font-semibold">₹{tax.toLocaleString()}</span></div>
                {paymentMethod === 'COD' && (
                  <div className="flex justify-between text-sm"><span className="text-gray-600">COD Charges</span><span className="font-semibold">₹50</span></div>
                )}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
              </div>
              <div className="mt-6 space-y-2">
                {['Secure Checkout', 'Free Shipping over ₹5000', 'Easy Returns & Refunds'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" /><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}