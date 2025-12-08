"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function ResetPasswordSuccessPage() {
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
            <span className="text-gray-900 font-medium">Password Reset Success</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="section-wrapper">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircleIcon className="h-16 w-16 text-green-600" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset Successful!
              </h1>
              
              {/* Success Message */}
              <p className="text-gray-600 mb-8">
                Your password has been successfully reset. You can now log in with your new password.
              </p>

              {/* Login Button */}
              <Link href="/account?tab=signin">
                <Button className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-3 flex items-center justify-center gap-2 font-medium">
                  Go to Login
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </Link>

              {/* Additional Info */}
              <p className="text-sm text-gray-500 mt-6">
                Didn&apos;t reset your password?{" "}
                <Link
                  href="/account/forgot-password"
                  className="text-[#98C243] hover:text-[#7FA836] font-medium"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

