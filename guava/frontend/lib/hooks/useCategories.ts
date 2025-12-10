"use client";

import { useState, useEffect } from "react";
import { catalogApi } from "@/lib/api/catalog";
import { shopCategories, type Category } from "@/lib/data/categories";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch categories from API with fallback to static data
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>(shopCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await catalogApi.getCategories({ page: 1, page_size: 100 });
      
      // Transform API response to match Category interface
      const transformedCategories: Category[] = (response.results || []).map((cat: any) => ({
        id: cat.id || cat.slug,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon || "",
        image: cat.image || "",
      }));
      
      if (transformedCategories.length > 0) {
        setCategories(transformedCategories);
      } else {
        // Fallback to static data if API returns empty
        setCategories(shopCategories);
      }
    } catch (err: any) {
      console.warn("Failed to fetch categories from API, using static data:", err.message);
      setError(err);
      // Fallback to static data
      setCategories(shopCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    
    // Listen for category updates
    const handleUpdate = () => {
      fetchCategories();
    };
    
    window.addEventListener("categories:updated", handleUpdate);
    
    return () => {
      window.removeEventListener("categories:updated", handleUpdate);
    };
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

