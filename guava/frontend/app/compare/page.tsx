"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import {
  XMarkIcon,
  HeartIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { useCompare } from "@/lib/hooks/use-compare";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import {
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  categorySubcategoryProducts,
  type Product,
} from "@/lib/data/products";
import { categoryProducts } from "@/lib/data/categoryProducts";

// Build unified catalog
const categoryProductsList: Product[] = Object.values(categoryProducts).flat();
const categorySubcategoryList: Product[] = Object.values(
  categorySubcategoryProducts
).flatMap((group) => Object.values(group).flat());

const allCatalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
  ...categoryProductsList,
  ...categorySubcategoryList,
];

function getProductById(id: string): Product | undefined {
  return allCatalogProducts.find((p) => p.id === id);
}

function getProductAttribute(product: Product, attribute: string): string {
  switch (attribute) {
    case "Customer feedback":
      const rating = product.rating || 5;
      const count = product.ratingCount || 0;
      return `${"★".repeat(5)} (${count})`;
    case "Price":
      return `KSh ${product.price.toLocaleString()}`;
    case "Sold by":
      return product.brand || "Guava Stores";
    case "Brand":
      return product.brand || "N/A";
    case "Model":
      return (product as any).model || product.name.split(" ").slice(-2).join(" ");
    case "Stock status":
      const stock = product.stock ?? 0;
      return stock > 0 ? "IN STOCK" : "OUT OF STOCK";
    case "Size":
      if (product.screen) return product.screen;
      if (product.category === "Smartphones") {
        return "6.4 inches, 96.9 cm";
      }
      return "N/A";
    case "Weight":
      if (product.category === "Smartphones") {
        return "177 g (6.24 oz)";
      }
      if (product.category === "Laptops") {
        return "240 g (8.47 oz)";
      }
      return "N/A";
    case "Processor":
      return product.processor || "N/A";
    case "RAM":
      return product.ram || "N/A";
    case "Storage":
      return product.storage || "N/A";
    case "Display":
      return product.screen || "N/A";
    case "OS":
      return product.os || "N/A";
    case "Category":
      return product.category || "N/A";
    default:
      return "N/A";
  }
}

function getAllAttributes(products: Product[]): string[] {
  const baseAttributes = [
    "Customer feedback",
    "Price",
    "Sold by",
    "Brand",
    "Model",
    "Stock status",
    "Size",
    "Weight",
  ];

  // Add product-specific attributes
  const specificAttributes = new Set<string>();
  products.forEach((product) => {
    if (product.processor) specificAttributes.add("Processor");
    if (product.ram) specificAttributes.add("RAM");
    if (product.storage) specificAttributes.add("Storage");
    if (product.screen) specificAttributes.add("Display");
    if (product.os) specificAttributes.add("OS");
    if (product.category) specificAttributes.add("Category");
  });

  return [...baseAttributes, ...Array.from(specificAttributes)];
}

export default function ComparePage() {
  const { ids, remove } = useCompare();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();

  const products = useMemo(() => {
    return ids.map(getProductById).filter((p): p is Product => p !== undefined);
  }, [ids]);

  const attributes = useMemo(() => {
    return getAllAttributes(products);
  }, [products]);

  const handleAddToWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-gray-50 py-4">
            <div className="section-wrapper">
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-[#98C243] transition-colors"
                >
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Compare</span>
              </div>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="section-wrapper text-center">
              <ArrowsRightLeftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No products to compare
              </h2>
              <p className="text-gray-600 mb-6">
                Add products to compare their features and specifications.
              </p>
              <Link href="/">
                <Button className="bg-[#98C243] hover:bg-[#7FA836] text-white">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <section className="bg-gray-50 py-4">
          <div className="section-wrapper">
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#98C243] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Compare</span>
            </div>
          </div>
        </section>

        {/* Product Cards - Horizontal Scroll */}
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="section-wrapper">
            <div className="overflow-x-auto">
              <div
                className="flex gap-4 pb-4"
                style={{ minWidth: `${Math.max(4, products.length) * 280}px` }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[260px] border border-gray-200 rounded-lg p-4 bg-white relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => remove(product.id)}
                      className="absolute -top-2 -right-2 p-2 rounded-full bg-white border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors shadow-md z-10"
                      aria-label="Remove from compare"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-700" />
                    </button>

                    {/* Product Image */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative w-full h-48 mb-3 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </Link>

                    {/* Product Name */}
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#98C243] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          KSh {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            KSh {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {(product.stock ?? 0) > 0 ? (
                        <AddToCartButton
                          product={product}
                          className="w-full text-sm py-2 bg-[#98C243] hover:bg-[#7FA836] text-white border-0"
                          size="sm"
                        />
                      ) : (
                        <Button
                          disabled
                          className="w-full text-sm py-2 bg-gray-400 text-white cursor-not-allowed border-0"
                        >
                          OUT OF STOCK
                        </Button>
                      )}
                      <button
                        onClick={() => handleAddToWishlist(product.id)}
                        className="w-full flex items-center justify-center gap-1 text-gray-600 hover:text-[#98C243] transition-colors"
                      >
                        <HeartIcon
                          className={`h-4 w-4 ${
                            wishlistIds.includes(product.id) ? "fill-current text-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-6 bg-white">
          <div className="section-wrapper">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <tbody>
                  {attributes.map((attribute, attrIndex) => (
                    <tr
                      key={attribute}
                      className={attrIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <th className="w-48 px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 align-top">
                        {attribute}
                      </th>
                      {products.map((product, productIndex) => (
                        <td
                          key={`${product.id}-${attribute}`}
                          className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0 align-top"
                        >
                          {attribute === "Stock status" ? (
                            <span
                              className={`font-semibold ${
                                getProductAttribute(product, attribute) === "IN STOCK"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {getProductAttribute(product, attribute)}
                            </span>
                          ) : attribute === "Customer feedback" ? (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">
                                {getProductAttribute(product, attribute).split(" (")[0]}
                              </span>
                              <span className="text-gray-600">
                                ({getProductAttribute(product, attribute).split(" (")[1]}
                              </span>
                            </div>
                          ) : (
                            getProductAttribute(product, attribute)
                          )}
                        </td>
                      ))}
                      {/* Empty cells if less than 4 products */}
                      {Array.from({ length: Math.max(0, 4 - products.length) }).map(
                        (_, emptyIndex) => (
                          <td
                            key={`empty-${attrIndex}-${emptyIndex}`}
                            className="px-4 py-3 border-r border-gray-200 last:border-r-0"
                          />
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

