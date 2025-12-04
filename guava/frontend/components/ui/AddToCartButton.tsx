"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/lib/data/products";
import { useCart } from "@/lib/hooks/use-cart";

interface AddToCartButtonProps
  extends Omit<React.ComponentProps<"button">, "variant"> {
  className?: string;
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  product?: Product;
}

export function AddToCartButton({
  className,
  size = "default",
  fullWidth = true,
  variant = "destructive",
  product,
  ...props
}: AddToCartButtonProps) {
  const { add, items } = useCart();
  const { onClick, ...rest } = props;
  const [showToast, setShowToast] = React.useState(false);
  const [toastVariant, setToastVariant] =
    React.useState<"added" | "exists">("added");
  const toastTimeoutRef = React.useRef<number | null>(null);

  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    default: "text-xs sm:text-sm py-2",
    lg: "text-sm px-6 py-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-3 w-3 sm:h-4 sm:w-4",
    lg: "h-4 w-4",
  };

  const baseStyles = variant === "destructive" 
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // First, update cart if we have a product
    if (product) {
      const alreadyInCart = items.some(
        (item) => item.productId === product.id
      );

      if (alreadyInCart) {
        setToastVariant("exists");
      } else {
        add(product.id, 1);
        setToastVariant("added");
      }
    }
    // Then, allow caller to run any extra logic (like navigation)
    if (onClick) {
      onClick(e);
    }
  };

  // Auto-hide toast on unmount
  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Button
        variant={variant}
        className={cn(
          "font-semibold rounded-none",
          baseStyles,
          fullWidth && "w-full",
          sizeClasses[size],
          className
        )}
        onClick={(e) => {
          // Trigger cart logic
          handleClick(e);
          // Show lightweight snackbar
          if (product) {
            setShowToast(true);
            if (toastTimeoutRef.current) {
              window.clearTimeout(toastTimeoutRef.current);
            }
            toastTimeoutRef.current = window.setTimeout(
              () => setShowToast(false),
              2000
            );
          }
        }}
        {...rest}
      >
        <ShoppingCartIcon className={cn(iconSizes[size], "mr-1.5")} />
        ADD TO CART
      </Button>

      {showToast && product && (
        <div
          className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2",
            toastVariant === "added" ? "bg-green-600" : "bg-black"
          )}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          <span>
            {toastVariant === "exists"
              ? "Item already in cart"
              : "Added to cart"}
          </span>
        </div>
      )}
    </>
  );
}

