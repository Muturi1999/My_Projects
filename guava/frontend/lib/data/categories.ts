export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  slug?: string;
}

export interface CategoryDropdown {
  categoryName: string;
  columns: {
    title: string;
    links: string[];
  }[];
}

export const shopCategories: Category[] = [
  // First row (6 categories)
  {
    id: "1",
    name: "Laptops & Computers",
    icon: "laptop",
    slug: "laptops-computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "Computer Accessories",
    icon: "keyboard",
    slug: "computer-accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Monitors",
    icon: "monitor",
    slug: "monitors",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Smartphones",
    icon: "smartphone",
    slug: "smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "5",
    name: "Tablets & iPads",
    icon: "tablet",
    slug: "tablets-ipads",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "6",
    name: "Printers & Scanners",
    icon: "printer",
    slug: "printers-scanners",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=400&q=80",
  },
  // Second row (6 categories)
  {
    id: "7",
    name: "Desktops",
    icon: "desktop",
    slug: "desktops",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "8",
    name: "Audio & Headphones",
    icon: "headphones",
    slug: "audio-headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "9",
    name: "WiFi & Networking",
    icon: "wifi",
    slug: "wifi-networking",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "10",
    name: "Software",
    icon: "software",
    slug: "software",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "11",
    name: "Drives & Storage",
    icon: "hard-drive",
    slug: "drives-storage",
    image: "https://images.unsplash.com/photo-1591488320449-11f2e2e2d08f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "12",
    name: "Gaming",
    icon: "gamepad",
    slug: "gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80",
  },
];

export interface PopularCategory {
  id: string;
  name: string;
  image: string;
  subCategories: string[];
}

export interface PopularCategory {
  id: string;
  name: string;
  image: string;
  slug: string;
  subCategories: string[];
}

export const popularCategories: PopularCategory[] = [
  {
    id: "1",
    name: "CCTV & Security",
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80",
    slug: "cctv-security",
    subCategories: [
      "Access Control",
      "Security Cameras",
      "Security Systems",
      "Security Accessories",
      "CCTV & NVR System",
    ],
  },
  {
    id: "2",
    name: "Computer Accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    slug: "computer-accessories",
    subCategories: [
      "Laptop Bags & Cases",
      "Keyboards & Mouse",
      "Headphones",
      "Webcams",
      "Batteries & Cables",
    ],
  },
  {
    id: "3",
    name: "Drives & Storage",
    image: "https://images.unsplash.com/photo-1591488320449-11f2e2e2d08f?auto=format&fit=crop&w=800&q=80",
    slug: "drives-storage",
    subCategories: [
      "External Hard Drive",
      "SSD Hard Drives",
      "Internal Hard Drives",
      "USB Flash Drives",
      "Servers",
    ],
  },
  {
    id: "4",
    name: "TV, Audio & Video",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    slug: "tv-audio-video",
    subCategories: [
      "TVs",
      "Projectors",
      "Home cinema & Soundbars",
      "Video Conferencing",
      "Car Audio",
    ],
  },
];

export interface Brand {
  id: string;
  name: string;
  logo: string;
  image: string; // Live image URL
  slug: string; // URL-friendly slug
  discount?: number;
  color: string;
}

