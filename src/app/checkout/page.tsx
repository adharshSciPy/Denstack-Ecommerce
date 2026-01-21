'use client';
import { useState } from 'react';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock, Check, ChevronRight, Home, Building, Calendar } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

interface CheckoutPageProps {
    cartCount: number;
    onCartCountChange: (count: number) => void;
    onBackToCart: () => void;
    onProceedToPayment: (amount: number, orderId: string) => void;
    onCartClick: () => void;
}

export default function CheckoutPage({
    cartCount,
    onCartCountChange,
    onBackToCart,
    onProceedToPayment,
    onCartClick
}: CheckoutPageProps) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');

    // Form States
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    const [shippingInfo, setShippingInfo] = useState({
        sameAsBilling: true,
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    // Mock cart items
    const cartItems = [
        { id: 1, name: 'Dental Impression Tray Kit', price: 1299, quantity: 2 },
        { id: 2, name: 'LED Dental Curing Light', price: 4599, quantity: 1 },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = () => {
        // Validate based on payment method
        if (paymentMethod === 'card') {
            if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
                toast.error('Please fill in all card details');
                return;
            }
        } else if (paymentMethod === 'upi') {
            if (!upiId) {
                toast.error('Please enter your UPI ID');
                return;
            }
        } else if (paymentMethod === 'netbanking') {
            if (!selectedBank) {
                toast.error('Please select a bank');
                return;
            }
        }

        // Generate order ID
        const orderId = 'ORD' + Date.now().toString(36).toUpperCase();

        toast.success('Order placed successfully!', {
            description: `Order ID: ${orderId}`
        });

        setTimeout(() => {
            onProceedToPayment?.(paymentMethod === 'cod' ? total + 50 : total, orderId);
        }, 1500);
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />

            {/* <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={() => {}}
        favoritesCount={0}
      /> */}

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Home className="w-4 h-4 text-gray-500" />
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <button onClick={() => router.push('/cart')} className="text-gray-500 hover:text-blue-600">Cart</button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600 font-semibold">Checkout</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all
                    ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
                  `}>
                                        {currentStep > step ? <Check className="w-6 h-6" /> : step}
                                    </div>
                                    <span className={`mt-2 text-sm font-semibold ${currentStep >= step ? 'text-blue-600' : 'text-gray-600'}`}>
                                        {step === 1 ? 'Billing' : step === 2 ? 'Shipping' : 'Payment'}
                                    </span>
                                </div>
                                {step < 3 && (
                                    <div className={`h-1 flex-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1 - Billing Information */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingInfo.fullName}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={billingInfo.email}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={billingInfo.phone}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Address *
                                        </label>
                                        <textarea
                                            value={billingInfo.address}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            rows={3}
                                            placeholder="Street address, building name, etc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            value={billingInfo.city}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            value={billingInfo.state}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="State"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                                        <input
                                            type="text"
                                            value={billingInfo.pincode}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, pincode: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="123456"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                                        <select
                                            value={billingInfo.country}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                        >
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone) {
                                            toast.error('Please fill in all required fields');
                                            return;
                                        }
                                        setCurrentStep(2);
                                    }}
                                    className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                                >
                                    Continue to Shipping
                                </button>
                            </div>
                        )}

                        {/* Step 2 - Shipping Information */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={shippingInfo.sameAsBilling}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, sameAsBilling: e.target.checked })}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="font-semibold text-gray-700">Same as billing address</span>
                                </label>

                                {!shippingInfo.sameAsBilling && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.fullName}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="Recipient name"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                value={shippingInfo.phone}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                                            <textarea
                                                value={shippingInfo.address}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                rows={3}
                                                placeholder="Delivery address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.city}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.state}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.pincode}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Payment */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                        <p className="text-sm font-semibold">Card</p>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        <div className="text-2xl mx-auto mb-2">📱</div>
                                        <p className="text-sm font-semibold">UPI</p>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('netbanking')}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'netbanking' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                        <p className="text-sm font-semibold">Net Banking</p>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                        <p className="text-sm font-semibold">COD</p>
                                    </button>
                                </div>

                                {/* Card Payment Form */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                                            <input
                                                type="text"
                                                value={cardInfo.cardNumber}
                                                onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                                            <input
                                                type="text"
                                                value={cardInfo.cardName}
                                                onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="Name on card"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                                                <input
                                                    type="text"
                                                    value={cardInfo.expiryDate}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                                                <input
                                                    type="password"
                                                    value={cardInfo.cvv}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                    placeholder="123"
                                                    maxLength={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-2">
                                            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700">Your payment information is encrypted and secure</p>
                                        </div>
                                    </div>
                                )}

                                {/* UPI Payment */}
                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID *</label>
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="yourname@paytm"
                                            />
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-700">Popular UPI Apps: Google Pay, PhonePe, Paytm, BHIM</p>
                                        </div>
                                    </div>
                                )}

                                {/* Net Banking */}
                                {paymentMethod === 'netbanking' && (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Bank *</label>
                                        <select
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="">Choose a bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="axis">Axis Bank</option>
                                            <option value="pnb">Punjab National Bank</option>
                                        </select>
                                    </div>
                                )}

                                {/* Cash on Delivery */}
                                {paymentMethod === 'cod' && (
                                    <div className="bg-yellow-50 rounded-xl p-6">
                                        <h3 className="font-bold text-gray-900 mb-2">Cash on Delivery</h3>
                                        <p className="text-sm text-gray-700 mb-4">Pay when you receive your order at your doorstep.</p>
                                        <p className="text-sm text-gray-600">₹50 additional COD handling charges will apply.</p>
                                    </div>
                                )}

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => router.push('/paymentgatewaypage')}
                                        className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
                                    >
                                        Place Order - ₹{paymentMethod === 'cod' ? total + 50 : total}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-green-600">
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (18%)</span>
                                    <span className="font-semibold">₹{tax}</span>
                                </div>
                                {paymentMethod === 'cod' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">COD Charges</span>
                                        <span className="font-semibold">₹50</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₹{paymentMethod === 'cod' ? total + 50 : total}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Check className="w-5 h-5" />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Check className="w-5 h-5" />
                                    <span>Free Shipping over ₹5000</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Check className="w-5 h-5" />
                                    <span>Easy Returns & Refunds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
}