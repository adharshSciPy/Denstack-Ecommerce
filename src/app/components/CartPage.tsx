import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Percent } from 'lucide-react';
import img33211 from "../../assets/0815c4dbb681f7ea1c9955cfaec5ad8e6de976af.png";
import { StaticImageData } from "next/image";
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: StaticImageData;
  category: string;
  inStock: boolean;
}

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
  index: number;
}

function CartItemCard({ item, onQuantityChange, onRemove, index }: CartItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-xl p-4 md:p-6
        transition-all duration-300 animate-fade-in-up
        ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${isHovered ? 'shadow-lg border-blue-300' : 'shadow-sm'}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-6 items-center">
        {/* Product Image */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden w-full md:w-[120px] h-32 md:h-28 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-contain p-3"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xs font-semibold px-2 py-1 bg-red-600 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-2 min-w-0">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold text-blue-700">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500">per item</span>
            </div>

            {/* Stock Status */}
            {item.inStock && (
              <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-50 rounded-full">
                In Stock
              </span>
            )}
          </div>

          {/* Mobile: Quantity and Remove */}
          <div className="flex items-center gap-3 md:hidden mt-2">
            <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={item.quantity >= 99}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <button
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="ml-auto">
              <span className="text-sm text-gray-500">Subtotal:</span>
              <div className="text-lg font-bold text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Quantity, Subtotal, Remove */}
        <div className="hidden md:flex items-center gap-6">
          {/* Quantity Controls */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Quantity</span>
            <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="w-12 text-center font-semibold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={item.quantity >= 99}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex flex-col items-end gap-1 min-w-[120px]">
            <span className="text-xs text-gray-500 font-semibold">Subtotal</span>
            <div className="text-xl font-bold text-gray-900">
              ₹{subtotal.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
            title="Remove from cart"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface CartPageProps {
  cartCount: number;
  onCartCountChange: (count: number) => void;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onCheckoutClick?: () => void;
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
}

export default function CartPage({
  cartCount,
  onCartCountChange,
  onBackToHome,
  onCartClick,
  onCheckoutClick,
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
  favoritesCount
}: CartPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Diagnostic Extraction and Instrument Planning Kit",
      price: 12499,
      quantity: 2,
      image: img33211,
      category: "Surgical Instruments",
      inStock: true
    },
    {
      id: 2,
      name: "Professional Dental Extraction Forceps Set",
      price: 8999,
      quantity: 1,
      image: img33211,
      category: "Extraction Tools",
      inStock: true
    },
    {
      id: 3,
      name: "Advanced Periodontal Surgery Kit",
      price: 15999,
      quantity: 3,
      image: img33211,
      category: "Periodontal Tools",
      inStock: true
    },
    {
      id: 4,
      name: "Endodontic Treatment Complete Set",
      price: 22499,
      quantity: 1,
      image: img33211,
      category: "Endodontic Instruments",
      inStock: false
    }
  ]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    onCartCountChange(cartCount - 1);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode('');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal - discount + shipping + tax;

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => { }}
        onLogoClick={onBackToHome}
        onFavoritesClick={onFavoritesClick}
        onOrdersClick={onOrdersClick}
        onAccountClick={onAccountClick}
        favoritesCount={favoritesCount}
      />

      {/* Navigation */}
      <Navigation
        currentPage="home"
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />

      {/* Page Title */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-6 shadow-lg animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
              <p className="text-blue-100 text-sm mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {isEmpty ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={onBackToHome}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold hover:shadow-lg hover:scale-105 inline-flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                <button
                  onClick={() => {
                    setCartItems([]);
                    onCartCountChange(0);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item, index) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  index={index}
                />
              ))}

              {/* Continue Shopping Button */}
              <button
                onClick={onBackToHome}
                className="w-full py-3 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2 mt-6"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-bold text-gray-900 pb-4 border-b">Order Summary</h2>

                {/* Coupon Code */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Have a coupon code?
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          {appliedCoupon} Applied
                        </span>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-t border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 Add ₹{(50000 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-700">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={onCheckoutClick}
                  className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Security Badge */}
                <div className="text-center text-xs text-gray-500 pt-2">
                  🔒 Secure checkout powered by SSL encryption
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}