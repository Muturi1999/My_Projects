"use client";

import Link from "next/link";
import { hotDeals } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function HotDealsSection() {
  const displayedDeals = hotDeals.slice(0, 4);

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="section-wrapper flex flex-col items-center">
        <div className="w-full max-w-[1320px] flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="section-heading text-xl sm:text-2xl">Today&apos;s Hot Deals</h2>
          <Link
            href="/hot-deals"
            className="text-xs sm:text-sm font-semibold text-black hover:opacity-80"
          >
            View all →
          </Link>
        </div>

        <div className="max-w-[1320px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedDeals.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              variant="hot-deal"
              imageHeight="h-[200px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
