"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  discount?: string;
  description?: string;
  priceText?: string;
  image?: string;
  logo?: string;
  backgroundColor?: string;
  productId?: string;
  buttonText?: string;
  className?: string;
  variant?: "tp-link" | "xiaomi";
}

export function PromotionalBanner({
  title,
  subtitle,
  discount,
  description,
  priceText,
  image,
  logo,
  backgroundColor,
  productId,
  buttonText = "SHOP NOW",
  className,
  variant,
}: PromotionalBannerProps) {
  const bgColor =
    backgroundColor ||
    (variant === "tp-link" ? "#A7E059" : variant === "xiaomi" ? "#F7E99E" : "#A7E059");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "lg:col-span-1 rounded-none p-4 sm:p-5 md:p-6 text-white flex flex-col justify-center items-center text-center w-full max-w-full sm:max-w-[280px] mx-auto lg:mx-0 space-y-2 sm:space-y-3 relative overflow-hidden border border-gray-200",
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {/* Image */}
      {image && (
        <div className="relative w-full h-24 sm:h-32 md:h-36 flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={120}
            height={120}
            className="object-contain w-auto h-full max-h-full"
          />
        </div>
      )}

      {/* Logo and Title */}
      {variant === "xiaomi" && logo ? (
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-10 sm:w-12 h-4 sm:h-5 flex items-center">
            <Image
              src={logo}
              alt={title}
              width={48}
              height={20}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            {title}
          </div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{title}</div>
          {subtitle && (
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">{subtitle}</h3>
          )}
        </div>
      )}

      {/* Subtitle for Xiaomi */}
      {variant === "xiaomi" && subtitle && (
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
          {subtitle}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-[10px] sm:text-xs md:text-sm px-2",
            variant === "xiaomi" ? "text-gray-700" : "opacity-90"
          )}
        >
          {description}
        </p>
      )}

      {/* Discount */}
      {discount && variant !== "xiaomi" && (
        <p className="text-sm sm:text-base md:text-lg font-bold">{discount}</p>
      )}

      {/* Price Banner */}
      {priceText && (
        <div
          className={cn(
            "rounded-none px-3 sm:px-4 py-1.5 sm:py-2 w-full border border-gray-200",
            variant === "xiaomi" ? "bg-white" : "bg-white/10 backdrop-blur-sm"
          )}
        >
          <p
            className={cn(
              "text-xs sm:text-sm md:text-base font-medium",
              variant === "xiaomi" ? "text-gray-900" : "text-white"
            )}
          >
            {priceText}
          </p>
        </div>
      )}

      {/* Button */}
      {productId && (
        <Link href={`/product/${productId}`} className="w-full mt-2">
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full rounded-none"
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            {buttonText} →
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

