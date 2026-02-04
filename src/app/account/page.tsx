"use client";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import {
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  ChevronRight,
  Star,
  Truck,
  CheckCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRouter } from "next/navigation";
import baseUrl from "../baseUrl";
import axios from "axios";

interface AccountPageProps {
  cartCount: number;
  onBackToHome: () => void;
  onCartClick?: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  onBrandClick?: () => void;
  onBuyingGuideClick?: () => void;
  onEventsClick?: () => void;
  onMembershipClick?: () => void;
  onFreebiesClick?: () => void;
  onBestSellerClick?: () => void;
  onClinicSetupClick?: () => void;
  favoritesCount?: number;
}

type TabType =
  | "profile"
  | "orders"
  | "addresses"
  | "payment"
  | "wishlist"
  | "settings";

export default function AccountPage({
  cartCount,
  onBackToHome,
  onCartClick,
  onFavoritesClick,
  onOrdersClick,
  onBrandClick,
  onBuyingGuideClick,
  onEventsClick,
  onMembershipClick,
  onFreebiesClick,
  onBestSellerClick,
  onClinicSetupClick,
  favoritesCount,
}: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [tempUserData, setTempUserData] = useState<any>(null);

  // Sample Orders Data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      total: 12499,
      status: "delivered",
      items: 3,
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200",
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-20",
      total: 8999,
      status: "shipped",
      items: 2,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-25",
      total: 4599,
      status: "processing",
      items: 1,
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200",
    },
  ];

  // Sample Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Clinic",
      name: "Smile Care Dental Clinic",
      address: "123 MG Road, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: 2,
      type: "Home",
      name: "Dr. Rajesh Kumar",
      address: "456 Koramangala, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ]);

  // Sample Payment Methods
  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      last4: "4532",
      brand: "Visa",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "UPI",
      upiId: "rajesh@okaxis",
      isDefault: false,
    },
  ];

  // Sample Wishlist Items
  const wishlistItems = [
    {
      id: 1,
      name: "Dental Impression Tray Kit",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200",
      inStock: true,
    },
    {
      id: 2,
      name: "LED Dental Curing Light",
      price: 4599,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200",
      inStock: true,
    },
    {
      id: 3,
      name: "Ultrasonic Scaler",
      price: 8999,
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200",
      inStock: false,
    },
  ];

  const handleSaveProfile = () => {
    setUserData(tempUserData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setTempUserData(userData);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${baseUrl.AUTH}/api/v1/ecommerceuser/getProfile`,
          { withCredentials: true }, // 🔥 REQUIRED
        );

        setUserData(res.data.data);
        setTempUserData(res.data.data);
      } catch (error: any) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${baseUrl.AUTH}/api/v1/ecommerceuser/logout`,
        {},
        { withCredentials: true }, // 🔐 REQUIRED
      );

      // Clear client-side user data
      localStorage.removeItem("user");

      toast.success("Logged out successfully 👋");

      router.push("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <Navigation currentPage="account" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl font-bold border-4 border-white shadow-2xl">
              {userData?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userData?.name}!
              </h1>
              <p className="text-pink-100 text-lg">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all
                        ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{tab.label}</span>
                    </button>
                  );
                })}

                <hr className="my-2" />

                <button
                  onClick={() => {
                    handleLogout();
                    toast.success("Logged out successfully!");
                    setTimeout(() => router.push("/"), 1000);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={
                        isEditing ? tempUserData?.firstName : userData?.name
                      }
                      onChange={(e) =>
                        setTempUserData({
                          ...tempUserData,
                          firstName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={isEditing ? tempUserData?.email : userData?.email}
                        onChange={(e) =>
                          setTempUserData({
                            ...tempUserData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={isEditing ? tempUserData?.phone : userData?.phoneNumber}
                        onChange={(e) =>
                          setTempUserData({
                            ...tempUserData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={
                          isEditing
                            ? tempUserData.dateOfBirth
                            : userData.dateOfBirth
                        }
                        onChange={(e) =>
                          setTempUserData({
                            ...tempUserData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={
                        isEditing
                          ? tempUserData.specialization
                          : userData.specialization
                      }
                      onChange={(e) =>
                        setTempUserData({
                          ...tempUserData,
                          specialization: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      value={
                        isEditing
                          ? tempUserData.clinicName
                          : userData.clinicName
                      }
                      onChange={(e) =>
                        setTempUserData({
                          ...tempUserData,
                          clinicName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      License Number
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={
                          isEditing
                            ? tempUserData.licenseNumber
                            : userData.licenseNumber
                        }
                        onChange={(e) =>
                          setTempUserData({
                            ...tempUserData,
                            licenseNumber: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Orders
                  </h2>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-600 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg text-gray-900">
                              {order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              Ordered on{" "}
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <ImageWithFallback
                            src={order.image}
                            alt="Order item"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-gray-700">
                              {order.items} item{order.items > 1 ? "s" : ""}
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{order.total.toLocaleString()}
                            </p>
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() =>
                        toast.success("Add address feature coming soon!")
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                    >
                      + Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-xl p-4 relative ${address.isDefault ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                      >
                        {address.isDefault && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Default
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {address.type}
                            </p>
                            <p className="font-semibold text-gray-800 mt-1">
                              {address.name}
                            </p>
                            <p className="text-gray-600 text-sm mt-2">
                              {address.address}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.state} -{" "}
                              {address.pincode}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              Phone: {address.phone}
                            </p>

                            <div className="flex gap-2 mt-4">
                              <button className="text-blue-600 text-sm font-semibold hover:underline">
                                Edit
                              </button>
                              <button className="text-red-600 text-sm font-semibold hover:underline">
                                Delete
                              </button>
                              {!address.isDefault && (
                                <button className="text-green-600 text-sm font-semibold hover:underline">
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Methods
                    </h2>
                    <button
                      onClick={() =>
                        toast.success("Add payment method coming soon!")
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                    >
                      + Add Payment Method
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-xl p-4 relative ${method.isDefault ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                      >
                        {method.isDefault && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Default
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {method.type}
                            </p>
                            {method.type === "Credit Card" ? (
                              <>
                                <p className="text-gray-600 text-sm">
                                  •••• •••• •••• {method.last4}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {method.brand} - Expires {method.expiry}
                                </p>
                              </>
                            ) : (
                              <p className="text-gray-600 text-sm">
                                {method.upiId}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-600 text-sm font-semibold hover:underline">
                              Edit
                            </button>
                            <button className="text-red-600 text-sm font-semibold hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Wishlist
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-600 transition-all"
                      >
                        <div className="flex gap-4">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <p className="text-2xl font-bold text-blue-600 mb-2">
                              ₹{item.price}
                            </p>
                            {item.inStock ? (
                              <span className="text-green-600 text-sm font-semibold">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-red-600 text-sm font-semibold">
                                Out of Stock
                              </span>
                            )}
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                                Add to Cart
                              </button>
                              <button className="px-3 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Account Settings
                  </h2>

                  {/* Change Password */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            placeholder="Enter current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button
                        onClick={() =>
                          toast.success("Password updated successfully!")
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: "email",
                          label: "Email Notifications",
                          desc: "Receive order updates via email",
                        },
                        {
                          id: "sms",
                          label: "SMS Notifications",
                          desc: "Receive order updates via SMS",
                        },
                        {
                          id: "promo",
                          label: "Promotional Emails",
                          desc: "Receive promotional offers and deals",
                        },
                        {
                          id: "newsletter",
                          label: "Newsletter",
                          desc: "Stay updated with latest products",
                        },
                      ].map((pref) => (
                        <label
                          key={pref.id}
                          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 cursor-pointer transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <Bell className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {pref.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {pref.desc}
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 text-blue-600"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div>
                    <h3 className="text-lg font-bold text-red-600 mb-4">
                      Danger Zone
                    </h3>
                    <div className="border-2 border-red-300 rounded-xl p-4 bg-red-50">
                      <p className="text-gray-700 mb-3">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={() =>
                          toast.error(
                            "Account deletion requires confirmation via email.",
                          )
                        }
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                      >
                        Delete Account
                      </button>
                    </div>
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
