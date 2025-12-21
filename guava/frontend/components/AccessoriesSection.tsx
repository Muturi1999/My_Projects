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

  // Map product names to their corresponding image filenames in public folder
  const imageMap: { [key: string]: string } = {
    "Logitech MK270/MK295 Wireless Keyboard and Mouse": "/Logitech MK270-MK295.png",
    "TP-Link 8/16-port switches": "/TP-Link 8-16-port switches.png",
    "TP-Link Archer C6 AC1200": "/TP-Link Archer C6 AC1200.png",
  };

  // Map product cards to use local images
  const productsWithLocalImages = productCards.map((product, index) => {
    const localSrc = imageMap[product.name] || product.image; // Use mapping or fallback to original

    return {
      ...product,
      image: localSrc,
      images: [localSrc],
    };
  });

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="section-wrapper flex flex-col">
          <SectionHeader
            title="Computer Accessories Deals"
            viewAllLink="/computer-accessories"
          />

          {/* Layout: responsive banner + products 
             - phones: 1 column
             - small tablets: banner + products stacked with tighter gaps
             - md/lg: 4 columns (banner + 3 products)
          */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Promotional Banner */}
            <PromotionalBanner
              title="tp-link"
              subtitle="CLEARANCE SALE"
              discount="37% DISCOUNT"
              description="only for TP-Link Routers"
              priceText={`From Ksh ${bannerProduct?.price.toLocaleString() || "6,499"}`}
              productId={bannerProduct?.id || "13"}
              variant="tp-link"
              section="Computer Accessories Deals"
            />

            {/* Product Cards */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {productsWithLocalImages.map((product, index) => {
                const isInWishlist = wishlistIds.includes(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    variant="compact"
                    imageHeight="h-40 md:h-44"
                    className="h-full"
                    showWishlist
                    isInWishlist={isInWishlist}
                    section="Computer Accessories Deals"
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
