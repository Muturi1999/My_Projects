import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const columns = [
  { title: "New", count: 34 },
  { title: "Processing", count: 18 },
  { title: "Shipped", count: 41 },
  { title: "Completed", count: 1_204 },
  { title: "Returns", count: 5 },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Monitor fulfillment, delivery statuses, and escalations."
        actions={
          <>
            <Button variant="outline">Download CSV</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Create draft order</Button>
          </>
        }
      />

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm overflow-x-auto">
        <div className="min-w-[900px] grid grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.title} className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">{column.title}</p>
                <span className="text-xs font-medium text-gray-500">{column.count}</span>
              </div>
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-xs text-gray-500 text-center">
                Drag-and-drop board placeholder — display order cards with SLA timers and courier steps.
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 bg-white text-sm text-gray-500 shadow-sm">
          Order timeline placeholder — show payment history, fulfillment events, customer notes.
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 bg-white text-sm text-gray-500 shadow-sm">
          Courier performance placeholder — deliveries on time, delayed shipments, carrier SLAs.
        </div>
      </section>
    </div>
  );
}

