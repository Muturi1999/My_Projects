/**
 * Products API client.
 * Functions for interacting with the Products service.
 */
import apiClient from './client';
import type {
  Product,
  ProductListResponse,
  ProductSpecification,
  ApiResponse,
  ApiError,
} from './types';

export const productsApi = {
  /**
   * Get list of products with filters and pagination
   */
  list: async (params?: {
    category?: string;
    brand?: string;
    hot?: boolean;
    featured?: boolean;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    in_stock?: boolean;
    search?: string;
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(
      '/products/queries/',
      { params }
    );
    return response.data;
  },

  /**
   * Get single product by ID
   */
  get: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/queries/${id}/`);
    return response.data;
  },

  /**
   * Search products
   */
  search: async (query: string, params?: Record<string, any>): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(
      '/products/queries/search/',
      { params: { q: query, ...params } }
    );
    return response.data;
  },

  /**
   * Get hot deals
   */
  getHotDeals: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/queries/hot-deals/');
    return response.data;
  },

  /**
   * Get products by category
   */
  getByCategory: async (
    categorySlug: string,
    params?: Record<string, any>
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(
      `/products/queries/by-category/${categorySlug}/`,
      { params }
    );
    return response.data;
  },

  /**
   * Get products by brand
   */
  getByBrand: async (
    brandSlug: string,
    params?: Record<string, any>
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>(
      `/products/queries/by-brand/${brandSlug}/`,
      { params }
    );
    return response.data;
  },

  /**
   * Create product (admin only - future)
   */
  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products/commands/', product);
    return response.data;
  },

  /**
   * Update product (admin only - future)
   */
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/commands/${id}/`, product);
    return response.data;
  },

  /**
   * Delete product (admin only - future)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/commands/${id}/`);
  },
};


