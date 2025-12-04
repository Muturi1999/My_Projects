"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";

interface TopLaptopDealsSectionProps {
  products: Product[];
}

export function TopLaptopDealsSection({ products }: TopLaptopDealsSectionProps) {
  const { ids: wishlistIds, toggle } = useWishlist();
  const router = useRouter();
  const toast = useToast();

  const displayProducts = products.slice(0, 4);

  return (
    <>
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
                  onCardClick={() => router.push(`/product/${product.id}`)}
                  imageHeight="h-[276px]"
                  className="w-[312px] mx-auto"
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
