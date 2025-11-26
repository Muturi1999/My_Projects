/**
 * Pagination hook for admin pages
 * Handles pagination state and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export interface PaginationParams {
  page: number;
  pageSize: number;
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

export interface UsePaginationOptions {
  defaultPageSize?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
}

export function usePagination<T = any>(
  fetchFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  options: UsePaginationOptions = {}
) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: options.defaultPage || parseInt(searchParams.get('page') || '1'),
    pageSize: options.defaultPageSize || parseInt(searchParams.get('pageSize') || '20'),
    count: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PaginationParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: search || undefined,
        sortBy: sortBy || undefined,
        sortOrder,
      };
      
      const result = await fetchFn(params);
      
      setData(result.results);
      setPagination({
        ...pagination,
        count: result.count,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Pagination fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, sortBy, sortOrder, fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ ...pagination, page });
      options.onPageChange?.(page);
    }
  }, [pagination, options]);

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      goToPage(pagination.page + 1);
    }
  }, [pagination, goToPage]);

  const previousPage = useCallback(() => {
    if (pagination.hasPrevious) {
      goToPage(pagination.page - 1);
    }
  }, [pagination, goToPage]);

  const setPageSize = useCallback((newPageSize: number) => {
    setPagination({ ...pagination, pageSize: newPageSize, page: 1 });
  }, [pagination]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    refresh,
  };
}

