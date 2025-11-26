"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { popularCategories } from "@/lib/data/categories";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PopularCategoriesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#ffdbc8] via-[#ffd9d0] to-[#ffd3c7] py-16 md:py-24 text-gray-900">
        <div className="section-wrapper text-center">
          <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
            Popular Categories
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Explore our wide range of product categories
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Image - Full Width */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  {/* Category Name */}
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    {category.name}
                  </h3>
                  {/* Subcategories */}
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    {category.subCategories.map((subCategory, i) => (
                      <li key={i}>{subCategory}</li>
                    ))}
                  </ul>
                  {/* Shop all Button */}
                  <Link href={category.slug === "computer-accessories" ? "/computer-accessories" : `/category/${category.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full border-[#A7E059] text-[#A7E059] hover:bg-[#A7E059] hover:text-white"
                    >
                      Shop all
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

