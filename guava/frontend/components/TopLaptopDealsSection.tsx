"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { laptopDeals } from "@/lib/data/products";
import { mapProductsToLocalImages } from "@/lib/utils/imageMapper";

export function TopLaptopDealsSection() {
  const { ids: wishlistIds, toggle } = useWishlist();
  const router = useRouter();
  const toast = useToast();

  // Fetch products internally - no props needed
  const displayProducts = useMemo(() => {
    const products = laptopDeals.slice(0, 4);
    return mapProductsToLocalImages(products);
  }, []);

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="section-wrapper flex flex-col">
          <div className="w-full flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="section-heading">Top Laptop Deals</h2>
            <Link
              href="/top-laptop-deals"
              className="text-black font-semibold text-sm transition-colors hover:opacity-80"
            >
              View all →
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product, index) => {
              const isInWishlist = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  variant="detailed"
                  showSpecs
                  showWishlist
                  showViewButton
                  isInWishlist={isInWishlist}
                  section="Top Laptop Deals"
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
                  onCardClick={() => router.push(`/home/top-laptop-deals/${product.id}`)}
                  imageHeight="h-[260px]"
                  className="h-full"
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
