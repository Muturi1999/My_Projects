"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  type Product,
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  categorySubcategoryProducts,
} from "@/lib/data/products";
import { categoryProducts } from "@/lib/data/categoryProducts";
import { useCart } from "@/lib/hooks/use-cart";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const categoryProductsList: Product[] = Object.values(categoryProducts).flat();
const categorySubcategoryList: Product[] = Object.values(
  categorySubcategoryProducts
).flatMap((group) => Object.values(group).flat());

const allCatalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
  ...categoryProductsList,
  ...categorySubcategoryList,
];

type ShippingMethod = "nairobi" | "near-nairobi" | "outside-nairobi" | "pickup";
type PaymentMethod = "mpesa" | "card" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems, clear: clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");
  const [apartment, setApartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("nairobi");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [notes, setNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingAdjustment, setShippingAdjustment] = useState(0);

  const buyNowProductId = searchParams.get("productId");

  const lines = useMemo(() => {
    const productMap = new Map(allCatalogProducts.map((p) => [p.id, p]));

    // Buy Now: single item checkout only
    if (buyNowProductId) {
      const product = productMap.get(buyNowProductId);
      if (product) {
        return [{ product, quantity: 1 }];
      }
      // If buy-now productId is unknown, fall back to cart contents
      // (or show empty if cart is empty)
    }

    // Default: use full cart
    return cartItems
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter(Boolean) as { product: Product; quantity: number }[];
  }, [buyNowProductId, cartItems]);

  const baseShipping = useMemo(() => {
    switch (shippingMethod) {
      case "nairobi":
        return 0;
      case "near-nairobi":
        return 400;
      case "outside-nairobi":
        return 600;
      case "pickup":
      default:
        return 0;
    }
  }, [shippingMethod]);

  const shippingCost = Math.max(0, baseShipping + shippingAdjustment);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0
    );
    const discount = 0;
    const tax = 0;
    const total = subtotal + shippingCost - discount + tax;
    return { subtotal, shipping: shippingCost, discount, tax, total };
  }, [lines, shippingCost]);

  const handlePlaceOrder = () => {
    if (!acceptTerms || lines.length === 0) return;

    // In a real app this would call your backend checkout API.
    // For now we just simulate success and clear the cart for cart-based orders.
    if (!buyNowProductId) {
      clearCart();
    }
    setOrderPlaced(true);
  };

  // After successful order, optionally redirect after a short delay
  useEffect(() => {
    if (orderPlaced) {
      const id = window.setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => window.clearTimeout(id);
    }
  }, [orderPlaced, router]);

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
              href="/cart"
              className="hover:text-red-600 transition-colors"
            >
              Shopping Cart
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </section>

        {/* Checkout content */}
        <section className="py-6 sm:py-10 bg-white flex-1">
          <div className="section-wrapper grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8">
            {/* Left: Billing, Shipping, Payment, Notes */}
            <div className="space-y-6">
              {/* Billing information */}
              <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
                  Billing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      County
                    </label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Select..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      Town
                    </label>
                    <input
                      type="text"
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Select..."
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                    Apartment, building, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="+254..."
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                  Shipping
                </h2>
                <div className="space-y-2 text-xs sm:text-sm">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-0.5"
                      checked={shippingMethod === "nairobi"}
                      onChange={() => setShippingMethod("nairobi")}
                    />
                    <span>
                      Delivery within Nairobi CBD{" "}
                      <span className="font-semibold">Free</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-0.5"
                      checked={shippingMethod === "near-nairobi"}
                      onChange={() => setShippingMethod("near-nairobi")}
                    />
                    <span>
                      Delivery within Nairobi County{" "}
                      <span className="font-semibold">KSh 400</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-0.5"
                      checked={shippingMethod === "outside-nairobi"}
                      onChange={() => setShippingMethod("outside-nairobi")}
                    />
                    <span>
                      Delivery outside Nairobi starting from{" "}
                      <span className="font-semibold">KSh 600</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-0.5"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                    />
                    <span>
                      Pickup from Store: The Bazaar, Moi Avenue, 4th Floor Shop
                      No. 1024
                    </span>
                  </label>
                  {/* Adjustable shipping fee */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs text-gray-600">
                      Adjust shipping fee:
                    </span>
                    <div className="inline-flex items-center border border-gray-300 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setShippingAdjustment((prev) => {
                            const next = prev - 50;
                            return baseShipping + next < 0
                              ? -baseShipping
                              : next;
                          })
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                        aria-label="Decrease shipping fee"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        className="px-3 py-1 border-x border-gray-300 text-xs sm:text-sm min-w-[4.5rem] text-center outline-none"
                        value={shippingCost}
                        min={0}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = Number(raw);
                          if (Number.isNaN(parsed)) {
                            setShippingAdjustment(-baseShipping);
                            return;
                          }
                          const safe = Math.max(0, parsed);
                          setShippingAdjustment(safe - baseShipping);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShippingAdjustment((prev) => prev + 50)
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                        aria-label="Increase shipping fee"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment option */}
              <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                  Payment Option
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`border px-4 py-3 rounded-none text-left flex items-center gap-2 ${
                      paymentMethod === "mpesa"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-green-600/40 text-green-700 hover:bg-green-50/50"
                    }`}
                  >
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white">
                      <img
                        src="https://img.icons8.com/color/48/mpesa.png"
                        alt="M-PESA"
                        className="h-5 w-5"
                      />
                    </span>
                    <span className="font-semibold">Pay now using M-PESA PayBill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`border px-4 py-3 rounded-none text-left ${
                      paymentMethod === "card"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold">Pay now using Debit or Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`border px-4 py-3 rounded-none text-left ${
                      paymentMethod === "cod"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold">
                      Pay on Delivery using M-PESA or Cash
                    </span>
                  </button>
                </div>
              </div>

              {/* Additional information */}
              <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                  Additional Information
                </h2>
                <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </div>
            </div>

            {/* Right: Order summary */}
            <aside className="space-y-6">
              <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {lines.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No items to checkout. Please add items to your cart.
                  </p>
                ) : (
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                    {lines.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 text-xs sm:text-sm"
                      >
                        <div className="relative w-10 h-10 border border-gray-200 bg-white flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Qty: {quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            KSh{" "}
                            {(
                              product.price * quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="divide-y divide-gray-200 text-xs sm:text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Sub-total</span>
                    <span className="font-medium text-gray-900">
                      KSh {totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {totals.shipping === 0
                        ? "Free"
                        : `KSh ${totals.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-gray-900">
                      {totals.discount > 0
                        ? `KSh ${totals.discount.toLocaleString()}`
                        : "KSh 0"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">
                      {totals.tax > 0
                        ? `KSh ${totals.tax.toLocaleString()}`
                        : "KSh 0"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 text-sm sm:text-base font-semibold">
                    <span>Total</span>
                    <span className="text-gray-900">
                      KSh {totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coupon input */}
                <div className="mt-4">
                  <label className="block text-[11px] sm:text-xs text-gray-600 mb-1">
                    Enter Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="flex-1 border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-[11px] sm:text-xs font-semibold border border-red-500 text-red-600 hover:bg-red-50 rounded-none"
                    >
                      APPLY CODE
                    </button>
                  </div>
                </div>

                {/* Terms & conditions */}
                <label className="mt-4 flex items-start gap-2 text-[11px] sm:text-xs text-gray-600">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>
                    I have read and agree to this website{" "}
                    <Link
                      href="/terms"
                      className="text-red-600 hover:text-red-700 underline"
                    >
                      terms and conditions
                    </Link>
                    .
                  </span>
                </label>

                {/* Place order */}
                <button
                  type="button"
                  disabled={!acceptTerms || lines.length === 0}
                  onClick={handlePlaceOrder}
                  className="mt-3 w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm sm:text-base font-semibold py-3 rounded-none"
                >
                  {orderPlaced ? "ORDER PLACED" : "PLACE ORDER"}
                </button>

                {orderPlaced && (
                  <p className="mt-3 text-xs sm:text-sm text-green-600">
                    Thank you! Your order has been placed. Redirecting to home...
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


