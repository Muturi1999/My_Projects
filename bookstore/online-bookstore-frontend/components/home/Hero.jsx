// components/home/Hero.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-[#f5f7fe] py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Buy and sell your <br /> books for <span className="text-blue-600">the best prices</span>
          </h1>
          <p className="text-gray-600 mt-4">
            Find and read your favorite books at the best prices you want. Be part of the region's growing community of book lovers and merchants.
          </p>
          <div className="mt-6 relative max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search for Books..."
              className="w-full border border-gray-300 py-3 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute top-3.5 right-4 text-gray-500 text-xl" />
          </div>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/book-hero.png"
            alt="Book Hero"
            width={400}
            height={400}
            className="rounded-xl shadow-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
