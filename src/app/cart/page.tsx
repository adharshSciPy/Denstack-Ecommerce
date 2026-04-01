"use client";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Tag, Percent, Loader2, Check, X, AlertCircle, Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cartService, CartItem as ApiCartItem } from "@/services/cartService";
import { toast } from "sonner";
import baseUrl from "../baseUrl";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountedPrice: number | null;
  quantity: number;
  image: string;
  category: string;
  inStock: boolean;
  variantId: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
}

interface AppliedCoupon {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  discountAmount: number;
  description?: string;
}

// ── Auth helpers ─────────────────────────────────────────────────────────────
const getClinicAuth = (): { clinicId: string; token: string; name: string; email: string } | null => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("clinicToken") : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const clinicId = payload.clinicId || payload.hospitalId || payload._id;
    return clinicId ? { clinicId, token, name: payload.name || "", email: payload.email || "" } : null;
  } catch { return null; }
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const clinic = getClinicAuth();
  if (clinic?.token) headers["Authorization"] = `Bearer ${clinic.token}`;
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

    const map: Record<string, number> = {};
    if (data.success && Array.isArray(data.items)) {
      data.items.forEach((i: any) => { map[i.productId] = i.unitPrice; });
    }
    return map;
  } catch { return {}; }
};

// ── Validate coupon (preview only, does NOT record usage) ────────────────────
const validateCouponAPI = async (
  code: string,
  orderAmount: number
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/coupons/validate`, {
      method:      "POST",
      headers:     getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        code:        code.toUpperCase().trim(),
        orderAmount,
      }),
    });

    const data = await res.json();
    return { success: data.success, data: data.data, message: data.message };
  } catch {
    return { success: false, message: "Failed to connect. Please try again." };
  }
};

// ── ✅ NEW — Fetch shipping charge from backend ───────────────────────────────
const fetchShippingChargeAPI = async (): Promise<number> => {
  try {
    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/shipping/get`, {
      method:      "GET",
      headers:     getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) return 0;
    const data = await res.json();
    return data.success ? (data.shippingCharge ?? 0) : 0;
  } catch {
    return 0;
  }
};

