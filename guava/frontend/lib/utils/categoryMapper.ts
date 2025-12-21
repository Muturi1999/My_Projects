/**
 * Utility to map product categories to category slugs
 */

import { shopCategories } from "@/lib/data/categories";

/**
 * Map product category name to category slug
 */
export function getCategorySlug(categoryName: string): string | null {
  const categoryLower = categoryName.toLowerCase();
  
  // Direct mappings
  const categoryMap: Record<string, string> = {
    "laptops": "laptops-computers",
    "laptop": "laptops-computers",
    "computers": "laptops-computers",
    "computer": "laptops-computers",
    "smartphones": "smartphones",
    "smartphone": "smartphones",
    "phone": "smartphones",
    "phones": "smartphones",
    "printers": "printers-scanners",
    "printer": "printers-scanners",
    "scanners": "printers-scanners",
    "scanner": "printers-scanners",
    "accessories": "computer-accessories",
    "computer accessories": "computer-accessories",
    "audio": "audio-headphones",
    "headphones": "audio-headphones",
    "headphone": "audio-headphones",
    "monitors": "monitors",
    "monitor": "monitors",
    "tablets": "tablets-ipads",
    "tablet": "tablets-ipads",
    "ipads": "tablets-ipads",
    "ipad": "tablets-ipads",
    "desktops": "desktops",
    "desktop": "desktops",
    "wifi": "wifi-networking",
    "networking": "wifi-networking",
    "network": "wifi-networking",
    "software": "software",
    "storage": "drives-storage",
    "drives": "drives-storage",
    "drive": "drives-storage",
    "gaming": "gaming",
  };

  // Check direct mapping first
  for (const [key, slug] of Object.entries(categoryMap)) {
    if (categoryLower.includes(key)) {
      return slug;
    }
  }

  // Try to find in shopCategories
  const category = shopCategories.find((cat) => 
    cat.name.toLowerCase().includes(categoryLower) ||
    categoryLower.includes(cat.name.toLowerCase())
  );

  return category?.slug || null;
}

/**
 * Get category name from slug
 */
export function getCategoryName(slug: string): string | null {
  const category = shopCategories.find((cat) => cat.slug === slug);
  return category?.name || null;
}

