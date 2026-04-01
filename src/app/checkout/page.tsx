'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock, Check, ChevronRight, Home, AlertCircle, Percent, Loader2 } from 'lucide-react';
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

// ── Validation helpers ────────────────────────────────────────────────────────
const VALIDATORS = {
  fullName: (v: string) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 3) return 'Name must be at least 3 characters';
    if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return 'Name can only contain letters, spaces, hyphens and apostrophes';
    return '';
  },
  email: (v: string) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address';
    return '';
  },
  phone: (v: string) => {
    const digits = v.replace(/\D/g, '');
    if (!v.trim()) return 'Phone number is required';
    if (digits.length !== 10) return 'Enter a valid 10-digit mobile number';
    if (!/^[6-9]/.test(digits)) return 'Mobile number must start with 6, 7, 8 or 9';
    return '';
  },
  address: (v: string) => {
    if (!v.trim()) return 'Address is required';
    if (v.trim().length < 10) return 'Please enter a complete address (min 10 characters)';
    return '';
  },
  city: (v: string) => {
    if (!v.trim()) return 'City is required';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Enter a valid city name';
    return '';
  },
  state: (v: string) => {
    if (!v.trim()) return 'State is required';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Enter a valid state name';
    return '';
  },
  pincode: (v: string) => {
    if (!v.trim()) return 'PIN code is required';
    if (!/^\d{6}$/.test(v.trim())) return 'Enter a valid 6-digit PIN code';
    return '';
  },
};

type BillingField = keyof typeof VALIDATORS;
type BillingErrors = Partial<Record<BillingField, string>>;

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

const getClinicAuth = (): { clinicId: string; token: string } | null => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('clinicToken') : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const clinicId = payload.clinicId || payload.hospitalId || payload._id;
    if (!clinicId) return null;
    return { clinicId, token };
  } catch { return null; }
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const clinicAuth = getClinicAuth();
  if (clinicAuth) headers['Authorization'] = `Bearer ${clinicAuth.token}`;
  return headers;
};

