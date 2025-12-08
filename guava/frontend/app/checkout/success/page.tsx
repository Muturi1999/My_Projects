"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="hover:text-red-600 transition-colors">
              Shopping Cart
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </section>

        {/* Success content */}
        <section className="flex-1 flex items-center justify-center py-10 sm:py-16">
          <div className="section-wrapper flex flex-col items-center text-center">
            {/* Success icon */}
            <div className="mb-6 flex items-center justify-center">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12.75L11.25 15L15 9.75"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text */}
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
              Your order is successfully placed
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-gray-600 mb-8">
              Your order has been processed and is now on its way. You can review
              the details in your dashboard or view this specific order anytime.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-none border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Go to dashboard
              </Link>
              <Link
                href={orderId ? `/orders/${orderId}` : "/orders"}
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-none bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                View order
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


