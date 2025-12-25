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
    image: "/laptop.png",
  },
  {
    id: "2",
    name: "Computer Accessories",
    icon: "keyboard",
    slug: "computer-accessories",
    image: "/Computer Accessories.png",
  },
  {
    id: "3",
    name: "Monitors",
    icon: "monitor",
    slug: "monitors",
    image: "/Monitors.png",
  },
  {
    id: "4",
    name: "Smartphones",
    icon: "smartphone",
    slug: "smartphones",
    image: "/Smartphones.png",
  },
  {
    id: "5",
    name: "Tablets & iPads",
    icon: "tablet",
    slug: "tablets-ipads",
    image: "/Tablets & Ipads.png",
  },
  {
    id: "6",
    name: "Printers & Scanners",
    icon: "printer",
    slug: "printers-scanners",
    image: "/Printers & Scanners.png",
  },
  // Second row (6 categories)
  {
    id: "7",
    name: "Desktops",
    icon: "desktop",
    slug: "desktops",
    image: "/Desktops.png",
  },
  {
    id: "8",
    name: "Audio & Headphones",
    icon: "headphones",
    slug: "audio-headphones",
    image: "/Audio & Headphones.png",
  },
  {
    id: "9",
    name: "WiFi & Networking",
    icon: "wifi",
    slug: "wifi-networking",
    image: "/Wifi & Networking.png",
  },
  {
    id: "10",
    name: "Software",
    icon: "software",
    slug: "software",
    image: "/Software.png",
  },
  {
    id: "11",
    name: "Drives & Storage",
    icon: "hard-drive",
    slug: "drives-storage",
    image: "/Drivers & Storage.png",
  },
  {
    id: "12",
    name: "Gaming",
    icon: "gamepad",
    slug: "gaming",
    image: "/Gaming.png",
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
    image: "/cctv and security.png",
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
    image: "/computer accessories-pc.png",
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
    image: "/Drivers&storage-pc.png",
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
    image: "/Tv, audio & Video.png",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Logitech_logo.svg",
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
  "Desktops": {
    categoryName: "Desktops",
    columns: [
      {
        title: "Desktop Brands",
        links: [
          "HP Desktops",
          "Lenovo Desktops",
          "Dell Desktops",
          "Acer Desktops",
          "Asus Desktops",
          "Apple iMac",
          "MSI Desktops",
        ],
      },
      {
        title: "More Brands",
        links: [
          "Samsung Desktops",
          "LG Desktops",
          "Sony Desktops",
          "Mecer Desktops",
          "Compaq Desktops",
          "Fujitsu Desktops",
        ],
      },
      {
        title: "Brand New Desktops",
        links: [
          "New Desktops",
          "Tower Desktops",
          "Small Form Factor",
          "Gaming Desktops",
          "Workstations",
        ],
      },
      {
        title: "Refurbished Desktops",
        links: [
          "Ex-Uk Desktops",
          "Refurbished HP",
          "Refurbished Dell",
          "Refurbished Lenovo",
          "SEE ALL DESKTOPS",
        ],
      },
      {
        title: "Desktop Specs",
        links: [
          "Intel Core i9 Desktops",
          "Intel Core i7 Desktops",
          "Intel Core i5 Desktops",
          "Intel Core i3 Desktops",
          "Dual Core Desktops",
          "Core 2 Duo Desktops",
          "AMD Ryzen Desktops",
        ],
      },
      {
        title: "Desktop Types",
        links: [
          "All in One PC's",
          "Tower Form Factors",
          "Small Form Factors",
          "Gaming Desktops",
          "Servers & Workstations",
          "Business/Office Desktops",
          "Chromebox Desktops",
        ],
      },
      {
        title: "Monitor Sizes",
        links: [
          "17\" Monitors",
          "18.5\" Monitors",
          "19\" Monitors",
          "20\" Monitors",
          "22\" Monitors",
          "23.8\" Monitors",
          "24\" Monitors",
          "27\" Monitors",
        ],
      },
      {
        title: "Monitor Types",
        links: [
          "4K Monitors",
          "Full HD Monitors",
          "Gaming Monitors",
          "Curved Monitors",
          "Ultrawide Monitors",
        ],
      },
      {
        title: "Brand New Monitors",
        links: [
          "New Monitors",
          "HP Monitors",
          "Dell Monitors",
          "Samsung Monitors",
          "LG Monitors",
        ],
      },
      {
        title: "Refurbished Monitors",
        links: [
          "Ex-UK Monitors",
          "Refurbished HP Monitors",
          "Refurbished Dell Monitors",
          "Refurbished Samsung",
        ],
      },
      {
        title: "Storage Options",
        links: [
          "SSD Desktops",
          "HDD Desktops",
          "256GB Storage",
          "512GB Storage",
          "1TB Storage",
        ],
      },
    ],
  },
  "Laptops": {
    categoryName: "Laptops",
    columns: [
      {
        title: "Laptop Brands",
        links: [
          "HP Laptops",
          "Lenovo Laptops",
          "Dell Laptops",
          "Acer Laptops",
          "Asus Laptops",
          "MacBooks",
          "Microsoft Surface Pro",
        ],
      },
      {
        title: "More Brands",
        links: [
          "Toshiba Laptops",
          "Samsung Laptops",
          "MSI Laptops",
          "Razer Laptops",
          "Alienware Laptops",
          "LG Laptops",
          "Huawei Laptops",
        ],
      },
      {
        title: "Additional Brands",
        links: [
          "Xiaomi Laptops",
          "Legion Laptops",
          "Google Pixelbook",
          "Fujitsu Laptops",
          "Panasonic Laptops",
          "Vaio Laptops",
        ],
      },
      {
        title: "Brand New Laptops",
        links: [
          "New Laptops",
          "Latest Models",
          "Business Laptops",
          "Gaming Laptops",
          "Student Laptops",
          "Ultrabooks",
        ],
      },
      {
        title: "Refurbished Laptops",
        links: [
          "Ex-UK Laptops",
          "Refurbished HP",
          "Refurbished Dell",
          "Refurbished Lenovo",
          "SEE ALL LAPTOPS",
        ],
      },
      {
        title: "Laptop Specs",
        links: [
          "Intel Core i7 Laptops",
          "Intel Core i5 Laptops",
          "Intel Core i3 Laptops",
          "Dual Core Laptops",
          "Intel Celeron Laptops",
          "Intel Pentium Laptops",
          "Intel Atom Laptops",
          "AMD Laptops",
        ],
      },
      {
        title: "Screen Sizes",
        links: [
          "11\" Laptops",
          "13\" Laptops",
          "14\" Laptops",
          "15.6\" Laptops",
          "17\" Laptops",
        ],
      },
      {
        title: "Laptop Types",
        links: [
          "Student Laptops",
          "Budget Laptops",
          "2-in-1 Convertibles",
          "Chromebooks",
          "Tablets",
        ],
      },
      {
        title: "Storage Options",
        links: [
          "SSD Laptops",
          "HDD Laptops",
          "256GB Storage",
          "512GB Storage",
          "1TB Storage",
        ],
      },
      {
        title: "Graphics",
        links: [
          "Integrated Graphics",
          "Dedicated Graphics",
          "NVIDIA Graphics",
          "AMD Graphics",
        ],
      },
      {
        title: "Softwares",
        links: [
          "Antivirus",
          "Internet Security",
          "Windows 10",
          "Office 2013",
        ],
      },
      {
        title: "Accessories",
        links: [
          "Laptop Bags",
          "Laptop Chargers",
          "Laptop Batteries",
          "Laptop Memory (RAM)",
          "Mouse",
          "Keyboards",
          "Webcams",
        ],
      },
    ],
  },
  "Phones": {
    categoryName: "Phones",
    columns: [
      {
        title: "iPhones",
        links: [
          "iPhone 17 Pro Max",
          "iPhone 17 Pro",
          "iPhone 17 Plus",
          "iPhone 17",
          "iPhone 16 Pro Max",
          "iPhone 16 Pro",
          "iPhone 16 Plus",
          "iPhone 16",
          "iPhone 15 Pro Max",
          "iPhone 15 Pro",
          "iPhone 15 Plus",
        ],
      },
      {
        title: "More iPhones",
        links: [
          "iPhone 14",
          "iPhone 13 Pro Max",
          "iPhone 13 Pro",
          "iPhone 13",
          "iPhone 12 Pro Max",
          "iPhone 12 Pro",
          "iPhone 12",
          "iPhone 11 Pro Max",
          "iPhone 11 Pro",
          "iPhone 11",
          "iPhone XS Max",
        ],
      },
      {
        title: "Older iPhones",
        links: [
          "iPhone XS",
          "iPhone XR",
          "iPhone X",
          "iPhone 8 Plus",
          "iPhone 8",
          "iPhone 7 Plus",
          "iPhone 7",
          "iPhone 6s Plus",
          "iPhone 6s",
          "iPhone 6 Plus",
          "iPhone 6",
        ],
      },
      {
        title: "Samsung Phones",
        links: [
          "Samsung Galaxy S24 Ultra",
          "Samsung Galaxy S24+",
          "Samsung Galaxy S24",
          "Samsung Galaxy S23 Ultra",
          "Samsung Galaxy S23+",
          "Samsung Galaxy S23",
          "Samsung Galaxy Z Fold 5",
          "Samsung Galaxy Z Flip 5",
          "Samsung Galaxy A54",
          "Samsung Galaxy A34",
          "Samsung Galaxy A14",
        ],
      },
      {
        title: "Tecno Phones",
        links: [
          "Tecno Camon 40 Pro",
          "Tecno Camon 40",
          "Tecno Camon 30 Pro",
          "Tecno Camon 30",
          "Tecno Phantom X2 Pro",
          "Tecno Spark 20 Pro",
          "Tecno Spark 20",
          "Tecno Pova 6 Pro",
          "Tecno Pova 6",
          "Tecno Pop 8 Pro",
        ],
      },
      {
        title: "Infinix Phones",
        links: [
          "Infinix Zero 30",
          "Infinix Note 30 Pro",
          "Infinix Note 30",
          "Infinix Hot 30",
          "Infinix Hot 30i",
          "Infinix Smart 8",
          "Infinix Smart 7",
          "Infinix Zero X Pro",
          "Infinix Note 12",
        ],
      },
      {
        title: "Redmi Phones",
        links: [
          "Redmi Note 13 Pro+",
          "Redmi Note 13 Pro",
          "Redmi Note 13",
          "Redmi 12",
          "Redmi 12C",
          "Redmi Note 12 Pro",
          "Redmi Note 12",
          "Redmi Note 11",
          "Redmi 10",
        ],
      },
      {
        title: "Huawei Phones",
        links: [
          "Huawei Mate 60 Pro",
          "Huawei P60 Pro",
          "Huawei P60",
          "Huawei Nova 11 Pro",
          "Huawei Nova 11",
          "Huawei Mate 50 Pro",
          "Huawei P50 Pro",
          "Huawei Nova Y90",
        ],
      },
      {
        title: "Google Pixel",
        links: [
          "Google Pixel 8 Pro",
          "Google Pixel 8",
          "Google Pixel 7 Pro",
          "Google Pixel 7",
          "Google Pixel 7a",
          "Google Pixel 6 Pro",
          "Google Pixel 6",
          "Google Pixel 6a",
        ],
      },
      {
        title: "Xiaomi Phones",
        links: [
          "Xiaomi 14 Pro",
          "Xiaomi 14",
          "Xiaomi 13 Ultra",
          "Xiaomi 13 Pro",
          "Xiaomi 13",
          "Xiaomi 12 Pro",
          "Xiaomi 12",
          "Xiaomi 11T Pro",
        ],
      },
      {
        title: "Other Brands",
        links: [
          "Oppo Phones",
          "Vivo Phones",
          "OnePlus Phones",
          "Nokia Phones",
          "Realme Phones",
          "Sony Xperia",
          "Motorola Phones",
          "Itel Phones",
        ],
      },
      {
        title: "Phone Condition",
        links: [
          "Brand New Phones",
          "Refurbished Phones",
          "Ex-UK Phones",
          "Used Phones",
          "Certified Pre-Owned",
          "SEE ALL PHONES",
        ],
      },
    ],
  },
  "TVs": {
    categoryName: "TVs",
    columns: [
      {
        title: "TV Types",
        links: [
          "Smart TVs",
          "4K Ultra HD TVs",
          "8K TVs",
          "LED TVs",
          "OLED TVs",
          "QLED TVs",
          "ULED TVs",
          "Android TVs",
          "Google TVs",
          "Roku TVs",
        ],
      },
      {
        title: "TV Brands",
        links: [
          "Samsung TVs",
          "LG TVs",
          "Sony TVs",
          "TCL TVs",
          "Hisense TVs",
          "Panasonic TVs",
          "Philips TVs",
          "Toshiba TVs",
          "Sharp TVs",
        ],
      },
      {
        title: "More Brands",
        links: [
          "Skyworth TVs",
          "Changhong TVs",
          "Vitron TVs",
          "Nobel TVs",
          "Vision Plus TVs",
          "Nasco TVs",
          "Bruhm TVs",
        ],
      },
      {
        title: "Screen Sizes",
        links: [
          "24 inch TVs",
          "32 inch TVs",
          "40 inch TVs",
          "43 inch TVs",
          "49 inch TVs",
          "50 inch TVs",
          "55 inch TVs",
          "58 inch TVs",
          "60 inch TVs",
        ],
      },
      {
        title: "Large Screen TVs",
        links: [
          "65 inch TVs",
          "70 inch TVs",
          "75 inch TVs",
          "77 inch TVs",
          "82 inch TVs",
          "85 inch TVs",
          "98 inch TVs",
        ],
      },
      {
        title: "Display Technology",
        links: [
          "Full HD TVs",
          "4K UHD TVs",
          "8K TVs",
          "HDR TVs",
          "Dolby Vision TVs",
          "Curved TVs",
        ],
      },
      {
        title: "Smart Features",
        links: [
          "Android Smart TVs",
          "Google TV",
          "WebOS TVs",
          "Tizen OS TVs",
          "Vidaa OS TVs",
          "Voice Control TVs",
          "WiFi TVs",
          "Bluetooth TVs",
        ],
      },
      {
        title: "TV Accessories",
        links: [
          "TV Wall Mounts",
          "TV Stands",
          "HDMI Cables",
          "TV Remote Controls",
          "TV Antenna",
          "Streaming Devices",
          "TV Screen Protectors",
        ],
      },
      {
        title: "Streaming Devices",
        links: [
          "Amazon Fire Stick",
          "Roku Streaming Stick",
          "Google Chromecast",
          "Apple TV",
          "Android TV Box",
        ],
      },
      {
        title: "Special Categories",
        links: [
          "Gaming TVs",
          "Outdoor TVs",
          "Commercial Display TVs",
          "Portable TVs",
          "Budget TVs",
          "**SEE ALL TVs →**",
        ],
      },
    ],
  },
  "Sound Bars": {
    categoryName: "Sound Bars",
    columns: [
      {
        title: "Sound Bar Brands",
        links: [
          "Samsung Sound Bars",
          "LG Sound Bars",
          "Sony Sound Bars",
          "JBL Sound Bars",
          "Bose Sound Bars",
          "TCL Sound Bars",
          "Yamaha Sound Bars",
          "Polk Audio Sound Bars",
        ],
      },
      {
        title: "More Sound Bar Brands",
        links: [
          "Vitron Sound Bars",
          "Amtech Sound Bars",
          "GLD Sound Bars",
          "Harman Kardon Sound Bars",
          "Klipsch Sound Bars",
          "Vizio Sound Bars",
          "Sonos Sound Bars",
          "Denon Sound Bars",
          "Hisense Sound Bars",
          "Vision Plus Sound Bars",
          "Haier Sound Bars",
        ],
      },
      {
        title: "Sound Bar Types",
        links: [
          "2.1 Channel Sound Bars",
          "3.1 Channel Sound Bars",
          "5.1 Channel Sound Bars",
          "7.1 Channel Sound Bars",
          "Dolby Atmos Sound Bars",
          "DTS:X Sound Bars",
          "Compact Sound Bars",
        ],
      },
      {
        title: "Woofer Brands",
        links: [
          "Samsung Woofers",
          "LG Woofers",
          "Sony Woofers",
          "JBL Woofers",
          "Bose Woofers",
          "Pioneer Woofers",
          "Kenwood Woofers",
          "Alpine Woofers",
        ],
      },
      {
        title: "More Woofer Brands",
        links: [
          "Rockford Fosgate Woofers",
          "Kicker Woofers",
          "MTX Woofers",
          "Infinity Woofers",
          "Cerwin Vega Woofers",
          "Polk Audio Woofers",
          "Yamaha Woofers",
        ],
      },
      {
        title: "Subwoofer Types",
        links: [
          "Active Subwoofers",
          "Passive Subwoofers",
          "Wireless Subwoofers",
          "Car Subwoofers",
          "Home Subwoofers",
          "Powered Subwoofers",
        ],
      },
      {
        title: "Home Theater Systems",
        links: [
          "5.1 Home Theater",
          "7.1 Home Theater",
          "Wireless Home Theater",
          "Blu-ray Home Theater",
          "DVD Home Theater",
          "Complete Theater Systems",
        ],
      },
      {
        title: "Speakers",
        links: [
          "Bluetooth Speakers",
          "Bookshelf Speakers",
          "Floor Standing Speakers",
          "Portable Speakers",
          "Studio Monitors",
          "PA Speakers",
        ],
      },
      {
        title: "Audio Features",
        links: [
          "Wireless Sound Bars",
          "Bluetooth Sound Bars",
          "WiFi Sound Bars",
          "HDMI ARC Sound Bars",
          "Voice Assistant Sound Bars",
          "Wall-Mountable Sound Bars",
        ],
      },
      {
        title: "Amplifiers & Receivers",
        links: [
          "AV Receivers",
          "Stereo Amplifiers",
          "Home Theater Receivers",
          "Integrated Amplifiers",
          "Power Amplifiers",
        ],
      },
      {
        title: "Audio Accessories",
        links: [
          "Speaker Cables",
          "Audio Cables",
          "Speaker Stands",
          "Wall Mounts",
          "Remote Controls",
          "Optical Cables",
        ],
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
  "Printers": {
    categoryName: "Printers",
    columns: [
      {
        title: "Printer Brands",
        links: [
          "HP Printers",
          "Epson Printers",
          "Brother Printers",
          "Canon Printers",
          "Samsung Printers",
          "Kyocera Printers",
        ],
      },
      {
        title: "Scanners",
        links: [
          "Flatbed Scanners",
          "Sheetfed Scanners",
          "Document Scanners",
          "Barcode Scanners",
          "Table Scanners",
          "Handheld Scanners",
          "SEE ALL PRINTERS",
        ],
      },
      {
        title: "Printer Types",
        links: [
          "Laser Printers",
          "Inkjet Printers",
          "Dot Matrix Printers",
          "Thermal Printers",
          "ETR Machines",
          "Label Printers",
          "Photocopy Machines",
        ],
      },
      {
        title: "Other Printer Specs",
        links: [
          "Photo Printers",
          "Ink Tank Printers",
          "A3 Size Printers",
          "Laser Printer With Scanner",
          "Duplex Printers",
          "Receipt Printers",
          "Color Printers",
          "Monochrome Printers",
          "Wireless Printers (WiFi)",
          "Network Printers (LAN)",
          "HP OfficeJet Printers",
          "HP DeskJet Printers",
          "Kyocera Photocopiers",
        ],
      },
      {
        title: "Printer Supplies",
        links: [
          "Ink & Toner Cartridges",
          "Printing Papers",
        ],
      },
    ],
  },
  "Toners": {
    categoryName: "Toners",
    columns: [
      {
        title: "Printer Toners",
        links: [
          "HP Toners",
          "Kyocera Toners",
          "Ricoh Toners",
          "OfficePoint Toners",
          "Canon Toners",
          "Samsung Toners",
          "Brother Toners",
          "Xerox Toners",
          "Dell Toners",
          "Lexmark Toners",
          "Compatible Toners",
        ],
      },
      {
        title: "Printer Cartridges",
        links: [
          "HP Ink Cartridges",
          "Canon Ink Cartridges",
          "Brother Ink Cartridges",
          "Epson Ink Cartridges",
          "Samsung Cartridges",
          "Dell Cartridges",
          "Lexmark Cartridges",
          "Kodak Cartridges",
          "Original Cartridges",
          "Refurbished Cartridges",
        ],
      },
      {
        title: "Ribbon Cartridges",
        links: [
          "Epson Ribbon Cartridges",
          "Olivetti Ribbon Cartridges",
          "Star Ribbon Cartridges",
          "OKI Ribbon Cartridges",
          "Citizen Ribbon Cartridges",
          "Panasonic Ribbon Cartridges",
        ],
      },
      {
        title: "Printer Inks",
        links: [
          "Epson Inks",
          "HP Inks",
          "Brother Inks",
          "Canon Inks",
          "Samsung Inks",
          "Dell Inks",
          "Compatible Inks",
          "Replacement Inks",
          "Refill Inks",
          "Bulk Inks",
        ],
      },
    ],
  },
  "UPS": {
    categoryName: "UPS",
    columns: [
      {
        title: "UPS Backup Brands",
        links: [
          "APC UPS Backups",
          "Mecer UPS Backups",
          "Lightwave UPS Backups",
          "Vertiv Liebert UPS Backups",
          "Techcom UPS Backups",
          "Premax UPS Backups",
          "Mercury UPS Backups",
          "Digitek UPS Backups",
          "Officepoint UPS Backups",
          "Cursor UPS Backups",
          "SEE ALL UPS BACKUPS",
        ],
      },
      {
        title: "UPS Power Rating",
        links: [
          "500VA UPS",
          "600VA UPS",
          "650VA UPS",
          "680VA UPS",
          "700VA UPS",
          "750VA UPS",
          "800VA UPS",
          "850VA UPS",
          "860VA UPS",
          "900VA UPS",
          "1000VA UPS",
        ],
      },
      {
        title: "Power Rating",
        links: [
          "2000VA UPS",
          "2200VA UPS",
          "2250VA UPS",
          "3000VA UPS",
          "5000VA UPS",
          "6000VA UPS",
          "8000VA UPS",
          "10000VA UPS",
          "UPS Batteries",
        ],
      },
      {
        title: "UPS Topology",
        links: [
          "Line Interactive UPS",
          "Double Conversion",
          "Online UPS",
          "Smart UPS",
          "Rackmount UPS",
          "Tower UPS",
        ],
      },
    ],
  },
  "Hard Disks": {
    categoryName: "Hard Disks",
    columns: [
      {
        title: "Solid State Drives (SSD's)",
        links: [
          "External SSD Drives",
          "Internal SSD Drives",
          "1TB SSD Drives",
          "2TB SSD Drives",
          "512GB SSD Drives",
          "256GB SSD Drives",
          "128GB SSD Drives",
          "NVMe SSD Drives",
          "M.2 SSD Drives",
          "SATA SSD Drives",
        ],
      },
      {
        title: "External Hard Disks",
        links: [
          "8TB External Hard Disks",
          "6TB External Hard Disks",
          "5TB External Hard Disks",
          "4TB External Hard Disks",
          "2TB External Hard Disks",
          "1TB External Hard Disks",
          "500GB External Hard Disks",
        ],
      },
      {
        title: "Desktop Hard Disks",
        links: [
          "4TB Internal Hard Disks",
          "2TB Internal Hard Disks",
          "1TB Internal Hard Disks",
          "500GB Internal Hard Disks",
        ],
      },
      {
        title: "Laptop Hard Disks",
        links: [
          "4TB Laptop Hard Disks",
          "2TB Laptop Hard Disks",
          "1TB Laptop Hard Disks",
          "500GB Laptop Hard Disks",
        ],
      },
      {
        title: "Surveillance Hard Disks",
        links: [
          "1TB Surveillance Hard disks",
          "2TB Surveillance Hard disks",
          "4TB Surveillance Hard disks",
          "6TB Surveillance Hard disks",
          "8TB Surveillance Hard disks",
          "10TB Surveillance Hard disks",
        ],
      },
      {
        title: "Server Hard Disks",
        links: [
          "SAS Hard disks",
          "Enterprise HDDs",
          "Datacenter Drives",
        ],
      },
      {
        title: "Flash Disks",
        links: [
          "128GB Flash Disks",
          "64GB Flash Disks",
          "32GB Flash Disks",
          "16GB Flash Disks",
          "8GB Flash Disks",
          "4GB Flash Disks",
        ],
      },
      {
        title: "Memory Cards",
        links: [
          "128GB Memory Cards",
          "64GB Memory Cards",
          "32GB Memory Cards",
          "16GB Memory Cards",
          "8GB Memory Cards",
        ],
      },
      {
        title: "Hard Disk Casing",
        links: [
          "3.5 Hard Drive Enclosure",
          "2.5 Hard Drive Enclosure",
          "NVMe Enclosure",
          "SATA Enclosure",
        ],
      },
      {
        title: "Featured Brands",
        links: [
          "Transcend Hard Disks",
          "WD Hard Disks",
          "Seagate Hard Disks",
          "Toshiba Hard Disks",
          "Samsung SSD",
          "Kingston SSD",
          "Crucial SSD",
          "SanDisk",
        ],
      },
      {
        title: "NAS Storage Drives",
        links: [
          "NAS Drives",
          "Network Attached Storage",
          "QNAP NAS",
          "Synology NAS",
          "WD My Cloud",
        ],
      },
    ],
  },
  "Network": {
    categoryName: "Network",
    columns: [
      {
        title: "Network Devices",
        links: [
          "Starlink Kits",
          "Routers",
          "Network Switches",
          "Access Points",
          "WiFi Range Extenders",
          "WiFi Network Adapters",
          "Modems",
          "Portable MiFi Routers",
          "3G/4G Modems",
          "Voice & IP Telephony",
          "Firewalls",
        ],
      },
      {
        title: "Featured Brands",
        links: [
          "TP-Link",
          "D-Link",
          "Cisco",
          "Ubiquiti",
          "Mikrotik",
          "Cambium",
          "Extralink",
          "Tenda",
          "Huawei",
          "ZTE",
        ],
      },
      {
        title: "Routers",
        links: [
          "TP-Link Routers",
          "D-Link Routers",
          "Huawei Routers",
          "ZTE Routers",
          "Tenda Routers",
          "Teltonika Routers",
          "MikroTik WiFi Routers",
          "Cisco Routers",
          "Mikrotik Routers",
          "Ubiquiti Routers",
          "Cambium Routers",
        ],
      },
      {
        title: "Switches",
        links: [
          "TP-Link Switches",
          "D-Link Switches",
          "Cisco Switches",
          "Mikrotik Switches",
          "Ubiquiti Switches",
          "Teltonika Switches",
          "Tenda Gigabit Switches",
          "Extralink Switches",
          "Linksys Switches",
        ],
      },
      {
        title: "Access Points",
        links: [
          "TP-Link Access Points",
          "D-Link Access Points",
          "Cisco Access Points",
          "Mikrotik Access Points",
          "Ubiquiti Access Points",
          "Teltonika Access Points",
          ">>Nanostations",
          ">>Litebeams",
          "SEE ALL ACCESS POINTS",
        ],
      },
      {
        title: "Accessories & Tools",
        links: [
          "Cabinets",
          "CAT 6 Cables",
          "Patch Cords",
          "Trunking",
          "Cable Trays",
          "Faceplates",
          "RJ45 Tools",
          "POE Adapters",
          "Tool Kits",
          "Crimping Tools",
          "Punch Down Tools",
        ],
      },
    ],
  },
  "Softwares": {
    categoryName: "Softwares",
    columns: [
      {
        title: "Antivirus Softwares",
        links: [
          "Kaspersky Antivirus",
          "Norton Antivirus",
          "Bitdefender Antivirus",
          "Quick Heal Antivirus",
          "eScan Antivirus",
          "Eset Antivirus",
        ],
      },
      {
        title: "Internet Security",
        links: [
          "Kaspersky Internet Security",
          "Norton Internet Security",
          "Bitdefender Internet Security",
          "Quick Heal Internet Security",
          "eScan Total Security",
          "Eset Internet Security",
        ],
      },
      {
        title: "Enterprise Security",
        links: [
          "Endpoint Security",
          "Server Security",
          "Network Security",
          "Email Security",
        ],
      },
      {
        title: "Application Softwares",
        links: [
          "Microsoft Office Suites",
          "POS Softwares",
          "Quickbooks Software",
          "Accounting Software",
          "Design Software",
          "Video Editing Software",
        ],
      },
      {
        title: "Operating Systems",
        links: [
          "Windows Operating Systems",
          "Linux Operating Systems",
          "Mac Operating Systems",
          "Chrome Operating Systems",
          "Server OS",
        ],
      },
    ],
  },
  "Accessories": {
    categoryName: "Accessories",
    columns: [
      {
        title: "Computer Accessories",
        links: [
          "Laptop Chargers",
          "Laptop Batteries",
          "Laptop Bags",
          "Adapters",
          "Mouse",
          "Keyboards",
          "Webcams",
          "Computer Cables",
          "Docking Stations",
          "USB Hubs",
          "Audio Speakers",
        ],
      },
      {
        title: "Computer Components",
        links: [
          "Laptop Memory",
          "Desktop Memory",
          "Graphics Card",
          "Fans & CPU Coolers",
          "Processors",
          "Sound Card",
          "Network Card",
          "Motherboards",
          "CMOS/UPS Battery",
        ],
      },
      {
        title: "Electronic Products",
        links: [
          "Projectors",
          "Projector Screens",
          "Laser Presenter Remote",
          "Digital Cameras",
          "Dash Cams",
          "Video Cameras",
          "TVs",
          "Gaming Consoles",
        ],
      },
      {
        title: "Office Tools and Stationery",
        links: [
          "Binding Machines",
          "Laminators",
          "Paper Cutters",
          "Paper Shredders",
          "Money Counters",
          "Blowers",
          "Printing Papers",
          "Staplers",
        ],
      },
      {
        title: "Input Devices",
        links: [
          "Wireless Mouse",
          "Gaming Mouse",
          "Bluetooth Mouse",
          "Mechanical Keyboards",
          "Wireless Keyboards",
          "Gaming Keyboards",
          "Trackpads",
          "Drawing Tablets",
        ],
      },
      {
        title: "Audio & Video",
        links: [
          "Headphones",
          "Earphones",
          "Bluetooth Headsets",
          "Studio Microphones",
          "USB Microphones",
          "Webcams HD",
          "Conference Cameras",
          "Streaming Equipment",
        ],
      },
      {
        title: "Cables & Connectors",
        links: [
          "USB Cables",
          "HDMI Cables",
          "VGA Cables",
          "DisplayPort Cables",
          "Ethernet Cables",
          "Audio Cables",
          "Power Cables",
          "Adapters & Converters",
          "Extension Sockets",
        ],
      },
      {
        title: "Mobile Accessories",
        links: [
          "Phone Cases",
          "Screen Protectors",
          "Phone Chargers",
          "Power Banks",
          "Car Chargers",
          "Wireless Chargers",
          "Phone Holders",
          "Selfie Sticks",
        ],
      },
      {
        title: "Storage Accessories",
        links: [
          "HDD Enclosures",
          "SSD Enclosures",
          "Card Readers",
          "USB Flash Drives",
          "Memory Card Cases",
          "Storage Bags",
        ],
      },
      {
        title: "Cooling & Protection",
        links: [
          "Laptop Cooling Pads",
          "Laptop Stands",
          "Monitor Stands",
          "Keyboard Covers",
          "Screen Protectors",
          "Dust Covers",
          "Cable Management",
        ],
      },
      {
        title: "Gaming Accessories",
        links: [
          "Gaming Headsets",
          "Gaming Mouse Pads",
          "Game Controllers",
          "Racing Wheels",
          "VR Headsets",
          "Gaming Chairs",
          "RGB Lighting",
        ],
      },
    ],
  },
  "Security": {
    categoryName: "Security",
    columns: [
      {
        title: "CCTV",
        links: [
          "HD CCTV Cameras",
          "IP CCTV Cameras",
          "PTZ Cameras",
          "Wireless CCTV Cameras",
          "Hikvision Cameras",
          "Dahua Cameras",
          "DVR Machines",
          "NVR Machines",
          "Nanny/Spy Cameras",
          "Power Supply Unit",
          "Surveillance Hard Disks",
        ],
      },
      {
        title: "CCTV Accessories",
        links: [
          "RG59 Cables",
          "CAT 6 Cables",
          "BNC Connectors",
          "DC Jack Connectors",
          "Pigtail Connectors",
          "Connectors",
          "Knock-Out Boxes",
          "CCTV Installation",
        ],
      },
      {
        title: "GPS Tracking Devices",
        links: [
          "Car Trackers",
          "Motorbike Trackers",
          "Asset Trackers",
          "Personal Trackers",
          "Speed Limiters",
          "Car Alarms",
        ],
      },
      {
        title: "Monitoring",
        links: [
          "Fuel Monitoring System",
          "Fuel Level Sensors",
          "Temperature Sensors",
          "Load Sensors",
          "Dashcams",
        ],
      },
      {
        title: "GPS Tracking Devices",
        links: [
          "Teltonika Trackers",
          "Tramigo Trackers",
          "Concox Trackers",
          "Jimi Trackers",
          "Coban Trackers",
          "Cantrack",
          "Sinotrack",
        ],
      },
      {
        title: "Tracking Softwares",
        links: [
          "Protrack",
          "AIKA GPS",
          "Tracksolid",
          "Tracker Home",
          "Secumore",
          "Sinotrack",
          "GPS Trace",
          "Trackgree",
        ],
      },
      {
        title: "Dashcams",
        links: [
          "Jimi IoT Dashcams",
          "Mattax Dashcams",
          "Howen Dashcams",
          "Hikvision Dashcams",
        ],
      },
      {
        title: "Smart Home Devices",
        links: [
          "TAPO Smart Cameras",
          "TAPO Smart Wifi Sockets",
          "Smart Doorbells",
          "Smart Locks",
          "Motion Sensors",
          "Smart Alarms",
        ],
      },
      {
        title: "Access Control",
        links: [
          "Fingerprint Scanners",
          "Card Readers",
          "Biometric Systems",
          "Access Control Panels",
          "Magnetic Locks",
          "Electric Strikes",
        ],
      },
      {
        title: "Alarm Systems",
        links: [
          "Burglar Alarms",
          "Fire Alarms",
          "Smoke Detectors",
          "Motion Detectors",
          "Panic Buttons",
          "Sirens",
        ],
      },
      {
        title: "Security Brands",
        links: [
          "Hikvision",
          "Dahua",
          "Teltonika",
          "Concox",
          "Jimi IoT",
          "Tramigo",
          "TAPO",
          "Ring",
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
    image: "/HP.png",
    text: "You simply won't find it cheaper - HP Laptops",
  },
  {
    name: "Dell",
    slug: "dell",
    discount: 20,
    color: "#FF6B35",
    image: "/Dell.png",
    text: "20% OFF Dell Laptops",
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    discount: 25,
    color: "#E2231A",
    image: "/Lenovo.png",
    text: "Save up to 25% on Lenovo Laptops",
  },
  {
    name: "Apple",
    slug: "apple",
    discount: 15,
    color: "#000000",
    image: "/Apple.png",
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

