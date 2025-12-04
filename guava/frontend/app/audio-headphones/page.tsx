"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { audioDeals } from "@/lib/data/products";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@heroicons/react/24/solid";
import { Product } from "@/lib/data/products";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 12;

function AudioCard({ product, index }: { product: Product; index: number }) {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/product/${product.id}`}>
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border border-gray-200 max-w-[280px] mx-auto rounded-none">
          {/* Discount and HOT Badges */}
          <div className="px-3 pt-3 pb-1 flex flex-col gap-1.5 items-start">
            <span className="inline-flex items-center bg-[#A7E059] text-black px-2.5 py-1 rounded-full text-xs font-semibold">
              {discountPercentage}% OFF
            </span>
            {product.hot && (
              <Badge
                variant="destructive"
                className="rounded-full text-xs font-semibold px-2.5 py-1"
              >
                HOT
              </Badge>
            )}
          </div>

          {/* Image Container */}
          <div className="relative p-4 border-b border-gray-200">
            <div className="relative w-full bg-white border border-gray-200 h-32 md:h-36 flex items-center justify-center overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-2 md:p-3"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 flex-1 flex flex-col">
            {/* Item Name */}
            <h3 className="font-semibold text-sm md:text-base mb-1.5 line-clamp-2 min-h-[2rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-1.5">
              {Array.from({ length: product.rating }).map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="mb-1.5">
                <span className="text-xs md:text-sm text-[#A7E059] font-medium">
                  In stock
                </span>
              </div>
            )}

            {/* Prices */}
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-500 line-through">
                Ksh {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-base md:text-lg font-bold text-gray-900">
                Ksh {product.price.toLocaleString()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} className="mt-auto" size="sm" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function AudioHeadphonesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(audioDeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = audioDeals.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#ffdbc8] via-[#ffd9d0] to-[#ffd3c7] py-16 md:py-24 text-gray-900">
        <div className="section-wrapper text-center">
          <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
            Audio & Headphones Deals
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Discover premium headphones, earbuds, and speakers from top brands
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          <div className="mb-6">
            <h2 className="section-heading">
              {audioDeals.length} Product{audioDeals.length !== 1 ? "s" : ""} Available
            </h2>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product, index) => (
                  <AudioCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
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
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-md border transition-colors ${
                            currentPage === page
                              ? "bg-[#A7E059] text-white border-[#A7E059]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

