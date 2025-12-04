"use client";

import type React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface WishlistIconProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export function WishlistIcon({ isActive, onClick, className }: WishlistIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-opacity transition-colors",
        isActive ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100",
        className
      )}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon className={cn("h-5 w-5", isActive && "fill-current")} />
    </button>
  );
}


