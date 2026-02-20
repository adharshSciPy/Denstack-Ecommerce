'use client';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Percent, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cartService, CartItem as ApiCartItem } from '@/services/cartService';
import { toast } from 'sonner';
import Image from 'next/image';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  inStock: boolean;
  variantId: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
}

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      
      if (response.success && response.data) {
        const formattedItems: CartItem[] = response.data.items.map((item: ApiCartItem) => ({
          id: item._id,
          productId: item.product._id,
          name: item.product.name,
          price: item.variant.price,
          quantity: item.quantity,
          image: item.product.image[0],
          category: item.product.brand?.name || 'Uncategorized',
          inStock: true, // You can add stock checking logic
          variantId: item.variant.variantId,
          size: item.variant.size,
          color: item.variant.color,
          material: item.variant.material,
        }));
        
        setCartItems(formattedItems);
      }
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      toast.error(error.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    try {
      setUpdating(true);
      await cartService.updateCartItemQuantity(itemId, newQuantity);
      
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      toast.success('Quantity updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setUpdating(true);
      await cartService.removeCartItem(itemId);
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
      setUpdating(true);
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode('');
      toast.success('Coupon applied!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  const isEmpty = cartItems.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="cart" cartCount={cartItems.length} favoritesCount={0} />

      {/* Page Title */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-6 shadow-lg">
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
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Start shopping to fill it up!
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold inline-flex items-center gap-2"
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
                  onClick={handleClearCart}
                  disabled={updating}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline disabled:opacity-50"
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
                  disabled={updating}
                />
              ))}

              <button
                onClick={() => router.push('/')}
                className="w-full py-3 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2 mt-6"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              tax={tax}
              total={total}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              handleApplyCoupon={handleApplyCoupon}
              onCheckout={() => router.push('/checkout')}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Cart Item Card Component
function CartItemCard({ item, onQuantityChange, onRemove, index, disabled }: any) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 md:p-6 transition-all duration-300 ${
        isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-6 items-center">
        {/* Product Image */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden w-full md:w-[120px] h-32 md:h-28">
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-contain p-3"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.category}</p>
          
          {/* Variant Info */}
          {(item.size || item.color || item.material) && (
            <div className="text-xs text-gray-600 flex gap-2">
              {item.size && <span>Size: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
              {item.material && <span>Material: {item.material}</span>}
            </div>
          )}

          <div className="text-lg font-bold text-blue-700">
            ₹{item.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-semibold">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= 99 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={disabled}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="text-xl font-bold text-gray-900">
            ₹{subtotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({
  subtotal,
  discount,
  shipping,
  tax,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
  handleApplyCoupon,
  onCheckout,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 h-fit sticky top-6">
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
              <span className="text-sm font-semibold text-green-700">{appliedCoupon} Applied</span>
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
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-b">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount (10%)</span>
            <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Tax (GST 18%)</span>
          <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-bold text-blue-700">₹{total.toLocaleString('en-IN')}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all font-bold flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="text-center text-xs text-gray-500">
        🔒 Secure checkout powered by SSL encryption
      </div>
    </div>
  );
}