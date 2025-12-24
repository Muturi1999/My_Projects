"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { StarIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { WishlistIcon } from "@/components/ui/WishlistIcon";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { getProductUrl } from "@/lib/utils/sectionSlugs";

export interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "compact" | "detailed" | "hot-deal";
  showSpecs?: boolean;
  showWishlist?: boolean; // when undefined, defaults to true
  showViewButton?: boolean;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: string, e: React.MouseEvent) => void;
  onCardClick?: () => void;
  className?: string;
  imageHeight?: string;
  badgePosition?: "top-left" | "top-right" | "inline";
  section?: string; // Section name for URL generation (e.g., "Today's Hot Deals")
}

export function ProductCard({
  product,
  index = 0,
  variant = "default",
  showSpecs = false,
  showWishlist,
  showViewButton = false,
  isInWishlist,
  onWishlistToggle,
  onCardClick,
  className,
  imageHeight = "h-48",
  badgePosition = "top-left",
  section,
}: ProductCardProps) {
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  
  // Determine if card is wrapped in Link (to avoid nested links)
  const isCardWrappedInLink = !onCardClick;

  // Wishlist behaviour: if parent doesn't provide handler, use global wishlist
  const managedByParent = typeof onWishlistToggle === "function";
  const effectiveShowWishlist = showWishlist ?? true;
  const effectiveIsInWishlist = managedByParent
    ? !!isInWishlist
    : wishlistIds.includes(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (managedByParent && onWishlistToggle) {
      onWishlistToggle(product.id, e);
    } else {
      e.preventDefault();
      toggleWishlist(product.id);
    }
  };

  const specs = showSpecs
    ? [
        product.processor && { label: "Processor", value: product.processor },
        product.generation && { label: "Generation", value: product.generation },
        product.ram && { label: "RAM", value: product.ram },
        product.storage && { label: "Storage", value: product.storage },
        product.screen && { label: "Screen", value: product.screen },
        product.os && { label: "OS", value: product.os },
      ].filter(Boolean) as { label: string; value: string }[]
    : [];

  const renderStars = (rating: number) => {
    if (variant === "hot-deal") {
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              )}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: product.rating }).map((_, i) => (
          <StarIcon
            key={i}
            className="h-4 w-4 text-yellow-400 fill-current"
          />
        ))}
      </div>
    );
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={variant !== "hot-deal" ? { y: -4 } : undefined}
      className={cn("h-full", className)}
    >
      <Card
        className={cn(
          "group cursor-pointer h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border border-gray-200 rounded-none"
        )}
        onClick={onCardClick}
      >
        {/* Image Container */}
        <div className={cn("relative p-4 border-b border-gray-200", variant === "hot-deal" && "p-3")}>
          <div
            className={cn(
              "relative w-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden",
              imageHeight,
              variant === "hot-deal" && "h-[200px]"
            )}
          >
            {product.image && product.image.trim() !== "" ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={cn(
                  "object-contain",
                  variant === "hot-deal" ? "p-4" : "p-4",
                  variant === "detailed" && "group-hover:scale-105 transition-transform duration-300"
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-4">
                No Image Available
              </div>
            )}

            {/* Badges - unified style like Today's Hot Deals */}
            {badgePosition === "top-left" && (
              <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                {discountPercentage > 0 && (
                  <Badge
                    className="text-xs font-semibold bg-[#A7E059] text-black rounded-full px-3 py-1 border-none"
                  >
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {product.hot && (
                  <Badge className="text-xs font-semibold bg-red-500 text-white rounded-full px-3 py-1 border-none">
                    HOT
                  </Badge>
                )}
              </div>
            )}

            {/* Hover Actions */}
            {(showViewButton || effectiveShowWishlist) && (
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {showViewButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick?.();
                    }}
                    className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <EyeIcon className="h-5 w-5 text-gray-700" />
                  </button>
                )}
                {effectiveShowWishlist && (
                  <WishlistIcon
                    isActive={effectiveIsInWishlist}
                    onClick={handleWishlistClick}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            variant === "hot-deal" ? "p-3" : "p-4",
            variant === "compact" && "p-3"
          )}
        >
          {/* Discount Badge (Inline) - Before Title */}
          {badgePosition === "inline" && (
            <div className="mb-2 flex flex-col gap-1.5">
              {discountPercentage > 0 && (
                <span className="inline-flex items-center bg-[#A7E059] text-black px-2.5 py-1 rounded-full text-xs font-semibold w-fit">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.hot && (
                <Badge
                  variant="destructive"
                  className="rounded-full text-xs font-semibold px-2.5 py-1 w-fit"
                >
                  HOT
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          {isCardWrappedInLink ? (
            // When card is wrapped in Link, use span to avoid nested links
            <span
              className={cn(
                "font-semibold mb-2 line-clamp-2 block",
                variant === "hot-deal"
                  ? "text-sm sm:text-base md:text-lg"
                  : variant === "compact"
                  ? "text-sm md:text-base min-h-[2rem]"
                  : "text-base min-h-[3rem]"
              )}
            >
              {product.name}
            </span>
          ) : (
            // When card has onClick handler, use Link for title
            <Link
              href={getProductUrl(product.id, section)}
              onClick={(e) => {
                e.stopPropagation();
                onCardClick?.();
              }}
              className={cn(
                "font-semibold mb-2 line-clamp-2",
                variant === "hot-deal"
                  ? "text-sm sm:text-base md:text-lg hover:text-[#A7E059] transition-colors"
                  : variant === "compact"
                  ? "text-sm md:text-base min-h-[2rem]"
                  : "text-base min-h-[3rem]"
              )}
            >
              {product.name}
            </Link>
          )}

          {/* Rating */}
          {variant !== "compact" && (
            <div className="flex items-center gap-2 mb-2">
              {renderStars(product.rating)}
              {variant === "hot-deal" && product.ratingCount && (
                <span className="text-gray-500 font-public-sans text-[10px] sm:text-xs">
                  ({product.ratingCount})
                </span>
              )}
            </div>
          )}

          {/* Specs */}
          {showSpecs && specs.length > 0 && (
            <div className="space-y-1.5 mb-4 text-sm text-gray-600">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <span className="font-medium">{spec.label}: </span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className={cn("mb-3", variant === "compact" && "mb-1.5")}>
              <span
                className={cn(
                  "text-sm text-[#A7E059] font-medium",
                  variant === "hot-deal" && "text-xs sm:text-sm",
                  variant === "compact" && "text-xs md:text-sm"
                )}
              >
                {variant === "hot-deal"
                  ? `In stock (${product.stock} pcs)`
                  : "In stock"}
              </span>
            </div>
          )}

          {/* Prices */}
          <div
            className={cn(
              "flex items-center gap-3 mb-4",
              variant === "compact" && "mb-2.5",
              variant === "hot-deal" && "mb-0 flex-wrap"
            )}
          >
            <span
              className={cn(
                "text-gray-500 line-through",
                variant === "hot-deal"
                  ? "text-xs sm:text-sm"
                  : variant === "compact"
                  ? "text-xs md:text-sm"
                  : "text-sm"
              )}
            >
              Ksh {product.originalPrice.toLocaleString()}
            </span>
            <span
              className={cn(
                "font-bold text-gray-900",
                variant === "hot-deal"
                  ? "text-base sm:text-lg md:text-xl"
                  : variant === "compact"
                  ? "text-base md:text-lg"
                  : "text-xl"
              )}
            >
              Ksh {product.price.toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton
            product={product}
            className={cn(
              "mt-auto",
              variant === "hot-deal" && "mt-3 sm:mt-4",
              variant === "compact" && "mt-auto"
            )}
            size={variant === "compact" ? "sm" : "default"}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </Card>
    </motion.div>
  );

  // Wrap in Link if no onCardClick handler
  if (!onCardClick) {
    return (
      <Link href={getProductUrl(product.id, section)} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

