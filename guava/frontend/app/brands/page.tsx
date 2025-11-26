"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brandSections } from "@/lib/data/categories";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#A7E059] to-[#8FC94A] py-16 md:py-24">
        <div className="section-wrapper">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
              Shop Laptop by Brand
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover laptops from top brands with unbeatable prices and
              premium quality
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandSections.map((brand, index) => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[400px] rounded-lg p-8 text-white overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: brand.color }}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold mb-4">{brand.name}</h3>
                      <p className="text-base opacity-90">{brand.text}</p>
                      {brand.discount > 0 && (
                        <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <span className="text-lg font-bold">
                            {brand.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative h-48 bg-white/10 rounded-lg overflow-hidden backdrop-blur-sm mb-4">
                      <Image
                        src={brand.image}
                        alt={`${brand.name} Laptop`}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline">
                      Shop {brand.name} Laptops →
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

