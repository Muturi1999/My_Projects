"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatKenyaPhone, formatKenyaAddress } from "@/lib/utils/format";

interface SupplierRecord {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
  is_active?: boolean;
  products?: number;
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Inactive: "bg-gray-200 text-gray-700",
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/suppliers");
      const data = await response.json();
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setSuppliers(list);
    } catch (error) {
      console.error("Failed to load suppliers", error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;
    return suppliers.filter((supplier) =>
      supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier relationships and procurement."
        actions={
          <Button className="bg-[#98C243] hover:bg-[#85AC3A] text-white px-4 py-2 rounded-none">
            + Add Supplier
          </Button>
        }
      />

      <section className="bg-white border border-gray-200 shadow-sm p-6 rounded-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="w-full sm:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="rounded-none border-gray-300 focus:ring-1 focus:ring-[#98C243]"
            />
          </div>
        </div>

        <div className="border border-gray-200">
          <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">
            <div className="col-span-3">Supplier</div>
            <div className="col-span-3">Contact Info</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Products</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {loading && (
            <div className="px-4 py-6 text-sm text-gray-500 border-t border-gray-100">
              Loading suppliers...
            </div>
          )}
          {!loading && filteredSuppliers.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500 border-t border-gray-100">
              No suppliers found.
            </div>
          )}
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="grid grid-cols-12 items-center px-4 py-4 border-t border-gray-100 text-sm"
            >
              <div className="col-span-3">
                <p className="font-semibold text-gray-900">{supplier.name}</p>
                <p className="text-xs text-gray-500">{supplier.contact_name || "—"}</p>
              </div>
              <div className="col-span-3 text-gray-600">
                <p>{supplier.email || "—"}</p>
                <p className="text-xs">{formatKenyaPhone(supplier.phone)}</p>
              </div>
              <div className="col-span-2 text-gray-600">{formatKenyaAddress(supplier.location)}</div>
              <div className="col-span-2 font-medium">{supplier.products ?? "—"}</div>
              <div className="col-span-1">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${
                    (supplier.is_active !== false ? statusStyles.Active : statusStyles.Inactive)
                  }`}
                >
                  {supplier.is_active === false ? "Inactive" : "Active"}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <button className="text-gray-400 hover:text-gray-600">•••</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

