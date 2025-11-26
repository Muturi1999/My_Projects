import { StatCard } from "@/components/admin/StatCard";
import {
  activeCampaigns,
  adminStats,
  lowStockItems,
  supportQueue,
} from "@/lib/data/admin/dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Daily overview of store performance</p>
        </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales & Campaigns</h2>
            <button className="text-sm font-medium text-[#A7E059]">View reports</button>
          </div>
          <div className="h-64 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
            Chart placeholder — connect Chart.js for trend visualization
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            <button className="text-sm text-[#A7E059]">Manage inventory</button>
          </div>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-500">{item.stock} in stock</p>
                  <p className="text-xs text-gray-500">Threshold {item.threshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
            <button className="text-sm text-[#A7E059]">Create new</button>
          </div>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.name}
                className="rounded-xl border border-gray-100 p-4 bg-[#F9FAFB]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                  <span className="text-xs font-medium text-[#A7E059]">{campaign.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{campaign.period}</p>
                <p className="text-xs font-medium text-gray-700 mt-2">Expected uplift {campaign.uplift}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Support Queue</h2>
            <button className="text-sm text-[#A7E059]">Open inbox</button>
          </div>
          <div className="divide-y divide-gray-100">
            {supportQueue.map((ticket) => (
              <div key={ticket.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.customer}</p>
                  <p className="text-xs text-gray-500">
                    {ticket.channel} • {ticket.id}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  waiting {ticket.waiting}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

