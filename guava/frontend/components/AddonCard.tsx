"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AddonCardProps {
  addon: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
  };
  index: number;
}

export function AddonCard({ addon, index }: AddonCardProps) {
  const addonSaving =
    addon.originalPrice && addon.originalPrice > addon.price
      ? addon.originalPrice - addon.price
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle add to cart logic here
    // TODO: Implement add to cart functionality
  };

  return (
    <Link
      href={`/product/${addon.id}`}
      className="flex items-stretch gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-200 rounded-none overflow-hidden bg-white flex-shrink-0 group-hover:border-[#A7E059] transition-colors">
        <Image
          src={addon.image}
          alt={addon.name}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 mb-1 group-hover:text-[#A7E059] transition-colors">
            {addon.name}
          </h3>
          <div className="flex items-baseline gap-2">
            {addon.originalPrice && addon.originalPrice > addon.price && (
              <span className="text-xs text-gray-500 line-through">
                KSh {addon.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-gray-900">
              KSh {addon.price.toLocaleString()}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 text-xs border-gray-300 hover:border-[#A7E059] w-fit"
          onClick={handleAddToCart}
        >
          Add
        </Button>
      </div>
    </Link>
  );
}

