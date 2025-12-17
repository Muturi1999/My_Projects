import { HomepageCMSData } from "@/lib/types/cms";

export const homepageCMSData: HomepageCMSData = {
  heroSlides: [
    {
      id: "hero-1",
      eyebrow: "Black November Deals",
      title: "Laptops & Desktops up to 40% off",
      description: "Power through work, school, and play with premium performance devices.",
      ctaLabel: "Shop laptops",
      ctaHref: "/category/laptops-computers",
      leftImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      rightImage: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80",
      badge: "Limited stock",
    },
    {
      id: "hero-2",
      eyebrow: "Pro Accessories",
      title: "Tools for the modern workstation",
      description: "Keyboards, mice, headsets, docks, and more from leading brands.",
      ctaLabel: "Browse accessories",
      ctaHref: "/category/computer-accessories",
      leftImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      rightImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    },
  ],
  shopByCategory: {
    id: "shop-by-category",
    title: "Shop by Category",
    description: "Explore essentials across laptops, accessories, networking, and more.",
    layout: "grid",
    items: [
      { id: "cat-laptops", title: "Laptops & Computers", image: "/images/cms/categories/laptops.png", slug: "laptops-computers" },
      { id: "cat-accessories", title: "Computer Accessories", image: "/images/cms/categories/accessories.png", slug: "computer-accessories" },
      { id: "cat-monitors", title: "Monitors", image: "/images/cms/categories/monitors.png", slug: "monitors" },
      { id: "cat-smartphones", title: "Smartphones", image: "/images/cms/categories/phones.png", slug: "smartphones" },
      { id: "cat-audio", title: "Audio & Headphones", image: "/images/cms/categories/audio.png", slug: "audio-headphones" },
      { id: "cat-drives", title: "Drives & Storage", image: "/images/cms/categories/storage.png", slug: "drives-storage" },
    ],
  },
  featuredDeals: {
    id: "featured-deals",
    title: "Featured Deals",
    description: "Hero banners for seasonal promotions like HP OMEN flyer.",
    layout: "carousel",
    items: [
      {
        id: "fd-omen",
        title: "HP OMEN",
        subtitle: "Gaming Desktops",
        description: ["Intel Core i9", "NVIDIA RTX 4080", "32GB RAM", "2TB SSD"],
        price: 449999,
        saving: 50000,
        badge: "Top pick",
        image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=700&q=80",
        ctaLabel: "Buy now",
        ctaHref: "/checkout?productId=hp-omen-elite",
      },
    ],
  },
  hotDeals: {
    id: "hot-deals",
    title: "Today’s Hot Deals",
    description: "Rotating 4-card grid with discounts and stock info.",
    layout: "grid",
    items: [
      {
        id: "hot-1",
        name: "Samsung Galaxy A54 5G",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        price: 34999,
        originalPrice: 54000,
        inStock: true,
        rating: 5,
        badge: "35% OFF",
        slug: "/product/1",
      },
      {
        id: "hot-2",
        name: "HP DeskJet 2710 All-in-One",
        image:
          "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=600&q=80",
        price: 8999,
        originalPrice: 12000,
        inStock: true,
        rating: 5,
        badge: "30% OFF",
        slug: "/product/2",
      },
      {
        id: "hot-3",
        name: "Tenda AC10U AC1200",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        price: 4299,
        originalPrice: 6000,
        inStock: true,
        rating: 5,
        badge: "28% OFF",
        slug: "/product/3",
      },
      {
        id: "hot-4",
        name: "JBL Tune 510BT",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        price: 4599,
        originalPrice: 7000,
        inStock: true,
        rating: 5,
        badge: "34% OFF",
        slug: "/product/4",
      },
    ],
  },
  printerScanner: {
    id: "printer-scanner-section",
    title: "Printers & Scanner Deals",
    description: "Highlighted SKUs for the Printers & Scanner homepage section.",
    layout: "grid",
    items: [
      {
        id: "printer-1",
        name: "HP OfficeJet Pro",
        image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=600&q=80",
        price: 34999,
        originalPrice: 39999,
        slug: "/product/hp-officejet-pro",
      },
    ],
  },
  accessories: {
    id: "accessories-section",
    title: "Computer Accessories Deals",
    layout: "grid",
    items: [
      {
        id: "acc-1",
        name: "Logitech MX Master 3S",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        price: 12999,
        originalPrice: 14999,
        inStock: true,
        slug: "/product/logitech-mx-master-3s",
      },
    ],
  },
  audio: {
    id: "audio-section",
    title: "Audio & Headphones Deals",
    layout: "grid",
    items: [
      {
        id: "audio-1",
        name: "Sony WH-1000XM5",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        price: 49999,
        originalPrice: 54999,
        slug: "/product/sony-wh-1000xm5",
      },
    ],
  },
  popularBrands: {
    id: "popular-brands",
    title: "Shop Laptop by Brand",
    layout: "grid",
    items: [
      { id: "brand-hp", title: "HP", image: "/images/cms/brands/hp.png", slug: "brands/hp" },
      { id: "brand-dell", title: "Dell", image: "/images/cms/brands/dell.png", slug: "brands/dell" },
      { id: "brand-lenovo", title: "Lenovo", image: "/images/cms/brands/lenovo.png", slug: "brands/lenovo" },
    ],
  },
  popularCategories: {
    id: "popular-categories",
    title: "Popular Categories",
    layout: "grid",
    items: [
      { id: "pc-cctv", title: "CCTV & Security", image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=80", slug: "category/cctv-security", variant: "highlight" },
      { id: "pc-accessories", title: "Computer Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80", slug: "category/computer-accessories" },
    ],
  },
};

