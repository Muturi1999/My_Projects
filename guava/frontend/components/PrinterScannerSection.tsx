"use client";

import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface PrinterScannerSectionProps {
  products: Product[];
}

export function PrinterScannerSection({ products }: PrinterScannerSectionProps) {
  const displayedProducts = products.slice(0, 4);

  return (
    <section className="py-10 bg-white">
      <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
        <SectionHeader
          title="Printer & Scanner Deals"
          viewAllLink="/printers-scanners"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {displayedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              variant="default"
              imageHeight="h-48"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