export const popularBrands: Brand[] = [
  {
    id: "1",
    name: "EPSON",
    logo: "/brands/epson.png",
    image: "https://cdn.simpleicons.org/epson/00a6e0",
    slug: "epson",
    color: "#00a6e0",
  },
  {
    id: "2",
    name: "SAMSUNG",
    logo: "/brands/samsung.png",
    image: "https://cdn.simpleicons.org/samsung/1428a0",
    slug: "samsung",
    color: "#1428a0",
  },
  {
    id: "3",
    name: "LG",
    logo: "/brands/lg.png",
    image: "https://cdn.simpleicons.org/lg/a50034",
    slug: "lg",
    color: "#a50034",
  },
  {
    id: "4",
    name: "Canon",
    logo: "/brands/canon.png",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Canon_logo.svg/512px-Canon_logo.svg.png",
    slug: "canon",
    color: "#bc002d",
  },
  {
    id: "5",
    name: "tp-link",
    logo: "/brands/tp-link.png",
    image: "https://cdn.simpleicons.org/tplink/4a90e2",
    slug: "tp-link",
    color: "#4a90e2",
  },
  {
    id: "6",
    name: "SEAGATE",
    logo: "/brands/seagate.png",
    image: "https://cdn.simpleicons.org/seagate/0066cc",
    slug: "seagate",
    color: "#0066cc",
  },
  {
    id: "7",
    name: "HP",
    image: "https://cdn.simpleicons.org/hp/0096d6",
    slug: "hp",
    logo: "/brands/hp.png",
    color: "#0096d6",
  },
  {
    id: "8",
    name: "Dell",
    image: "https://cdn.simpleicons.org/dell/007DB8",
    slug: "dell",
    logo: "/brands/dell.png",
    color: "#007DB8",
  },
  {
    id: "9",
    name: "Lenovo",
    image: "https://cdn.simpleicons.org/lenovo/E2231A",
    slug: "lenovo",
    logo: "/brands/lenovo.png",
    color: "#E2231A",
  },
  {
    id: "10",
    name: "Apple",
    image: "https://cdn.simpleicons.org/apple/000000",
    slug: "apple",
    logo: "/brands/apple.png",
    color: "#000000",
  },
  {
    id: "11",
    name: "Acer",
    image: "https://cdn.simpleicons.org/acer/83B81A",
    slug: "acer",
    logo: "/brands/acer.png",
    color: "#83B81A",
  },
  {
    id: "12",
    name: "ASUS",
    image: "https://cdn.simpleicons.org/asus/000000",
    slug: "asus",
    logo: "/brands/asus.png",
    color: "#000000",
  },
  {
    id: "13",
    name: "Microsoft",
    image: "https://cdn.simpleicons.org/microsoft/00A4EF",
    slug: "microsoft",
    logo: "/brands/microsoft.png",
    color: "#00A4EF",
  },
  {
    id: "14",
    name: "Logitech",
    image: "https://cdn.simpleicons.org/logitech/00B8FC",
    slug: "logitech",
    logo: "/brands/logitech.png",
    color: "#00B8FC",
  },
  {
    id: "15",
    name: "Sony",
    image: "https://cdn.simpleicons.org/sony/000000",
    slug: "sony",
    logo: "/brands/sony.png",
    color: "#000000",
  },
  {
    id: "16",
    name: "Intel",
    image: "https://cdn.simpleicons.org/intel/0071C5",
    slug: "intel",
    logo: "/brands/intel.png",
    color: "#0071C5",
  },
  {
    id: "17",
    name: "AMD",
    image: "https://cdn.simpleicons.org/amd/ED1C24",
    slug: "amd",
    logo: "/brands/amd.png",
    color: "#ED1C24",
  },
  {
    id: "18",
    name: "NVIDIA",
    image: "https://cdn.simpleicons.org/nvidia/76B900",
    slug: "nvidia",
    logo: "/brands/nvidia.png",
    color: "#76B900",
  },
  {
    id: "19",
    name: "Corsair",
    image: "https://cdn.simpleicons.org/corsair/000000",
    slug: "corsair",
    logo: "/brands/corsair.png",
    color: "#000000",
  },
  {
    id: "20",
    name: "Razer",
    image: "https://cdn.simpleicons.org/razer/00FF00",
    slug: "razer",
    logo: "/brands/razer.png",
    color: "#00FF00",
  },
];

