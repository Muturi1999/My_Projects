"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
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
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/lib/hooks/use-cart";

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

export default function CartPage() {
  const router = useRouter();
  const { items, setQuantity, remove, clear } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const lines = useMemo(() => {
    const productMap = new Map(allCatalogProducts.map((p) => [p.id, p]));
    return items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as { product: Product; quantity: number }[];
  }, [items]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0
    );
    // Placeholder calculations – can be wired to real backend later
    const shipping = subtotal > 0 ? 0 : 0;
    const discount = 0;
    const tax = 0;
    const total = subtotal + shipping - discount + tax;
    return { subtotal, shipping, discount, tax, total };
  }, [lines]);

  const handleDecrease = (productId: string, currentQty: number) => {
    if (currentQty <= 1) {
      remove(productId);
    } else {
      setQuantity(productId, currentQty - 1);
    }
  };

  const handleIncrease = (productId: string, currentQty: number) => {
    setQuantity(productId, currentQty + 1);
  };

  const handleClearCart = () => {
    clear();
  };

  const totalPages = Math.max(1, Math.ceil(lines.length / ITEMS_PER_PAGE));

  // Keep currentPage in valid range when cart size changes
  useEffect(() => {
    setCurrentPage((prev) => {
      if (lines.length === 0) return 1;
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [lines.length, totalPages]);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Breadcrumb / top bar */}
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </div>
        </section>

        {/* Cart content */}
        <section className="py-6 sm:py-10 bg-white flex-1">
          <div className="section-wrapper grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8">
            {/* Left: Cart table */}
            <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Shopping Cart
            </h1>

            {lines.length === 0 ? (
              <div className="bg-white border border-gray-200 p-6 sm:p-8 text-center rounded-none">
                <p className="text-gray-700 mb-3">
                  Your cart is currently empty.
                </p>
                <Link
                  href="/"
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Return to shop →
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-none overflow-x-auto mb-4">
                <table className="w-full min-w-[720px] text-xs sm:text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Products
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Sub-total
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines
                      .slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE
                      )
                      .map(({ product, quantity }) => {
                      const lineTotal = product.price * quantity;
                      return (
                        <tr
                          key={product.id}
                          className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {/* Product */}
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => router.push(`/product/${product.id}`)}
                              className="w-full flex items-center gap-3 text-left"
                            >
                              <div className="relative w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 bg-white flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1.5"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 line-clamp-2">
                                  {product.name}
                                </p>
                                <p className="text-[11px] sm:text-xs text-gray-500">
                                  {product.category}
                                  {product.brand &&
                                    ` • ${product.brand.toUpperCase()}`}
                                </p>
                              </div>
                            </button>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                KSh {product.price.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-gray-500 line-through">
                                KSh {product.originalPrice.toLocaleString()}
                              </span>
                            </div>
                          </td>

                          {/* Quantity controls */}
                          <td className="px-4 py-3 align-top">
                            <div className="inline-flex items-center border border-gray-300 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecrease(product.id, quantity)
                                }
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 text-xs sm:text-sm min-w-[2rem] text-center">
                                {quantity.toString().padStart(2, "0")}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrease(product.id, quantity)
                                }
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </td>

                          {/* Line subtotal */}
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-gray-900">
                              KSh {lineTotal.toLocaleString()}
                            </span>
                          </td>

                          {/* Remove */}
                          <td className="px-4 py-3 align-top">
                            <button
                              type="button"
                              onClick={() => remove(product.id)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                              aria-label="Remove from cart"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {lines.length > 0 && (
              <div className="flex flex-wrap justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-none"
                >
                  RETURN TO SHOP
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-none"
                >
                  UPDATE CART
                </button>
              </div>
            )}
            {/* Pagination */}
            {lines.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-xs border rounded-none ${
                        currentPage === page
                          ? "bg-red-600 text-white border-red-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.ceil(lines.length / ITEMS_PER_PAGE),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(lines.length / ITEMS_PER_PAGE)
                  }
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
            </div>

            {/* Right: Cart totals / coupon */}
            <aside className="space-y-6">
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
                Cart Totals
              </h2>
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
                    {totals.shipping === 0 ? "Free" : `KSh ${totals.shipping.toLocaleString()}`}
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

              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() => {
                  if (lines.length === 0) return;
                  router.push("/checkout");
                }}
                className="mt-4 w-full inline-flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm sm:text-base font-semibold py-3 rounded-none"
              >
                PROCEED TO CHECKOUT
              </button>

              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="mt-3 w-full inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-600"
                >
                  Clear cart
                </button>
              )}
            </div>

            {/* Coupon section */}
            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-none">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Coupon Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 px-3 py-2 text-xs sm:text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-none"
                >
                  APPLY COUPON
                </button>
              </div>
            </div>
            </aside>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


