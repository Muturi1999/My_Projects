"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = ["/Hero.png", "/Hero.png", "/Hero.png"];

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentImage = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage + activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage}
              alt="Hero banner"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Simple pagination dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-white"
                  : "w-2 bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

