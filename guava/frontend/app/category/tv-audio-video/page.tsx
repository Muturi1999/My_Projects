"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";

type Subcategory = {
  name: string;
  slug: string;
  description: string;
  products: {
    name: string;
    image: string;
    description: string;
  }[];
};

const subcategories: Subcategory[] = [
  {
    name: "TVs",
    slug: "tvs",
    description:
      "4K and smart TVs for living rooms, boardrooms and digital signage.",
    products: [
      {
        name: "55\" 4K Smart TV",
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
        description: "Crystal‑clear 4K picture with built‑in streaming apps.",
      },
      {
        name: "65\" QLED Smart TV",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Ultra‑bright QLED panel for vivid movies and sports.",
      },
      {
        name: "32\" HD Commercial Display",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        description: "Compact display ideal for shops and reception areas.",
      },
    ],
  },
  {
    name: "Projectors",
    slug: "projectors",
    description:
      "Portable and ceiling‑mounted projectors for classrooms and theaters.",
    products: [
      {
        name: "Full HD Office Projector",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "Bright 1080p projector for meeting rooms and events.",
      },
      {
        name: "Portable Mini Projector",
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
        description: "Pocket‑sized projector for movies on the go.",
      },
      {
        name: "Short‑Throw Classroom Projector",
        image:
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
        description: "Short‑throw lens to avoid shadows and glare.",
      },
    ],
  },
  {
    name: "Home Cinema & Soundbars",
    slug: "home-cinema-soundbars",
    description:
      "Immersive sound systems and soundbars that bring cinema home.",
    products: [
      {
        name: "5.1 Surround Sound System",
        image:
          "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80",
        description: "Multi‑speaker system with subwoofer and AV receiver.",
      },
      {
        name: "Premium Dolby Atmos Soundbar",
        image:
          "https://images.unsplash.com/photo-1604079628040-ac6c682e3552?auto=format&fit=crop&w=800&q=80",
        description: "Slim soundbar with upward‑firing drivers for Atmos.",
      },
      {
        name: "Compact Bluetooth Soundbar",
        image:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
        description: "All‑in‑one bar ideal for smaller rooms and desks.",
      },
    ],
  },
  {
    name: "Video Conferencing",
    slug: "video-conferencing",
    description:
      "Cameras, speakerphones and all‑in‑one kits for hybrid meetings.",
    products: [
      {
        name: "4K Conference Camera",
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        description: "Ultra‑wide 4K camera with auto‑framing for teams.",
      },
      {
        name: "All‑in‑One Video Bar",
        image:
          "https://images.unsplash.com/photo-1587613864524-996ff3f01ab1?auto=format&fit=crop&w=800&q=80",
        description: "Camera, speakers and microphones in one sleek bar.",
      },
      {
        name: "USB Speakerphone",
        image:
          "https://images.unsplash.com/photo-1590658268037-6aab6c1e65c1?auto=format&fit=crop&w=800&q=80",
        description: "Full‑duplex audio for crystal‑clear conference calls.",
      },
    ],
  },
  {
    name: "Car Audio",
    slug: "car-audio",
    description:
      "Upgrade your in‑car entertainment with speakers, stereos and amplifiers.",
    products: [
      {
        name: "Bluetooth Car Stereo",
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
        description: "Touch‑screen stereo with Bluetooth and USB playback.",
      },
      {
        name: "Component Speaker Kit",
        image:
          "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80",
        description: "High‑fidelity door speakers with separate tweeters.",
      },
      {
        name: "Powered Subwoofer",
        image:
          "https://images.unsplash.com/photo-1544286173-98902a03b40c?auto=format&fit=crop&w=800&q=80",
        description: "Compact sub that adds deep bass to any factory system.",
      },
    ],
  },
];

export default function TvAudioVideoPage() {
  const [query, setQuery] = useState("");

  const filteredSubcategories = useMemo(() => {
    if (!query.trim()) return subcategories;
    const q = query.trim().toLowerCase();
    return subcategories.map((sub) => ({
      ...sub,
      products: sub.products.filter((p) =>
        (p.name + " " + p.description).toLowerCase().includes(q)
      ),
    }));
  }, [query]);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#020617] via-[#111827] to-[#020617] text-white">
        <div className="section-wrapper py-10 sm:py-14 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 sm:space-y-5">
            <p className="uppercase tracking-wide text-xs sm:text-sm text-sky-300 font-semibold">
              TV, Audio & Video
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Big screens. Bigger sound. Smarter entertainment.
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl">
              Discover TVs, projectors, home cinema systems and conferencing
              gear to upgrade every room.
            </p>
            <div className="mt-4 w-full max-w-md">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-stretch gap-2"
              >
                <Input
                  type="search"
                  placeholder="Search TV, Audio & Video products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-white text-gray-900 text-xs sm:text-sm"
                />
              </form>
            </div>
          </div>
          <div className="flex-1 relative w-full h-52 sm:h-64 md:h-72 lg:h-80">
            <Image
              src="/Tv, audio & Video.png"
              alt="TV, Audio & Video"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="section-wrapper py-3 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
          <Link href="/" className="hover:text-[#A7E059] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">TV, Audio & Video</span>
        </div>
      </section>

      {/* Subcategory sections */}
      <section className="flex-1 bg-white">
        <div className="section-wrapper py-6 sm:py-8 md:py-10 space-y-10 sm:space-y-12">
          {filteredSubcategories.map((subcategory) => {
            if (subcategory.products.length === 0) return null;
            return (
              <div
                key={subcategory.slug}
                id={subcategory.slug}
                className="space-y-4 sm:space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                      {subcategory.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
                      {subcategory.description}
                    </p>
                  </div>
                  <Link
                    href={`/category/tv-audio-video`}
                    className="text-xs sm:text-sm font-semibold text-[#A7E059] hover:text-[#8FC94A]"
                  >
                    View all in {subcategory.name} →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {subcategory.products.map((product) => (
                    <article
                      key={product.name}
                      className="border border-gray-200 hover:border-[#A7E059] bg-white shadow-sm hover:shadow-md transition-all flex flex-col rounded-none"
                    >
                      <div className="relative w-full h-40 sm:h-48 bg-gray-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 flex-1">
                          {product.description}
                        </p>
                        <span className="mt-1 inline-flex text-[11px] sm:text-xs font-semibold text-[#A7E059]">
                          TV, Audio & Video
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}


