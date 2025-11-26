"use client";

import { audioDeals } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PromotionalBanner } from "@/components/ui/PromotionalBanner";

export function AudioSection() {
  // First item for promotional banner (Xiaomi)
  const xiaomiProduct = {
    id: "xiaomi-1",
    name: "Xiaomi Wireless Earbuds",
    price: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    logo: "https://cdn.simpleicons.org/xiaomi/FF6900",
  };
  // Next three items for product cards
  const productCards = audioDeals.slice(0, 3);

  return (
    <section className="py-10 bg-white">
      <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
        <SectionHeader
          title="Audio & Headphones Deals"
          viewAllLink="/audio-headphones"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4">
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
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {productCards.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                variant="compact"
                imageHeight="h-32 md:h-36"
                badgePosition="inline"
                className="max-w-[280px] mx-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
