/**
 * Catalog API client.
 * Functions for interacting with the Catalog service.
 */
import apiClient from './client';
import type {
  Category,
  CategoryListResponse,
  Brand,
  BrandListResponse,
} from './types';

export const catalogApi = {
  /**
   * Get list of categories
   */
  getCategories: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<CategoryListResponse> => {
    const response = await apiClient.get<CategoryListResponse>(
      '/catalog/queries/categories/',
      { params }
    );
    return response.data;
  },

  /**
   * Get single category by ID or slug
   */
  getCategory: async (idOrSlug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(
      `/catalog/queries/categories/${idOrSlug}/`
    );
    return response.data;
  },

  /**
   * Get subcategories of a category
   */
  getSubcategories: async (categoryId: string): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(
      `/catalog/queries/categories/${categoryId}/subcategories/`
    );
    return response.data;
  },

  /**
   * Get list of brands
   */
  getBrands: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<BrandListResponse> => {
    const response = await apiClient.get<BrandListResponse>(
      '/catalog/queries/brands/',
      { params }
    );
    return response.data;
  },

  /**
   * Get single brand by ID or slug
   */
  getBrand: async (idOrSlug: string): Promise<Brand> => {
    const response = await apiClient.get<Brand>(
      `/catalog/queries/brands/${idOrSlug}/`
    );
    return response.data;
  },

  /**
   * Create category (admin only - future)
   */
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<Category>(
      '/catalog/commands/categories/',
      category
    );
    return response.data;
  },

  /**
   * Update category (admin only - future)
   */
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put<Category>(
      `/catalog/commands/categories/${id}/`,
      category
    );
    return response.data;
  },

  /**
   * Create brand (admin only - future)
   */
  createBrand: async (brand: Partial<Brand>): Promise<Brand> => {
    const response = await apiClient.post<Brand>(
      '/catalog/commands/brands/',
      brand
    );
    return response.data;
  },

  /**
   * Update brand (admin only - future)
   */
  updateBrand: async (id: string, brand: Partial<Brand>): Promise<Brand> => {
    const response = await apiClient.put<Brand>(
      `/catalog/commands/brands/${id}/`,
      brand
    );
    return response.data;
  },
};


