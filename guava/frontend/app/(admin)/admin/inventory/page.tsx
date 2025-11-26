import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const restockList = [
  { sku: "ACC-230", name: "Logitech MX Keys", stock: 6, supplier: "Logitech EA" },
  { sku: "DRV-512", name: "Samsung T7 1TB SSD", stock: 12, supplier: "Samsung Dist." },
  { sku: "LTP-044", name: "HP EliteBook 840", stock: 4, supplier: "HP Kenya" },
];

export default function AdminInventoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory"
        description="Track stock, thresholds, and replenishment schedules."
        actions={
          <>
            <Button variant="outline">Import counts</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Create PO</Button>
          </>
        }
      />

      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-100 p-4 bg-[#F9FAFB]">
            <p className="text-sm text-gray-500">Total SKUs</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">2,438</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 bg-[#F9FAFB]">
            <p className="text-sm text-gray-500">Low stock alerts</p>
            <p className="text-2xl font-semibold text-red-500 mt-1">28</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 bg-[#F9FAFB]">
            <p className="text-sm text-gray-500">In inbound shipment</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">412 units</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Restock priority</h2>
          <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {restockList.map((item) => (
              <div key={item.sku} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <p className="text-sm font-semibold text-red-500">{item.stock} remaining</p>
                <p className="text-xs text-gray-500">{item.supplier}</p>
                <Button variant="outline" size="sm">
                  Raise request
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 bg-white shadow-sm">
        Inventory heatmap placeholder — visualize stock aging, ABC classification, buffer levels.
      </section>
    </div>
  );
}

