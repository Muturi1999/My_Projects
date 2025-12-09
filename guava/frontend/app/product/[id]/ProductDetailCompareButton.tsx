"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { useCompare } from "@/lib/hooks/use-compare";
import { useState } from "react";

interface ProductDetailCompareButtonProps {
  productId: string;
}

export function ProductDetailCompareButton({
  productId,
}: ProductDetailCompareButtonProps) {
  const { isInCompare, toggle, canAddMore, count, maxItems } = useCompare();
  const [showMessage, setShowMessage] = useState(false);
  const inCompare = isInCompare(productId);

  const handleClick = () => {
    if (!inCompare && !canAddMore) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }
    toggle(productId);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 transition-colors ${
          inCompare
            ? "text-[#98C243]"
            : "text-gray-700 hover:text-[#98C243]"
        }`}
        aria-label={inCompare ? "Remove from Compare" : "Add to Compare"}
      >
        <Squares2X2Icon className="h-4 w-4" />
        <span>{inCompare ? "Remove from Compare" : "Add to Compare"}</span>
      </button>
      {showMessage && (
        <div className="absolute top-full left-0 mt-2 bg-red-600 text-white text-xs px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
          Maximum {maxItems} items allowed. Remove an item to add more.
        </div>
      )}
    </div>
  );
}

