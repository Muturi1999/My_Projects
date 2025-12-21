"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useHomepage } from "@/lib/hooks/useCMS";
import type { HeroSlide } from "@/lib/types/cms";

const DEFAULT_HERO_SLIDES = ["/Hero.png", "/Hero.png", "/Hero.png"];

export function HeroBanner() {
  const { homepage, loading } = useHomepage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Get hero slides from CMS or use default
  const heroSlides = useMemo(() => {
    if (!loading && homepage?.hero_slides && homepage.hero_slides.length > 0) {
      // Use CMS slides, prefer rightImage, fallback to leftImage, then default
      return homepage.hero_slides.map((slide: HeroSlide) => 
        slide.rightImage || slide.leftImage || "/Hero.png"
      );
    }
    return DEFAULT_HERO_SLIDES;
  }, [homepage, loading]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentImage = heroSlides[activeIndex] ?? heroSlides[0];

  if (heroSlides.length === 0) {
    return null;
  }

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
        {heroSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {heroSlides.map((_, index) => (
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
        )}
      </div>
    </section>
  );
}

