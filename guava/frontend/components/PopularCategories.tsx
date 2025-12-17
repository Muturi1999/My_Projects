"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { popularCategories } from "@/lib/data/categories";

export function PopularCategories() {
  const router = useRouter();
  
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="section-wrapper">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h2 className="section-heading">Popular categories</h2>
          <Link
            href="/popular-categories"
            className="text-black font-semibold text-sm transition-colors hover:opacity-80"
          >
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {popularCategories.map((category, index) => {
            const categoryUrl = `/category/${category.slug}`;
            const isSpecialCategory = ["cctv-security", "computer-accessories", "drives-storage", "tv-audio-video"].includes(category.slug);
            
            // Get background color for category name based on slug
            const getCategoryBgColor = (slug: string) => {
              switch (slug) {
                case "cctv-security":
                  return "#F3B0A7";
                case "computer-accessories":
                  return "#D5DE8F";
                case "drives-storage":
                  return "#F4E5CE";
                case "tv-audio-video":
                  return "#9DB0D1";
                default:
                  return "#F3B0A7";
              }
            };
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(categoryUrl)}
                className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all group max-w-xs mx-auto w-full"
              >
                  {/* Image - Full Width */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {isSpecialCategory ? (
                    <>
                      {/* Category Name with Custom Background - Full Width */}
                      <div className="w-full px-3 py-2" style={{ backgroundColor: getCategoryBgColor(category.slug) }}>
                        <h3 className="font-bold text-lg text-black">
                          {category.name}
                        </h3>
                      </div>
                      {/* Subcategories with Black Background and White Text - Full Width */}
                      <div className="w-full bg-black">
                        <ul className="space-y-0 text-sm">
                          {category.subCategories.slice(0, 5).map((subCategory, i) => (
                            <li key={i}>
                              <Link
                                href={`${categoryUrl}#${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  router.push(`${categoryUrl}#${subCategory.toLowerCase().replace(/\s+/g, "-")}`);
                                }}
                                className={`block px-3 py-2 text-white hover:bg-gray-800 transition-colors ${
                                  i < category.subCategories.slice(0, 5).length - 1 ? "border-b border-gray-400" : ""
                                }`}
                              >
                                {subCategory}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {/* Divider above Shop all */}
                        <div className="border-t border-gray-400"></div>
                        {/* Shop all Button with Circular Icon - White text on black, aligned to center */}
                        <div className="flex items-center justify-center gap-2 text-white font-medium text-sm px-3 py-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ArrowRightIcon className="h-4 w-4 text-white" />
                          </div>
                          <span>Shop all</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6">
                      {/* Category Name with Background */}
                      <h3 className="font-bold text-lg mb-4 text-gray-900 bg-gray-100 px-3 py-2 rounded-none inline-block">
                        {category.name}
                      </h3>
                      {/* Five Subcategories as Links */}
                      <ul className="space-y-2 mb-6 text-sm">
                        {category.subCategories.slice(0, 5).map((subCategory, i) => (
                          <li key={i}>
                            <Link
                              href={`${categoryUrl}#${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                router.push(`${categoryUrl}#${subCategory.toLowerCase().replace(/\s+/g, "-")}`);
                              }}
                              className="text-gray-600 hover:text-[#A7E059] transition-colors"
                            >
                              {subCategory}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {/* Shop all Button with Circular Icon */}
                      <div className="flex items-center gap-2 text-[#A7E059] hover:text-[#8FC94A] transition-colors font-medium text-sm">
                        <div className="w-8 h-8 rounded-full bg-[#A7E059] flex items-center justify-center group-hover:bg-[#8FC94A] transition-colors">
                          <ArrowRightIcon className="h-4 w-4 text-white" />
                        </div>
                        <span>Shop all</span>
                      </div>
                    </div>
                  )}
                </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
