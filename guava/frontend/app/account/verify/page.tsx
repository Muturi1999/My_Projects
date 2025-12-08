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
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">(
    email ? "email" : phone ? "phone" : "email"
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code");
      return;
    }
    // TODO: Implement verification logic
    console.log("Verify:", {
      method: verificationMethod,
      code: verificationCode,
      email: verificationMethod === "email" ? email : undefined,
      phone: verificationMethod === "phone" ? phone : undefined,
    });
    // After successful verification, redirect to dashboard
    // TODO: Store username in auth context/localStorage
    router.push("/account/dashboard");
  };

  const handleResendCode = async () => {
    setIsResending(true);
    // TODO: Implement resend code logic
    console.log("Resend code to:", verificationMethod === "email" ? email : phone);
    setTimeout(() => {
      setIsResending(false);
      alert(`Verification code has been resent to your ${verificationMethod}`);
    }, 1000);
  };

  const verificationTarget = verificationMethod === "email" ? email : phone;
  const maskedTarget = verificationMethod === "email"
    ? email
      ? `${email.slice(0, 3)}***${email.slice(email.indexOf("@"))}`
      : "your email"
    : phone
    ? `${phone.slice(0, 3)}***${phone.slice(-3)}`
    : "your phone number";

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
              Sign Up
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900 font-medium">
              {verificationMethod === "email" ? "Email" : "Phone"} Verification
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
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your {verificationMethod === "email" ? "Email Address" : "Phone Number"}
              </h1>
              
              {/* Instruction Text */}
              <p className="text-gray-600 mb-6">
                Enter the 6-digit verification code we sent to{" "}
                <span className="font-medium">{maskedTarget}</span> to continue.
              </p>

              {/* Verification Method Selection (if both email and phone are available) */}
              {email && phone && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Verify using:
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("email")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-colors ${
                        verificationMethod === "email"
                          ? "border-[#98C243] bg-[#F0F9E8] text-[#7FA836]"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                      <span className="font-medium">Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("phone")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-colors ${
                        verificationMethod === "phone"
                          ? "border-[#98C243] bg-[#F0F9E8] text-[#7FA836]"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <PhoneIcon className="h-5 w-5" />
                      <span className="font-medium">Phone</span>
                    </button>
                  </div>
                </div>
              )}

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
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setVerificationCode(value);
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
                    Enter the 6-digit code sent to {maskedTarget}
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-3 flex items-center justify-center gap-2 font-medium"
                >
                  VERIFY ME
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

