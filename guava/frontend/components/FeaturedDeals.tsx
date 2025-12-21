"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredDeals } from "@/lib/data/products";
import { useHomepage } from "@/lib/hooks/useCMS";
import type { FeaturedTile } from "@/lib/types/cms";
import { getProductImage } from "@/lib/utils/imageMapper";

interface DealDisplay {
  id: string;
  name: string;
  model?: string;
  description: string[];
  price: number;
  saving: number;
  badge?: string;
  image: string;
  productId?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function FeaturedDeals() {
  const { homepage, loading } = useHomepage();

  // Get featured deals from CMS or fallback to static data
  const displayedDeals = useMemo((): DealDisplay[] => {
    if (!loading && homepage?.featured_deals?.items && homepage.featured_deals.items.length > 0) {
      // Map CMS FeaturedTile to DealDisplay format
      return homepage.featured_deals.items.map((deal: FeaturedTile) => ({
        id: deal.id,
        name: deal.title,
        model: deal.subtitle,
        description: Array.isArray(deal.description) ? deal.description : [],
        price: deal.price,
        saving: deal.saving || (deal.originalPrice ? deal.originalPrice - deal.price : 0),
        badge: deal.badge,
        image: getProductImage(deal.title, deal.image),
        productId: deal.id,
        ctaLabel: deal.ctaLabel,
        ctaHref: deal.ctaHref,
      }));
    }
    
    // Fallback to static data
    return featuredDeals.map((deal) => ({
      ...deal,
      image: getProductImage(deal.name, deal.image),
    }));
  }, [homepage, loading]);

  if (displayedDeals.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="section-wrapper">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center md:items-stretch">
          {displayedDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-[#789b32] rounded-none text-white relative overflow-hidden shadow-lg border border-gray-200 w-full md:flex-1 min-h-[320px]"
            >
              {deal.badge && (
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-white text-[#A7E059] font-semibold z-20"
                >
                  {deal.badge}
                </Badge>
              )}
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Content Section */}
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 z-10 relative">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-white/90 uppercase">
                        2025 model | new release
                      </p>
                      <h3 className="mt-1 text-base sm:text-xl md:text-2xl font-bold text-white drop-shadow-sm leading-tight">
                        {deal.name}{deal.model ? ` - ${deal.model}` : ""}
                      </h3>
                    </div>
                    <div className="inline-flex items-center bg-[#FFD600] text-[9px] sm:text-[10px] font-semibold text-black px-2.5 py-1 rounded-none shadow-sm">
                      INCLUDES FREE 24&quot; MONITOR
                    </div>
                    <ul className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-white mt-1.5">
                      {deal.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5 pt-4">
                    <div className="flex flex-col gap-0.5 text-white">
                      <span className="text-sm sm:text-base opacity-90">
                        Ksh {deal.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm opacity-90">
                        Save: Ksh {deal.saving.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={deal.ctaHref || `/checkout?productId=${deal.productId ?? deal.id}`}
                    className="mt-3 inline-flex w-auto"
                  >
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs px-4 sm:px-5 py-2 rounded-none shadow-md transition-all flex items-center gap-1.5"
                    >
                      <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      {deal.ctaLabel || "BUY NOW"}
                    </Button>
                  </Link>
                </div>
                {/* Right Image Section with Intel + HP badges */}
                {/* Right panel: OMEN image should occupy full height and about half width */}
                <div className="relative z-10 w-full md:w-1/2 flex-shrink-0 h-56 md:h-full flex items-stretch justify-center">
                  {/* subtle green gradient to blend image with card background */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#789b32] via-[#6b8b2d] to-[#789b32]" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Omen laptop image */}
                    <Image
                      src={deal.image}
                      alt={`${deal.name} ${deal.model}`}
                      width={256}
                      height={353}
                      className="object-contain w-full h-full max-h-full max-w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
