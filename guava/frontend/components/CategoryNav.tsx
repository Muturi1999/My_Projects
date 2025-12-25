"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/24/outline";
import {
  categoryDropdowns,
  popularCategories,
  shopCategories,
} from "@/lib/data/categories";

const categories = [
  "Desktops",
  "Laptops",
  "Phones",
  "TVs",
  "Sound Bars",
  "Printers",
  "Toners",
  "UPS",
  "Hard Disks",
  "Network",
  "Softwares",
  "Accessories",
  "Security",
];

export function CategoryNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAllCategoriesDropdown, setShowAllCategoriesDropdown] = useState(false);
  const [activeAllCategorySlug, setActiveAllCategorySlug] = useState<string>(
    shopCategories[0]?.slug ?? ""
  );

  const handleMouseEnter = (category: string) => {
    if (categoryDropdowns[category]) {
      setActiveDropdown(category);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav
      className="sticky top-[80px] bg-white border-b border-gray-200 z-40 shadow-sm"
      onMouseLeave={handleMouseLeave}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {/* All Categories with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowAllCategoriesDropdown(true)}
              onMouseLeave={() => setShowAllCategoriesDropdown(false)}
            >
              <button
                type="button"
                onClick={() => window.location.href = '/popular-categories'}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border border-gray-200 rounded-none cursor-pointer ${
                  showAllCategoriesDropdown
                    ? "bg-gray-100 text-[#A7E059]"
                    : "bg-white text-gray-700 hover:text-[#A7E059] hover:bg-gray-50"
                }`}
              >
                <Bars3Icon className="h-4 w-4" />
                All Categories
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    showAllCategoriesDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* All Categories Dropdown */}
              <AnimatePresence>
                {showAllCategoriesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 min-w-[800px] max-h-[600px] overflow-hidden"
                  >
                    <div className="flex">
                      {/* Left rail: main categories (dynamic) */}
                      <div className="w-56 border-r border-gray-200 bg-gray-50 overflow-y-auto max-h-[600px]">
                        {shopCategories.map((cat) => {
                          if (!cat.slug) return null;
                          const isActive = cat.slug === activeAllCategorySlug;
                          return (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onMouseEnter={() => setActiveAllCategorySlug(cat.slug)}
                              className={`block w-full text-left px-4 py-3 text-sm transition-all ${
                                isActive
                                  ? "bg-white text-gray-900 font-semibold border-l-4 border-[#A7E059]"
                                  : "text-gray-700 hover:bg-white hover:border-l-4 hover:border-gray-300"
                              }`}
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Middle: subcategories or info for active category */}
                      <div className="flex-1 p-5 overflow-y-auto max-h-[600px]">
                        {(() => {
                          const activeShop =
                            shopCategories.find(
                              (c) => c.slug === activeAllCategorySlug
                            ) ?? shopCategories[0];

                          const activePopular = popularCategories.find(
                            (c) => c.slug === activeAllCategorySlug
                          );

                          if (activePopular) {
                            return (
                              <>
                                <h3 className="font-semibold text-gray-900 mb-3 text-base">
                                  {activePopular.name}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {activePopular.subCategories.map((sub) => {
                                    const hash = sub
                                      .toLowerCase()
                                      .replace(/\s+/g, "-");
                                    return (
                                      <Link
                                        key={sub}
                                        href={`/category/${activePopular.slug}#${hash}`}
                                        className="text-sm text-gray-700 hover:text-[#A7E059] transition-colors"
                                        onClick={() =>
                                          setShowAllCategoriesDropdown(false)
                                        }
                                      >
                                        {sub}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </>
                            );
                          }

                          // Fallback for categories without defined subCategories
                          return (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {activeShop.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Browse all products in{" "}
                                <Link
                                  href={`/category/${activeShop.slug}`}
                                  className="text-red-600 hover:underline"
                                  onClick={() =>
                                    setShowAllCategoriesDropdown(false)
                                  }
                                >
                                  {activeShop.name}
                                </Link>
                                .
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Categories */}
            {categories.map((category) => {
              const hasDropdown = categoryDropdowns[category];
              const isActive = activeDropdown === category;
              
              const categorySlug = (() => {
                switch(category) {
                  case "Desktops": return "desktops";
                  case "Laptops": return "laptops-computers";
                  case "TVs": return "monitors";
                  case "Sound Bars": return "audio-headphones";
                  case "Printers": return "printers-scanners";
                  case "Toners": return "printers-scanners";
                  case "UPS": return "computer-accessories";
                  case "Hard Disks": return "drives-storage";
                  case "Network": return "wifi-networking";
                  case "Softwares": return "software";
                  case "Accessories": return "computer-accessories";
                  case "Security": return "cctv-security";
                  default: return "";
                }
              })();

              return (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(category)}
                >
                  <Link
                    href={categorySlug ? `/category/${categorySlug}` : "#"}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "text-[#A7E059] bg-gray-50"
                        : "text-gray-700 hover:text-[#A7E059] hover:bg-gray-50"
                    }`}
                  >
                    {category}
                    {hasDropdown && (
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dropdown Menu for other categories */}
      <AnimatePresence>
        {activeDropdown && categoryDropdowns[activeDropdown] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-200"
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="px-4 sm:px-6 md:px-[60px] lg:px-[100px] xl:px-[120px] py-3">
              <div
                className={`grid gap-2 ${
                  categoryDropdowns[activeDropdown].columns.length >= 10
                    ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11"
                    : categoryDropdowns[activeDropdown].columns.length >= 6
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                    : categoryDropdowns[activeDropdown].columns.length === 5
                    ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
                    : categoryDropdowns[activeDropdown].columns.length === 4
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : categoryDropdowns[activeDropdown].columns.length === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : categoryDropdowns[activeDropdown].columns.length >= 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {categoryDropdowns[activeDropdown].columns.map(
                  (column, index) => (
                    <div key={index} className="space-y-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {column.title}
                      </h3>
                      <ul className="space-y-0.5">
                        {column.links.map((link, linkIndex) => {
                          const linkSlug = link.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                          const parentSlug = activeDropdown.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                          return (
                            <li key={linkIndex}>
                              <Link
                                href={`/category/${parentSlug}?subcategory=${linkSlug}`}
                                className="text-xs text-gray-600 hover:text-[#A7E059] hover:translate-x-1 transition-all inline-block leading-tight"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {link}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
