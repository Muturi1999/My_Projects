"use client";

import { accessoriesDeals } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PromotionalBanner } from "@/components/ui/PromotionalBanner";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";

export function AccessoriesSection() {
  // First item for promotional banner
  const bannerProduct = accessoriesDeals[0];
  // Next three items for product cards
  const productCards = accessoriesDeals.slice(1, 4);

  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  return (
    <>
      <section className="py-10 bg-white">
        <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
          <SectionHeader
            title="Computer Accessories Deals"
            viewAllLink="/computer-accessories"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Promotional Banner */}
            <PromotionalBanner
              title="tp-link"
              subtitle="CLEARANCE SALE"
              discount="37% DISCOUNT"
              description="only for TP-Link Routers"
              priceText={`From Ksh ${bannerProduct?.price.toLocaleString() || "6,499"}`}
              productId={bannerProduct?.id || "13"}
              variant="tp-link"
            />

            {/* Product Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productCards.map((product, index) => {
                const isInWishlist = wishlistIds.includes(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    variant="compact"
                    imageHeight="h-32 md:h-36"
                    badgePosition="inline"
                    className="max-w-[280px] mx-auto"
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
        </div>
      </section>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </>
  );
}
