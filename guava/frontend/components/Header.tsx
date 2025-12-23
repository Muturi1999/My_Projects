"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserIcon, HomeIcon,
} from "@heroicons/react/24/outline";
import { CategoryNav } from "./CategoryNav";
import { shopCategories, popularBrands } from "@/lib/data/categories";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCart } from "@/lib/hooks/use-cart";
import { useCompare } from "@/lib/hooks/use-compare";
import { CartPopup } from "./CartPopup";
import { type Product } from "@/lib/data/products";
import { catalogProducts as allCatalogProducts } from "@/lib/data/productCatalog";

export function Header() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchScope, setSearchScope] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileScopeDropdown, setShowMobileScopeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount } = useCart();
  const { count: compareCount } = useCompare();
  const [showCartPopup, setShowCartPopup] = useState(false);

  const handleCartClick = (e?: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      e?.preventDefault();
      setShowCartPopup((prev) => !prev);
    } else {
      router.push("/cart");
    }
  };

  // Removed useScrollHideHeader() to keep header sticky at all times

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

  // Focus trap & keyboard handling for mobile menu
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Escape") {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      return;
    }

    if (e.key === "Tab") {
      // If shift + tab
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Auto-focus first focusable element inside menu (anchor or button)
      setTimeout(() => {
        const el = menuRef.current?.querySelector<HTMLElement>("a, button");
        el?.focus();
      }, 50);

      // Lock body scroll
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onDocKey = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") setIsMobileMenuOpen(false);
      };
      document.addEventListener("keydown", onDocKey);

      return () => {
        document.body.style.overflow = prevOverflow || "";
        document.removeEventListener("keydown", onDocKey);
      };
    }
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchTerm.trim();

    // Decide where to route based on scope
    if (searchScope === "all") {
      if (!trimmed) return;
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      const base = `/category/${searchScope}`;
      if (trimmed) {
        router.push(`${base}?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push(base);
      }
    }

    setIsMobileSearchOpen(false);
  };

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 1) return [];

    let pool = allCatalogProducts;
    if (searchScope !== "all") {
      const categoryName =
        shopCategories.find((c) => c.slug === searchScope)?.name ?? "";
      const catLower = categoryName.toLowerCase().trim();
      if (catLower) {
        pool = pool.filter((p) =>
          (p.category || "").toLowerCase().includes(catLower)
        );
      }
    }

    const unique: Record<string, Product> = {};
    for (const p of pool) {
      if (!p) continue;
      if (!p.name.toLowerCase().includes(term)) continue;
      if (!unique[p.id]) {
        unique[p.id] = p;
      }
    }

    return Object.values(unique).slice(0, 8);
  }, [searchTerm, searchScope]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Mobile / tablet / small-desktop header (all screens below xl) */}
      <div className="bg-black text-white xl:hidden">
        <div className="section-wrapper py-3 flex items-center justify-between">
          {/* Left: Hamburger */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-white" /> GUAVASTORES
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            {/* Search toggle */}
            {!isMobileSearchOpen ? (
              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsMobileSearchOpen(true)}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => router.push("/wishlist")}
              className="relative"
              aria-label="Wishlist"
            >
              <HeartIcon className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>

            {/* Compare */}
            <button
              type="button"
              onClick={() => router.push("/compare")}
              className="relative"
              aria-label="Compare"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {compareCount > 9 ? "9+" : compareCount}
                </span>
              )}
            </button>

            {/* User icon (placeholder route for future auth) */}
            <button
              type="button"
              aria-label="Account"
              onClick={() => router.push("/account")}
            >
              <UserIcon className="h-6 w-6" />
            </button>

            {/* Cart */}
              <div
                className="relative"
                onMouseEnter={() => setShowCartPopup(true)}
                onMouseLeave={() => setShowCartPopup(false)}
              >
                <button
                  type="button"
                  onClick={handleCartClick}
                  className="relative"
                  aria-label="Cart"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
                <CartPopup
                  isOpen={showCartPopup}
                  onClose={() => setShowCartPopup(false)}
                />
              </div>
          </div>
        </div>

        {/* Mobile / tablet search bar (expands under header when open) */}
        {isMobileSearchOpen && (
          <div className="px-3 pb-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-[#1f2937] rounded-none px-0 py-0 flex items-stretch shadow-md h-11 sm:h-12"
            >
              {/* Scope dropdown on the left */}
              <div className="relative flex items-stretch">
                <button
                  type="button"
                  onClick={() => setShowMobileScopeDropdown((prev) => !prev)}
                  className="h-full flex items-center gap-1 px-3 bg-[#111827] text-gray-100 text-[11px] sm:text-xs border-r border-gray-700"
                >
                  <span>
                    {searchScope === "all"
                      ? "All"
                      : shopCategories.find((c) => c.slug === searchScope)?.name ??
                        "All"}
                  </span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                {showMobileScopeDropdown && (
                  <div className="absolute left-0 mt-1 w-56 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 p-2">
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchScope("all");
                          setShowMobileScopeDropdown(false);
                        }}
                        className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                      >
                        All
                      </button>
                      {shopCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            if (category.slug) setSearchScope(category.slug);
                            setShowMobileScopeDropdown(false);
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          {category.name}
                        </button>
                      ))}

                      <div className="pt-2 border-t border-gray-100">
                        <h4 className="text-xs text-gray-500 px-3 py-1">Brands</h4>
                        <div className="grid grid-cols-2 gap-1 px-2">
                          {popularBrands.slice(0, 8).map((b) => (
                            <button
                              key={b.id}
                              onClick={() => {
                                setShowMobileScopeDropdown(false);
                                router.push(`/search?brand=${b.slug}`);
                              }}
                              className="text-xs text-left px-2 py-1 hover:text-[#A7E059]"
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search input */}
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="flex-1 border-0 focus-visible:ring-0 bg-white text-gray-900 placeholder:text-gray-500 text-sm rounded-none px-3"
              />

              {/* Search button on the right */}
              <button
                type="submit"
                className="h-full bg-red-600 hover:bg-red-700 text-white px-4 flex items-center justify-center"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Typeahead suggestions (mobile / tablet) */}
            {suggestions.length > 0 && (
              <div className="mt-1 bg-white rounded-md shadow-lg border border-gray-200 text-sm max-h-64 overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setSearchTerm("");
                      router.push(`/product/${product.id}`);
                    }}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop header (extra-large screens and up) */}
      <div className="bg-black text-white hidden xl:block">
        <div className="section-wrapper py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white ml-4 md:ml-0 flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-white" /> GUAVASTORES
            </Link>

            {/* Search */}
            <div className="flex-1 w-full md:max-w-2xl md:mx-4 order-3 md:order-2 relative">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                    aria-expanded={showCategoryDropdown}
                    aria-controls="search-categories-dropdown"
                    className="flex items-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 border-r border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="hidden sm:inline">
                      {searchScope === "all"
                        ? "All"
                        : selectedCategory}
                    </span>
                    <span className="sm:hidden">All</span>
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  {showCategoryDropdown && (
                    <div id="search-categories-dropdown" className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-72 overflow-y-auto min-w-[320px]">
                      <div className="p-2">
                        <div className="flex gap-4">
                          <div className="min-w-[200px]">
                            <button
                              onClick={() => {
                                setSelectedCategory("All");
                                setSearchScope("all");
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              All
                            </button>
                            {shopCategories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setSelectedCategory(category.name);
                                  if (category.slug) {
                                    setSearchScope(category.slug);
                                  }
                                  setShowCategoryDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>

                          <div className="flex-1 border-l border-gray-100 pl-4">
                            <h4 className="text-xs text-gray-500 mb-2 font-semibold">Brands</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {popularBrands.slice(0, 12).map((b) => (
                                <button
                                  key={b.id}
                                  onClick={() => {
                                    setShowCategoryDropdown(false);
                                    router.push(`/search?brand=${b.slug}`);
                                  }}
                                  className="text-sm text-gray-700 hover:text-[#A7E059] text-left px-2 py-1"
                                >
                                  {b.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <Input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 border-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-500 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm"
                />

                {/* Search Button */}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 transition-colors"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Typeahead suggestions (desktop) */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 text-sm max-h-72 overflow-y-auto z-50">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setSearchTerm("");
                        router.push(`/product/${product.id}`);
                      }}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
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
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-5 h-5 sm:w-5 sm:h-5 flex items-center justify-center">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                )}
              </button>

              {/* Compare */}
              <button
                type="button"
                onClick={() => router.push("/compare")}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors relative"
                aria-label="Compare"
              >
                <ArrowsRightLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs hidden sm:inline">
                  Compare
                </span>
                {compareCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-5 h-5 sm:w-5 sm:h-5 flex items-center justify-center">
                        {compareCount > 9 ? "9+" : compareCount}
                      </span>
                )}
              </button>

              {/* User / Account */}
              <button
                type="button"
                onClick={() => router.push("/account")}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors"
                aria-label="Account"
              >
                <UserIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="text-[10px] sm:text-xs hidden sm:inline">
                  Account
                </span>
              </button>

              {/* Cart */}
              <div
                className="relative"
                onMouseEnter={() => setShowCartPopup(true)}
                onMouseLeave={() => setShowCartPopup(false)}
              >
                <button
                  type="button"
                  onClick={handleCartClick}
                  className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#A7E059] transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-[10px] sm:text-xs hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-5 h-5 sm:w-5 sm:h-5 flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
                <CartPopup
                  isOpen={showCartPopup}
                  onClose={() => setShowCartPopup(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop category navigation */}
      <div className="hidden xl:block">
        <CategoryNav />
      </div>

      {/* Mobile menu panel (animated + focus trap) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="md:hidden absolute inset-x-0 top-full bg-white border-t border-gray-200 shadow-lg"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            ref={menuRef}
            onKeyDown={handleMenuKeyDown}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            <nav className="px-4 py-3 space-y-2 text-sm text-gray-800" role="navigation" aria-label="Mobile primary">
              <Link
                href="/"
                className="block py-1 hover:text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/popular-categories"
                className="block py-1 hover:text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Popular Categories
              </Link>
              <Link
                href="/popular-brands"
                className="block py-1 hover:text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Popular Brands
              </Link>
              <Link
                href="/hot-deals"
                className="block py-1 hover:text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Today&apos;s Hot Deals
              </Link>
              <div className="pt-2 mt-1 border-t border-gray-200">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">Shop by category</p>
                {shopCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.slug ? `/category/${category.slug}` : "/"}
                    className="block py-1.5 hover:text-red-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
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


