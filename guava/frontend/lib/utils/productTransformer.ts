/**
 * Product Transformation Utility
 * 
 * Transforms Django product format to frontend Product format.
 * Handles image URLs properly without applying image mapper to Django products.
 */

import { Product } from "@/lib/data/products";
import { shopCategories } from "@/lib/data/categories";

export interface DjangoProduct {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  price: number | string;
  original_price?: number | string | null;
  image_url?: string | null;
  image?: string | null;
  images?: string[];
  product_images?: Array<{
    image_url?: string;
    image?: string;
    alt_text?: string;
    order?: number;
  }>;
  category_slug?: string;
  brand_slug?: string;
  brand_name?: string;
  rating?: number | string;
  rating_count?: number;
  hot?: boolean;
  featured?: boolean;
  stock_quantity?: number;
  availability?: string;
  sku?: string;
  tags?: string[];
  condition?: string;
  specifications?: any;
  variants?: any[];
}

/**
 * Transform Django product to frontend Product format
 */
export function transformDjangoProduct(djangoProduct: DjangoProduct): Product & { _isDjangoProduct?: boolean; category_slug?: string } {
  // Handle images - prioritize product_images gallery, then images array, then single image_url
  const galleryImages = djangoProduct.product_images?.length > 0
    ? djangoProduct.product_images
        .map((img) => img.image_url || img.image)
        .filter(Boolean)
        .filter((img): img is string => typeof img === 'string' && img.trim() !== '')
    : [];
  
  const imagesArray = djangoProduct.images?.length > 0
    ? djangoProduct.images.filter((img): img is string => typeof img === 'string' && img.trim() !== '')
    : [];
  
  const primaryImage = djangoProduct.image_url || djangoProduct.image || "";
  const allImages = galleryImages.length > 0 
    ? galleryImages 
    : imagesArray.length > 0 
      ? imagesArray 
      : primaryImage 
        ? [primaryImage] 
        : [];

  const categorySlug = djangoProduct.category_slug || "";
  
  return {
    id: djangoProduct.id?.toString() || "",
    name: djangoProduct.name || "",
    slug: djangoProduct.slug || "",
    description: djangoProduct.description || "",
    price: typeof djangoProduct.price === 'string' ? parseFloat(djangoProduct.price) || 0 : djangoProduct.price || 0,
    originalPrice: djangoProduct.original_price 
      ? (typeof djangoProduct.original_price === 'string' ? parseFloat(djangoProduct.original_price) : djangoProduct.original_price)
      : 0, // Use 0 instead of null to match Product interface
    discount: 0, // Calculate discount if needed
    image: primaryImage,
    images: allImages,
    category: (() => {
      // Get category name from slug
      if (categorySlug) {
        const category = shopCategories.find(cat => cat.slug === categorySlug);
        return category ? category.name : categorySlug;
      }
      return "";
    })(),
    category_slug: categorySlug, // Keep slug for navigation
    brand: djangoProduct.brand_name || djangoProduct.brand_slug || "",
    brand_slug: djangoProduct.brand_slug || "",
    availability: djangoProduct.availability || "in_stock",
    rating: typeof djangoProduct.rating === 'string' ? parseFloat(djangoProduct.rating) || 0 : djangoProduct.rating || 0,
    ratingCount: djangoProduct.rating_count || 0,
    hot: djangoProduct.hot || false,
    featured: djangoProduct.featured || false,
    stock_quantity: djangoProduct.stock_quantity || 0,
    sku: djangoProduct.sku || "",
    tags: djangoProduct.tags || [],
    condition: djangoProduct.condition || "new",
    // Mark as Django product to avoid image mapper interference
    _isDjangoProduct: true,
  } as Product & { _isDjangoProduct: boolean; category_slug: string };
}

/**
 * Check if a product is from Django (has _isDjangoProduct flag or is a number ID)
 */
export function isDjangoProduct(product: Product | any): boolean {
  return product._isDjangoProduct === true || 
         (typeof product.id === 'string' && /^\d+$/.test(product.id)) ||
         (typeof product.id === 'number');
}

