"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrders } from "@/lib/hooks/use-orders";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">My Orders</span>
          </div>
        </section>

        <section className="flex-1 py-8">
          <div className="section-wrapper">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4">
              Order History
            </h1>

            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 p-6 text-center text-sm text-gray-600">
                You don&apos;t have any orders yet. Once you place an order, it will
                appear here for tracking.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-500 border-b border-gray-200">
                  <span>Order</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="flex flex-col md:grid md:grid-cols-[2fr,1fr,1fr,1fr] gap-2 md:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 text-xs sm:text-sm text-gray-800"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          {order.itemsCount} product
                          {order.itemsCount !== 1 ? "s" : ""} placed on{" "}
                          {new Date(order.placedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="md:text-left text-gray-600">
                        {new Date(order.placedAt).toLocaleDateString()}
                      </div>
                      <div className="md:text-left">
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          {order.status === "placed"
                            ? "Order Placed"
                            : order.status === "packaging"
                            ? "Packaging"
                            : order.status === "on-road"
                            ? "On the Road"
                            : "Delivered"}
                        </span>
                      </div>
                      <div className="md:text-right font-semibold text-gray-900">
                        KSh {order.total.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


