/**
 * Utility functions to map API Product types to component Product types
 */

import type { Product as APIProduct } from '@/lib/api/types';
import type { Product as ComponentProduct } from '@/lib/data/products';

/**
 * Maps an API Product to the format expected by ProductCard and other components
 */
export function mapApiProductToComponent(apiProduct: APIProduct): ComponentProduct {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price,
    discount: apiProduct.discount_percentage,
    rating: apiProduct.rating,
    image: apiProduct.image,
    category: apiProduct.category_slug,
    brand: apiProduct.brand_slug,
    hot: apiProduct.hot,
    stock: apiProduct.stock_quantity,
    ratingCount: apiProduct.rating_count,
    images: apiProduct.images || apiProduct.product_images?.map(img => img.image_url),
    // Map specifications
    processor: apiProduct.specifications?.processor,
    ram: apiProduct.specifications?.ram,
    storage: apiProduct.specifications?.storage,
    screen: apiProduct.specifications?.screen,
    os: apiProduct.specifications?.os,
    generation: apiProduct.specifications?.generation,
    printerType: apiProduct.specifications?.printer_type,
    features: apiProduct.specifications?.features,
    description: apiProduct.description,
  };
}

/**
 * Maps an array of API Products to component Products
 */
export function mapApiProductsToComponents(apiProducts: APIProduct[]): ComponentProduct[] {
  return apiProducts.map(mapApiProductToComponent);
}

