'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

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
  Truck,
  CheckCircle
} from 'lucide-react';

import { toast, Toaster } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

type TabType =
  | 'profile'
  | 'orders'
  | 'addresses'
  | 'payment'
  | 'wishlist'
  | 'settings';

export default function AccountPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cartCount = 2;
  const favoritesCount = 5;

  // ---------------- USER DATA ----------------
  const [userData, setUserData] = useState({
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@dentalclinic.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1985-06-15',
    clinicName: 'Smile Care Dental Clinic',
    licenseNumber: 'DCI-12345-2010',
    specialization: 'General Dentistry'
  });

  const [tempUserData, setTempUserData] = useState(userData);

  // ---------------- HELPERS ----------------
  const handleSaveProfile = () => {
    setUserData(tempUserData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setTimeout(() => router.push('/'), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // ---------------- TABS ----------------
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <Header
        cartCount={cartCount}
        favoritesCount={favoritesCount}
        onLogoClick={() => router.push('/')}
        onCartClick={() => router.push('/cart')}
        onFavoritesClick={() => router.push('/wishlist')}
        onOrdersClick={() => router.push('/orders')}
      />

      {/* NAVIGATION */}
      <Navigation currentPage="account" />

      {/* PAGE CONTENT (your existing JSX stays SAME) */}

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-600"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      <Footer />
    </div>
  );
}
