"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { type Product } from "@/lib/data/products";
import { catalogProducts as allCatalogProducts } from "@/lib/data/productCatalog";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim();

  const results = useMemo(() => {
    if (!q) return [];
    const term = q.toLowerCase();
    return allCatalogProducts.filter((p) =>
      `${p.name} ${p.category || ""}`.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex flex-col">
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hover:text-red-600 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Search</span>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="section-wrapper">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
              Search results
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Showing results for <span className="font-semibold">&quot;{q || " "}&quot;</span>
            </p>

            {q && results.length === 0 ? (
              <div className="bg-white border border-gray-200 p-6 text-sm text-gray-600">
                No products matched your search. Try a different keyword or category.
              </div>
            ) : null}

            {results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {results.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}


