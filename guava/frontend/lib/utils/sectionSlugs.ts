/**
 * Section name to URL slug mapping
 * Maps home section names to URL-friendly slugs
 */

export type HomeSection = 
  | "hot-deals"
  | "top-laptop-deals"
  | "printers-scanners"
  | "computer-accessories"
  | "audio-headphones";

export const SECTION_SLUGS: Record<string, HomeSection> = {
  "Today's Hot Deals": "hot-deals",
  "Hot Deals": "hot-deals",
  "Top Laptop Deals": "top-laptop-deals",
  "Printer & Scanner Deals": "printers-scanners",
  "Printers & Scanner Deals": "printers-scanners",
  "Computer Accessories Deals": "computer-accessories",
  "Audio & Headphones Deals": "audio-headphones",
};

export const SECTION_NAMES: Record<HomeSection, string> = {
  "hot-deals": "Today's Hot Deals",
  "top-laptop-deals": "Top Laptop Deals",
  "printers-scanners": "Printer & Scanner Deals",
  "computer-accessories": "Computer Accessories Deals",
  "audio-headphones": "Audio & Headphones Deals",
};

/**
 * Get section slug from section name
 */
export function getSectionSlug(sectionName: string): HomeSection {
  return SECTION_SLUGS[sectionName] || "hot-deals";
}

/**
 * Get section name from slug
 */
export function getSectionName(slug: string): string {
  return SECTION_NAMES[slug as HomeSection] || slug;
}

/**
 * Generate product URL with section
 */
export function getProductUrl(productId: string, section?: string): string {
  if (section) {
    const slug = getSectionSlug(section);
    return `/home/${slug}/${productId}`;
  }
  return `/product/${productId}`;
}

