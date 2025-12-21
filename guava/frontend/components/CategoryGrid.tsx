"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { shopCategories } from "@/lib/data/categories";
import { useHomepage } from "@/lib/hooks/useCMS";
import type { CategoryCardContent } from "@/lib/types/cms";

interface CategoryDisplay {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export function CategoryGrid() {
  const { homepage, loading } = useHomepage();

  // Get categories from CMS or fallback to static data
  const categories = useMemo((): CategoryDisplay[] => {
    if (!loading && homepage?.shop_by_category?.items && homepage.shop_by_category.items.length > 0) {
      // Map CMS CategoryCardContent to CategoryDisplay format
      return homepage.shop_by_category.items.map((cat: CategoryCardContent) => ({
        id: cat.id,
        name: cat.title,
        slug: cat.slug,
        image: cat.image,
      }));
    }
    
    // Fallback to static data with fixed order
    const orderedSlugs = [
      "laptops-computers",
      "computer-accessories",
      "monitors",
      "smartphones",
      "tablets-ipads",
      "printers-scanners",
      "desktops",
      "audio-headphones",
      "wifi-networking",
      "software",
      "drives-storage",
      "gaming",
    ];
    
    return orderedSlugs
      .map((slug) => shopCategories.find((cat) => cat.slug === slug))
      .filter((cat): cat is (typeof shopCategories)[number] => Boolean(cat))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      }));
  }, [homepage, loading]);

  const firstRow = categories.slice(0, 6);
  const secondRow = categories.slice(6, 12);

  return (
    <section className="bg-white min-h-[400px] sm:min-h-[500px] md:min-h-[604px]">
      <div className="section-wrapper py-6 sm:py-8 md:py-12">
        <h2 className="section-heading mb-4 sm:mb-6 md:mb-8 text-left text-xl sm:text-2xl">Shop by Category</h2>
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {firstRow.map((category, index) => {
              const Icon = RectangleStackIcon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="w-full"
                >
                  <Link
                    href={`/category/${category.slug || category.id}`}
                    className="flex flex-col bg-white hover:shadow-md transition-all border border-gray-200 hover:border-[#A7E059] group h-full"
                    style={{
                      borderRadius: "0px",
                      borderWidth: "1px",
                      paddingTop: "16px",
                      paddingRight: "8px",
                      paddingBottom: "16px",
                      paddingLeft: "8px",
                      gap: "12px",
                      minHeight: "180px",
                    }}
                  >
                    {category.image ? (
                      <div className="relative w-full flex items-center justify-center flex-1" style={{ width: "100%" }}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={181}
                          height={120}
                          className="object-contain w-full h-auto"
                          style={{ maxHeight: "80px", maxWidth: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 sm:h-20 md:h-24 bg-[#A7E059]/10 group-hover:bg-[#A7E059]/20 rounded-none flex items-center justify-center transition-colors flex-1">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#A7E059]" />
                      </div>
                    )}
                    <span 
                      className="text-gray-700 text-center group-hover:text-[#A7E059] transition-colors font-public-sans text-xs sm:text-sm md:text-base"
                      style={{
                        fontWeight: 500,
                        lineHeight: "1.4",
                        textAlign: "center",
                      }}
                    >
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {secondRow.map((category, index) => {
              const Icon = RectangleStackIcon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 6) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="w-full"
                >
                  <Link
                    href={`/category/${category.slug || category.id}`}
                    className="flex flex-col bg-white hover:shadow-md transition-all border border-gray-200 hover:border-[#A7E059] group h-full"
                    style={{
                      borderRadius: "0px",
                      borderWidth: "1px",
                      paddingTop: "16px",
                      paddingRight: "8px",
                      paddingBottom: "16px",
                      paddingLeft: "8px",
                      gap: "12px",
                      minHeight: "180px",
                    }}
                  >
                    {category.image ? (
                      <div className="relative w-full flex items-center justify-center flex-1" style={{ width: "100%" }}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={181}
                          height={120}
                          className="object-contain w-full h-auto"
                          style={{ maxHeight: "80px", maxWidth: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 sm:h-20 md:h-24 bg-[#A7E059]/10 group-hover:bg-[#A7E059]/20 rounded-none flex items-center justify-center transition-colors flex-1">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#A7E059]" />
                      </div>
                    )}
                    <span 
                      className="text-gray-700 text-center group-hover:text-[#A7E059] transition-colors font-public-sans text-xs sm:text-sm md:text-base"
                      style={{
                        fontWeight: 500,
                        lineHeight: "1.4",
                        textAlign: "center",
                      }}
                    >
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
