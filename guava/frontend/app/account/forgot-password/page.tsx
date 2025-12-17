"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      alert(`Please enter your ${method === "email" ? "email address" : "phone number"}`);
      return;
    }
    
    setIsSending(true);
    // TODO: Implement send code logic
    console.log("Send verification code to:", method, emailOrPhone);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      // Redirect to verification page with the method and value
      const params = new URLSearchParams();
      params.set("method", method);
      params.set("value", emailOrPhone);
      router.push(`/account/forgot-password/verify?${params.toString()}`);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="section-wrapper py-2 sm:py-3">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-[#98C243] transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link href="/account" className="hover:text-[#98C243] transition-colors">
              User Account
            </Link>
            <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link href="/account" className="hover:text-[#98C243] transition-colors">
              Sign In
            </Link>
            <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-gray-900 font-medium">Forget Password</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6">
        <div className="section-wrapper">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Forget Password
              </h1>
              
              {/* Instruction Text */}
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Enter the email address or mobile phone number associated with your Guavastores account.
              </p>

              {/* Method Selection (Radio Buttons) */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Select verification method:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={method === "email"}
                      onChange={() => setMethod("email")}
                      className="w-4 h-4 text-[#98C243] focus:ring-[#98C243] focus:ring-2 flex-shrink-0"
                    />
                    <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Email Address</span>
                  </label>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="phone"
                      checked={method === "phone"}
                      onChange={() => setMethod("phone")}
                      className="w-4 h-4 text-[#98C243] focus:ring-[#98C243] focus:ring-2 flex-shrink-0"
                    />
                    <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Phone Number</span>
                  </label>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSendCode} className="space-y-4 sm:space-y-5">
                {/* Email or Phone Input */}
                <div>
                  <label
                    htmlFor="emailOrPhone"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    {method === "email" ? "Email Address" : "Phone Number"}
                  </label>
                  <Input
                    id="emailOrPhone"
                    type={method === "email" ? "email" : "tel"}
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm"
                    placeholder={
                      method === "email"
                        ? "Enter your email address"
                        : "Enter your phone number"
                    }
                  />
                </div>

                {/* Send Code Button */}
                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-2.5 sm:py-3 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                >
                  {isSending ? "Sending..." : "SEND CODE"}
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </form>

              {/* Account Links */}
              <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm text-center">
                <p className="text-gray-600">
                  Already have account?{" "}
                  <Link
                    href="/account"
                    className="text-[#98C243] hover:text-[#7FA836] font-medium"
                  >
                    Sign In
                  </Link>
                </p>
                <p className="text-gray-600">
                  Don&apos;t have account?{" "}
                  <Link
                    href="/account"
                    className="text-[#98C243] hover:text-[#7FA836] font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      // Switch to sign up tab - you might want to pass a query param
                      router.push("/account?tab=signup");
                    }}
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Support Text */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  You may contact{" "}
                  <Link
                    href="/contact"
                    className="text-[#98C243] hover:text-[#7FA836] font-medium"
                  >
                    Customer Service
                  </Link>{" "}
                  for help restoring access to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