export const categoryDropdowns: Record<string, CategoryDropdown> = {
  "Laptops & Computers": {
    categoryName: "Laptops & Computers",
    columns: [
      {
        title: "Computers & Tablets",
        links: [
          "Laptops & Desktops",
          "Tablets",
          "Monitors",
          "Laptops",
          "Accessories",
        ],
      },
      {
        title: "Camera",
        links: ["Camera", "Accessories"],
      },
      {
        title: "Cell Phone",
        links: [
          "Smartphone",
          "AT&T",
          "iPhone",
          "Prepaid Phones",
          "Samsung Galaxy",
          "Unlocked Phones",
        ],
      },
      {
        title: "TV & Home Theater",
        links: ["Television"],
      },
    ],
  },
  "Accessories": {
    categoryName: "Accessories",
    columns: [
      {
        title: "Computer Accessories",
        links: [
          "Laptop Bags & Cases",
          "Keyboards & Mouse",
          "Headphones",
          "Webcams",
          "Software & Games",
        ],
      },
      {
        title: "Cables & Adapters",
        links: [
          "USB Cables",
          "HDMI Cables",
          "Power Adapters",
          "Connectors",
        ],
      },
      {
        title: "Storage",
        links: [
          "USB Flash Drives",
          "External Hard Drives",
          "Memory Cards",
        ],
      },
    ],
  },
  "Monitors & TVs": {
    categoryName: "Monitors & TVs",
    columns: [
      {
        title: "Monitors",
        links: [
          "Gaming Monitors",
          "4K Monitors",
          "Ultrawide Monitors",
          "Professional Monitors",
        ],
      },
      {
        title: "TVs",
        links: [
          "Smart TVs",
          "4K TVs",
          "LED TVs",
          "OLED TVs",
        ],
      },
      {
        title: "Accessories",
        links: [
          "TV Stands",
          "Monitor Arms",
          "Cables",
        ],
      },
    ],
  },
  Smartphones: {
    categoryName: "Smartphones",
    columns: [
      {
        title: "Cell Phone",
        links: [
          "Smartphone",
          "AT&T",
          "iPhone",
          "Prepaid Phones",
          "Samsung Galaxy",
          "Unlocked Phones",
        ],
      },
      {
        title: "Accessories",
        links: [
          "Phone Cases",
          "Screen Protectors",
          "Chargers",
          "Wireless Chargers",
        ],
      },
    ],
  },
  Printers: {
    categoryName: "Printers",
    columns: [
      {
        title: "Printers",
        links: [
          "Inkjet Printers",
          "Laser Printers",
          "All-in-One Printers",
          "Photo Printers",
        ],
      },
      {
        title: "Supplies",
        links: [
          "Ink Cartridges",
          "Toner",
          "Paper",
        ],
      },
    ],
  },
  "Drives & Storage": {
    categoryName: "Drives & Storage",
    columns: [
      {
        title: "Storage Devices",
        links: [
          "External Hard Drive",
          "SSD Hard Drives",
          "Internal Hard Drives",
          "USB Flash Drives",
          "Servers",
        ],
      },
      {
        title: "Network Storage",
        links: [
          "NAS Devices",
          "Network Drives",
        ],
      },
    ],
  },
  Gaming: {
    categoryName: "Gaming",
    columns: [
      {
        title: "Video Games",
        links: [
          "Xbox Series",
          "Playstation 4",
          "Playstation 5",
          "Gaming Headsets",
          "Accessories",
        ],
      },
      {
        title: "Gaming Peripherals",
        links: [
          "Gaming Keyboards",
          "Gaming Mice",
          "Gaming Monitors",
          "Gaming Chairs",
        ],
      },
      {
        title: "Gaming Consoles",
        links: [
          "PlayStation",
          "Xbox",
          "Nintendo Switch",
        ],
      },
    ],
  },
};

export interface BrandSection {
  name: string;
  slug: string;
  discount: number;
  color: string;
  image: string;
  text: string;
}

export const brandSections: BrandSection[] = [
  {
    name: "HP",
    slug: "hp",
    discount: 0,
    color: "#A7E059",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    text: "You simply won't find it cheaper - HP Laptops",
  },
  {
    name: "Dell",
    slug: "dell",
    discount: 20,
    color: "#FF6B35",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
    text: "20% OFF Dell Laptops",
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    discount: 25,
    color: "#E2231A",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    text: "Save up to 25% on Lenovo Laptops",
  },
  {
    name: "Apple",
    slug: "apple",
    discount: 15,
    color: "#000000",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
    text: "Premium Apple MacBooks",
  },
  {
    name: "Acer",
    slug: "acer",
    discount: 30,
    color: "#83B81A",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    text: "Up to 30% OFF Acer Laptops",
  },
];

