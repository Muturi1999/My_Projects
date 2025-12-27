"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrders } from "@/lib/hooks/use-orders";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS = [
  { id: "placed", label: "Order Placed" },
  { id: "packaging", label: "Packaging" },
  { id: "on-road", label: "On The Road" },
  { id: "delivered", label: "Delivered" },
] as const;

export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const params = await props.params;
  const { orders } = useOrders();

  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    // If no order found, show 404-style state
    return notFound();
  }

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.id === order.status
  );

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
            <Link
              href="/orders"
              className="hover:text-red-600 transition-colors"
            >
              Track Order
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Details</span>
          </div>
        </section>

        <section className="flex-1 py-8">
          <div className="section-wrapper">
            <div className="bg-white border border-gray-200 rounded-none p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {order.itemsCount} product
                    {order.itemsCount !== 1 ? "s" : ""} • Order placed on{" "}
                    {new Date(order.placedAt).toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Order total
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    KSh {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-600 mb-6">
                Order expected arrival{" "}
                {order.expectedDelivery
                  ? new Date(order.expectedDelivery).toLocaleDateString()
                  : ""}
              </p>

              {/* Multi-step status bar */}
              <div className="mb-6">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-red-100" />
                  {STATUS_STEPS.map((step, index) => {
                    const isActive =
                      currentStepIndex >= 0 && index <= currentStepIndex;
                    return (
                      <div
                        key={step.id}
                        className="relative flex flex-col items-center flex-1"
                      >
                        <div
                          className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 ${
                            isActive
                              ? "border-red-500 bg-red-500"
                              : "border-red-200 bg-white"
                          }`}
                        />
                        <p className="mt-3 text-[10px] sm:text-xs text-gray-700">
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Activity */}
              <div className="mt-4">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                  Order Activity
                </h2>
                <div className="space-y-3">
                  {order.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <div className="mt-0.5">
                        {activity.icon === "check" ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px]">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px]">
                            i
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-800">{activity.label}</p>
                        {activity.description && (
                          <p className="text-[11px] text-gray-600">
                            {activity.description}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


