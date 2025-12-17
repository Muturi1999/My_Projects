"use client";

import { audioDeals } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PromotionalBanner } from "@/components/ui/PromotionalBanner";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";

export function AudioSection() {
  // First item for promotional banner (Xiaomi)
  const xiaomiProduct = {
    id: "xiaomi-1",
    name: "Xiaomi Wireless Earbuds",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    logo: "https://cdn.simpleicons.org/xiaomi/FF6900",
  };
  // Next three items for product cards
  const productCards = audioDeals.slice(0, 3);

  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  // Map product names to their corresponding image filenames in public folder
  const productsWithLocalImages = productCards.map((product) => {
    const imageMap: { [key: string]: string } = {
      "Sony WH-1000XM5": "/Sony WH-1000XM5.png",
      "Apple AirPods Pro (2nd Gen)": "/Apple AirPods Pro (2nd Gen).png",
      "JBL Flip 6 Portable Speaker": "/JBL Flip 6 Portable Speaker.png",
      "JBL Tune 510BT": "/JBL.png",
    };
    const localSrc = imageMap[product.name] || `/${product.name}.png`; // Use mapping or default

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
            title="Audio & Headphones Deals"
            viewAllLink="/audio-headphones"
          />

          {/* Layout mirrors Computer Accessories:
             - phones: single column
             - small tablets: banner + products stacked
             - md/lg: 4 columns (banner + 3 products)
          */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Xiaomi Promotional Banner */}
            <PromotionalBanner
              title="Xiaomi"
              subtitle="Wireless Earbuds"
              description="High-quality wireless earbuds with exceptional sound quality"
              priceText={`From: KSh ${xiaomiProduct.price.toLocaleString()}`}
              image={xiaomiProduct.image}
              logo={xiaomiProduct.logo}
              productId={xiaomiProduct.id}
              variant="xiaomi"
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
                    imageHeight="h-32 md:h-36"
                    className="h-full"
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
