import { NavigationCMSData } from "@/lib/types/cms";

export const navigationCMSData: NavigationCMSData = {
  primaryNav: [
    { id: "nav-1", label: "Laptops", href: "/category/laptops-computers", order: 1 },
    { id: "nav-2", label: "Smartphones", href: "/category/smartphones", order: 2 },
    { id: "nav-3", label: "Accessories", href: "/category/computer-accessories", order: 3 },
    { id: "nav-4", label: "Gaming", href: "/category/gaming", order: 4 },
  ],
  categoryNav: [
    { id: "cat-nav-1", label: "All Categories", href: "#", hasDropdown: true, order: 1 },
    { id: "cat-nav-2", label: "Laptops", href: "/category/laptops-computers", order: 2 },
    { id: "cat-nav-3", label: "Smartphones", href: "/category/smartphones", order: 3 },
    { id: "cat-nav-4", label: "Accessories", href: "/category/computer-accessories", order: 4 },
  ],
  whatsappLink: "https://wa.me/254710599234",
  phoneNumber: "+254 710 599234",
};



