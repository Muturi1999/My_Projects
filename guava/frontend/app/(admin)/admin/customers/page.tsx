"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatKES } from "@/lib/utils/format";

const customers = [
  {
    id: "CUS-001",
    name: "Alice Freeman",
    email: "alice@example.com",
    orders: 12,
    totalSpent: 1240.5,
    lastOrder: "2025-04-12",
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Bob Smith",
    email: "bob@example.com",
    orders: 3,
    totalSpent: 245.0,
    lastOrder: "2025-03-28",
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    orders: 1,
    totalSpent: 45.0,
    lastOrder: "2024-12-15",
    status: "Inactive",
  },
  {
    id: "CUS-004",
    name: "Diana Prince",
    email: "diana@example.com",
    orders: 24,
    totalSpent: 3450.0,
    lastOrder: "2025-04-14",
    status: "VIP",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Inactive: "bg-gray-200 text-gray-700",
  VIP: "bg-purple-100 text-purple-800",
};

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Manage customer profiles and view purchase history."
        actions={
          <Button className="bg-[#98C243] hover:bg-[#85AC3A] text-white px-4 py-2 rounded-none">
            Export Customers
          </Button>
        }
      />

      <section className="bg-white border border-gray-200 shadow-sm p-6 rounded-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search customers..."
              className="rounded-none border-gray-300 focus:ring-1 focus:ring-[#98C243]"
            />
          </div>
        </div>

        <div className="border border-gray-200">
          <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Orders</div>
            <div className="col-span-2">Total Spent</div>
            <div className="col-span-2">Last Order</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-12 items-center px-4 py-4 border-t border-gray-100 text-sm"
            >
              <div className="col-span-3">
                <p className="font-semibold text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.email}</p>
              </div>
              <div className="col-span-2 text-gray-600">{customer.orders}</div>
              <div className="col-span-2 font-medium">
                {formatKES(customer.totalSpent)}
              </div>
              <div className="col-span-2 text-gray-600">{customer.lastOrder}</div>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${
                    statusStyles[customer.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {customer.status}
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

