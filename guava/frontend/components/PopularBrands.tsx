"use client";

import { popularBrands } from "@/lib/data/categories";
import { BrandCard } from "@/components/ui/BrandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function PopularBrands() {
  // Get specific brands: Epson, Samsung, LG, Logitech, NVIDIA, Sony
  const brandSlugs = ["epson", "samsung", "lg", "logitech", "nvidia", "sony"];
  const displayedBrands = popularBrands.filter((brand) =>
    brandSlugs.includes(brand.slug)
  );

  return (
    <section className="py-12 bg-white">
      <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
        <SectionHeader
          title="Shop Popular Brands"
          viewAllLink="/popular-brands"
          viewAllText="Discover more"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayedBrands.map((brand, index) => (
            <BrandCard
              key={brand.id}
              id={brand.id}
              name={brand.name}
              image={brand.image}
              slug={brand.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
