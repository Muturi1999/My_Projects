/**
 * React hooks for catalog API.
 */
'use client';

import { useState, useEffect } from 'react';
import { catalogApi } from '@/lib/api';
import type { Category, Brand, CategoryListResponse, BrandListResponse } from '@/lib/api/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await catalogApi.getCategories();
        setCategories(response.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useCategory(idOrSlug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const data = await catalogApi.getCategory(idOrSlug);
        setCategory(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch category'));
        setCategory(null);
      } finally {
        setLoading(false);
      }
    }

    if (idOrSlug) {
      fetchCategory();
    }
  }, [idOrSlug]);

  return { category, loading, error };
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await catalogApi.getBrands();
        setBrands(response.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  return { brands, loading, error };
}

export function useBrand(idOrSlug: string) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBrand() {
      try {
        setLoading(true);
        const data = await catalogApi.getBrand(idOrSlug);
        setBrand(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brand'));
        setBrand(null);
      } finally {
        setLoading(false);
      }
    }

    if (idOrSlug) {
      fetchBrand();
    }
  }, [idOrSlug]);

  return { brand, loading, error };
}

