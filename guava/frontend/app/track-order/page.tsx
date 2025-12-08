"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrders } from "@/lib/hooks/use-orders";

export default function TrackOrderPage() {
  const router = useRouter();
  const { orders } = useOrders();

  const [orderIdInput, setOrderIdInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = orderIdInput.trim();
    if (!raw) {
      setError("Please enter your Order ID.");
      return;
    }

    // First try matching by human order number (e.g. #96459761 or 96459761)
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    let match =
      orders.find((o) => o.orderNumber === normalized) ??
      orders.find((o) => o.orderNumber.replace("#", "") === raw);

    // Fallback: allow direct internal id lookup
    if (!match) {
      match = orders.find((o) => o.id === raw);
    }

    if (!match) {
      setError("We could not find an order with that ID. Please check and try again.");
      return;
    }

    setError(null);
    router.push(`/orders/${match.id}`);
  };

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
            <span className="text-gray-900 font-medium">Track Order</span>
          </div>
        </section>

        {/* Track Order content */}
        <section className="flex-1 py-10 sm:py-14">
          <div className="section-wrapper max-w-5xl">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
              Track Order
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-2xl">
              To track your order please enter your order ID in the input field below
              and press the &quot;Track Order&quot; button. This was given to you on your
              receipt and in the confirmation email you should have received.
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 px-4 sm:px-6 py-5 sm:py-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    placeholder="ID..."
                    className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Email address"
                    className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <p className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 mb-4">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px]">
                  i
                </span>
                Order ID that we sent to you in your email address.
              </p>

              {error && (
                <p className="text-[11px] sm:text-xs text-red-600 mb-3">{error}</p>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-none bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Track Order
                <span className="ml-2 text-base leading-none">→</span>
              </button>
            </form>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


