"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

interface BrandLaptopCardProps {
  laptop: Product;
}

export function BrandLaptopCard({ laptop }: BrandLaptopCardProps) {
  const router = useRouter();
  const brandSlug = laptop.brand || '';

  return (
    <ProductCard
      product={laptop}
      variant="detailed"
      showSpecs={true}
      showViewButton={true}
      onCardClick={() => router.push(`/product/${laptop.slug || laptop.id}?from=brand&brand=${brandSlug}`)}
      imageHeight="h-48 md:h-52"
    />
  );
}
