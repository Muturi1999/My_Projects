"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { featuredDeals } from "@/lib/data/products";

export function FeaturedDeals() {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="section-wrapper">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center md:items-stretch">
          {featuredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-[#A7E059] rounded-none text-white relative overflow-hidden shadow-lg border border-gray-200 w-full max-w-full md:max-w-[646px] min-h-[280px]"
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
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-sm leading-tight">
                        {deal.name} - {deal.model}
                      </h3>
                    </div>
                    <ul className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-white">
                      {deal.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                      <span className="line-through opacity-80 text-white/90 text-sm sm:text-base">
                        KSh {deal.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-sm">
                        KSh {deal.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-none text-white font-semibold border border-white/30">
                        Save: KSh {deal.saving.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/product/${deal.id}`} className="mt-2">
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-none shadow-lg transition-all w-full"
                    >
                      <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                      BUY NOW
                    </Button>
                  </Link>
                </div>
                {/* Right Image Section */}
                <div className="flex items-center justify-center relative z-10 w-full md:w-48 lg:w-64 flex-shrink-0 h-48 md:h-auto">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={deal.image}
                      alt={`${deal.name} ${deal.model}`}
                      width={256}
                      height={353}
                      className="object-contain w-full h-full max-h-[200px] max-w-full"
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