// ── Main CartPage ─────────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading]             = useState(true);
  const [updating, setUpdating]           = useState(false);
  const [cartItems, setCartItems]         = useState<CartItem[]>([]);
  const [priceLoading, setPriceLoading]   = useState(false);

  // ✅ Shipping state (fetched from backend)
  const [shipping, setShipping]           = useState<number>(0);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode]       = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]     = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    fetchCart();
    fetchShipping(); // ✅ fetch shipping charge on mount
  }, []);

  // ✅ NEW — fetch shipping charge from backend
  const fetchShipping = async () => {
    setShippingLoading(true);
    const charge = await fetchShippingChargeAPI();
    setShipping(charge);
    setShippingLoading(false);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();

      if (response.success && response.data) {
        const formattedItems: CartItem[] = response.data.items.map((item: ApiCartItem) => ({
          id:              item._id,
          productId:       item.product._id,
          name:            item.product.name,
          price:           item.variant.price,
          discountedPrice: null,
          quantity:        item.quantity,
          image:           item.product.image[0],
          category:        item.product.brand?.name || "Uncategorized",
          inStock:         true,
          variantId:       item.variant.variantId,
          size:            item.variant.size,
          color:           item.variant.color,
          material:        item.variant.material,
        }));

        setCartItems(formattedItems);

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
      if (appliedCoupon) {
        setAppliedCoupon(null);
        toast.info("Cart updated — please re-apply your coupon.");
      } else {
        toast.success("Quantity updated");
      }
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
      if (appliedCoupon) setAppliedCoupon(null);
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
      setAppliedCoupon(null);
      toast.success("Cart cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponLoading(true);

    const result = await validateCouponAPI(couponCode, subtotal);

    if (result.success && result.data) {
      setAppliedCoupon({
        code:           result.data.code,
        discountType:   result.data.discountType,
        discountValue:  result.data.discountValue,
        discountAmount: result.data.discountAmount ?? 0,
        description:    result.data.description,
      });
      setCouponCode("");
      toast.success(`Coupon "${result.data.code}" applied! You save ₹${result.data.discountAmount}`);
    } else {
      setCouponError(result.message || "Invalid or expired coupon code.");
    }

    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // ── Pricing ───────────────────────────────────────────────────────────────
  const effectivePrice = (item: CartItem) =>
    item.discountedPrice !== null ? item.discountedPrice : item.price;

  const subtotal       = cartItems.reduce((sum, i) => sum + effectivePrice(i) * i.quantity, 0);
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const total          = subtotal - couponDiscount + shipping; // ✅ uses dynamic shipping state

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
              couponDiscount={couponDiscount}
              shipping={shipping}
              shippingLoading={shippingLoading}
              total={total}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onCheckout={() => {
                if (appliedCoupon) {
                  localStorage.setItem("pendingCoupon", JSON.stringify(appliedCoupon));
                } else {
                  localStorage.removeItem("pendingCoupon");
                }
                // ✅ Also persist shipping charge so checkout page has it
                localStorage.setItem("shippingCharge", String(shipping));
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
  const handleRemove = () => { setIsRemoving(true); setTimeout(() => onRemove(item.id), 300); };
  const hasDiscount = item.discountedPrice !== null && item.discountedPrice < item.price;
  const itemTotal   = effectivePrice * item.quantity;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 md:p-6 transition-all duration-300 ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-6 items-center">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden w-full md:w-[120px] h-32 md:h-28">
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-3" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.category}</p>
          {(item.size || item.color || item.material) && (
            <div className="text-xs text-gray-600 flex gap-2">
              {item.size     && <span>Size: {item.size}</span>}
              {item.color    && <span>Color: {item.color}</span>}
              {item.material && <span>Material: {item.material}</span>}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-blue-700">₹{effectivePrice.toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-400 line-through">₹{item.price.toLocaleString("en-IN")}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {Math.round((1 - item.discountedPrice / item.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
            <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"><Minus className="w-4 h-4" /></button>
            <span className="w-12 text-center font-semibold">{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= 99 || disabled}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"><Plus className="w-4 h-4" /></button>
          </div>
          <button onClick={handleRemove} disabled={disabled}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="text-xl font-bold text-gray-900">₹{itemTotal.toLocaleString("en-IN")}</div>
        </div>
      </div>
    </div>
  );
}

// ── Order Summary ─────────────────────────────────────────────────────────────
function OrderSummary({
  subtotal, couponDiscount, shipping, shippingLoading, total,
  couponCode, setCouponCode,
  appliedCoupon, couponLoading, couponError,
  onApplyCoupon, onRemoveCoupon, onCheckout,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 pb-4 border-b">Order Summary</h2>

      {/* Coupon section */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Have a coupon code?
        </label>

        {appliedCoupon ? (
          <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-green-800 font-mono tracking-wider">{appliedCoupon.code}</div>
                  <div className="text-xs text-green-600">
                    {appliedCoupon.discountType === "percent"
                      ? `${appliedCoupon.discountValue}% off`
                      : `₹${appliedCoupon.discountValue} flat off`}
                    {appliedCoupon.description ? ` · ${appliedCoupon.description}` : ""}
                  </div>
                </div>
              </div>
              <button onClick={onRemoveCoupon}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
            {couponDiscount > 0 && (
              <div className="px-4 py-2 bg-green-100 border-t border-green-200 text-xs text-green-700 font-semibold">
                🎉 You save ₹{couponDiscount.toLocaleString("en-IN")} on this order!
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                placeholder="Enter coupon code"
                className={`flex-1 px-4 py-2.5 border-2 rounded-lg font-mono tracking-wider text-sm uppercase focus:outline-none transition-colors
                  ${couponError ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
              />
              <button onClick={onApplyCoupon} disabled={!couponCode.trim() || couponLoading}
                className="px-4 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 font-semibold text-sm min-w-[80px] flex items-center justify-center gap-1">
                {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
              </button>
            </div>
            {couponError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {couponError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" /> Coupon Discount
            </span>
            <span className="font-semibold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* ✅ Shipping row — shows loader while fetching */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Shipping
          </span>
          <span className="font-semibold">
            {shippingLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
            ) : shipping === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              `₹${shipping.toLocaleString("en-IN")}`
            )}
          </span>
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