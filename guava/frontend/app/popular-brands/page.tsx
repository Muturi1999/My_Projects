"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { popularBrands } from "@/lib/data/categories";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PopularBrandsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#ffdbc8] via-[#ffd9d0] to-[#ffd3c7] py-16 md:py-24 text-gray-900">
        <div className="section-wrapper text-center">
          <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
            Popular Brands
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Explore products from your favorite brands
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="flex items-center justify-center h-32 md:h-36 bg-white rounded-lg border border-gray-200 hover:border-[#A7E059] hover:shadow-lg transition-all p-4"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={140}
                    height={80}
                    className="object-contain max-w-full max-h-full"
                    unoptimized
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

