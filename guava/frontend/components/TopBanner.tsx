"use client";

import { motion } from "framer-motion";

export function TopBanner() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-brand text-white py-2 px-4"
    >
      <div className="container mx-auto flex justify-between items-center text-sm font-medium">
        <span>Black Friday</span>
        <span>Up to 45% OFF</span>
      </div>
    </motion.div>
  );
}

