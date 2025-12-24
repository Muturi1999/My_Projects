import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandLaptopCard } from "@/components/BrandLaptopCard";
import { popularBrands } from "@/lib/data/categories";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { transformDjangoProduct } from "@/lib/utils/productTransformer";
import { env } from "@/lib/config/env";
import type { Product } from "@/lib/data/products";

interface BrandPageProps {
  params: Promise<{ brandSlug: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandSlug } = await params;
  const brand = popularBrands.find((b) => b.slug === brandSlug);

  if (!brand) {
    notFound();
  }

  // Fetch products from Django API by brand_slug
  let products: Product[] = [];
  try {
    // For server-side, use the full URL. For client-side, use relative URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";
    
    const response = await fetch(
      `${API_BASE_URL}/products/queries/?brand_slug=${brandSlug}&page_size=1000`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store', // Always fetch fresh data
        next: { revalidate: 0 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const djangoProducts = data.results || [];
      
      // Transform Django products to frontend format
      // Show all products from database (even without images)
      products = djangoProducts.map((p: any) => transformDjangoProduct(p));
      
      console.log(`[Brand Page] Fetched ${products.length} products for brand: ${brandSlug}`);
    } else {
      console.error(`[Brand Page] API returned status ${response.status}`);
    }
  } catch (error) {
    console.error("[Brand Page] Failed to fetch products from Django:", error);
    // Don't throw - just show empty list
    products = [];
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 text-white"
        style={{ backgroundColor: brand.color }}
      >
        <div className="section-wrapper">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                width={200}
                height={100}
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
              {brand.name} Products
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Explore all {brand.name} products and variants
            </p>
            {brand.discount && brand.discount > 0 && (
              <Badge className="bg-white/20 text-white px-6 py-3 text-lg">
                {brand.discount}% OFF
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="section-wrapper">
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#A7E059] transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/popular-brands"
              className="text-gray-600 hover:text-[#A7E059] transition-colors"
            >
              Popular Brands
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="section-wrapper">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products available for {brand.name} at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="section-heading">
                  {products.length} {brand.name} Product{products.length > 1 ? "s" : ""} Available
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <BrandLaptopCard key={product.id} laptop={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

