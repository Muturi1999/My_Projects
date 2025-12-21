"use client";

import { useState, useEffect, useMemo } from "react";
import { catalogProducts, getProductsByCategory, getProductsByBrand } from "@/lib/data/productCatalog";
import { shopCategories } from "@/lib/data/categories";
import { popularBrands } from "@/lib/data/categories";
import { mapProductsToLocalImages } from "@/lib/utils/imageMapper";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MagnifyingGlassIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

type ViewMode = "categories" | "brands" | "all";

export function InventoryTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  // Get all unique categories from products
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    catalogProducts.forEach((product) => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }, []);

  // Get all unique brands from products
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    catalogProducts.forEach((product) => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  }, []);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return catalogProducts;
    const query = searchQuery.toLowerCase();
    return catalogProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof catalogProducts> = {};
    filteredProducts.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  // Group products by brand
  const productsByBrand = useMemo(() => {
    const grouped: Record<string, typeof catalogProducts> = {};
    filteredProducts.forEach((product) => {
      const brand = product.brand || "Unbranded";
      if (!grouped[brand]) {
        grouped[brand] = [];
      }
      grouped[brand].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBrand = (brand: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

  const productsWithImages = useMemo(() => {
    return mapProductsToLocalImages(filteredProducts);
  }, [filteredProducts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Product Inventory</h2>
          <p className="text-sm text-gray-500 mt-1">
            View all products organized by category, brand, or browse all items.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "categories" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("categories")}
          >
            <TagIcon className="h-4 w-4 mr-2" />
            Categories
          </Button>
          <Button
            variant={viewMode === "brands" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("brands")}
          >
            <ShoppingBagIcon className="h-4 w-4 mr-2" />
            Brands
          </Button>
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("all")}
          >
            <CubeIcon className="h-4 w-4 mr-2" />
            All Products
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">{allCategories.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Brands</p>
          <p className="text-2xl font-bold text-gray-900">{allBrands.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{catalogProducts.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Filtered Results</p>
          <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products by name, category, or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content based on view mode */}
      {viewMode === "categories" && (
        <div className="space-y-4">
          {allCategories.map((category) => {
            const products = productsByCategory[category] || [];
            const isExpanded = expandedCategories.has(category);
            if (products.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    <Badge variant="secondary">{products.length} items</Badge>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                      {products.map((product) => {
                        const productWithImage = mapProductsToLocalImages([product])[0];
                        return (
                          <div
                            key={product.id}
                            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                              {productWithImage.image ? (
                                <Image
                                  src={productWithImage.image}
                                  alt={product.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  className="object-contain"
                                  unoptimized={productWithImage.image.startsWith("http")}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              KSh {product.price.toLocaleString()}
                            </p>
                            {product.brand && (
                              <Badge variant="outline" className="text-xs">
                                {product.brand}
                              </Badge>
                            )}
                            {product.hot && (
                              <Badge variant="destructive" className="text-xs ml-2">
                                Hot
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "brands" && (
        <div className="space-y-4">
          {allBrands.map((brand) => {
            const products = productsByBrand[brand] || [];
            const isExpanded = expandedBrands.has(brand);
            if (products.length === 0) return null;

            return (
              <div key={brand} className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => toggleBrand(brand)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{brand}</h3>
                    <Badge variant="secondary">{products.length} items</Badge>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                      {products.map((product) => {
                        const productWithImage = mapProductsToLocalImages([product])[0];
                        return (
                          <div
                            key={product.id}
                            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                              {productWithImage.image ? (
                                <Image
                                  src={productWithImage.image}
                                  alt={product.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  className="object-contain"
                                  unoptimized={productWithImage.image.startsWith("http")}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              KSh {product.price.toLocaleString()}
                            </p>
                            {product.category && (
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            )}
                            {product.hot && (
                              <Badge variant="destructive" className="text-xs ml-2">
                                Hot
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productsWithImages.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain"
                    unoptimized={product.image.startsWith("http")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                )}
                {product.hot && (
                  <Badge variant="destructive" className="text-xs">
                    Hot
                  </Badge>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900">
                KSh {product.price.toLocaleString()}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

