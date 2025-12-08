"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    } else if (tab === "signin") {
      setActiveTab("signin");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    if (activeTab === "signin") {
      // Handle sign in with email or phone
      if (!emailOrPhone.trim()) {
        alert("Please enter your email address or phone number");
        return;
      }
      console.log("Sign in:", { emailOrPhone, password });
      // After successful sign in, redirect to dashboard
      // TODO: Store username in auth context/localStorage
      router.push("/account/dashboard");
    } else {
      // Handle sign up
      if (!agreeToTerms) {
        alert("Please agree to the Terms of Condition and Privacy Policy");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
      console.log("Sign up:", { name, email, phone, password });
      // After successful sign up, redirect to verification page
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (phone) params.set("phone", phone);
      router.push(`/account/verify?${params.toString()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="section-wrapper py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#98C243] transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/account" className="hover:text-[#98C243] transition-colors">
              User Account
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900 font-medium">
              {activeTab === "signin" ? "Sign In" : "Sign Up"}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="section-wrapper">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-3 text-center font-medium transition-colors relative ${
                    activeTab === "signin"
                      ? "text-[#98C243]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                  {activeTab === "signin" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#98C243]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-3 text-center font-medium transition-colors relative ${
                    activeTab === "signup"
                      ? "text-[#98C243]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                  {activeTab === "signup" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#98C243]" />
                  )}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name (Sign Up only) */}
                {activeTab === "signup" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                {/* Email or Phone (Sign In) / Email (Sign Up) */}
                {activeTab === "signin" ? (
                  <div>
                    <label
                      htmlFor="emailOrPhone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address or Phone Number
                    </label>
                    <Input
                      id="emailOrPhone"
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      className="w-full"
                      placeholder="Enter your email or phone number"
                    />
                  </div>
                ) : (
                  <>
                    {/* Email (Sign Up) */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Phone Number (Sign Up) */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                      placeholder={activeTab === "signup" ? "8+ characters" : "Enter your password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {activeTab === "signin" && (
                    <div className="flex justify-end mt-1">
                      <Link
                        href="/account/forgot-password"
                        className="text-sm text-[#98C243] hover:text-[#7FA836] transition-colors"
                      >
                        Forgot Password
                      </Link>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {activeTab === "signup" && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pr-10"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions (Sign Up only) */}
                {activeTab === "signup" && (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="data-[state=checked]:bg-[#98C243] data-[state=checked]:border-[#98C243] data-[state=checked]:text-white mt-0.5"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                    >
                      Are you agree to{" "}
                      <Link
                        href="/terms"
                        className="text-[#98C243] hover:text-[#7FA836] underline"
                      >
                        Clicon Terms of Condition
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-[#98C243] hover:text-[#7FA836] underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-3 flex items-center justify-center gap-2 font-medium"
                >
                  {activeTab === "signin" ? "SIGN IN" : "SIGN UP"}
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                {/* Google Sign Up/Login */}
                <button
                  type="button"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // TODO: Implement Google OAuth
                    console.log(activeTab === "signup" ? "Sign up with Google" : "Login with Google");
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {activeTab === "signup" ? "Sign up with Google" : "Login with Google"}
                  </span>
                </button>

                {/* Apple Sign Up (Sign Up only) */}
                {activeTab === "signup" && (
                  <button
                    type="button"
                    className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // TODO: Implement Apple OAuth
                      console.log("Sign up with Apple");
                    }}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zm-3.95-18.4c.27 1.16-.08 2.53-.98 3.64-.79 1.07-2.12 1.78-3.35 1.65-.31-1.14.13-2.36.9-3.27.88-.95 2.25-1.48 3.43-1.02z" />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      Sign up with Apple
                    </span>
                  </button>
                )}

                {/* Facebook Sign Up/Login */}
                <button
                  type="button"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // TODO: Implement Facebook OAuth
                    console.log(activeTab === "signup" ? "Sign up with Facebook" : "Login with Facebook");
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {activeTab === "signup" ? "Sign up with Facebook" : "Login with Facebook"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

