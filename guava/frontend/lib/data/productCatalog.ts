/**
 * Centralized Product Catalog Store
 * 
 * This module aggregates all products from various sources into a single
 * unified catalog. This ensures that products from categories, home sections,
 * and other sources are all available on product detail pages.
 */

import { Product } from "./products";
import {
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  categorySubcategoryProducts,
} from "./products";
import { categoryProducts } from "./categoryProducts";

/**
 * Flatten category products from all categories
 */
const categoryProductsList: Product[] = Object.values(categoryProducts).flat();

/**
 * Flatten category subcategory products from all subcategories
 */
const categorySubcategoryList: Product[] = Object.values(
  categorySubcategoryProducts
).flatMap((group) => Object.values(group).flat());

/**
 * Unified catalog of all products
 * 
 * This includes:
 * - Hot deals
 * - Laptop deals
 * - Printer deals
 * - Accessories deals
 * - Audio deals
 * - Brand laptops
 * - Category products (from categoryProducts)
 * - Category subcategory products (from categorySubcategoryProducts)
 */
export const catalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
  ...categoryProductsList,
  ...categorySubcategoryList,
];

/**
 * Get a product by ID from the catalog
 * @param id Product ID
 * @returns Product if found, undefined otherwise
 */
export function getProductById(id: string): Product | undefined {
  return catalogProducts.find((product) => product.id === id);
}

/**
 * Get products by category
 * @param category Category name
 * @returns Array of products in the category
 */
export function getProductsByCategory(category: string): Product[] {
  return catalogProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get products by brand
 * @param brand Brand slug
 * @returns Array of products from the brand
 */
export function getProductsByBrand(brand: string): Product[] {
  return catalogProducts.filter(
    (product) => product.brand?.toLowerCase() === brand.toLowerCase()
  );
}

/**
 * Search products by name, category, or brand
 * @param query Search query
 * @returns Array of matching products
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return catalogProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.brand?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all unique categories from the catalog
 * @returns Array of unique category names
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  catalogProducts.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get all unique brands from the catalog
 * @returns Array of unique brand slugs
 */
export function getAllBrands(): string[] {
  const brands = new Set<string>();
  catalogProducts.forEach((product) => {
    if (product.brand) {
      brands.add(product.brand);
    }
  });
  return Array.from(brands).sort();
}

/**
 * Get total number of products in catalog
 */
export function getCatalogSize(): number {
  return catalogProducts.length;
}

