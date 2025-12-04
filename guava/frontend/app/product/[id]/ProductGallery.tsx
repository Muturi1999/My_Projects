"use client";

import React from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  // Limit to at most 6 images for the gallery
  const safeImages = images && images.length ? images.slice(0, 6) : [""];
  const maxVisible = 4;
  const total = safeImages.length;

  const [startIndex, setStartIndex] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const canPrev = startIndex > 0;
  const canNext = startIndex + maxVisible < total;

  const visibleImages = safeImages.slice(startIndex, startIndex + maxVisible);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-none overflow-hidden border border-gray-200 p-4">
        <Image
          src={safeImages[activeIndex] ?? safeImages[0]}
          alt={name}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Thumbnails + navigation (4 visible, up to 6 total with arrows) */}
      {total > 1 && (
        <div className="flex items-center gap-3 justify-between">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => canPrev && setStartIndex((prev) => prev - 1)}
            className="h-10 w-10 text-xl flex items-center justify-center border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-40 disabled:cursor-default"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
            {visibleImages.map((image, index) => {
              const absoluteIndex = startIndex + index;
              return (
                <button
                  key={absoluteIndex}
                  type="button"
                  onClick={() => setActiveIndex(absoluteIndex)}
                  className="relative w-full aspect-[4/3] border border-gray-200 rounded-none overflow-hidden bg-white hover:border-[#A7E059] transition-colors"
                >
                  <Image
                    src={image}
                    alt={`${name} thumbnail ${absoluteIndex + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canNext}
            onClick={() => canNext && setStartIndex((prev) => prev + 1)}
            className="h-10 w-10 text-xl flex items-center justify-center border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-40 disabled:cursor-default"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}


