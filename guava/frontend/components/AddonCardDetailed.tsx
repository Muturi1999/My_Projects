"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AddonCardDetailedProps {
  addon: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
  };
  index: number;
}

export function AddonCardDetailed({ addon, index }: AddonCardDetailedProps) {
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
          className="object-contain"
        />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#A7E059] transition-colors">
          {addon.name}
        </p>
        <div className="flex items-center gap-2 text-sm">
          {addon.originalPrice && (
            <span className="text-gray-500 line-through">
              KSh {addon.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="font-semibold text-gray-900">
            KSh {addon.price.toLocaleString()}
          </span>
          {addonSaving > 0 && (
            <span className="text-xs text-red-600">
              Save KSh {addonSaving.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm px-4 py-2 rounded-none"
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </Link>
  );
}

