"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  ServerIcon,
  PlayIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  RadioIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { shopCategories } from "@/lib/data/categories";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: ComputerDesktopIcon,
  keyboard: RectangleStackIcon,
  monitor: ComputerDesktopIcon,
  smartphone: DevicePhoneMobileIcon,
  tablet: DevicePhoneMobileIcon,
  printer: PrinterIcon,
  "hard-drive": ServerIcon,
  gamepad: PlayIcon,
  software: Squares2X2Icon,
  desktop: ComputerDesktopIcon,
  headphones: RadioIcon,
  wifi: ChartBarIcon,
};

export function CategoryGrid() {
  // Split into two rows of 6 categories each
  const firstRow = shopCategories.slice(0, 6);
  const secondRow = shopCategories.slice(6, 12);

  return (
    <section className="bg-white min-h-[400px] sm:min-h-[500px] md:min-h-[604px]">
      <div className="section-wrapper py-6 sm:py-8 md:py-12">
        <h2 className="section-heading mb-4 sm:mb-6 md:mb-8 text-left text-xl sm:text-2xl">Shop by Category</h2>
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {firstRow.map((category, index) => {
              const IconComponent = iconMap[category.icon];
              const Icon = IconComponent && typeof IconComponent === 'function' ? IconComponent : RectangleStackIcon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="w-full"
                >
                  <Link
                    href={`/category/${category.slug || category.id}`}
                    className="flex flex-col bg-white hover:shadow-md transition-all border border-gray-200 hover:border-[#A7E059] group h-full"
                    style={{
                      borderRadius: "0px",
                      borderWidth: "1px",
                      paddingTop: "16px",
                      paddingRight: "8px",
                      paddingBottom: "16px",
                      paddingLeft: "8px",
                      gap: "12px",
                      minHeight: "180px",
                    }}
                  >
                    {category.image ? (
                      <div className="relative w-full flex items-center justify-center flex-1" style={{ width: "100%" }}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={181}
                          height={120}
                          className="object-contain w-full h-auto"
                          style={{ maxHeight: "80px", maxWidth: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 sm:h-20 md:h-24 bg-[#A7E059]/10 group-hover:bg-[#A7E059]/20 rounded-none flex items-center justify-center transition-colors flex-1">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#A7E059]" />
                      </div>
                    )}
                    <span 
                      className="text-gray-700 text-center group-hover:text-[#A7E059] transition-colors font-public-sans text-xs sm:text-sm md:text-base"
                      style={{
                        fontWeight: 500,
                        lineHeight: "1.4",
                        textAlign: "center",
                      }}
                    >
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {secondRow.map((category, index) => {
              const IconComponent = iconMap[category.icon];
              const Icon = IconComponent && typeof IconComponent === 'function' ? IconComponent : RectangleStackIcon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 6) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="w-full"
                >
                  <Link
                    href={`/category/${category.slug || category.id}`}
                    className="flex flex-col bg-white hover:shadow-md transition-all border border-gray-200 hover:border-[#A7E059] group h-full"
                    style={{
                      borderRadius: "0px",
                      borderWidth: "1px",
                      paddingTop: "16px",
                      paddingRight: "8px",
                      paddingBottom: "16px",
                      paddingLeft: "8px",
                      gap: "12px",
                      minHeight: "180px",
                    }}
                  >
                    {category.image ? (
                      <div className="relative w-full flex items-center justify-center flex-1" style={{ width: "100%" }}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={181}
                          height={120}
                          className="object-contain w-full h-auto"
                          style={{ maxHeight: "80px", maxWidth: "100%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 sm:h-20 md:h-24 bg-[#A7E059]/10 group-hover:bg-[#A7E059]/20 rounded-none flex items-center justify-center transition-colors flex-1">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#A7E059]" />
                      </div>
                    )}
                    <span 
                      className="text-gray-700 text-center group-hover:text-[#A7E059] transition-colors font-public-sans text-xs sm:text-sm md:text-base"
                      style={{
                        fontWeight: 500,
                        lineHeight: "1.4",
                        textAlign: "center",
                      }}
                    >
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
