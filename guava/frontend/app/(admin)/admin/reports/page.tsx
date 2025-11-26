import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const reportCards = [
  { title: "Sales performance", detail: "Revenue by category, channel, device" },
  { title: "Promotion impact", detail: "Before/after uplift, margin impact" },
  { title: "Inventory health", detail: "Aging stock, turnover, coverage" },
  { title: "Customer insights", detail: "Repeat rate, AOV, cohorts" },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Visualize key metrics and schedule recurring exports."
        actions={
          <>
            <Button variant="outline">Schedule email</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Download PDF</Button>
          </>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
                <p className="text-sm text-gray-500">{card.detail}</p>
              </div>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </div>
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">
              Chart placeholder — integrate Chart.js for timeseries, donut, and stacked bar visualizations.
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

