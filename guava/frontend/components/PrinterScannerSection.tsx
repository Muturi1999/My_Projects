"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { printerDeals } from "@/lib/data/products";
import { useHomepage } from "@/lib/hooks/useCMS";
import { mapApiProductsToComponents } from "@/lib/utils/productMapper";
import type { Product as APIProduct } from "@/lib/api/types";
import { mapProductsToLocalImages } from "@/lib/utils/imageMapper";

export function PrinterScannerSection() {
  const { homepage, loading } = useHomepage();
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  // Fetch products from CMS or fallback to static data
  const displayedProducts = useMemo(() => {
    if (!loading && homepage?.printer_scanner?.items && homepage.printer_scanner.items.length > 0) {
      // Use CMS data
      const apiProducts: APIProduct[] = homepage.printer_scanner.items.map((item) => ({
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
        hot: false,
        featured: false,
        rating: item.rating ?? 5,
        rating_count: 120,
        stock_quantity: item.inStock ? 10 : 0,
        specifications: undefined,
        product_images: [],
        created_at: "",
        updated_at: "",
      }));
      const products = mapApiProductsToComponents(apiProducts);
      return mapProductsToLocalImages(products).slice(0, 4);
    }
    
    // Fallback to static data
    const products = printerDeals.slice(0, 4);
    return mapProductsToLocalImages(products);
  }, [homepage, loading]);

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="section-wrapper flex flex-col">
          <SectionHeader
            title="Printer & Scanner Deals"
            viewAllLink="/printers-scanners"
          />

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product, index) => {
              const isInWishlist = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  variant="default"
                  imageHeight="h-48"
                  showWishlist
                  isInWishlist={isInWishlist}
                  section="Printer & Scanner Deals"
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

