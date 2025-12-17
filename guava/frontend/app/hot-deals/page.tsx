import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { StarIcon } from "@heroicons/react/24/solid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useHomepage } from "@/lib/hooks/useCMS";
import { mapApiProductsToComponents } from "@/lib/utils/productMapper";
import { hotDeals } from "@/lib/data/products";
import React from "react";

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function HotDealsPage() {
  const { homepage, loading } = useHomepage();

  const products = React.useMemo(() => {
    // Use CMS data if available, otherwise fallback to mock data
    if (!loading && homepage?.hot_deals?.items?.length) {
      return mapApiProductsToComponents(
        homepage.hot_deals.items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice ?? item.price,
          rating: item.rating ?? 5,
          badge: item.badge,
          slug: item.slug,
          discount: item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0,
          stock: item.inStock ? 10 : 0,
          ratingCount: 120,
          category: "",
          brand: "",
          description: "",
          images: [item.image],
        }))
      );
    }
    
    // Fallback to mock data
    return hotDeals;
  }, [homepage, loading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <section className="py-10">
          <div className="section-wrapper">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="section-heading">Today&apos;s Hot Deals</h1>
                <p className="text-gray-600 mt-2">
                  Latest offers with limited stock. Grab them before they are
                  gone.
                </p>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-[#A7E059] hover:underline"
              >
                ← Back to Home
              </Link>
            </div>

            {loading && !products.length ? (
              <p className="text-gray-500 text-sm">Loading hot deals...</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-none border border-gray-200 shadow-sm bg-white flex flex-col overflow-hidden"
                >
                  <div className="px-4 pt-4 flex items-center justify-between text-xs font-semibold">
                    <span className="bg-[#A7E059] text-white px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full">
                      HOT
                    </span>
                  </div>

                  <div className="relative p-4 border-b border-gray-200">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative w-full bg-white border border-gray-200 h-44 flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-[#A7E059] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                      {renderStars(product.rating)}
                      <span className="text-gray-500">
                        ({product.ratingCount ?? 120})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#A7E059] font-semibold">
                        In stock
                      </span>
                      <span className="text-gray-500">
                        ({product.stock ?? 10} pcs)
                      </span>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <span className="text-sm text-gray-400 line-through">
                        Ksh {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        Ksh {product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

