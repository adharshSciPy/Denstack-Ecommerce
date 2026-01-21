'use client';
import { useState } from 'react';
// import Header from './Header';
// import Footer from './Footer';
import { CreditCard, Smartphone, Building2, Wallet, DollarSign, Lock, Shield, Check, ChevronLeft, AlertCircle, QrCode } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

interface PaymentGatewayPageProps {
  amount: number;
  orderId: string;
  cartCount: number;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
  onCartClick: () => void;
}

export default function PaymentGatewayPage({
  amount = 0,
  orderId = '',
  cartCount = 0,
  onPaymentSuccess = () => {},
  onPaymentCancel = () => {},
  onCartClick = () => {}
}: PaymentGatewayPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet' | 'cod' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // UPI states
  const [upiId, setUpiId] = useState('');
  const [upiMethod, setUpiMethod] = useState<'id' | 'qr'>('id');

  // Net Banking states
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet states
  const [selectedWallet, setSelectedWallet] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const validatePayment = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      if (!cardName) {
        toast.error('Please enter cardholder name');
        return false;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        toast.error('Please enter valid expiry date (MM/YY)');
        return false;
      }
      if (!cvv || cvv.length !== 3) {
        toast.error('Please enter valid CVV');
        return false;
      }
    } else if (selectedMethod === 'upi') {
      if (upiMethod === 'id' && !upiId) {
        toast.error('Please enter your UPI ID');
        return false;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        toast.error('Please select a bank');
        return false;
      }
    } else if (selectedMethod === 'wallet') {
      if (!selectedWallet) {
        toast.error('Please select a wallet');
        return false;
      }
    }

    return true;
  };

  const handlePayment = () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate payment processing
    toast.loading('Processing payment...', { id: 'payment' });

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful!', { id: 'payment' });
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 3000);
  };

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: CreditCard, 
      color: 'blue',
      description: 'Visa, Mastercard, RuPay'
    },
    { 
      id: 'upi', 
      name: 'UPI Payment', 
      icon: Smartphone, 
      color: 'green',
      description: 'Google Pay, PhonePe, Paytm'
    },
    { 
      id: 'netbanking', 
      name: 'Net Banking', 
      icon: Building2, 
      color: 'purple',
      description: 'All major banks'
    },
    { 
      id: 'wallet', 
      name: 'Wallets', 
      icon: Wallet, 
      color: 'orange',
      description: 'Paytm, PhonePe, Amazon Pay'
    },
    { 
      id: 'cod', 
      name: 'Cash on Delivery', 
      icon: DollarSign, 
      color: 'gray',
      description: '₹50 additional charges'
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'IDFC First Bank'
  ];

  const wallets = [
    { name: 'Paytm', logo: '💰' },
    { name: 'PhonePe', logo: '📱' },
    { name: 'Amazon Pay', logo: '🛒' },
    { name: 'Mobikwik', logo: '💳' },
    { name: 'Freecharge', logo: '⚡' }
  ];

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* <Header 
        cartCount={cartCount}
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={onCartClick}
        onFavoritesClick={() => {}}
        favoritesCount={0}
      /> */}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onPaymentCancel}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-all hover:gap-3"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Checkout
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment Gateway</h1>
                <p className="text-gray-600">Order ID: <span className="font-semibold text-blue-600">{orderId}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                <p className="text-4xl font-bold text-green-600">₹{amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Payment Methods Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`
                        relative p-5 rounded-xl border-2 transition-all text-left
                        ${selectedMethod === method.id 
                          ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }
                      `}
                    >
                      {selectedMethod === method.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-8 h-8 text-${method.color}-600`} />
                        <div>
                          <p className="font-bold text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form based on selected method */}
            {selectedMethod && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Enter Card Details
                    </h3>

                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                        <div className="text-xs opacity-75">VISA</div>
                      </div>
                      <div className="mb-6">
                        <p className="text-lg tracking-widest font-mono">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs opacity-75 mb-1">CARDHOLDER NAME</p>
                          <p className="font-semibold">{cardName || 'YOUR NAME'}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75 mb-1">VALID THRU</p>
                          <p className="font-semibold">{expiryDate || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        placeholder="JOHN DOE"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={handleCvvChange}
                          className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Save this card for future payments</span>
                    </label>
                  </div>
                )}

                {/* UPI Payment Form */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      UPI Payment
                    </h3>

                    <div className="flex gap-4 mb-4">
                      <button
                        onClick={() => setUpiMethod('id')}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                          upiMethod === 'id' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Enter UPI ID
                      </button>
                      <button
                        onClick={() => setUpiMethod('qr')}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                          upiMethod === 'qr' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Scan QR Code
                      </button>
                    </div>

                    {upiMethod === 'id' ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Enter UPI ID</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                            placeholder="yourname@paytm"
                          />
                        </div>

                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Popular UPI Apps:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map((app) => (
                              <span key={app} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-green-300">
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-4 border-green-600">
                          <QrCode className="w-48 h-48 text-gray-900 mx-auto mb-4" />
                          <p className="font-bold text-gray-900">Scan with any UPI App</p>
                          <p className="text-sm text-gray-600 mt-2">Amount: ₹{amount.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                          Open your UPI app and scan the QR code to complete payment
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Net Banking Form */}
                {selectedMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      Select Your Bank
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`
                            p-4 rounded-xl border-2 text-left transition-all
                            ${selectedBank === bank 
                              ? 'border-purple-600 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{bank}</span>
                            {selectedBank === bank && (
                              <Check className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedBank && (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-gray-700">
                          You will be redirected to <span className="font-bold">{selectedBank}</span> secure login page to complete the payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Wallet Form */}
                {selectedMethod === 'wallet' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-orange-600" />
                      Select Your Wallet
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {wallets.map((wallet) => (
                        <button
                          key={wallet.name}
                          onClick={() => setSelectedWallet(wallet.name)}
                          className={`
                            p-6 rounded-xl border-2 transition-all
                            ${selectedWallet === wallet.name 
                              ? 'border-orange-600 bg-orange-50 scale-105' 
                              : 'border-gray-200 hover:border-orange-300'
                            }
                          `}
                        >
                          <div className="text-4xl mb-2">{wallet.logo}</div>
                          <p className="font-semibold text-gray-900">{wallet.name}</p>
                          {selectedWallet === wallet.name && (
                            <Check className="w-5 h-5 text-orange-600 mx-auto mt-2" />
                          )}
                        </button>
                      ))}
                    </div>

                    {selectedWallet && (
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                        <p className="text-sm text-gray-700">
                          You will be redirected to <span className="font-bold">{selectedWallet}</span> to complete the payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* COD Confirmation */}
                {selectedMethod === 'cod' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      Cash on Delivery
                    </h3>

                    <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-gray-900 mb-2">Payment on Delivery</p>
                          <p className="text-sm text-gray-700 mb-3">
                            Pay ₹{(amount + 50).toLocaleString()} (including ₹50 COD charges) when you receive your order at your doorstep.
                          </p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Cash payment accepted</li>
                            <li>• Additional ₹50 handling charges apply</li>
                            <li>• Verify items before payment</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={()=> router.push('/orderconfirmation')}
                  disabled={isProcessing}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg transition-all
                    ${isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
                    }
                    text-white
                  `}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay ₹${selectedMethod === 'cod' ? (amount + 50).toLocaleString() : amount.toLocaleString()}`
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right - Security Info */}
          <div className="space-y-6">
            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">100% Secure Payment</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p>256-bit SSL encryption</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p>PCI DSS compliant</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p>No card details stored</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p>Verified by Visa & Mastercard</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Amount</span>
                  <span className="font-semibold">₹{amount.toLocaleString()}</span>
                </div>
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Charges</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-green-600 text-xl">
                    ₹{selectedMethod === 'cod' ? (amount + 50).toLocaleString() : amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <p className="font-bold text-gray-900">Need Help?</p>
              </div>
              <p className="text-sm text-gray-700">
                Our support team is available 24/7 to assist you with payment issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
