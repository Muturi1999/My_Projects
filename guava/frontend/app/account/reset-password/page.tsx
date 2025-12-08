"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "email";
  const value = searchParams.get("value") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsResetting(true);
    // TODO: Implement reset password logic
    console.log("Reset password:", {
      method,
      value,
      password,
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsResetting(false);
      // Redirect to success page
      router.push("/account/reset-password/success");
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
            <span className="text-gray-900 font-medium">Reset Password</span>
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
                Reset Password
              </h1>
              
              {/* Instruction Text */}
              <p className="text-gray-600 mb-6">
                Create a new password to secure your account. Ensure it&apos;s something strong and easy for you to remember.
              </p>

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-5">
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
                      placeholder="8+ characters"
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
                </div>

                {/* Confirm Password */}
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

                {/* Reset Password Button */}
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-3 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? "Resetting..." : "RESET PASSWORD"}
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

