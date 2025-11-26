/**
 * React hooks for products API.
 */
'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import type { Product, ProductListResponse } from '@/lib/api/types';

export function useProducts(params?: {
  category?: string;
  brand?: string;
  hot?: boolean;
  featured?: boolean;
  page?: number;
  page_size?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Partial<ProductListResponse>>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await productsApi.list(params);
        setProducts(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
          total_pages: response.total_pages,
          current_page: response.current_page,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, pagination };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await productsApi.get(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useHotDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHotDeals() {
      try {
        setLoading(true);
        const data = await productsApi.getHotDeals();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch hot deals'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHotDeals();
  }, []);

  return { products, loading, error };
}

export function useProductsByCategory(categorySlug: string) {
  return useProducts({ category: categorySlug });
}

export function useProductsByBrand(brandSlug: string) {
  return useProducts({ brand: brandSlug });
}

