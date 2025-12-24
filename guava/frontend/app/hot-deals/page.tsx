"use client";

import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { StarIcon } from "@heroicons/react/24/solid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useHomepage } from "@/lib/hooks/useCMS";
import { mapApiProductsToComponents } from "@/lib/utils/productMapper";
import { hotDeals } from "@/lib/data/products";
import React from "react";

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function HotDealsPage() {
  const { homepage, loading } = useHomepage();

  const products = React.useMemo(() => {
    // Use CMS data if available, otherwise fallback to mock data
    if (!loading && homepage?.hot_deals?.items?.length) {
      return mapApiProductsToComponents(
        homepage.hot_deals.items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice ?? item.price,
          rating: item.rating ?? 5,
          badge: item.badge,
          slug: item.slug,
          discount: item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0,
          stock: item.inStock ? 10 : 0,
          ratingCount: 120,
          category: "",
          brand: "",
          description: "",
          images: [item.image],
        }))
      );
    }
    
    // Fallback to mock data
    return hotDeals;
  }, [homepage, loading]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("Most Popular");

  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Highest Rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest First":
        // Keep original order for hot deals
        break;
      default:
        // Most Popular - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-16 md:py-20">
          <div className="section-wrapper">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">🔥 LIMITED TIME OFFERS</span>
              </div>
              <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
                Today&apos;s Hot Deals
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Exclusive discounts on top products. Limited stock available - grab them before they&apos;re gone!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-white/20 px-4 py-2 rounded">
                  <span className="font-semibold">{filteredProducts.length}</span> Deals Available
                </div>
                <div className="bg-white/20 px-4 py-2 rounded">
                  <span className="font-semibold">Up to 70%</span> OFF
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="section-wrapper">
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#A7E059] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Hot Deals</span>
            </div>
          </div>
        </section>

        {/* Search and Sort Bar */}
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="section-wrapper">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search hot deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7E059] focus:border-transparent"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 bg-white">
          <div className="section-wrapper">{loading && !products.length ? (
              <p className="text-gray-500 text-sm">Loading hot deals...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery ? `No deals found matching "${searchQuery}"` : "No hot deals available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-none border border-gray-200 shadow-sm bg-white flex flex-col overflow-hidden"
                >
                  <div className="px-4 pt-4 flex items-center justify-between text-xs font-semibold">
                    <span className="bg-[#A7E059] text-white px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full">
                      HOT
                    </span>
                  </div>

                  <div className="relative p-4 border-b border-gray-200">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative w-full bg-white border border-gray-200 h-44 flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-[#A7E059] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                      {renderStars(product.rating)}
                      <span className="text-gray-500">
                        ({product.ratingCount ?? 120})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#A7E059] font-semibold">
                        In stock
                      </span>
                      <span className="text-gray-500">
                        ({product.stock ?? 10} pcs)
                      </span>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <span className="text-sm text-gray-400 line-through">
                        Ksh {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        Ksh {product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

