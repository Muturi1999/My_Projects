"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { categorySubcategoryProducts } from "@/lib/data/products";
import { popularCategories } from "@/lib/data/categories";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { WishlistIcon } from "@/components/ui/WishlistIcon";

const storageCategory = popularCategories.find(
  (cat) => cat.slug === "drives-storage"
);
const subcategories = storageCategory?.subCategories || [];

function ProductCard({
  product,
  isInWishlist,
  onWishlistToggle,
}: {
  product: any;
  isInWishlist: boolean;
  onWishlistToggle: (id: string, e: React.MouseEvent) => void;
}) {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/product/${product.id}`)}
      className="cursor-pointer"
    >
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border border-gray-200 rounded-none">
        <div className="relative p-4 border-b border-gray-200">
          <div className="relative w-full bg-white border border-gray-200 h-32 md:h-36 flex items-center justify-center overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-2 md:p-3"
            />
            <WishlistIcon
              isActive={isInWishlist}
              onClick={(e) => onWishlistToggle(product.id, e)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm md:text-base mb-1.5 line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1.5">
            {Array.from({ length: product.rating }).map((_, i) => (
              <StarIcon
                key={i}
                className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-400 fill-current"
              />
            ))}
          </div>
          {product.stock !== undefined && (
            <div className="mb-1.5">
              <span className="text-xs md:text-sm text-[#A7E059] font-medium">
                In stock
              </span>
            </div>
          )}
          <div className="mb-2.5 flex items-center gap-3">
            <span className="text-xs md:text-sm text-gray-500 line-through">
              Ksh {product.originalPrice.toLocaleString()}
            </span>
            <span className="text-base md:text-lg font-bold text-gray-900">
              Ksh {product.price.toLocaleString()}
            </span>
          </div>
          <AddToCartButton
            product={product}
            className="mt-auto"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
}

export default function DrivesStoragePage() {
  const products = categorySubcategoryProducts["drives-storage"] || {};
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#ffdbc8] via-[#ffd9d0] to-[#ffd3c7] py-16 md:py-24 text-gray-900">
        <div className="section-wrapper text-center">
          <h1 className="font-public-sans text-4xl md:text-5xl font-bold mb-4">
            Drives & Storage
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Reliable storage solutions for all your data needs
          </p>
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
              href="/popular-categories"
              className="text-gray-600 hover:text-[#A7E059] transition-colors"
            >
              Popular Categories
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Drives & Storage</span>
          </div>
        </div>
      </section>

      {/* Subcategory Sections with Products */}
      {subcategories.map((subcategory) => {
        const subcategoryKey = subcategory.toLowerCase().replace(/\s+/g, "-");
        const subcategoryProducts = products[subcategory] || [];
        
        if (subcategoryProducts.length === 0) return null;

        return (
          <section
            key={subcategory}
            id={subcategoryKey}
            className="py-12 bg-white"
          >
            <div className="section-wrapper">
              <h2 className="section-heading mb-8">{subcategory}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {subcategoryProducts.slice(0, 4).map((product) => {
                  const isInWishlist = wishlistIds.includes(product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInWishlist={isInWishlist}
                      onWishlistToggle={(id, e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const willAdd = !wishlistIds.includes(id);
                        toggle(id);
                        if (willAdd) {
                          toast.success("Added to wishlist");
                        } else {
                          toast.info("Removed from wishlist");
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <Footer />
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </main>
  );
}
