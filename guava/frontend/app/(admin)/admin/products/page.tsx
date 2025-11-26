"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FunnelIcon, ArrowDownTrayIcon, CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AddProductWizard } from "@/components/admin/products/AddProductWizard";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { formatKES } from "@/lib/utils/format";

interface ProductRow {
  id: string;
  name: string;
  category?: string;
  category_slug?: string;
  brand?: string;
  brand_slug?: string;
  price?: number;
  stock_quantity?: number;
  stock?: number;
}

interface FilterOptions {
  brand: string;
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  "Out of Stock": "bg-red-100 text-red-800",
  "Low Stock": "bg-amber-100 text-amber-800",
};

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    brand: "",
    category: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products");
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response has content
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.warn("Empty response from products API");
        setProducts([]);
        return;
      }
      
      // Parse JSON
      const data = JSON.parse(text);
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setProducts(list);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()) ||
          product.category_slug?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(
        (product) =>
          product.brand_slug?.toLowerCase() === filters.brand.toLowerCase() ||
          product.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category_slug?.toLowerCase() === filters.category.toLowerCase() ||
          product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((product) => {
        const qty = product.stock_quantity ?? product.stock ?? 0;
        if (filters.status === "active") return qty >= 10;
        if (filters.status === "low_stock") return qty > 0 && qty < 10;
        if (filters.status === "out_of_stock") return qty <= 0;
        return true;
      });
    }

    // Apply price range filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => (product.price ?? 0) >= min);
      }
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => (product.price ?? 0) <= max);
      }
    }

    return filtered;
  }, [products, search, filters]);

  const getStatusLabel = (product: ProductRow) => {
    const qty = product.stock_quantity ?? 0;
    if (qty <= 0) return "Out of Stock";
    if (qty < 10) return "Low Stock";
    return "Active";
  };

  const handleAddSuccess = () => {
    toast.success("Product added");
    setWizardOpen(false);
    loadProducts();
  };

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Products"
          description="Manage your product catalog, inventory, and pricing."
          actions={
            <Button
              className="bg-[#98C243] hover:bg-[#85AC3A] text-white px-4 py-2 rounded-none"
              onClick={() => setWizardOpen(true)}
            >
              + Add Product
            </Button>
          }
        />

        <section className="bg-white border border-gray-200 shadow-sm p-6 rounded-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-none border-gray-300 focus:ring-1 focus:ring-[#98C243]"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {(filters.brand || filters.category || filters.status || filters.minPrice || filters.maxPrice) && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#98C243]/10 border border-[#98C243] rounded-none">
                  <span className="text-sm font-medium text-[#2D3A06]">
                    {[filters.brand && "Brand", filters.category && "Category", filters.status && "Status"]
                      .filter(Boolean)
                      .join(", ")}
                    {(filters.minPrice || filters.maxPrice) && "Price"}
                  </span>
                  <button
                    onClick={() => {
                      setFilters({
                        brand: "",
                        category: "",
                        status: "",
                        minPrice: "",
                        maxPrice: "",
                      });
                    }}
                    className="text-[#2D3A06] hover:text-[#98C243]"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-none"
                onClick={() => setFilterOpen(true)}
              >
                <FunnelIcon className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2 rounded-none">
                <CloudArrowUpIcon className="h-4 w-4" />
                Bulk Upload
              </Button>
              <Button variant="outline" className="flex items-center gap-2 rounded-none">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {loading && <div className="px-4 py-6 text-sm text-gray-500 border-t border-gray-100">Loading products...</div>}
            {!loading && filteredProducts.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-500 border-t border-gray-100">No products found.</div>
            )}
            {filteredProducts.map((product) => {
              const status = getStatusLabel(product);
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-12 items-center px-4 py-4 border-t border-gray-100 text-sm"
                >
                  <div className="col-span-4">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.id}</p>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {product.category_slug || product.category || "—"}
                  </div>
                  <div className="col-span-2 font-medium">
                    {formatKES(product.price)}
                  </div>
                  <div className="col-span-2">{product.stock_quantity ?? "—"}</div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${
                        statusStyles[status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="text-gray-400 hover:text-gray-600">•••</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isWizardOpen && (
        <AddProductWizard open={isWizardOpen} onClose={() => setWizardOpen(false)} onSuccess={handleAddSuccess} />
      )}

      <ProductFilters
        open={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => {}}
        onClear={() => {
          setFilters({
            brand: "",
            category: "",
            status: "",
            minPrice: "",
            maxPrice: "",
          });
        }}
      />

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </>
  );
}

