import { ShopPageCMSData } from "@/lib/types/cms";

export const shopPageCMSData: ShopPageCMSData = {
  defaultView: "grid",
  itemsPerPage: 12,
  sortOptions: ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest First", "Highest Rated", "Best Sellers"],
  filters: [
    { id: "filter-1", label: "Availability", type: "checkbox", options: ["In Stock", "Out of Stock"], order: 1 },
    { id: "filter-2", label: "Price Range", type: "range", order: 2 },
    { id: "filter-3", label: "Brand", type: "checkbox", order: 3 },
    { id: "filter-4", label: "Type", type: "checkbox", order: 4 },
  ],
  featuredBrands: ["hp", "dell", "lenovo", "apple", "samsung"],
  bannerText: "Discover amazing deals on electronics",
};



