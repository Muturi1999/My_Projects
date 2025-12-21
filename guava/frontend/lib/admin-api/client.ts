/**
 * Admin API Client - Local store only (no backend)
 * 
 * This client provides a unified interface for admin CRUD operations.
 * All operations use local mock data store only.
 * 
 * Features:
 * - Local data store operations
 * - Pagination support
 * - Type-safe operations
 * - Error handling
 */

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
 * Normalize pagination params
 */
function normalizePaginationParams(params?: PaginationParams): Record<string, any> {
  if (!params) return {};
  
  return {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
    search: params.search || '',
    ordering: params.sortBy 
      ? `${params.sortOrder === 'desc' ? '-' : ''}${params.sortBy}`
      : undefined,
  };
}

/**
 * Normalize paginated response
 */
function normalizePaginatedResponse<T>(
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
  
  // Handle array data
  if (Array.isArray(data)) {
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

/**
 * Admin API Client class - Local store only
 */
export class AdminApiClient {
  /**
   * Get data from local store
   */
  private async fetchLocal<T>(mockCall: () => T): Promise<T> {
    return Promise.resolve(mockCall());
  }

  /**
   * Create data in local store
   */
  private async createLocal<T>(mockCall: () => T): Promise<T> {
    return Promise.resolve(mockCall());
  }

  /**
   * Update data in local store
   */
  private async updateLocal<T>(mockCall: () => T): Promise<T> {
    return Promise.resolve(mockCall());
  }

  /**
   * Delete data in local store
   */
  private async deleteLocal(mockCall: () => void): Promise<void> {
    return Promise.resolve(mockCall());
  }

  // ==================== CMS Operations ====================

  /**
   * Get homepage data
   */
  async getHomepage(mockCall: () => any): Promise<any> {
    return this.fetchLocal(mockCall);
  }

  /**
   * Update homepage data
   */
  async updateHomepage(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(data));
  }

  /**
   * Get navigation data
   */
  async getNavigation(mockCall: () => any): Promise<any> {
    return this.fetchLocal(mockCall);
  }

  /**
   * Update navigation data
   */
  async updateNavigation(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(data));
  }

  /**
   * Get footer data
   */
  async getFooter(mockCall: () => any): Promise<any> {
    return this.fetchLocal(mockCall);
  }

  /**
   * Update footer data
   */
  async updateFooter(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(data));
  }

  /**
   * Get service guarantees
   */
  async getServiceGuarantees(mockCall: () => any): Promise<any> {
    return this.fetchLocal(mockCall);
  }

  /**
   * Create service guarantee
   */
  async createServiceGuarantee(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createLocal(() => mockCall(data));
  }

  /**
   * Update service guarantee
   */
  async updateServiceGuarantee(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(id, data));
  }

  /**
   * Delete service guarantee
   */
  async deleteServiceGuarantee(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteLocal(() => mockCall(id));
  }

  // ==================== Catalog Operations ====================

  /**
   * Get categories (paginated)
   */
  async getCategories(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    const allData = await this.fetchLocal(mockCall);
    return normalizePaginatedResponse(allData, params);
  }

  /**
   * Create category
   */
  async createCategory(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createLocal(() => mockCall(data));
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(id, data));
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteLocal(() => mockCall(id));
  }

  /**
   * Get brands (paginated)
   */
  async getBrands(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    const allData = await this.fetchLocal(mockCall);
    return normalizePaginatedResponse(allData, params);
  }

  /**
   * Create brand
   */
  async createBrand(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createLocal(() => mockCall(data));
  }

  /**
   * Update brand
   */
  async updateBrand(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(id, data));
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteLocal(() => mockCall(id));
  }

  /**
   * Suppliers
   */
  async getSuppliers(
    params?: PaginationParams,
    mockCall?: () => any[]
  ): Promise<PaginatedResponse<any>> {
    const fallback = mockCall ? mockCall() : [];
    const allData = await this.fetchLocal(() => fallback);
    return normalizePaginatedResponse(allData, params);
  }

  async createSupplier(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createLocal(() => mockCall(data));
  }

  async updateSupplier(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(id, data));
  }

  async deleteSupplier(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteLocal(() => mockCall(id));
  }

  // ==================== Products Operations ====================

  /**
   * Get products (paginated)
   */
  async getProducts(
    params?: PaginationParams,
    mockCall: () => any[] = () => []
  ): Promise<PaginatedResponse<any>> {
    const allData = await this.fetchLocal(mockCall);
    return normalizePaginatedResponse(allData, params);
  }

  /**
   * Get product by ID
   */
  async getProduct(id: string, mockCall: (id: string) => any): Promise<any> {
    return this.fetchLocal(() => mockCall(id));
  }

  /**
   * Create product
   */
  async createProduct(data: any, mockCall: (data: any) => any): Promise<any> {
    return this.createLocal(() => mockCall(data));
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: any, mockCall: (id: string, data: any) => any): Promise<any> {
    return this.updateLocal(() => mockCall(id, data));
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string, mockCall: (id: string) => void): Promise<void> {
    return this.deleteLocal(() => mockCall(id));
  }

  /**
   * Inventory helpers
   */
  async createStockRecord(
    data: { product_id: string; quantity: number; warehouse?: string | null; low_stock_threshold?: number },
    mockCall: () => void
  ): Promise<void> {
    return this.createLocal(() => mockCall());
  }
}

// Export singleton instance
export const adminApiClient = new AdminApiClient();
