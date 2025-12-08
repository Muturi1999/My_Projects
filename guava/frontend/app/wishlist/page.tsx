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
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/lib/hooks/use-wishlist";

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

export default function WishlistPage() {
  const { ids: wishlistIds, remove } = useWishlist();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const wishlistProducts = useMemo(() => {
    const map = new Map(allCatalogProducts.map((p) => [p.id, p]));
    return wishlistIds
      .map((id) => map.get(id))
      .filter(Boolean) as Product[];
  }, [wishlistIds]);

  const totalPages = Math.max(
    1,
    Math.ceil(wishlistProducts.length / ITEMS_PER_PAGE)
  );

  // Keep currentPage in valid range when list size changes
  useEffect(() => {
    setCurrentPage((prev) => {
      if (wishlistProducts.length === 0) return 1;
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [wishlistProducts.length, totalPages]);

  const handleRemove = (productId: string) => {
    remove(productId);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Breadcrumb / page header */}
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-red-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
        </section>

        {/* Wishlist content */}
        <section className="py-6 sm:py-10 bg-white flex-1">
          <div className="section-wrapper px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Products you&apos;ve saved for later. You can move them to cart or remove them at any time.
              </p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 p-6 sm:p-8 text-center rounded-none">
                <p className="text-gray-700 mb-2">
                  Your wishlist is currently empty.
                </p>
                <Link
                  href="/"
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Browse products to start adding favourites →
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-none overflow-x-auto">
                  <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left font-semibold text-gray-700 px-4 py-3">
                        Products
                      </th>
                      <th className="text-left font-semibold text-gray-700 px-4 py-3">
                        Price
                      </th>
                      <th className="text-left font-semibold text-gray-700 px-4 py-3">
                        Stock status
                      </th>
                      <th className="text-left font-semibold text-gray-700 px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistProducts
                      .slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE
                      )
                      .map((product) => {
                      const inStock = (product.stock ?? 0) > 0;

                      return (
                        <tr
                          key={product.id}
                          className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {/* Product cell */}
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => router.push(`/product/${product.id}`)}
                              className="w-full flex items-center gap-3 text-left"
                            >
                              <div className="relative w-16 h-16 border border-gray-200 bg-white flex-shrink-0">
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
                                <p className="text-xs text-gray-500">
                                  {product.category}
                                  {product.brand && ` • ${product.brand.toUpperCase()}`}
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
                              <span className="text-xs text-gray-500 line-through">
                                KSh {product.originalPrice.toLocaleString()}
                              </span>
                            </div>
                          </td>

                          {/* Stock status */}
                          <td className="px-4 py-3 align-top">
                            {inStock ? (
                              <span className="text-xs font-semibold text-green-600">
                                IN STOCK
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-gray-400">
                                OUT OF STOCK
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-row items-center gap-2">
                              {/* View (Eye) */}
                              <button
                                type="button"
                                onClick={() => router.push(`/product/${product.id}`)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                                aria-label="View product details"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>

                              {/* Add to Cart */}
                              <AddToCartButton
                                product={product}
                                size="sm"
                                variant={inStock ? "destructive" : "outline"}
                                className={
                                  inStock
                                    ? "rounded-none"
                                    : "rounded-none bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed hover:bg-gray-200 hover:text-gray-500"
                                }
                                disabled={!inStock}
                                onClick={() => inStock && handleRemove(product.id)}
                                fullWidth={false}
                              />

                              {/* Buy Now */}
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/checkout?productId=${product.id}`)
                                }
                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-none border border-red-500 text-red-600 hover:bg-red-50"
                              >
                                BUY NOW
                              </button>

                              {/* Remove (Trash) */}
                              <button
                                type="button"
                                onClick={() => handleRemove(product.id)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                                aria-label="Remove from wishlist"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="md:hidden space-y-4">
                  {wishlistProducts
                    .slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE
                    )
                    .map((product) => {
                    const inStock = (product.stock ?? 0) > 0;

                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-none p-4"
                      >
                        {/* Product Info */}
                        <button
                          type="button"
                          onClick={() => router.push(`/product/${product.id}`)}
                          className="w-full flex items-start gap-3 mb-4 text-left"
                        >
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 bg-white flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category}
                              {product.brand && ` • ${product.brand.toUpperCase()}`}
                            </p>
                          </div>
                        </button>

                        {/* Price and Stock Row */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                          <div className="flex flex-col">
                            <span className="font-semibold text-base text-gray-900">
                              KSh {product.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              KSh {product.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          {inStock ? (
                            <span className="text-xs font-semibold text-green-600 px-2 py-1 bg-green-50 rounded">
                              IN STOCK
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400 px-2 py-1 bg-gray-50 rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View (Eye) */}
                          <button
                            type="button"
                            onClick={() => router.push(`/product/${product.id}`)}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                            aria-label="View product details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>

                          {/* Add to Cart */}
                          <AddToCartButton
                            product={product}
                            size="sm"
                            variant={inStock ? "destructive" : "outline"}
                            className={
                              inStock
                                ? "rounded-none flex-1 min-w-[120px]"
                                : "rounded-none bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed hover:bg-gray-200 hover:text-gray-500 flex-1 min-w-[120px]"
                            }
                            disabled={!inStock}
                            onClick={() => inStock && handleRemove(product.id)}
                            fullWidth={false}
                          />

                          {/* Buy Now */}
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/checkout?productId=${product.id}`)
                            }
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-none border border-red-500 text-red-600 hover:bg-red-50 flex-1 min-w-[100px]"
                          >
                            BUY NOW
                          </button>

                          {/* Remove (Trash) */}
                          <button
                            type="button"
                            onClick={() => handleRemove(product.id)}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                            aria-label="Remove from wishlist"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Pagination */}
                {wishlistProducts.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-none min-w-[36px] sm:min-w-[40px] ${
                              currentPage === page
                                ? "bg-red-600 text-white border-red-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            } transition-colors`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(totalPages, p + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


