"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { useMemo } from "react";
import { useHomepage } from "@/lib/hooks/useCMS";
import { mapApiProductsToComponents } from "@/lib/utils/productMapper";
import type { Product as APIProduct } from "@/lib/api/types";
import { hotDeals } from "@/lib/data/products";
import { mapProductsToLocalImages } from "@/lib/utils/imageMapper";

export function HotDealsSection() {
  const { homepage, loading } = useHomepage();
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  // Determine which data to use: CMS first, fallback to mock data
  const dealsWithLocalImages = useMemo(() => {
    let displayedDeals = hotDeals.slice(0, 4); // Default to mock data

    if (!loading && homepage?.hot_deals?.items?.length) {
      // Use CMS data if available
      const apiProducts: APIProduct[] = homepage.hot_deals.items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: "",
        price: item.price,
        original_price: item.originalPrice ?? item.price,
        discount_percentage: item.originalPrice
          ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
          : 0,
        image: item.image,
        images: [item.image],
        category_slug: "",
        brand_slug: "",
        hot: true,
        featured: false,
        rating: item.rating ?? 5,
        rating_count: 120,
        stock_quantity: item.inStock ? 10 : 0,
        specifications: undefined,
        product_images: [],
        created_at: "",
        updated_at: "",
      }));

      displayedDeals = mapApiProductsToComponents(apiProducts).slice(0, 4);
    }

    // Use centralized image mapper
    return mapProductsToLocalImages(displayedDeals);
  }, [homepage, loading]);

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="section-wrapper flex flex-col">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="section-heading text-xl sm:text-2xl">
              Today&apos;s Hot Deals
            </h2>
            <Link
              href="/hot-deals"
              className="text-xs sm:text-sm font-semibold text-black hover:opacity-80"
            >
              View all →
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealsWithLocalImages.map((product, index) => {
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
                  section="Today's Hot Deals"
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
