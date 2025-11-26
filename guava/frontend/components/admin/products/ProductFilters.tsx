"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterOptions {
  brand: string;
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onClear: () => void;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

export function ProductFilters({
  open,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [categoryRes, brandRes] = await Promise.all([
          fetch("/api/admin/catalog/categories"),
          fetch("/api/admin/catalog/brands"),
        ]);

        const categoryData = await categoryRes.json();
        const brandData = await brandRes.json();

        const catList = Array.isArray(categoryData?.results)
          ? categoryData.results
          : Array.isArray(categoryData)
          ? categoryData
          : [];
        const brandList = Array.isArray(brandData?.results)
          ? brandData.results
          : Array.isArray(brandData)
          ? brandData
          : [];

        setCategories(catList);
        setBrands(brandList);
      } catch (error) {
        console.error("Failed to load filter options", error);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [open]);

  if (!open) return null;

  const hasActiveFilters =
    filters.brand ||
    filters.category ||
    filters.status ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col rounded-none">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold">Filter Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Brand Filter */}
          <div>
            <label className="block text-base font-semibold mb-2 text-gray-700">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-base font-semibold mb-2 text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-base font-semibold mb-2 text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-base font-semibold mb-2 text-gray-700">Price Range (KES)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price (KES)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price (KES)</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  className="border border-gray-300 px-4 py-3 rounded-none text-base w-full h-12"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-sm text-gray-500 text-center py-4">Loading filter options...</div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <Button
            variant="outline"
            className="rounded-none h-11 text-base"
            onClick={() => {
              onClear();
              onApply();
            }}
            disabled={!hasActiveFilters}
          >
            Clear All
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-none h-11 text-base px-6"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#98C243] hover:bg-[#85AC3A] text-white rounded-none h-11 text-base font-semibold px-6"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

