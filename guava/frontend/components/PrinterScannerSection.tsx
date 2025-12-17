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

  // Map product names to their corresponding image filenames in public folder
  const productsWithLocalImages = displayedProducts.map((product) => {
    const imageMap: { [key: string]: string } = {
      "HP DeskJet 2710 All-in-One": "/HP DeskJet 2710 All-in-One.png",
      "Canon PIXMA G3411 MegaTank": "/Canon PIXMA G3411 MegaTank.png",
      "Epson EcoTank L3250": "/Epson EcoTank L3250.png",
      "HP Smart Tank": "/HP Smart Tank.png",
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
            title="Printer & Scanner Deals"
            viewAllLink="/printers-scanners"
          />

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {productsWithLocalImages.map((product, index) => {
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

