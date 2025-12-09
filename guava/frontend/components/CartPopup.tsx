"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/lib/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  categorySubcategoryProducts,
  type Product,
} from "@/lib/data/products";
import { categoryProducts } from "@/lib/data/categoryProducts";

// Build unified catalog
const categoryProductsList: Product[] = Object.values(categoryProducts).flat();
const categorySubcategoryList: Product[] = Object.values(
  categorySubcategoryProducts
).flatMap((group) => Object.values(group).flat());

const allCatalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
  ...categoryProductsList,
  ...categorySubcategoryList,
];

function getProductById(id: string): Product | undefined {
  return allCatalogProducts.find((p) => p.id === id);
}

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPopup({ isOpen, onClose }: CartPopupProps) {
  const { items, remove, setQuantity } = useCart();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  // Get products with quantities
  const cartProducts = useMemo(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
        };
      })
      .filter((p): p is Product & { quantity: number } => p !== null);
  }, [items]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartProducts]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col hidden xl:flex"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Shopping Cart ({items.length})
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close cart"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cartProducts.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cartProducts.map((item) => (
              <div key={item.id} className="px-4 py-3 flex gap-3">
                {/* Product Image */}
                <Link
                  href={`/product/${item.id}`}
                  onClick={onClose}
                  className="relative w-16 h-16 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    className="block"
                  >
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#98C243] transition-colors">
                      {item.name}
                    </h4>
                  </Link>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.quantity} x KSh {item.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove item"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Subtotal and Buttons */}
      {cartProducts.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Sub-Total:</span>
            <span className="text-lg font-bold text-gray-900">
              KSh {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="w-full bg-[#98C243] hover:bg-[#7FA836] text-white py-2.5 rounded-none"
            >
              CHECKOUT NOW →
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.push("/cart");
              }}
              variant="outline"
              className="w-full border-[#98C243] text-[#98C243] hover:bg-[#F0F9E8] py-2.5 rounded-none"
            >
              VIEW CART
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

