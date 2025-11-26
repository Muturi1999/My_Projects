"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface AddToCartButtonProps extends Omit<React.ComponentProps<"button">, "variant"> {
  className?: string;
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export function AddToCartButton({
  className,
  size = "default",
  fullWidth = true,
  variant = "destructive",
  ...props
}: AddToCartButtonProps) {
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

  return (
    <Button
      variant={variant}
      className={cn(
        "font-semibold rounded-none",
        baseStyles,
        fullWidth && "w-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <ShoppingCartIcon className={cn(iconSizes[size], "mr-1.5")} />
      ADD TO CART
    </Button>
  );
}

