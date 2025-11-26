import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const quickStats = [
  { label: "Published products", value: "1,284" },
  { label: "Drafts", value: "46" },
  { label: "Low stock", value: "28" },
];

export default function AdminCatalogPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Catalog"
        description="Manage categories, pricing, and product availability."
        actions={
          <>
            <Button variant="outline">Bulk upload</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Add product</Button>
          </>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full border border-gray-200">All categories</span>
            <span className="px-3 py-1 rounded-full border border-gray-200">Status: Live</span>
            <span className="px-3 py-1 rounded-full border border-gray-200">Sort: Updated recently</span>
          </div>
          <Button variant="outline" size="sm">
            Save view
          </Button>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Product table placeholder — hook into data grid (filters, inline stock edits, bulk actions).
        </div>
      </section>
    </div>
  );
}

