"use client";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Tag, Percent, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cartService, CartItem as ApiCartItem } from "@/services/cartService";
import { toast } from "sonner";
import baseUrl from "../baseUrl";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;          // original price (from cart API)
  discountedPrice: number | null; // backend-calculated price for this user
  quantity: number;
  image: string;
  category: string;
  inStock: boolean;
  variantId: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
}

// ── Auth helpers ─────────────────────────────────────────────────────────────
const getClinicAuth = (): { clinicId: string; token: string } | null => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("clinicToken") : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const clinicId = payload.clinicId || payload.hospitalId || payload._id;
    return clinicId ? { clinicId, token } : null;
  } catch { return null; }
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const clinicAuth = getClinicAuth();
  if (clinicAuth) headers["Authorization"] = `Bearer ${clinicAuth.token}`;
  return headers;
};

// ── Fetch discounted prices from backend ─────────────────────────────────────
const fetchDiscountedPrices = async (
  items: { productId: string; quantity: number; variantId: string | null }[]
): Promise<Record<string, number>> => {
  try {
    const clinicAuth = getClinicAuth();
    const body: any = {
      items: items.map(i => ({
        productId: i.productId,
        quantity:  i.quantity,
        ...(i.variantId ? { variantId: i.variantId } : {}),
      })),
      ...(clinicAuth ? { clinicId: clinicAuth.clinicId } : {}),
    };

    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/ecom-order/price-preview`, {
      method:      "POST",
      headers:     getAuthHeaders(),
      credentials: "include",
      body:        JSON.stringify(body),
    });

    if (!res.ok) return {};
    const data = await res.json();

    // Expect data.items = [{ productId, unitPrice }]
    const map: Record<string, number> = {};
    if (data.success && Array.isArray(data.items)) {
      data.items.forEach((i: any) => { map[i.productId] = i.unitPrice; });
    }
    return map;
  } catch { return {}; }
};

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(false);
  const [cartItems, setCartItems]       = useState<CartItem[]>([]);
  const [couponCode, setCouponCode]     = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();

      if (response.success && response.data) {
        const formattedItems: CartItem[] = response.data.items.map((item: ApiCartItem) => ({
          id:             item._id,
          productId:      item.product._id,
          name:           item.product.name,
          price:          item.variant.price,
          discountedPrice: null,
          quantity:       item.quantity,
          image:          item.product.image[0],
          category:       item.product.brand?.name || "Uncategorized",
          inStock:        true,
          variantId:      item.variant.variantId,
          size:           item.variant.size,
          color:          item.variant.color,
          material:       item.variant.material,
        }));

        setCartItems(formattedItems);

        // ── Fetch discounted prices for all items ──────────────────────────
        setPriceLoading(true);
        const discountMap = await fetchDiscountedPrices(
          formattedItems.map(i => ({ productId: i.productId, quantity: i.quantity, variantId: i.variantId }))
        );

        if (Object.keys(discountMap).length > 0) {
          setCartItems(prev => prev.map(item => ({
            ...item,
            discountedPrice: discountMap[item.productId] ?? null,
          })));
        }
        setPriceLoading(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      toast.error(error.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    try {
      setUpdating(true);
      await cartService.updateCartItemQuantity(itemId, newQuantity);
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
      toast.success("Quantity updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setUpdating(true);
      await cartService.removeCartItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    try {
      setUpdating(true);
      await cartService.clearCart();
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode("");
      toast.success("Coupon applied!");
    }
  };

  // ── Use discounted price if available, else fall back to original ──────────
  const effectivePrice = (item: CartItem) =>
    item.discountedPrice !== null ? item.discountedPrice : item.price;

  const subtotal  = cartItems.reduce((sum, i) => sum + effectivePrice(i) * i.quantity, 0);
  const discount  = appliedCoupon ? subtotal * 0.1 : 0;
  // ✅ Fixed shipping: matches backend logic (free above ₹500, else ₹50)
  const shipping  = subtotal > 500 ? 0 : 50;
  const tax       = Math.round((subtotal - discount) * 0.18);
  const total     = subtotal - discount + shipping + tax;
  const isEmpty   = cartItems.length === 0;

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

      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
              <p className="text-blue-100 text-sm mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {isEmpty ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start shopping to fill it up!</p>
              <button onClick={() => router.push("/")}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold inline-flex items-center gap-2">
                Continue Shopping <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                <button onClick={handleClearCart} disabled={updating}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline disabled:opacity-50">
                  Clear Cart
                </button>
              </div>

              {priceLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating your discounted prices...
                </div>
              )}

              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  effectivePrice={effectivePrice(item)}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  disabled={updating}
                />
              ))}

              <button onClick={() => router.push("/")}
                className="w-full py-3 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2 mt-6">
                Continue Shopping <ArrowRight className="w-5 h-5" />
              </button>
            </div>

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
              onCheckout={() => {
                localStorage.setItem("checkoutItems", JSON.stringify(
                  cartItems.map(i => ({ ...i, price: effectivePrice(i) }))
                ));
                router.push("/checkout");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// ── Cart Item Card ────────────────────────────────────────────────────────────
function CartItemCard({ item, effectivePrice, onQuantityChange, onRemove, disabled }: any) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const hasDiscount = item.discountedPrice !== null && item.discountedPrice < item.price;
  const itemTotal   = effectivePrice * item.quantity;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 md:p-6 transition-all duration-300 ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-6 items-center">

        {/* Image */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden w-full md:w-[120px] h-32 md:h-28">
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-3" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.category}</p>

          {(item.size || item.color || item.material) && (
            <div className="text-xs text-gray-600 flex gap-2">
              {item.size && <span>Size: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
              {item.material && <span>Material: {item.material}</span>}
            </div>
          )}

          {/* ✅ Price with strikethrough if discounted */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-blue-700">
              ₹{effectivePrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {Math.round((1 - item.discountedPrice / item.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
            <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-semibold">{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= 99 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button onClick={handleRemove} disabled={disabled}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="text-xl font-bold text-gray-900">
            ₹{itemTotal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Order Summary ─────────────────────────────────────────────────────────────
function OrderSummary({
  subtotal, discount, shipping, tax, total,
  couponCode, setCouponCode, appliedCoupon, setAppliedCoupon,
  handleApplyCoupon, onCheckout,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 pb-4 border-b">Order Summary</h2>

      {/* Coupon */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Have a coupon code?
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">{appliedCoupon} Applied</span>
            </div>
            <button onClick={() => setAppliedCoupon(null)} className="text-xs text-red-600 hover:text-red-700 font-semibold">Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            <button onClick={handleApplyCoupon} disabled={!couponCode.trim()}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-b">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount (10%)</span>
            <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
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
          <span className="font-semibold">₹{tax.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-bold text-blue-700">₹{total.toLocaleString("en-IN")}</span>
      </div>

      <button onClick={onCheckout}
        className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all font-bold flex items-center justify-center gap-2">
        Proceed to Checkout <ArrowRight className="w-5 h-5" />
      </button>

      <div className="text-center text-xs text-gray-500">
        🔒 Secure checkout powered by SSL encryption
      </div>
    </div>
  );
}