"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  HeartIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { CategoryNav } from "./CategoryNav";
import { shopCategories } from "@/lib/data/categories";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCart } from "@/lib/hooks/use-cart";

export function Header() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount } = useCart();

  useScrollHideHeader();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-transform duration-200">
      <div className="bg-black text-white">
        <div className="section-wrapper py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white ml-4 md:ml-0">
              GUAVASTORES
            </Link>

            {/* Search */}
            <div className="flex-1 w-full md:max-w-2xl md:mx-4 order-3 md:order-2">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                    className="flex items-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 border-r border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="hidden sm:inline">{selectedCategory}</span>
                    <span className="sm:hidden">All</span>
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto min-w-[200px]">
                      <button
                        onClick={() => {
                          setSelectedCategory("All Categories");
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        All Categories
                      </button>
                      {shopCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="flex-1 border-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-500 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm"
                />

                {/* Search Button */}
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 transition-colors"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 order-2 md:order-3">
              {/* Wishlist */}
              <button
                type="button"
                onClick={() => router.push("/wishlist")}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors relative"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs hidden sm:inline">
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>

              {/* Compare (placeholder) */}
              <button
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors"
                aria-label="Compare"
              >
                <ArrowsRightLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs hidden sm:inline">
                  Compare
                </span>
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CategoryNav />
    </header>
  );
}

// Optional: simple hook to hide header on scroll
function useScrollHideHeader() {
  useEffect(() => {
    let lastY = window.scrollY;
    const el = document.querySelector("header");
    if (!el) return;
    const handle = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 64) {
        (el as HTMLElement).style.transform = "translateY(-100%)";
      } else {
        (el as HTMLElement).style.transform = "translateY(0)";
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);
}


