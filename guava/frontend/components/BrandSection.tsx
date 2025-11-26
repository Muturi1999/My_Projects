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
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading">Shop Laptop by Brand</h2>
          <Link
            href="/brands"
            className="text-[#A7E059] hover:text-[#8FC94A] font-medium text-sm transition-colors"
          >
            Shop now →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* HP - Full Height Left Column */}
          {hpBrand && (
            <Link href={`/brands/${hpBrand.slug}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative h-full min-h-[400px] sm:min-h-[500px] md:min-h-[550px] rounded-none p-4 sm:p-6 md:p-8 text-white overflow-hidden group cursor-pointer border border-gray-200"
                  style={{ backgroundColor: hpBrand.color }}
              >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={hpBrand.image}
                      alt={hpBrand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{hpBrand.name}</h3>
                      <p className="text-sm sm:text-base md:text-lg opacity-90">{hpBrand.text}</p>
                    </div>
                    <div className="mt-4 sm:mt-6 md:mt-8">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                        <div className="relative h-24 sm:h-28 md:h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm border border-white/20">
                          <Image
                            src={hpBrand.image}
                            alt="HP Laptop 1"
                            fill
                            className="object-contain p-1 sm:p-2"
                          />
                        </div>
                        <div className="relative h-24 sm:h-28 md:h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm border border-white/20">
                          <Image
                            src={hpBrand.image}
                            alt="HP Laptop 2"
                            fill
                            className="object-contain p-1 sm:p-2"
                          />
                        </div>
                      </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline text-sm sm:text-base">
                      Shop now →
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Right Column - Two Rows */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top Row: Dell and Lenovo */}
            {dellBrand && (
              <Link href={`/brands/${dellBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[250px] sm:h-[280px] md:h-[300px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                  style={{ backgroundColor: dellBrand.color }}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={dellBrand.image}
                      alt={dellBrand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{dellBrand.name}</h3>
                      <p className="text-xs sm:text-sm opacity-90">{dellBrand.text}</p>
                    </div>
                    <div className="relative h-20 sm:h-24 md:h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm mb-3 sm:mb-4 border border-white/20">
                      <Image
                        src={dellBrand.image}
                        alt="Dell Laptop"
                        fill
                        className="object-contain p-1 sm:p-2"
                      />
                    </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline text-xs sm:text-sm">
                      Shop now →
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
                  className="relative h-[250px] sm:h-[280px] md:h-[300px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                  style={{ backgroundColor: lenovoBrand.color }}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={lenovoBrand.image}
                      alt={lenovoBrand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{lenovoBrand.name}</h3>
                      <p className="text-sm opacity-90">{lenovoBrand.text}</p>
                    </div>
                    <div className="relative h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm mb-4 border border-white/20">
                      <Image
                        src={lenovoBrand.image}
                        alt="Lenovo Laptop"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline text-sm">
                      Shop now →
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Bottom Row: Apple and Acer */}
            {appleBrand && (
              <Link href={`/brands/${appleBrand.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[250px] sm:h-[280px] md:h-[300px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                  style={{ backgroundColor: appleBrand.color }}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={appleBrand.image}
                      alt={appleBrand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{appleBrand.name}</h3>
                      <p className="text-sm opacity-90">{appleBrand.text}</p>
                    </div>
                    <div className="relative h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm mb-4 border border-white/20">
                      <Image
                        src={appleBrand.image}
                        alt="Apple Laptop"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline text-sm">
                      Shop now →
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
                  className="relative h-[250px] sm:h-[280px] md:h-[300px] rounded-none p-4 sm:p-5 md:p-6 text-white overflow-hidden group cursor-pointer border border-gray-200"
                  style={{ backgroundColor: acerBrand.color }}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={acerBrand.image}
                      alt={acerBrand.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{acerBrand.name}</h3>
                      <p className="text-sm opacity-90">{acerBrand.text}</p>
                    </div>
                    <div className="relative h-32 bg-white/10 rounded-none overflow-hidden backdrop-blur-sm mb-4 border border-white/20">
                      <Image
                        src={acerBrand.image}
                        alt="Acer Laptop"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="inline-flex items-center text-white font-medium hover:underline text-sm">
                      Shop now →
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
