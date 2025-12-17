"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { brandSections } from "@/lib/data/categories";

export function BrandSection() {
  const hpBrand = brandSections.find((b) => b.slug === "hp");
  const dellBrand = brandSections.find((b) => b.slug === "dell");
  const lenovoBrand = brandSections.find((b) => b.slug === "lenovo");
  const appleBrand = brandSections.find((b) => b.slug === "apple");
  const acerBrand = brandSections.find((b) => b.slug === "acer");

  return (
    <section className="py-12 bg-gray-50">
      <div className="section-wrapper px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="section-heading">Shop Laptop by Brand</h2>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#A7E059] transition-colors"
          >
            <span>View all brands</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* HP - Full Height Left Column (image as full background, overlay content) */}
          {hpBrand && (
            <Link href={`/brands/${hpBrand.slug}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative h-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] rounded-none p-4 sm:p-6 md:p-8 text-white overflow-hidden group cursor-pointer border border-gray-200"
              >
                {/* Full background image */}
                <Image
                  src={hpBrand.image}
                  alt={hpBrand.name}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-colors" />

                {/* Overlay content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                      {hpBrand.name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-100/90 max-w-md">
                      {hpBrand.text}
                    </p>
                    {hpBrand.discount > 0 && (
                      <p className="mt-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-wide">
                        <span className="text-[#A7E059] mr-1">SAVE</span> up to {hpBrand.discount}% 
                      </p>
                    )}
                  </div>
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm md:text-base font-semibold text-[#A7E059] group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <span
                        aria-hidden
                        className="inline-block transform group-hover:translate-x-0.5 transition-transform"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Right Column - Two Rows */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top Row: Dell and Lenovo (image as full background, overlay content) */}
            {dellBrand && (
              <Link href={`/brands/${dellBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[230px] sm:h-[260px] md:h-[280px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                >
                  <Image
                    src={dellBrand.image}
                    alt={dellBrand.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/15 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/25 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-1.5">
                        {dellBrand.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-100/90 max-w-xs">
                        {dellBrand.text}
                      </p>
                      {dellBrand.discount > 0 && (
                        <p className="mt-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide">
                          <span className="text-[#A7E059] mr-1">SAVE</span> up to {dellBrand.discount}% 
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#A7E059] group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <span
                        aria-hidden
                        className="inline-block transform group-hover:translate-x-0.5 transition-transform"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {lenovoBrand && (
              <Link href={`/brands/${lenovoBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[230px] sm:h-[260px] md:h-[280px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                >
                  <Image
                    src={lenovoBrand.image}
                    alt={lenovoBrand.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/15 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/25 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{lenovoBrand.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-100/90 max-w-xs">
                        {lenovoBrand.text}
                      </p>
                      {lenovoBrand.discount > 0 && (
                        <p className="mt-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-wide">
                          <span className="text-[#A7E059] mr-1">SAVE</span> up to {lenovoBrand.discount}% 
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#A7E059] group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <span
                        aria-hidden
                        className="inline-block transform group-hover:translate-x-0.5 transition-transform"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Bottom Row: Apple and Acer (image as full background, overlay content) */}
            {appleBrand && (
              <Link href={`/brands/${appleBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[240px] sm:h-[270px] md:h-[290px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                >
                  <Image
                    src={appleBrand.image}
                    alt={appleBrand.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/15 group-hover:from-black/85 group-hover:via-black/55 group-hover:to-black/25 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{appleBrand.name}</h3>
                      <p className="text-sm text-gray-100/90 max-w-xs">{appleBrand.text}</p>
                      {appleBrand.discount > 0 && (
                        <p className="mt-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                          <span className="text-[#A7E059] mr-1">SAVE</span> up to {appleBrand.discount}% 
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#A7E059] group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <span
                        aria-hidden
                        className="inline-block transform group-hover:translate-x-0.5 transition-transform"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {acerBrand && (
              <Link href={`/brands/${acerBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[240px] sm:h-[270px] md:h-[290px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                >
                  <Image
                    src={acerBrand.image}
                    alt={acerBrand.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/15 group-hover:from-black/85 group-hover:via-black/55 group-hover:to-black/25 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{acerBrand.name}</h3>
                      <p className="text-sm text-gray-100/90 max-w-xs">{acerBrand.text}</p>
                      {acerBrand.discount > 0 && (
                        <p className="mt-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                          <span className="text-[#A7E059] mr-1">SAVE</span> up to {acerBrand.discount}% 
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#A7E059] group-hover:text-white transition-colors">
                      <span>Shop now</span>
                      <span
                        aria-hidden
                        className="inline-block transform group-hover:translate-x-0.5 transition-transform"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
