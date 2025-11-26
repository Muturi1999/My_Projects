"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "hero-slide-1",
    background:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1800&q=80",
    leftLaptop:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    rightLaptop:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hero-slide-2",
    background:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80",
    leftLaptop:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
    rightLaptop:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hero-slide-3",
    background:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80",
    leftLaptop:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
    rightLaptop:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
  },
];

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bubblePositions, setBubblePositions] = useState<Array<{ top: number; left: number }>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Generate bubble positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setBubblePositions(
      Array.from({ length: 14 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
      }))
    );
  }, []);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  return (
    <section className="relative overflow-hidden bg-[#fce1d6]">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[544px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.background}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffdbc8]/90 via-[#ffd9d0]/80 to-[#ffd3c7]/90" />
          </motion.div>
        </AnimatePresence>

        {/* flowing ribbons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 top-1/3 h-24 bg-gradient-to-r from-[#f97316] via-[#f0503a] to-[#f97f71] opacity-60 rounded-full blur-3xl"
            animate={{ x: ["-10%", "10%", "-10%"] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-24 bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#16a34a] opacity-60 rounded-full blur-3xl"
            animate={{ x: ["10%", "-10%", "10%"] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          >
            {bubblePositions.map((pos, index) => (
              <span
                key={`bubble-${index}`}
                className="absolute w-6 h-6 rounded-full bg-white/30 border border-white/40"
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Laptops */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <motion.div
            key={`${activeSlide.id}-left`}
            initial={{ opacity: 0, x: -40, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
            className="absolute left-6 md:left-10 lg:left-24 top-1/2 -translate-y-1/2"
          >
            <Image
              src={activeSlide.leftLaptop}
              alt="Featured laptop"
              width={280}
              height={180}
              className="drop-shadow-[0_25px_40px_rgba(0,0,0,0.2)]"
            />
          </motion.div>
          <motion.div
            key={`${activeSlide.id}-right`}
            initial={{ opacity: 0, x: 40, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
            className="absolute right-6 md:right-10 lg:right-24 top-1/2 -translate-y-1/2"
          >
            <Image
              src={activeSlide.rightLaptop}
              alt="Featured laptop"
              width={280}
              height={180}
              className="drop-shadow-[0_25px_40px_rgba(0,0,0,0.2)]"
            />
          </motion.div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-gray-900 px-4 py-16 gap-4 md:gap-6">
          <motion.span
            key={`${activeSlide.id}-badge`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="uppercase tracking-wide bg-[#f97316] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
          >
            Up to 45% off
          </motion.span>
          <motion.h1
            key={`${activeSlide.id}-title`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
          >
            Laptop Mega Sale
          </motion.h1>
          <motion.p
            key={`${activeSlide.id}-subtitle`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-medium"
          >
            Lowest. Ever. Price.
          </motion.p>
          <motion.div
            key={`${activeSlide.id}-cta`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white text-lg px-10 py-6 rounded-full shadow-lg">
              Shop the deals
            </Button>
          </motion.div>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-10 bg-gray-900"
                  : "w-2.5 bg-white/70"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

