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
    name: "Access Control",
    slug: "access-control",
    description:
      "Manage who can enter your premises with modern biometric and card-based access solutions.",
    products: [
      {
        name: "Biometric Door Reader",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        description: "Fingerprint and PIN access for secure entry points.",
      },
      {
        name: "RFID Card Access Panel",
        image:
          "https://images.unsplash.com/photo-1604079628040-ac6c682e3552?auto=format&fit=crop&w=800&q=80",
        description: "Contactless card reader for offices and apartments.",
      },
      {
        name: "Smart Door Lock",
        image:
          "https://images.unsplash.com/photo-1604076947037-fbdce89f3ba3?auto=format&fit=crop&w=800&q=80",
        description: "Wi‑Fi enabled lock controllable from your phone.",
      },
    ],
  },
  {
    name: "Security Cameras",
    slug: "security-cameras",
    description:
      "High‑definition IP and analog cameras for homes, shops, and enterprises.",
    products: [
      {
        name: "Outdoor Bullet Camera",
        image:
          "https://images.unsplash.com/photo-1581683705068-857tr0d054b6?auto=format&fit=crop&w=800&q=80",
        description: "Weather‑resistant camera with night vision.",
      },
      {
        name: "Indoor Dome Camera",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Discreet dome for offices and retail spaces.",
      },
      {
        name: "Wireless PTZ Camera",
        image:
          "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=800&q=80",
        description: "Pan‑tilt‑zoom camera for wide‑area surveillance.",
      },
    ],
  },
  {
    name: "Security Systems",
    slug: "security-systems",
    description:
      "Complete alarm and monitoring systems for homes, businesses, and warehouses.",
    products: [
      {
        name: "Smart Alarm Kit",
        image:
          "https://images.unsplash.com/photo-1580741543282-5a5c8d5a6dfa?auto=format&fit=crop&w=800&q=80",
        description: "Starter kit with siren, motion sensor and door contacts.",
      },
      {
        name: "Control Panel & Keypad",
        image:
          "https://images.unsplash.com/photo-1583719478250-cbaf12c8d9d0?auto=format&fit=crop&w=800&q=80",
        description: "Central control unit with LCD keypad and quick‑arm modes.",
      },
      {
        name: "Wireless Motion Detector",
        image:
          "https://images.unsplash.com/photo-1594904351111-7bcd2c4a5f70?auto=format&fit=crop&w=800&q=80",
        description: "Pet‑immune motion sensor for indoor monitoring.",
      },
    ],
  },
  {
    name: "Security Accessories",
    slug: "security-accessories",
    description:
      "Cables, brackets, power supplies and other accessories for neat, reliable installations.",
    products: [
      {
        name: "CCTV BNC Cable Roll",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "High‑quality coaxial cable for long‑distance runs.",
      },
      {
        name: "Camera Wall Brackets",
        image:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
        description: "Adjustable brackets for bullet and dome cameras.",
      },
      {
        name: "12V DC Power Supply",
        image:
          "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=800&q=80",
        description: "Multi‑channel power supply unit for CCTV deployments.",
      },
    ],
  },
  {
    name: "CCTV & NVR System",
    slug: "cctv-nvr-system",
    description:
      "End‑to‑end CCTV and NVR bundles ready to deploy, from 4‑channel kits to enterprise systems.",
    products: [
      {
        name: "4‑Camera NVR Kit",
        image:
          "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80",
        description: "Complete 4‑channel NVR kit with PoE cameras.",
      },
      {
        name: "16‑Channel NVR",
        image:
          "https://images.unsplash.com/photo-1583511655826-05700d52f4db?auto=format&fit=crop&w=800&q=80",
        description: "High‑capacity NVR for growing surveillance sites.",
      },
      {
        name: "Rack‑mount DVR",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        description: "Hybrid DVR for legacy analog and new IP cameras.",
      },
    ],
  },
];

export default function CctvSecurityPage() {
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
      <section className="relative bg-gradient-to-r from-[#111827] via-[#020617] to-[#020617] text-white">
        <div className="section-wrapper py-10 sm:py-14 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 sm:space-y-5">
            <p className="uppercase tracking-wide text-xs sm:text-sm text-emerald-300 font-semibold">
              CCTV & Security
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Protect what matters with smart security solutions.
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl">
              Browse access control, cameras, complete systems and accessories
              designed for homes, offices and enterprises.
            </p>
            <div className="mt-4 w-full max-w-md">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-stretch gap-2"
              >
                <Input
                  type="search"
                  placeholder="Search CCTV & Security products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-white text-gray-900 text-xs sm:text-sm"
                />
              </form>
            </div>
          </div>
          <div className="flex-1 relative w-full h-52 sm:h-64 md:h-72 lg:h-80">
            <Image
              src="/cctv and security.png"
              alt="CCTV & Security"
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
          <span className="text-gray-900 font-medium">CCTV & Security</span>
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
                    href={`/category/cctv-security`}
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
                          CCTV & Security
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


