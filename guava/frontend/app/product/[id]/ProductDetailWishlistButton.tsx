"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useState, useEffect, useRef } from "react";

interface ProductDetailWishlistButtonProps {
  productId: string;
}

export function ProductDetailWishlistButton({
  productId,
}: ProductDetailWishlistButtonProps) {
  const { ids, toggle } = useWishlist();
  const isInWishlist = ids.includes(productId);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"added" | "exists">("added");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInWishlist) {
            // Already in wishlist – just notify
            setToastVariant("exists");
          } else {
            toggle(productId);
            setToastVariant("added");
          }

          setShowToast(true);
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = window.setTimeout(() => setShowToast(false), 2000);
        }}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs md:text-sm transition-colors ${
          isInWishlist
            ? "border-red-500 text-red-600 bg-red-50"
            : "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
        }`}
      >
        <HeartIcon
          className={`h-4 w-4 ${
            isInWishlist ? "fill-current text-red-600" : ""
          }`}
        />
        <span>{isInWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
      </button>

      {showToast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${
            toastVariant === "added" ? "bg-green-600" : "bg-black"
          }`}
        >
          <HeartIcon className="h-4 w-4" />
          <span>
            {toastVariant === "exists"
              ? "Item already in wishlist"
              : "Added to wishlist"}
          </span>
        </div>
      )}
    </>
  );
}


