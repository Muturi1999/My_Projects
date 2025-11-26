import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const campaigns = [
  { name: "Black November", status: "Live", window: "Nov 1 – Nov 30", uplift: "+32%" },
  { name: "Flash Sale Friday", status: "Scheduled", window: "Nov 8", uplift: "+18%*" },
  { name: "Holiday Bundles", status: "Draft", window: "Dec 10 – Dec 26", uplift: "Pending" },
];

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Promotions"
        description="Plan seasonal sales, flash deals, and bundled offers."
        actions={
          <>
            <Button variant="outline">Campaign templates</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Create campaign</Button>
          </>
        }
      />

      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active & upcoming campaigns</h2>
          <Button variant="outline" size="sm">
            Calendar view
          </Button>
        </div>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#F9FAFB]">
              <div>
                <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                <p className="text-xs text-gray-500">{campaign.window}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                  Status: {campaign.status}
                </span>
                <span className="font-semibold text-[#4B6A11]">{campaign.uplift}</span>
              </div>
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 bg-white shadow-sm">
          Builder placeholder — step through promo basics, targeting, assets, preview, approvals.
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 bg-white shadow-sm">
          Smart suggestions placeholder — highlight categories with high inventory or stagnant sales.
        </div>
      </section>
    </div>
  );
}

