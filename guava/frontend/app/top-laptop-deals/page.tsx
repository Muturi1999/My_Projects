"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { laptopDeals } from "@/lib/data/products";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@heroicons/react/24/solid";
import { EyeIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function TopLaptopDealsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const itemsPerPage = 12;

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const totalPages = Math.ceil(laptopDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = laptopDeals.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#A7E059] to-[#8FC94A] py-16 md:py-24">
        <div className="section-wrapper">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
              Top Laptop Deals
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover the best laptop deals with unbeatable prices and premium
              quality
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-white text-[#A7E059] px-4 py-2 text-base">
                Up to 45% OFF
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2 text-base">
                Free Shipping
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => {
              const isInWishlist = wishlist.includes(product.id);
              const discountPercentage = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group rounded-none">
                    {/* Discount & HOT badges */}
                    <div className="px-4 pt-4 flex flex-col gap-2 items-start">
                      <span className="inline-flex items-center bg-[#A7E059] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {discountPercentage}% OFF
                      </span>
                    </div>

                    {/* Image Container */}
                    <div className="relative p-4 border-b border-gray-200">
                      <div className="relative bg-white w-full h-48 md:h-52 overflow-hidden border border-gray-200">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                        <Link
                          href={`/product/${product.id}`}
                          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EyeIcon className="h-5 w-5 text-gray-700" />
                        </Link>
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className={`rounded-full p-3 shadow-lg transition-colors ${
                            isInWishlist
                              ? "bg-red-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <HeartIcon
                            className={`h-5 w-5 ${
                              isInWishlist ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: product.rating }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>

                      {/* Specifications */}
                      <div className="space-y-1.5 mb-4 text-sm text-gray-600">
                        {product.processor && (
                          <div>
                            <span className="font-medium">Processor: </span>
                            <span>{product.processor}</span>
                          </div>
                        )}
                        {product.ram && (
                          <div>
                            <span className="font-medium">RAM: </span>
                            <span>{product.ram}</span>
                          </div>
                        )}
                        {product.storage && (
                          <div>
                            <span className="font-medium">SSD/Storage: </span>
                            <span>{product.storage}</span>
                          </div>
                        )}
                        {product.screen && (
                          <div>
                            <span className="font-medium">Screen: </span>
                            <span>{product.screen}</span>
                          </div>
                        )}
                        {product.os && (
                          <div>
                            <span className="font-medium">OS: </span>
                            <span>{product.os}</span>
                          </div>
                        )}
                        {product.generation && (
                          <div>
                            <span className="font-medium">Generation: </span>
                            <span>{product.generation}</span>
                          </div>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.stock !== undefined && (
                        <div className="mb-3">
                          <span className="text-sm text-[#A7E059] font-medium">
                            In stock
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 line-through">
                            Ksh {product.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            Ksh {product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <AddToCartButton
                        className="mt-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/product/${product.id}`;
                        }}
                      />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        currentPage === page
                          ? "bg-[#A7E059] text-white border-[#A7E059]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

