export interface MockSupplier {
  id: string;
  name: string;
  slug: string;
  contact_name: string;
  email: string;
  phone: string;
  location: string;
  tags?: string[];
  status?: "Active" | "Inactive";
}

export const mockSuppliers: MockSupplier[] = [
  {
    id: "sup-1",
    name: "TechGiant Distributors",
    slug: "techgiant-distributors",
    contact_name: "John Smith",
    email: "john@techgiant.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    tags: ["electronics", "computers"],
    status: "Active",
  },
  {
    id: "sup-2",
    name: "Global Electronics Ltd",
    slug: "global-electronics-ltd",
    contact_name: "Sarah Johnson",
    email: "sarah@globalelec.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    tags: ["audio", "devices"],
    status: "Active",
  },
  {
    id: "sup-3",
    name: "Premium Audio Co",
    slug: "premium-audio-co",
    contact_name: "Mike Wilson",
    email: "mike@premiumaudio.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    tags: ["audio"],
    status: "Inactive",
  },
];

