/**
 * Centralized image mapping utility
 * Maps product/category names to their actual image filenames in the /public folder
 */

export interface ImageMap {
  [key: string]: string;
}

/**
 * Product image mappings
 */
const PRODUCT_IMAGE_MAP: ImageMap = {
  // Hot Deals
  "Samsung Galaxy A54 5G": "/Samsung Galxy.png",
  "HP DeskJet 2710 All-in-One": "/HP DeskJet.png",
  "Tenda AC10U AC1200": "/Tenda.png",
  "JBL Tune 510BT": "/JBL.png",
  
  // Laptops
  "HP Pavilion 15 i5": "/HP Pavilion.png",
  "HP Pavilion 15-eg0000": "/HP Pavilion.png", // Category product
  "Apple MacBook Air M2": "/Apple Macbook Air M2.png",
  "Dell XPS 13 9310": "/DELL XPS.png",
  "Dell XPS 15 9500": "/DELL XPS.png", // Category product
  "Lenovo IdeaPad 3": "/Lenovo Ideapad.png",
  
  // Printers & Scanners
  "HP DeskJet 2710 All-in-One": "/HP DeskJet 2710 All-in-One.png",
  "Canon PIXMA G3411 MegaTank": "/Canon PIXMA G3411 MegaTank.png",
  "Epson EcoTank L3250": "/Epson EcoTank L3250.png",
  "HP Smart Tank": "/HP Smart Tank.png",
  "Canon Pixma G3411 MegaTank": "/Canon PIXMA G3411 MegaTank.png", // Category product variant
  
  // Audio & Headphones
  "Sony WH-1000XM5": "/Sony WH-1000XM5.png",
  "Apple AirPods Pro (2nd Gen)": "/Apple AirPods Pro (2nd Gen).png",
  "JBL Flip 6 Portable Speaker": "/JBL Flip 6 Portable Speaker.png",
  
  // Computer Accessories
  "TP-Link Archer AX55 AX3000": "/TP-Link Archer AX55 AX3000.png",
  "Logitech MK270-MK295": "/Logitech MK270-MK295.png",
  "Logitech MK270 Wireless Keyboard and Mouse": "/Logitech MK270-MK295.png", // Category product
  "TP-Link 8-16-port switches": "/TP-Link 8-16-port switches.png",
  "TP-Link 8-Port Gigabit Switch": "/TP-Link 8-16-port switches.png", // Category product
  "TP-Link Archer C6 AC1200": "/TP-Link Archer C6 AC1200.png",
  "Logitech MX Master 3 Wireless Mouse": "/Logitech MK270-MK295.png", // Use available accessory image
  "Logitech MX Master 3 Mouse": "/Logitech MK270-MK295.png", // Use available accessory image
  "HP Laptop Backpack 15.6\"": "/Computer Accessories.png", // Use category image as fallback
  "Dell Laptop Sleeve 14\"": "/Computer Accessories.png", // Use category image as fallback
  "Lenovo Laptop Case 15.6\"": "/Computer Accessories.png", // Use category image as fallback
  
  // Featured Deals
  "HP OMEN": "/omen-1.png",
  "HP OMEN Elite": "/omen-2.png",
};

/**
 * Brand image mappings
 */
const BRAND_IMAGE_MAP: ImageMap = {
  "HP": "/HP.png",
  "Dell": "/Dell.png",
  "Lenovo": "/Lenovo.png",
  "Apple": "/Apple.png",
  "Acer": "/Accer.jpeg",
};

/**
 * Category image mappings (if needed)
 */
const CATEGORY_IMAGE_MAP: ImageMap = {
  // Add category-specific mappings if needed
};

/**
 * Default placeholder image for products without specific images
 */
const DEFAULT_PLACEHOLDER = "/Computer Accessories.png"; // Use a generic category image

/**
 * Get product image path
 * Supports both local images and remote URLs
 * @param productName - Name of the product
 * @param fallback - Optional fallback path (can be local path or URL)
 * @returns Image path (local) or URL (remote)
 */
