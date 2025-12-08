"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "email";
  const value = searchParams.get("value") || "";
  
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const maskedValue =
    method === "email"
      ? value
        ? `${value.slice(0, 3)}***${value.slice(value.indexOf("@"))}`
        : "your email"
      : value
      ? `${value.slice(0, 3)}***${value.slice(-3)}`
      : "your phone number";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code");
      return;
    }
    
    setIsVerifying(true);
    // TODO: Implement verification logic
    console.log("Verify code:", {
      method,
      value,
      code: verificationCode,
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      // Redirect to reset password page with token
      const params = new URLSearchParams();
      params.set("method", method);
      params.set("value", value);
      params.set("token", "verified_token_placeholder"); // In real app, this would come from API
      router.push(`/account/reset-password?${params.toString()}`);
    }, 1000);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    // TODO: Implement resend code logic
    console.log("Resend code to:", method, value);
    setTimeout(() => {
      setIsResending(false);
      alert(`Verification code has been resent to your ${method}`);
    }, 1000);
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
            <Link href="/account" className="hover:text-[#98C243] transition-colors">
              Sign In
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/account/forgot-password" className="hover:text-[#98C243] transition-colors">
              Forget Password
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Verify Code</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="section-wrapper">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your {method === "email" ? "Email" : "Phone"}
              </h1>
              
              {/* Instruction Text */}
              <p className="text-gray-600 mb-6">
                Enter the 6-digit verification code we sent to{" "}
                <span className="font-medium">{maskedValue}</span> to continue.
              </p>

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-5">
                {/* Verification Code Input */}
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Verification Code
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setVerificationCode(val);
                      }}
                      required
                      className="w-full text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-sm text-[#98C243] hover:text-[#7FA836] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the 6-digit code sent to {maskedValue}
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-3 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "VERIFY"}
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

