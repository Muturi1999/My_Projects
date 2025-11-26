/**
 * Admin API Client - Service layer for admin operations
 * 
 * This client provides a unified interface for admin CRUD operations.
 * It tries the real API first, then falls back to mock data if the API is unavailable.
 * 
 * Features:
 * - Automatic fallback to mock data
 * - Pagination support
 * - Type-safe operations
 * - Error handling
 */

import apiClient from '@/lib/api/client';
import { env } from '@/lib/config/env';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

/**
 * Check if API is available
 */
async function isApiAvailable(): Promise<boolean> {
  try {
    await apiClient.get('/products/queries/', { timeout: 2000 });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Admin API Client class
 */
export class AdminApiClient {
  private useApi: boolean = true;
  private apiCheckPromise: Promise<boolean> | null = null;

  /**
   * Check API availability (with caching)
   */
  private async checkApiAvailability(): Promise<boolean> {
    if (this.apiCheckPromise) {
      return this.apiCheckPromise;
    }

    this.apiCheckPromise = isApiAvailable();
    
    // Cache result for 30 seconds
    setTimeout(() => {
      this.apiCheckPromise = null;
    }, 30000);

    return this.apiCheckPromise;
  }

  /**
   * Get data from API or fallback to mock
   */
  private async fetchWithFallback<T>(
    apiCall: () => Promise<T>,
    mockCall: () => T
  ): Promise<T> {
    try {
      // Try API first
      if (await this.checkApiAvailability()) {
        try {
          return await apiCall();
        } catch (apiError: any) {
          // If API call fails, log and fallback
          console.warn('API call failed, using mock data:', apiError.message);
          return mockCall();
        }
      } else {
        // API not available, use mock
        return mockCall();
      }
    } catch (error) {
      // Fallback to mock on any error
      console.warn('Using mock data fallback:', error);
      return mockCall();
    }
  }

  /**
   * Create data via API or mock
   */
  private async createWithFallback<T>(
    apiCall: () => Promise<T>,
    mockCall: () => T
  ): Promise<T> {
    try {
      if (await this.checkApiAvailability()) {
        try {
          return await apiCall();
        } catch (apiError: any) {
          console.warn('API create failed, using mock:', apiError.message);
          return mockCall();
        }
      } else {
        return mockCall();
      }
    } catch (error) {
      console.warn('Using mock create fallback:', error);
      return mockCall();
    }
  }

  /**
   * Update data via API or mock
   */
  private async updateWithFallback<T>(
    apiCall: () => Promise<T>,
    mockCall: () => T
  ): Promise<T> {
    try {
      if (await this.checkApiAvailability()) {
        try {
          return await apiCall();
        } catch (apiError: any) {
          console.warn('API update failed, using mock:', apiError.message);
          return mockCall();
        }
      } else {
        return mockCall();
      }
    } catch (error) {
      console.warn('Using mock update fallback:', error);
      return mockCall();
    }
  }

  /**
   * Delete data via API or mock
   */
  private async deleteWithFallback(
    apiCall: () => Promise<void>,
    mockCall: () => void
  ): Promise<void> {
    try {
      if (await this.checkApiAvailability()) {
        try {
          await apiCall();
          return;
        } catch (apiError: any) {
          console.warn('API delete failed, using mock:', apiError.message);
          mockCall();
          return;
        }
      } else {
        mockCall();
        return;
      }
    } catch (error) {
      console.warn('Using mock delete fallback:', error);
      mockCall();
      return;
    }
  }

  /**
   * Normalize pagination params for API
   */
  private normalizePaginationParams(params?: PaginationParams): Record<string, any> {
    if (!params) return {};
    
    return {
      page: params.page || 1,
      page_size: params.pageSize || 20,
      search: params.search || '',
      ordering: params.sortBy 
        ? `${params.sortOrder === 'desc' ? '-' : ''}${params.sortBy}`
        : undefined,
    };
  }

  /**
   * Normalize API pagination response
   */
  private normalizePaginatedResponse<T>(
    data: any,
    params?: PaginationParams
  ): PaginatedResponse<T> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    
    // Handle null/undefined data
    if (!data) {
      return {
        results: [],
        count: 0,
        page,
        pageSize,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      };
    }
    
    // Handle different API response formats
    if (Array.isArray(data)) {
      // Simple array - create paginated response
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = data.slice(start, end);
      
      return {
        results: paginated,
        count: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
        hasNext: end < data.length,
        hasPrevious: page > 1,
      };
    }
    
    // Django REST Framework format
    if (data && typeof data === 'object' && data.results !== undefined) {
      return {
        results: Array.isArray(data.results) ? data.results : [],
        count: data.count || (Array.isArray(data.results) ? data.results.length : 0),
        page: data.page || page,
        pageSize: data.page_size || pageSize,
        totalPages: Math.ceil((data.count || (Array.isArray(data.results) ? data.results.length : 0)) / (data.page_size || pageSize)),
        hasNext: data.next !== null && data.next !== undefined,
        hasPrevious: data.previous !== null && data.previous !== undefined,
      };
    }
    
    // Single item - wrap in paginated response
    if (data && typeof data === 'object') {
      return {
        results: [data],
        count: 1,
        page: 1,
        pageSize: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
    }
    
    // Fallback: empty response
    return {
      results: [],
      count: 0,
      page,
      pageSize,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }

  // ==================== CMS Operations ====================

  /**
   * Get homepage data
   */
  async getHomepage(mockCall: () => any): Promise<any> {
    return this.fetchWithFallback(
      async () => {
        const response = await apiClient.get('/cms/queries/homepage/');
        return response.data;
      },
      mockCall
    );
  }

  /**
   * Update homepage data
   */
  async updateHomepage(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        // Try to get existing first
        try {
          const existing = await apiClient.get('/cms/queries/homepage/');
          if (existing.data && existing.data.length > 0) {
            // Update existing
            const id = existing.data[0].id;
            const response = await apiClient.patch(`/cms/commands/homepage/${id}/`, data);
            return response.data;
          }
        } catch (e) {
          // No existing, create new
        }
        
        // Create new
        const response = await apiClient.post('/cms/commands/homepage/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Get navigation data
   */
  async getNavigation(mockCall: () => any): Promise<any> {
    return this.fetchWithFallback(
      async () => {
        const response = await apiClient.get('/cms/queries/navigation/');
        return response.data;
      },
      mockCall
    );
  }

  /**
   * Update navigation data
   */
  async updateNavigation(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        try {
          const existing = await apiClient.get('/cms/queries/navigation/');
          if (existing.data && existing.data.length > 0) {
            const id = existing.data[0].id;
            const response = await apiClient.patch(`/cms/commands/navigation/${id}/`, data);
            return response.data;
          }
        } catch (e) {
          // No existing
        }
        
        const response = await apiClient.post('/cms/commands/navigation/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Get footer data
   */
  async getFooter(mockCall: () => any): Promise<any> {
    return this.fetchWithFallback(
      async () => {
        const response = await apiClient.get('/cms/queries/footer/');
        return response.data;
      },
      mockCall
    );
  }

  /**
   * Update footer data
   */
  async updateFooter(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        try {
          const existing = await apiClient.get('/cms/queries/footer/');
          if (existing.data && existing.data.length > 0) {
            const id = existing.data[0].id;
            const response = await apiClient.patch(`/cms/commands/footer/${id}/`, data);
            return response.data;
          }
        } catch (e) {
          // No existing
        }
        
        const response = await apiClient.post('/cms/commands/footer/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Get service guarantees
   */
  async getServiceGuarantees(mockCall: () => any): Promise<any> {
    return this.fetchWithFallback(
      async () => {
        const response = await apiClient.get('/cms/queries/service-guarantees/');
        return response.data;
      },
      mockCall
    );
  }

  /**
   * Create service guarantee
   */
  async createServiceGuarantee(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createWithFallback(
      async () => {
        const response = await apiClient.post('/cms/commands/service-guarantees/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Update service guarantee
   */
  async updateServiceGuarantee(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        const response = await apiClient.patch(`/cms/commands/service-guarantees/${id}/`, data);
        return response.data;
      },
      () => mockCall(id, data)
    );
  }

  /**
   * Delete service guarantee
   */
  async deleteServiceGuarantee(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteWithFallback(
      async () => {
        await apiClient.delete(`/cms/commands/service-guarantees/${id}/`);
      },
      () => mockCall(id)
    );
  }

  // ==================== Catalog Operations ====================

  /**
   * Get categories (paginated)
   */
  async getCategories(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    return this.fetchWithFallback(
      async () => {
        const queryParams = this.normalizePaginationParams(params);
        const response = await apiClient.get('/catalog/queries/categories/', { params: queryParams });
        return this.normalizePaginatedResponse(response.data, params);
      },
      () => {
        const allData = mockCall();
        return this.normalizePaginatedResponse(allData, params);
      }
    );
  }

  /**
   * Create category
   */
  async createCategory(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createWithFallback(
      async () => {
        const response = await apiClient.post('/catalog/commands/categories/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        const response = await apiClient.patch(`/catalog/commands/categories/${id}/`, data);
        return response.data;
      },
      () => mockCall(id, data)
    );
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteWithFallback(
      async () => {
        await apiClient.delete(`/catalog/commands/categories/${id}/`);
      },
      () => mockCall(id)
    );
  }

  /**
   * Get brands (paginated)
   */
  async getBrands(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    return this.fetchWithFallback(
      async () => {
        const queryParams = this.normalizePaginationParams(params);
        const response = await apiClient.get('/catalog/queries/brands/', { params: queryParams });
        return this.normalizePaginatedResponse(response.data, params);
      },
      () => {
        const allData = mockCall();
        return this.normalizePaginatedResponse(allData, params);
      }
    );
  }

  /**
   * Create brand
   */
  async createBrand(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createWithFallback(
      async () => {
        const response = await apiClient.post('/catalog/commands/brands/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Update brand
   */
  async updateBrand(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        const response = await apiClient.patch(`/catalog/commands/brands/${id}/`, data);
        return response.data;
      },
      () => mockCall(id, data)
    );
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteWithFallback(
      async () => {
        await apiClient.delete(`/catalog/commands/brands/${id}/`);
      },
      () => mockCall(id)
    );
  }

  /**
   * Suppliers
   */
  async getSuppliers(
    params?: PaginationParams,
    mockCall?: () => any[]
  ): Promise<PaginatedResponse<any>> {
    return this.fetchWithFallback(
      async () => {
        const queryParams = this.normalizePaginationParams(params);
        const response = await apiClient.get('/catalog/queries/suppliers/', { params: queryParams });
        return this.normalizePaginatedResponse(response.data, params);
      },
      () => {
        const fallback = mockCall ? mockCall() : [];
        return this.normalizePaginatedResponse(fallback, params);
      }
    );
  }

  async createSupplier(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createWithFallback(
      async () => {
        const response = await apiClient.post('/catalog/commands/suppliers/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  async updateSupplier(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        const response = await apiClient.patch(`/catalog/commands/suppliers/${id}/`, data);
        return response.data;
      },
      () => mockCall(id, data)
    );
  }

  async deleteSupplier(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteWithFallback(
      async () => {
        await apiClient.delete(`/catalog/commands/suppliers/${id}/`);
      },
      () => mockCall(id)
    );
  }

  // ==================== Products Operations ====================

  /**
   * Get products (paginated)
   */
  async getProducts(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    return this.fetchWithFallback(
      async () => {
        const queryParams = this.normalizePaginationParams(params);
        const response = await apiClient.get('/products/queries/', { params: queryParams });
        return this.normalizePaginatedResponse(response.data, params);
      },
      () => {
        const allData = mockCall();
        return this.normalizePaginatedResponse(allData, params);
      }
    );
  }

  /**
   * Get product by ID
   */
  async getProduct(id: string, mockCall: (id: string) => any): Promise<any> {
    return this.fetchWithFallback(
      async () => {
        const response = await apiClient.get(`/products/queries/${id}/`);
        return response.data;
      },
      () => mockCall(id)
    );
  }

  /**
   * Create product
   */
  async createProduct(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createWithFallback(
      async () => {
        const response = await apiClient.post('/products/commands/', data);
        return response.data;
      },
      () => mockCall(data)
    );
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateWithFallback(
      async () => {
        const response = await apiClient.patch(`/products/commands/${id}/`, data);
        return response.data;
      },
      () => mockCall(id, data)
    );
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteWithFallback(
      async () => {
        await apiClient.delete(`/products/commands/${id}/`);
      },
      () => mockCall(id)
    );
  }

  /**
   * Inventory helpers
   */
  async createStockRecord(
    data: { product_id: string; quantity: number; warehouse?: string | null; low_stock_threshold?: number },
    mockCall: () => void
  ): Promise<void> {
    return this.createWithFallback(
      async () => {
        await apiClient.post('/inventory/commands/stock/', {
          product_id: data.product_id,
          warehouse: data.warehouse || null,
          quantity: data.quantity,
          reserved_quantity: 0,
          low_stock_threshold: data.low_stock_threshold ?? 5,
        });
      },
      () => mockCall()
    );
  }
}

// Export singleton instance
export const adminApiClient = new AdminApiClient();

