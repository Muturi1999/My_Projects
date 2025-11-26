"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/data/products";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  viewMoreLink?: string;
}

export function ProductCarousel({
  products,
  title,
  viewMoreLink,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {viewMoreLink && (
            <a
              href={viewMoreLink}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View more -&gt;
            </a>
          )}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                aria-label="Previous products"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                aria-label="Next products"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-green-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

