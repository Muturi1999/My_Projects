import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

const conversations = [
  { customer: "Mary A.", channel: "Live chat", topic: "Order #10923", waiting: "5m" },
  { customer: "Daniel K.", channel: "WhatsApp", topic: "Payment confirmation", waiting: "12m" },
  { customer: "Corporate Client", channel: "Email", topic: "Bulk quote", waiting: "20m" },
];

export default function AdminSupportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Support"
        description="Respond to customer chats, tickets, and escalations."
        actions={
          <>
            <Button variant="outline">Macros</Button>
            <Button className="bg-[#A7E059] text-gray-900 hover:bg-[#92D343]">Assign agents</Button>
          </>
        }
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            <Button variant="outline" size="sm">
              Filters
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <div key={conversation.customer} className="py-3">
                <p className="text-sm font-semibold text-gray-900">{conversation.customer}</p>
                <p className="text-xs text-gray-500">
                  {conversation.channel} • {conversation.topic}
                </p>
                <p className="text-xs font-medium text-red-500 mt-1">Waiting {conversation.waiting}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-200 p-6 bg-white shadow-sm text-sm text-gray-500 min-h-[320px]">
          Conversation panel placeholder — show message history, canned replies, order lookup, SLA timers.
        </div>
      </section>
    </div>
  );
}

