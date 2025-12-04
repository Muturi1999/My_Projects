"use client";

import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";

interface PrinterScannerSectionProps {
  products: Product[];
}

export function PrinterScannerSection({ products }: PrinterScannerSectionProps) {
  const displayedProducts = products.slice(0, 4);
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  return (
    <>
      <section className="py-10 bg-white">
        <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
          <SectionHeader
            title="Printer & Scanner Deals"
            viewAllLink="/printers-scanners"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

