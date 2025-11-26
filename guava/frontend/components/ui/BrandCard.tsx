"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  id: string;
  name: string;
  image: string;
  slug: string;
  index?: number;
  className?: string;
}

export function BrandCard({
  id,
  name,
  image,
  slug,
  index = 0,
  className,
}: BrandCardProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      className={className}
    >
      <Link
        href={`/brands/${slug}`}
        className="flex items-center justify-center h-24 md:h-28 bg-white rounded-none border border-gray-200 hover:border-[#A7E059] hover:shadow-md transition-all p-4"
      >
        <Image
          src={image}
          alt={name}
          width={120}
          height={60}
          className="object-contain max-w-full max-h-full"
          unoptimized
        />
      </Link>
    </motion.div>
  );
}

