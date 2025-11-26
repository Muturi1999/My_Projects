export const adminStats = [
  {
    label: "Today’s Revenue",
    value: "KSh 1.28M",
    delta: { value: "+12.4% vs yesterday", trend: "up" as const },
  },
  {
    label: "Open Orders",
    value: "312",
    delta: { value: "24 need fulfillment", trend: "neutral" as const },
  },
  {
    label: "Low Stock Alerts",
    value: "18",
    delta: { value: "6 critical", trend: "down" as const },
  },
  {
    label: "Active Campaigns",
    value: "5",
    delta: { value: "Black November ends in 4 days", trend: "neutral" as const },
  },
];

export const lowStockItems = [
  { sku: "LTP-001", name: "Lenovo ThinkPad X1", stock: 6, threshold: 10 },
  { sku: "MON-114", name: "Samsung Odyssey G7", stock: 4, threshold: 8 },
  { sku: "ACC-455", name: "Logitech MX Master 3S", stock: 9, threshold: 15 },
];

export const activeCampaigns = [
  {
    name: "Black November",
    period: "Nov 1 - Nov 30",
    status: "Live",
    uplift: "+32%",
  },
  {
    name: "Flash Sale Friday",
    period: "Nov 8",
    status: "Scheduled",
    uplift: "+18%*",
  },
];

export const supportQueue = [
  { id: "ORD-10923", customer: "Mary A.", channel: "Live Chat", waiting: "5m" },
  { id: "ORD-10911", customer: "Daniel K.", channel: "WhatsApp", waiting: "12m" },
  { id: "TCK-4481", customer: "Corporate Client", channel: "Email", waiting: "20m" },
];

