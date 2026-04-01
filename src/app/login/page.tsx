"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import baseUrl from "../baseUrl";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  const hasAutoLoggedIn = useRef(false);

  // ✅ SUPPORT BOTH PARAM NAMES
  const accessToken =
    searchParams.get("accessToken") || searchParams.get("clinicToken")|| searchParams.get("doctorToken");
  const clinicId = searchParams.get("clinicId"); // ✅ read clinicId from URL
  const doctorId = searchParams.get("doctorId");

  // ✅ AUTO LOGIN FROM CLINIC
useEffect(() => {
  if (!accessToken) return;
  if (hasAutoLoggedIn.current) return;

  hasAutoLoggedIn.current = true;

  const autoLogin = async () => {
  try {
    setIsAutoLoggingIn(true);
    setIsSubmitting(true);

    console.log("SSO token received:", accessToken);

    let endpoint = `${baseUrl.AUTH}/api/v1/ecommerceuser/`;

    if (clinicId) {
      endpoint += "clinic-marketplace-login";
    } else if (doctorId) {
      endpoint += "doctor-marketplace-login";
    } else {
      toast.error("Invalid login parameters");
      setIsAutoLoggingIn(false);
      setIsSubmitting(false);
      return;
    }

    const response = await axios.post(
      endpoint,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ✅ FIXED STORAGE
    if (clinicId) {
      localStorage.setItem("clinicToken", accessToken);
      localStorage.setItem("clinicId", clinicId);
    }

    if (doctorId) {
      localStorage.setItem("clinicToken", accessToken);
      localStorage.setItem("doctorId", doctorId);
    }

    const userType = clinicId ? "Clinic" : "Doctor";
    toast.success(`🎉 Logged in via ${userType} successfully!`);

    window.history.replaceState({}, document.title, "/");

    setTimeout(() => {
      router.replace("/");
    }, 800);

  } catch (error) {
    console.error("Auto login failed:", error);

    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Auto login failed");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }

    // ✅ cleanup
    localStorage.removeItem("clinicToken");
    localStorage.removeItem("clinicId");
    localStorage.removeItem("doctorId");

    setIsAutoLoggingIn(false);
    setIsSubmitting(false);
  }
};

  autoLogin();
}, [accessToken, clinicId, doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ MANUAL LOGIN — clear any clinic session on normal user login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAutoLoggingIn) return;

    if (!formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${baseUrl.AUTH}/api/v1/ecommerceuser/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const token = response.data?.token;

      if (token) {
        Cookies.set("accessToken", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/"
        });
      }

      // ✅ Clear any leftover clinic session
      localStorage.removeItem("clinicToken");
      localStorage.removeItem("clinicId");

      toast.success("🎉 Login successful!");

      setTimeout(() => router.replace("/"), 800);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navigation currentPage="login" />

      <div className="bg-gradient-to-r from-blue-50 to-white py-12 mt-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isAutoLoggingIn ? "Logging you in..." : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isAutoLoggingIn
              ? "Authenticating with Clinic account..."
              : "Log in to continue"}
          </p>
        </div>
      </div>

      {!isAutoLoggingIn && (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl text-black font-bold text-center mb-8">
              User <span className="text-blue-600">Login</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full text-black border-2 rounded-lg p-3"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full text-black border-2 rounded-lg p-3"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Create an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}