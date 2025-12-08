import api from './api';

// Example interfaces (match your Django serializer structure)
export interface Product {
  stock_quantity: string | number | undefined;
  long_description: string;
  id: number;
  name: string;
  slug: string;
  price: number;
  discounted_price: number | null;
  current_price: string;
  images: { image: string; is_main: boolean }[];
  is_featured: boolean;
  is_best_selling: boolean;
  short_description: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    product_count: number;
}

// Fetch Featured Products for the "FEATURED SECTIONS"
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products/featured/');
  return response.data;
};

// Fetch Categories for the "Category Grid with Images"
export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories/');
    return response.data;
};

// Fetch Products for the "Product Listing Page"
export const getProducts = async (params: { category?: string; sort?: string }): Promise<Product[]> => {
  const response = await api.get('/products/', { params });
  return response.data;
};

// Fetch Single Product for the "Product Detail Page"
export const getProductBySlug = async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
};