// ── Field component ───────────────────────────────────────────────────────────
function Field({
  label, icon: Icon, error, touched, children,
}: {
  label: string;
  icon?: any;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}) {
  const showError = touched && error;
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label}
      </label>
      {children}
      {showError && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CheckoutPage({ orderPayload }: CheckoutPageProps) {
  const [currentStep, setCurrentStep]       = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod]   = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isProcessing, setIsProcessing]     = useState(false);
  const [cartItems, setCartItems]           = useState<CartItem[]>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode]         = useState('');

  const [shipping, setShipping]               = useState<number>(0);
  const [shippingLoading, setShippingLoading] = useState(true);

  // ── Billing form state ──────────────────────────────────────────────────────
  const [billingInfo, setBillingInfo] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });

  // Tracks which fields the user has interacted with
  const [billingTouched, setBillingTouched] = useState<Partial<Record<BillingField, boolean>>>({});

  // Live errors derived from current values
  const billingErrors: BillingErrors = {
    fullName: VALIDATORS.fullName(billingInfo.fullName),
    email:    VALIDATORS.email(billingInfo.email),
    phone:    VALIDATORS.phone(billingInfo.phone),
    address:  VALIDATORS.address(billingInfo.address),
    city:     VALIDATORS.city(billingInfo.city),
    state:    VALIDATORS.state(billingInfo.state),
    pincode:  VALIDATORS.pincode(billingInfo.pincode),
  };

  const isBillingValid = Object.values(billingErrors).every((e) => !e);

  // ── Shipping form state ─────────────────────────────────────────────────────
  const [shippingInfo, setShippingInfo] = useState({
    sameAsBilling: true,
    fullName: '', phone: '', address: '', city: '', state: '', pincode: '',
  });

  const [shippingTouched, setShippingTouched] = useState<Partial<Record<string, boolean>>>({});

  const shippingErrors = shippingInfo.sameAsBilling ? {} : {
    fullName: VALIDATORS.fullName(shippingInfo.fullName),
    phone:    VALIDATORS.phone(shippingInfo.phone),
    address:  VALIDATORS.address(shippingInfo.address),
    city:     VALIDATORS.city(shippingInfo.city),
    state:    VALIDATORS.state(shippingInfo.state),
    pincode:  VALIDATORS.pincode(shippingInfo.pincode),
  };

  const isShippingValid = shippingInfo.sameAsBilling || Object.values(shippingErrors).every((e) => !e);

  const router = useRouter();

  // ── Input class helper ──────────────────────────────────────────────────────
  const inp = (field: BillingField, touched: boolean, error?: string) =>
    `w-full px-4 py-3 border-2 text-black rounded-xl focus:outline-none transition-colors ${
      touched && error
        ? 'border-red-400 focus:border-red-500 bg-red-50'
        : touched && !error
        ? 'border-green-400 focus:border-green-500 bg-green-50'
        : 'border-gray-300 focus:border-blue-500'
    }`;

  const shipInp = (field: string, error?: string) =>
    `w-full px-4 py-3 border-2 text-black rounded-xl focus:outline-none transition-colors ${
      shippingTouched[field] && error
        ? 'border-red-400 focus:border-red-500 bg-red-50'
        : shippingTouched[field] && !error
        ? 'border-green-400 focus:border-green-500 bg-green-50'
        : 'border-gray-300 focus:border-blue-500'
    }`;

  // ── Touch helpers ───────────────────────────────────────────────────────────
  const touchBilling = (field: BillingField) =>
    setBillingTouched((prev) => ({ ...prev, [field]: true }));

  const touchShipping = (field: string) =>
    setShippingTouched((prev) => ({ ...prev, [field]: true }));

  const touchAllBilling = () =>
    setBillingTouched(Object.fromEntries(Object.keys(VALIDATORS).map((k) => [k, true])));

  const touchAllShipping = () =>
    setShippingTouched({ fullName: true, phone: true, address: true, city: true, state: true, pincode: true });

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('checkoutItems');
    if (stored) {
      try { setCartItems(JSON.parse(stored)); }
      catch { toast.error('Failed to load cart items'); router.push('/cart'); }
    } else {
      toast.error('No items in cart');
      router.push('/cart');
    }

    const pendingCoupon = localStorage.getItem('pendingCoupon');
    if (pendingCoupon) {
      try {
        const coupon = JSON.parse(pendingCoupon);
        setCouponDiscount(coupon.discountAmount ?? 0);
        setCouponCode(coupon.code ?? '');
      } catch {}
    }

    const savedShipping = localStorage.getItem('shippingCharge');
    if (savedShipping !== null) {
      const parsed = parseFloat(savedShipping);
      setShipping(isNaN(parsed) ? 0 : parsed);
      setShippingLoading(false);
    } else {
      fetchShippingFallback();
    }

    loadRazorpayScript();
  }, []);

  const fetchShippingFallback = async () => {
    try {
      const res = await fetch(`${API}/api/v1/shipping/get`, {
        headers: getAuthHeaders(), credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setShipping(data.shippingCharge ?? 0);
    } catch {
      setShipping(0);
    } finally {
      setShippingLoading(false);
    }
  };

  // ── Pricing ─────────────────────────────────────────────────────────────────
  const subtotal  = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const codCharge = paymentMethod === 'COD' ? 50 : 0;
  const total     = subtotal - couponDiscount + shipping + codCharge;

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

  // ── Step navigation ─────────────────────────────────────────────────────────
  const handleBillingContinue = () => {
    touchAllBilling();
    if (!isBillingValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }
    setCurrentStep(2);
  };

  const handleShippingContinue = () => {
    if (!shippingInfo.sameAsBilling) {
      touchAllShipping();
      if (!isShippingValid) {
        toast.error('Please fix the errors before continuing');
        return;
      }
    }
    setCurrentStep(3);
  };

  // ── Place order ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const headers = getAuthHeaders();

    try {
      toast.loading('Creating your order...', { id: 'order' });

      const clinicAuth = getClinicAuth();

      const orderBody = orderPayload || {
        items: cartItems.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          ...(i.variantId ? { variantId: i.variantId } : {}),
        })),
        shippingAddress: getShippingAddress(),
        paymentMethod,
        orderNotes: '',
        ...(clinicAuth   ? { clinicId: clinicAuth.clinicId } : {}),
        ...(couponCode   ? { couponCode }                    : {}),
        buyerName:  billingInfo.fullName,
        buyerEmail: billingInfo.email,
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
        localStorage.removeItem('pendingCoupon');
        localStorage.removeItem('shippingCharge');
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
            localStorage.removeItem('pendingCoupon');
            localStorage.removeItem('shippingCharge');
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Breadcrumb */}
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

        {/* Step indicator */}
        <div className="mb-8 max-w-3xl mx-auto flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
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

            {/* ── Step 1: Billing ─────────────────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <Field label="Full Name *" icon={User}
                      error={billingErrors.fullName} touched={billingTouched.fullName}>
                      <input
                        type="text"
                        value={billingInfo.fullName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                        onBlur={() => touchBilling('fullName')}
                        className={inp('fullName', !!billingTouched.fullName, billingErrors.fullName)}
                        placeholder="e.g. Ravi Kumar"
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <div>
                    <Field label="Email *" icon={Mail}
                      error={billingErrors.email} touched={billingTouched.email}>
                      <input
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                        onBlur={() => touchBilling('email')}
                        className={inp('email', !!billingTouched.email, billingErrors.email)}
                        placeholder="your@email.com"
                      />
                    </Field>
                  </div>

                  {/* Phone */}
                  <div>
                    <Field label="Phone *" icon={Phone}
                      error={billingErrors.phone} touched={billingTouched.phone}>
                      <input
                        type="tel"
                        value={billingInfo.phone}
                        onChange={(e) => {
                          // Allow only digits, max 10
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setBillingInfo({ ...billingInfo, phone: val });
                        }}
                        onBlur={() => touchBilling('phone')}
                        className={inp('phone', !!billingTouched.phone, billingErrors.phone)}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </Field>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <Field label="Address *" icon={MapPin}
                      error={billingErrors.address} touched={billingTouched.address}>
                      <textarea
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        onBlur={() => touchBilling('address')}
                        className={inp('address', !!billingTouched.address, billingErrors.address)}
                        rows={3}
                        placeholder="Street address, building name, flat number, etc."
                      />
                    </Field>
                  </div>

                  {/* City */}
                  <div>
                    <Field label="City *"
                      error={billingErrors.city} touched={billingTouched.city}>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        onBlur={() => touchBilling('city')}
                        className={inp('city', !!billingTouched.city, billingErrors.city)}
                        placeholder="e.g. Mumbai"
                      />
                    </Field>
                  </div>

                  {/* State */}
                  <div>
                    <Field label="State *"
                      error={billingErrors.state} touched={billingTouched.state}>
                      <input
                        type="text"
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                        onBlur={() => touchBilling('state')}
                        className={inp('state', !!billingTouched.state, billingErrors.state)}
                        placeholder="e.g. Maharashtra"
                      />
                    </Field>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <Field label="PIN Code *"
                      error={billingErrors.pincode} touched={billingTouched.pincode}>
                      <input
                        type="text"
                        value={billingInfo.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setBillingInfo({ ...billingInfo, pincode: val });
                        }}
                        onBlur={() => touchBilling('pincode')}
                        className={inp('pincode', !!billingTouched.pincode, billingErrors.pincode)}
                        placeholder="400001"
                        maxLength={6}
                      />
                    </Field>
                  </div>

                  {/* Country */}
                  <div>
                    <Field label="Country">
                      <select
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                        className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      >
                        <option>India</option>
                        <option>USA</option>
                        <option>UK</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Error summary — only shown after attempting to continue */}
                {Object.values(billingTouched).some(Boolean) && !isBillingValid && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Please fix the following errors:</p>
                      <ul className="mt-1 space-y-0.5">
                        {(Object.entries(billingErrors) as [BillingField, string][])
                          .filter(([, e]) => e)
                          .map(([field, error]) => (
                            <li key={field} className="text-xs text-red-600">• {error}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBillingContinue}
                  className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* ── Step 2: Shipping ────────────────────────────────────────────── */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shippingInfo.sameAsBilling}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, sameAsBilling: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold text-gray-700">Same as billing address</span>
                </label>

                {shippingInfo.sameAsBilling ? (
                  // Show billing address as read-only preview
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">{billingInfo.fullName}</p>
                    <p>{billingInfo.phone}</p>
                    <p>{billingInfo.address}</p>
                    <p>{billingInfo.city}, {billingInfo.state} — {billingInfo.pincode}</p>
                    <p>{billingInfo.country}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <Field label="Full Name *"
                        error={shippingErrors.fullName} touched={shippingTouched.fullName}>
                        <input type="text" value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          onBlur={() => touchShipping('fullName')}
                          className={shipInp('fullName', shippingErrors.fullName)}
                          placeholder="e.g. Ravi Kumar" />
                      </Field>
                    </div>

                    <div className="md:col-span-2">
                      <Field label="Phone *"
                        error={shippingErrors.phone} touched={shippingTouched.phone}>
                        <input type="tel" value={shippingInfo.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setShippingInfo({ ...shippingInfo, phone: val });
                          }}
                          onBlur={() => touchShipping('phone')}
                          className={shipInp('phone', shippingErrors.phone)}
                          placeholder="9876543210" maxLength={10} />
                      </Field>
                    </div>

                    <div className="md:col-span-2">
                      <Field label="Address *"
                        error={shippingErrors.address} touched={shippingTouched.address}>
                        <textarea value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          onBlur={() => touchShipping('address')}
                          className={shipInp('address', shippingErrors.address)}
                          rows={3} placeholder="Street address, building name, etc." />
                      </Field>
                    </div>

                    <div>
                      <Field label="City *"
                        error={shippingErrors.city} touched={shippingTouched.city}>
                        <input type="text" value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          onBlur={() => touchShipping('city')}
                          className={shipInp('city', shippingErrors.city)}
                          placeholder="e.g. Mumbai" />
                      </Field>
                    </div>

                    <div>
                      <Field label="State *"
                        error={shippingErrors.state} touched={shippingTouched.state}>
                        <input type="text" value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          onBlur={() => touchShipping('state')}
                          className={shipInp('state', shippingErrors.state)}
                          placeholder="e.g. Maharashtra" />
                      </Field>
                    </div>

                    <div className="md:col-span-2">
                      <Field label="PIN Code *"
                        error={shippingErrors.pincode} touched={shippingTouched.pincode}>
                        <input type="text" value={shippingInfo.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setShippingInfo({ ...shippingInfo, pincode: val });
                          }}
                          onBlur={() => touchShipping('pincode')}
                          className={shipInp('pincode', shippingErrors.pincode)}
                          placeholder="400001" maxLength={6} />
                      </Field>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all">
                    Back
                  </button>
                  <button onClick={handleShippingContinue}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Payment ─────────────────────────────────────────────── */}
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
                  <button onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={isProcessing}
                    className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all
                      ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'}`}>
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      paymentMethod === 'RAZORPAY'
                        ? `Pay ₹${total.toLocaleString()}`
                        : `Place Order — ₹${total.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary ──────────────────────────────────────────────────── */}
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" /> Coupon {couponCode && `(${couponCode})`}
                    </span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shippingLoading
                      ? <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
                      : shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>

                {paymentMethod === 'COD' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Charges</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
              </div>

              <div className="mt-6 space-y-2">
                {['Secure Checkout', 'Easy Returns & Refunds'].map((t) => (
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