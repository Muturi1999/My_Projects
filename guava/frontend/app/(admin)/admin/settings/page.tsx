import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const sections = [
  { title: "Store profile", description: "Address, contact info, currencies" },
  { title: "Roles & permissions", description: "Invite teammates, assign scopes" },
  { title: "Notifications", description: "Low stock, campaign start, escalations" },
  { title: "Integrations", description: "Payments, couriers, analytics" },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Configure platform preferences and access controls."
        actions={<Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Save changes</Button>}
      />

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.title} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 bg-white shadow-sm">
        Audit log placeholder — list of admin actions with timestamps, IPs, and rollback hooks.
      </section>
    </div>
  );
}

