"use client";
import { useState, useEffect, useCallback } from "react";
import Navigation from "../components/Navigation";
import {
  User, Package, Settings, LogOut, Edit, Save, X,
  Phone, Mail, Calendar, Shield, Eye, EyeOff, ChevronRight,
  Loader2, RefreshCw,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import baseUrl from "../baseUrl";
import axios from "axios";
import Cookies from "js-cookie";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType = "profile" | "orders" | "settings";

interface Order {
  _id: string;
  orderId?: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number; price: number; image?: string }>;
  totalAmount: number;
  paymentDetails: { method: string; status: string };
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

const getAuthHeaders = () => {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getInventoryHeaders = () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const clinicToken = localStorage.getItem("clinicToken");
    if (clinicToken) headers["Authorization"] = `Bearer ${clinicToken}`;
  } catch {}
  return headers;
};

const getUserId = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${baseUrl.INVENTORY}/api/v1/auth/check`, {
      credentials: "include",
      headers: getInventoryHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.id || null;
  } catch { return null; }
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:          "bg-yellow-100 text-yellow-700",
  CONFIRMED:        "bg-blue-100 text-blue-700",
  PROCESSING:       "bg-purple-100 text-purple-700",
  SHIPPED:          "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED:        "bg-green-100 text-green-700",
  CANCELLED:        "bg-red-100 text-red-700",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AccountPageProps {
  cartCount: number;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  favoritesCount?: number;
}

export default function AccountPage({
  cartCount,
  onCartClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  favoritesCount,
}: AccountPageProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);

  const emptyProfile = { name: "", email: "", phoneNumber: "", DOB: "", specialization: "", clinicName: "", licenseNumber: "" };
  const [userData, setUserData]         = useState<any>(emptyProfile);
  const [tempUserData, setTempUserData] = useState<any>(emptyProfile);

  const [orders, setOrders]               = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [passwords, setPasswords]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd]       = useState({ current: false, new: false, confirm: false });
  const [pwdLoading, setPwdLoading] = useState(false);

  // ── Profile ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl.AUTH}/api/v1/ecommerceuser/getProfile`, {
          withCredentials: true, headers: getAuthHeaders(),
        });
        const merged = { ...emptyProfile, ...res.data.data };
        setUserData(merged); setTempUserData(merged);
      } catch {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    };
    fetchProfile();
  }, []);

  // ── Orders ────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const userId = await getUserId();
      if (!userId) return;
      const res = await fetch(
        `${baseUrl.INVENTORY}/api/v1/ecom-order/user/${userId}?page=1&limit=20`,
        { credentials: "include", headers: getInventoryHeaders() }
      );
      const data = await res.json();
      setOrders(data.data || []);
    } catch { toast.error("Failed to load orders"); }
    finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab, fetchOrders]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
        `${baseUrl.AUTH}/api/v1/ecommerceuser/edit-profile`,
        { name: tempUserData.name, phoneNumber: tempUserData.phoneNumber, DOB: tempUserData.DOB, specialization: tempUserData.specialization, clinicName: tempUserData.clinicName, licenseNumber: tempUserData.licenseNumber },
        { withCredentials: true, headers: getAuthHeaders() }
      );
      const updated = { ...emptyProfile, ...res.data.data };
      setUserData(updated); setTempUserData(updated);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl.AUTH}/api/v1/ecommerceuser/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      toast.success("Logged out!");
      router.push("/login");
    } catch { toast.error("Logout failed."); }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Please fill all password fields"); return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match"); return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    setPwdLoading(true);
    try {
      await axios.put(`${baseUrl.INVENTORY}/api/v1/userAccount/change-password`, passwords, { withCredentials: true, headers: getAuthHeaders() });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally { setPwdLoading(false); }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "profile",  label: "Profile",   icon: User     },
    { id: "orders",   label: "My Orders", icon: Package  },
    { id: "settings", label: "Settings",  icon: Settings },
  ];

  const inp = "w-full px-4 py-3 border-2 text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none";

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navigation
        currentPage="account"
        cartCount={cartCount}
        favoritesCount={favoritesCount ?? 0}
        onCartClick={onCartClick}
        onBrandClick={onBrandClick}
        onBuyingGuideClick={onBuyingGuideClick}
        onEventsClick={onEventsClick}
        onMembershipClick={onMembershipClick}
        onFreebiesClick={onFreebiesClick}
        onBestSellerClick={onBestSellerClick}
        onClinicSetupClick={onClinicSetupClick}
      />

      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl font-bold border-4 border-white shadow-2xl">
            {userData?.name?.charAt(0) || userData?.firstName?.charAt(0) || "?"}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">Welcome back, {userData?.name || userData?.firstName || "User"}!</h1>
            <p className="text-pink-100 text-lg">{userData?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              <nav className="p-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all mb-1
                      ${activeTab === id
                        ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"}`}>
                    <Icon className="w-5 h-5" />{label}
                  </button>
                ))}
                <hr className="my-2" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-4">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button onClick={() => { setTempUserData(userData); setIsEditing(false); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name",      key: "name",           type: "text",  icon: null },
                    { label: "Email",          key: "email",          type: "email", icon: <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> },
                    { label: "Phone",          key: "phoneNumber",    type: "tel",   icon: <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> },
                    { label: "Date of Birth",  key: "DOB",            type: "date",  icon: <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> },
                    { label: "Specialization", key: "specialization", type: "text",  icon: null },
                  ].map(({ label, key, type, icon }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                      <div className="relative">
                        {icon}
                        <input type={type}
                          value={isEditing ? (tempUserData[key] || "") : (userData[key] || "")}
                          onChange={(e) => setTempUserData({ ...tempUserData, [key]: e.target.value })}
                          disabled={!isEditing || key === "email"}
                          className={`${inp} ${icon ? "pl-12" : ""}`} />
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name</label>
                    <input type="text"
                      value={isEditing ? (tempUserData.clinicName || "") : (userData.clinicName || "")}
                      onChange={(e) => setTempUserData({ ...tempUserData, clinicName: e.target.value })}
                      disabled={!isEditing} className={inp} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text"
                        value={isEditing ? (tempUserData.licenseNumber || "") : (userData.licenseNumber || "")}
                        onChange={(e) => setTempUserData({ ...tempUserData, licenseNumber: e.target.value })}
                        disabled={!isEditing} className={`${inp} pl-12`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                  <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>
                {ordersLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <button onClick={() => router.push("/")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-all">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div>
                            <p className="font-bold text-gray-900">{order.orderId || `#${order._id.slice(-8).toUpperCase()}`}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                            {order.orderStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {order.items[0]?.image
                              ? <img src={`${baseUrl.INVENTORY}${order.items[0].image}`} alt="" className="w-full h-full object-cover" />
                              : <Package className="w-7 h-7 text-gray-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                            <p className="text-xl font-bold text-blue-600">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-gray-400">{order.paymentDetails?.method} · {order.paymentDetails?.status}</p>
                          </div>
                          <button onClick={() => router.push("/orderhistory")}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex-shrink-0">
                            Details <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    {([
                      { label: "Current Password",     key: "currentPassword" as const, showKey: "current" as const },
                      { label: "New Password",         key: "newPassword"     as const, showKey: "new"     as const },
                      { label: "Confirm New Password", key: "confirmPassword" as const, showKey: "confirm" as const },
                    ]).map(({ label, key, showKey }) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                        <div className="relative">
                          <input type={showPwd[showKey] ? "text" : "password"}
                            value={passwords[key]}
                            onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                            className={`${inp} pr-12`}
                            placeholder={`Enter ${label.toLowerCase()}`} />
                          <button onClick={() => setShowPwd(p => ({ ...p, [showKey]: !p[showKey] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPwd[showKey] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={handleChangePassword} disabled={pwdLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60">
                      {pwdLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Password"}
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-3 max-w-md">
                    {[
                      { label: "Email Notifications", desc: "Order updates via email" },
                      { label: "SMS Notifications",   desc: "Order updates via SMS"   },
                      { label: "Promotional Emails",  desc: "Offers and deals"         },
                    ].map((pref) => (
                      <label key={pref.label}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{pref.label}</p>
                          <p className="text-xs text-gray-500">{pref.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-3">Danger Zone</h3>
                  <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50 max-w-md">
                    <p className="text-sm text-gray-600 mb-3">Once deleted, your account cannot be recovered.</p>
                    <button onClick={() => toast.error("Account deletion requires email confirmation.")}
                      className="px-5 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}