export function getProductImage(productName: string, fallback?: string): string {
  // First, check exact mapping for local images
  const mapped = PRODUCT_IMAGE_MAP[productName];
  if (mapped) return mapped;
  
  // Try partial matches for common patterns (local images)
  const nameLower = productName.toLowerCase();
  
  // Try to match by brand or category keywords
  if (nameLower.includes("hp") && nameLower.includes("pavilion")) {
    return "/HP Pavilion.png";
  }
  if (nameLower.includes("dell") && nameLower.includes("xps")) {
    return "/DELL XPS.png";
  }
  if (nameLower.includes("apple") && nameLower.includes("macbook")) {
    return "/Apple Macbook Air M2.png";
  }
  if (nameLower.includes("lenovo") && nameLower.includes("ideapad")) {
    return "/Lenovo Ideapad.png";
  }
  if (nameLower.includes("logitech") && (nameLower.includes("mouse") || nameLower.includes("keyboard"))) {
    return "/Logitech MK270-MK295.png";
  }
  if (nameLower.includes("laptop") && (nameLower.includes("bag") || nameLower.includes("backpack") || nameLower.includes("case") || nameLower.includes("sleeve"))) {
    return "/Computer Accessories.png";
  }
  if (nameLower.includes("tp-link") && (nameLower.includes("router") || nameLower.includes("switch"))) {
    return "/TP-Link Archer C6 AC1200.png";
  }
  
  // If fallback is provided, use it (can be local path or URL)
  if (fallback) {
    // If it's a local path (starts with /), use it directly
    if (fallback.startsWith("/")) {
      return fallback;
    }
    // If it's a URL (http/https), use it as fallback
    if (fallback.startsWith("http://") || fallback.startsWith("https://")) {
      return fallback;
    }
    // If it doesn't start with / or http, treat it as a local path
    return fallback.startsWith("/") ? fallback : `/${fallback}`;
  }
  
  // Last resort: use default placeholder
  return DEFAULT_PLACEHOLDER;
}

/**
 * Get brand image path
 * @param brandName - Name of the brand
 * @param fallback - Optional fallback path
 * @returns Image path in /public folder
 */
export function getBrandImage(brandName: string, fallback?: string): string {
  const mapped = BRAND_IMAGE_MAP[brandName];
  if (mapped) return mapped;
  
  if (fallback) return fallback;
  
  return `/${brandName}.png`;
}

/**
 * Get category image path
 * @param categoryName - Name of the category
 * @param fallback - Optional fallback path
 * @returns Image path in /public folder
 */
export function getCategoryImage(categoryName: string, fallback?: string): string {
  const mapped = CATEGORY_IMAGE_MAP[categoryName];
  if (mapped) return mapped;
  
  if (fallback) return fallback;
  
  return `/${categoryName}.png`;
}

/**
 * Map multiple products to use local images when available, otherwise keep URLs
 * @param products - Array of products with name property
 * @returns Array of products with updated image paths (local preferred, URLs as fallback)
 */
export function mapProductsToLocalImages<T extends { name: string; image?: string; images?: string[] }>(
  products: T[]
): T[] {
  return products.map((product) => {
    // Get the mapped image - prefers local, falls back to URL if provided
    const mappedImage = getProductImage(product.name, product.image);
    
    // Map images array - keep all valid images (local or URLs)
    const mappedImages = product.images 
      ? product.images
          .filter(img => img && typeof img === "string" && img.trim() !== "")
          .map(img => {
            // Try to get mapped image for each image in the array
            // If it's a URL, keep it; if local mapping exists, use that
            const mapped = getProductImage(product.name, img);
            return mapped;
          })
      : [];
    
    // Ensure we have at least one image
    const finalImages = mappedImages.length > 0 ? mappedImages : [mappedImage];
    
    return {
      ...product,
      image: mappedImage,
      images: finalImages,
    };
  });
}

