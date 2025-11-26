"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface TopLaptopDealsSectionProps {
  products: Product[];
}

export function TopLaptopDealsSection({ products }: TopLaptopDealsSectionProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  const displayProducts = products.slice(0, 4);

  return (
    <section
      className="bg-white"
      style={{ minHeight: "854.95px", paddingTop: "72px", paddingBottom: "72px" }}
    >
      <div className="section-wrapper flex flex-col items-center">
        <div className="w-full max-w-[1320px] flex items-center justify-between mb-12">
          <h2 className="section-heading">Top Laptop Deals</h2>
          <Link
            href="/top-laptop-deals"
            className="text-black font-semibold text-sm transition-colors hover:opacity-80"
          >
            View all →
          </Link>
        </div>

        <div
          className="w-full max-w-[1320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ minHeight: "710.95px" }}
        >
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              variant="detailed"
              showSpecs={true}
              showWishlist={true}
              showViewButton={true}
              isInWishlist={wishlist.includes(product.id)}
              onWishlistToggle={toggleWishlist}
              onCardClick={() => router.push(`/product/${product.id}`)}
              imageHeight="h-[276px]"
              className="w-[312px] mx-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
