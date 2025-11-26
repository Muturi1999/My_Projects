import { FooterCMSData } from "@/lib/types/cms";

export const footerCMSData: FooterCMSData = {
  columns: [
    {
      id: "col-1",
      title: "TOP CATEGORIES",
      links: [
        { id: "link-1", label: "Laptops & Computers", href: "/category/laptops-computers" },
        { id: "link-2", label: "SmartPhone", href: "/category/smartphones" },
        { id: "link-3", label: "Headphone", href: "/category/audio-headphones" },
        { id: "link-4", label: "Accessories", href: "/category/computer-accessories" },
        { id: "link-5", label: "Printers", href: "/category/printers-scanners" },
        { id: "link-6", label: "Monitors & TVs", href: "/category/monitors" },
      ],
      order: 1,
    },
    {
      id: "col-2",
      title: "HELP & SUPPORT",
      links: [
        { id: "link-7", label: "Contact Us", href: "/contact" },
        { id: "link-8", label: "Payment Options", href: "/payment" },
        { id: "link-9", label: "Delivery Information", href: "/delivery" },
        { id: "link-10", label: "Track Order", href: "/track-order" },
        { id: "link-11", label: "Returns & Cancellations", href: "/returns" },
        { id: "link-12", label: "Customer Help", href: "/help" },
        { id: "link-13", label: "About Us", href: "/about" },
      ],
      order: 2,
    },
  ],
  companyInfo: {
    name: "GUAVASTORES",
    description:
      "Guavastores brings you the latest computing, accessories, mobile and smart tech at fair prices. We combine reliable fulfillment, transparent pricing and knowledgeable support to equip homes, offices and campuses with the right technology.",
    address: "The Bazaar, Moi Avenue, Nairobi Suite 1024",
    phone: "+254 710 599234",
    email: "info@guavastores.com",
  },
  socialLinks: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    youtube: "#",
  },
  copyright: "© 2025 Guava Stores",
};



