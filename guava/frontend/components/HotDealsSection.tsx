"use client";

import Link from "next/link";
import { hotDeals } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";

export function HotDealsSection() {
  const displayedDeals = hotDeals.slice(0, 4);
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  return (
    <>
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
            {displayedDeals.map((product, index) => {
              const isInWishlist = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  variant="hot-deal"
                  imageHeight="h-[200px]"
                  showWishlist
                  isInWishlist={isInWishlist}
                  onWishlistToggle={(id, e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const willAdd = !wishlistIds.includes(id);
                    toggle(id);
                    if (willAdd) {
                      toast.success("Added to wishlist");
                    } else {
                      toast.info("Removed from wishlist");
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </>
  );
}
