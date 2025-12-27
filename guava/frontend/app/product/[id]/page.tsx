import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  Squares2X2Icon,
  ShareIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  LinkIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { ProductGallery } from "./ProductGallery";
import {
  featuredDeals,
  type Product,
} from "@/lib/data/products";
import { catalogProducts } from "@/lib/data/productCatalog";
import { ProductDetailWishlistButton } from "./ProductDetailWishlistButton";
import { ProductDetailCompareButton } from "./ProductDetailCompareButton";
import { mapProductsToLocalImages, getProductImage } from "@/lib/utils/imageMapper";
import { getCategorySlug } from "@/lib/utils/categoryMapper";
import { AddonCardDetailed } from "@/components/AddonCardDetailed";
import { transformDjangoProduct, isDjangoProduct } from "@/lib/utils/productTransformer";
import { env } from "@/lib/config/env";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}

// Use centralized product catalog that includes all products from categories
// This ensures all category products are available on product detail pages

function getFallbackAddons(product: Product) {
  const categoryLower = (product.category || "").toLowerCase();
  const productNameLower = (product.name || "").toLowerCase();
  const productBrand = (product.brand || "").toLowerCase();
  
  // Score-based matching: higher score = more relevant
  const scored: Array<{ product: Product; score: number }> = [];
  
  for (const item of catalogProducts) {
    if (!item || item.id === product.id) continue;
    
    const itemName = (item.name || "").toLowerCase();
    const itemCategory = (item.category || "").toLowerCase();
    const itemBrand = (item.brand || "").toLowerCase();
    let score = 0;
    
    // Smartphones - Match phone-specific accessories
    if (categoryLower.includes("smartphone") || categoryLower.includes("phone") || productNameLower.includes("phone") || productNameLower.includes("galaxy") || productNameLower.includes("iphone")) {
      // Exclude non-phone items
      if (itemCategory.includes("laptop") || itemCategory.includes("printer") || 
          itemCategory.includes("cctv") || itemCategory.includes("monitor") ||
          itemCategory.includes("desktop") || itemCategory.includes("storage") ||
          itemCategory.includes("drive") || itemName.includes("laptop") ||
          itemName.includes("printer") || itemName.includes("router") ||
          itemName.includes("switch") || itemName.includes("keyboard")) {
        continue;
      }
      
      // Phone cases, covers, protectors (high priority)
      if (/case|cover|protector|tempered.*glass|screen.*protector|phone.*case|phone.*cover/i.test(itemName)) {
        score += 10;
      }
      // Earbuds, earphones, headphones (high priority)
      if (/earbud|earphone|headphone|airpod|pod|bud/i.test(itemName)) {
        score += 9;
      }
      // Chargers, power banks, cables (medium-high priority)
      if (/charger|power.*bank|wireless.*charger|car.*charger|cable|adapter/i.test(itemName)) {
        score += 7;
      }
      // Audio category with phone-compatible items
      if (itemCategory.includes("audio") && /earbud|earphone|headphone/i.test(itemName)) {
        score += 8;
      }
      // Same brand audio accessories
      if (productBrand && itemBrand === productBrand && itemCategory.includes("audio")) {
        score += 5;
      }
    }
    // Laptops - Match laptop-specific accessories
    else if (categoryLower.includes("laptop") || (categoryLower.includes("computer") && !categoryLower.includes("accessories"))) {
      // Exclude non-laptop items
      if (itemCategory.includes("smartphone") || itemCategory.includes("phone") ||
          itemCategory.includes("printer") || itemCategory.includes("cctv") ||
          (itemCategory.includes("audio") && !/headphone|headset/i.test(itemName))) {
        continue;
      }
      
      // Laptop bags, cases, sleeves (high priority)
      if (/laptop.*bag|bag.*laptop|laptop.*case|case.*laptop|laptop.*sleeve|sleeve.*laptop|laptop.*backpack|backpack.*laptop/i.test(itemName)) {
        score += 10;
      }
      // Mice and keyboards (high priority)
      if (/mouse|keyboard|trackpad/i.test(itemName)) {
        score += 9;
      }
      // Hubs, docks, adapters (high priority)
      if (/hub|dock|adapter|usb.*hub|usb.*dock|usb.*c/i.test(itemName)) {
        score += 8;
      }
      // Storage devices (SSD, HDD, USB drives) (medium-high priority)
      if (/ssd|hdd|external.*drive|usb.*drive|flash.*drive|portable.*ssd/i.test(itemName)) {
        score += 7;
      }
      // Laptop stands, cooling pads (medium priority)
      if (/laptop.*stand|stand.*laptop|cooling.*pad|pad.*cooling|laptop.*cooler/i.test(itemName)) {
        score += 6;
      }
      // Computer accessories category
      if (itemCategory.includes("computer") && itemCategory.includes("accessories")) {
        score += 5;
      }
      // Same brand accessories
      if (productBrand && itemBrand === productBrand && itemCategory.includes("accessories")) {
        score += 4;
      }
    }
    // Printers - Match printer-specific supplies
    else if (categoryLower.includes("printer") || categoryLower.includes("scanner")) {
      // Ink cartridges, toner (highest priority)
      if (/ink|cartridge|toner/i.test(itemName)) {
        score += 10;
      }
      // Printer paper (high priority)
      if (/paper|photo.*paper/i.test(itemName)) {
        score += 9;
      }
      // Printer spares category
      if (itemCategory.includes("printer") && (itemCategory.includes("spare") || itemCategory.includes("accessories"))) {
        score += 8;
      }
      // Printer cables
      if (/printer.*cable|cable.*printer|usb.*cable/i.test(itemName)) {
        score += 6;
      }
    }
    // Audio & Headphones - Match audio accessories
    else if (categoryLower.includes("audio") || categoryLower.includes("headphone") || productNameLower.includes("headphone") || productNameLower.includes("earbud") || productNameLower.includes("speaker")) {
      // Exclude non-audio items
      if (itemCategory.includes("laptop") || itemCategory.includes("printer") ||
          itemCategory.includes("smartphone") || itemCategory.includes("phone") ||
          itemCategory.includes("cctv") || itemCategory.includes("storage") ||
          itemName.includes("laptop") || itemName.includes("printer")) {
        continue;
      }
      
      // Headphones, earbuds, speakers (high priority)
      if (/headphone|earbud|earphone|speaker|soundbar|subwoofer/i.test(itemName)) {
        score += 10;
      }
      // Audio cables, adapters (medium priority)
      if (/audio.*cable|aux.*cable|audio.*adapter/i.test(itemName)) {
        score += 6;
      }
      // Audio category
      if (itemCategory.includes("audio") || itemCategory.includes("headphone")) {
        score += 8;
      }
      // Same brand audio
      if (productBrand && itemBrand === productBrand && itemCategory.includes("audio")) {
        score += 5;
      }
    }
    // Networking/WiFi - Match networking accessories
    else if (categoryLower.includes("wifi") || categoryLower.includes("networking") || productNameLower.includes("router") || productNameLower.includes("switch") || productNameLower.includes("tenda") || productNameLower.includes("tp-link")) {
      // Exclude non-networking items
      if (itemCategory.includes("laptop") || itemCategory.includes("printer") ||
          itemCategory.includes("smartphone") || itemCategory.includes("phone") ||
          itemCategory.includes("cctv") || itemCategory.includes("audio")) {
        continue;
      }
      
      // Routers, switches, access points (high priority)
      if (/router|switch|access.*point|wifi|wireless/i.test(itemName)) {
        score += 9;
      }
      // Network cables, adapters (medium priority)
      if (/cable|adapter|ethernet/i.test(itemName)) {
        score += 6;
      }
      // Same brand networking
      if (productBrand && itemBrand === productBrand && (itemCategory.includes("accessories") || itemName.includes("router") || itemName.includes("switch"))) {
        score += 5;
      }
    }
    // Computer Accessories - Match related accessories
    else if (categoryLower.includes("accessories") || categoryLower.includes("computer.*accessories")) {
      // Exclude unrelated items
      if (itemCategory.includes("smartphone") || itemCategory.includes("phone") ||
          itemCategory.includes("printer") || itemCategory.includes("cctv")) {
        continue;
      }
      
      // Related accessories (mouse, keyboard, hub, etc.)
      if (/mouse|keyboard|hub|dock|adapter|ssd|hdd|drive/i.test(itemName)) {
        score += 7;
      }
      // Computer accessories category
      if (itemCategory.includes("computer") && itemCategory.includes("accessories")) {
        score += 6;
      }
      // Same brand accessories
      if (productBrand && itemBrand === productBrand) {
        score += 4;
      }
    }
    
    // If item scored, add it
    if (score > 0) {
      scored.push({ product: item, score });
    }
  }
  
  // Sort by score (highest first) and take top 5
  scored.sort((a, b) => b.score - a.score);
  
  return scored
    .slice(0, 5)
    .map(({ product: item }) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      discount: item.discount,
    }));
}

function getFeatureHighlights(product: Product) {
  const category = product.category.toLowerCase();
  const brand = (product.brand || "").toLowerCase();

  // Base helpers for text pieces
  const name = product.name;
  const processor = (product as any).processor as string | undefined;
  const ram = (product as any).ram as string | undefined;
  const storage = (product as any).storage as string | undefined;
  const screen = (product as any).screen as string | undefined;

  // Laptops / computers
  if (category.includes("laptop") || category.includes("computer")) {
    return [
      {
        title: "Modern design",
        body:
          `${name} features a slim, contemporary chassis that looks at home in the office, classroom or on the move, with narrow bezels for a more immersive view.`,
      },
      {
        title: "Bright, clear visuals",
        body:
          `Enjoy crisp detail on the ${screen || "Full HD"} display, ideal for documents, spreadsheets and media, with wide viewing angles that make sharing the screen easy.`,
      },
      {
        title: "Power for everyday work",
        body:
          `Powered by ${processor || "a modern processor"} with ${ram || "responsive memory"} and ${storage || "fast storage"}, this laptop comfortably handles multitasking, browsing and productivity apps.`,
      },
    ];
  }

  // Smartphones
  if (category.includes("smartphone") || category.includes("phone")) {
    return [
      {
        title: "Sleek, pocket‑friendly design",
        body:
          `${name} offers a slim profile and rounded edges so it sits comfortably in your hand or pocket while still giving you a generous screen area.`,
      },
      {
        title: "Vivid display & sharp camera",
        body:
          "Bright colors and sharp details make social feeds, photos and video more enjoyable, while a high‑quality camera system helps you capture everyday moments clearly.",
      },
      {
        title: "All‑day connectivity",
        body:
          "Stay connected with 4G/5G data, Wi‑Fi and Bluetooth, plus fast charging support so you can top up quickly between tasks.",
      },
    ];
  }

  // Monitors / TV & Audio
  if (category.includes("monitor") || category.includes("tv") || category.includes("audio")) {
    return [
      {
        title: "Immersive viewing",
        body:
          `${name} delivers vivid color and sharp contrast, perfect for streaming, gaming or presentations in the office.`,
      },
      {
        title: "Comfort for long sessions",
        body:
          "Low‑blue‑light and flicker‑free technologies help reduce eye strain so you can work or play more comfortably for longer.",
      },
      {
        title: "Flexible connectivity",
        body:
          "Multiple HDMI, DisplayPort and audio connections (varies by model) make it easy to plug in laptops, consoles and set‑top boxes at the same time.",
      },
    ];
  }

  // Printers / Scanners
  if (category.includes("printer") || category.includes("scanner")) {
    return [
      {
        title: "Designed for busy homes and offices",
        body:
          `${name} is built for regular use, offering reliable print quality and simple controls so anyone on the team can operate it confidently.`,
      },
      {
        title: "Low‑cost, high‑quality prints",
        body:
          "Optimised ink or toner technology (depending on model) helps deliver sharp documents and vibrant graphics while keeping running costs in check.",
      },
      {
        title: "Smart connectivity",
        body:
          "Support for USB, network and often wireless printing makes it easy to share the device across laptops, desktops and mobile devices.",
      },
    ];
  }

  // CCTV & Security
  if (category.includes("cctv") || category.includes("security")) {
    return [
      {
        title: "Pro‑grade surveillance",
        body:
          `${name} helps you monitor key areas with high‑resolution imaging and options for night vision, motion detection and remote viewing.`,
      },
      {
        title: "Built for reliability",
        body:
          "Rugged enclosures and stable firmware help ensure continuous operation in demanding environments, indoors or outdoors depending on the model.",
      },
      {
        title: "Flexible integration",
        body:
          "Works with compatible NVRs, recorders and accessories so you can build or expand a complete security solution over time.",
      },
    ];
  }

  // Drives & Storage
  if (category.includes("drives") || category.includes("storage")) {
    return [
      {
        title: "Fast, dependable storage",
        body:
          `${name} provides reliable space for your files, backups and media, helping keep important data safe and accessible.`,
      },
      {
        title: "Compact and portable",
        body:
          "Slim, lightweight designs make it easy to carry drives between the office, home and client sites.",
      },
      {
        title: "Easy compatibility",
        body:
          "Standard USB or SATA interfaces mean it works with a wide range of laptops, desktops and NAS enclosures.",
      },
    ];
  }

  // Accessories & generic fallback (headphones, routers, etc.)
  return [
    {
      title: "Made to complement your setup",
      body:
        `${name} integrates neatly into your existing devices, helping you extend, protect or upgrade your everyday tech.`,
    },
    {
      title: "Reliable everyday performance",
      body:
        "Built from quality components to deliver consistent performance, whether you use it at home, in the office or on the move.",
    },
    {
      title: "Easy to use",
      body:
        "Simple, intuitive operation means you can start using it in minutes with minimal setup or configuration.",
    },
  ];
}

function getSimilarProductsFrontend(
  current: Product,
  allProducts: Product[],
  max = 4
): Product[] {
  const seen = new Set<string>([current.id]);
  const result: Product[] = [];

  const add = (candidate: Product | undefined | null) => {
    if (!candidate) return;
    if (seen.has(candidate.id)) return;
    if (result.length >= max) return;
    seen.add(candidate.id);
    result.push(candidate);
  };

  const nonCurrent = allProducts.filter((p) => p.id !== current.id);

  // 1) Same category + brand (+ subtype / printerType)
  const strictMatches = nonCurrent.filter((p) => {
    if (p.category !== current.category) return false;
    if (current.brand && p.brand !== current.brand) return false;
    const curPrinterType = (current as any).printerType;
    if (curPrinterType && (p as any).printerType !== curPrinterType) {
      return false;
    }
    return true;
  });
  strictMatches.forEach(add);
  if (result.length >= max) return result;

  // 2) Same category + brand (ignoring subtype)
  const categoryBrandMatches = nonCurrent.filter((p) => {
    if (p.category !== current.category) return false;
    if (current.brand && p.brand === current.brand) return true;
    return false;
  });
  categoryBrandMatches.forEach(add);
  if (result.length >= max) return result;

  // 3) Same category only
  const categoryMatches = nonCurrent.filter((p) => p.category === current.category);
  categoryMatches.forEach(add);
  if (result.length >= max) return result;

  // 4) Same brand anywhere
  if (current.brand) {
    const brandMatches = nonCurrent.filter((p) => p.brand === current.brand);
    brandMatches.forEach(add);
    if (result.length >= max) return result;
  }

  // 5) Hot deals fallback – but keep within the same category to avoid
  // suggesting completely unrelated products (e.g. phones on a software page).
  const hotMatches = nonCurrent.filter(
    (p) => p.hot && p.category === current.category
  );
  hotMatches.forEach(add);

  return result.slice(0, max);
}

function getTechnicalSpecs(detailed: any): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];

  const seen = new Set<string>();

  const normaliseLabel = (label: string) => {
    // Convert keys like "processor_frequency" or "total_storage_capacity" to "Processor frequency", etc.
    return label
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const push = (label: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    specs.push({ label, value: String(value) });
  };

  // Core identity and key headline specs in desired order
  push("Product", detailed.name);
  push("Processor", detailed.processor);
  push("Brand", (detailed as Product).brand);
  push("Processor generation", detailed.generation);
  push("Memory (RAM)", detailed.ram);
  push("Display", detailed.screen);
  push("Operating system", detailed.os);
  push("Rating", detailed.rating);

  // Printer / scanner / CCTV specific
  push("Printer / device type", detailed.printerType);

  // Generic shared metadata
  push("Condition", detailed.condition);
  push("Rating count", detailed.ratingCount);
  push("Stock quantity", detailed.stock_quantity ?? detailed.stock);

  // Flatten any richer spec groups if present
  if (Array.isArray(detailed.specGroups) && detailed.specGroups.length > 0) {
    detailed.specGroups.forEach(
      (group: { title: string; items: { label: string; value: string }[] }) => {
        group.items.forEach((item) => {
          push(`${group.title} – ${item.label}`, item.value);
        });
      }
    );
  }

  // If a dedicated technicalSpecs array is present (future backend field), use it directly as well
  if (Array.isArray(detailed.technicalSpecs)) {
    detailed.technicalSpecs.forEach(
      (item: { label: string; value: string }) => {
        if (!item) return;
        push(item.label, item.value);
      }
    );
  }

  // Generic extra attributes object (e.g. from backend `extra_attributes`)
  const extraAttrs = detailed.extra_attributes || detailed.extraSpecs;
  if (extraAttrs && typeof extraAttrs === "object") {
    Object.entries(extraAttrs).forEach(([rawLabel, value]) => {
      push(normaliseLabel(rawLabel), value as string);
    });
  }

  return specs;
}

function getFeaturedProduct(id: string) {
  const deal = featuredDeals.find((item) => item.id === id);
  if (!deal) return null;
  return {
    id: deal.id,
    name: `${deal.name} - ${deal.model}`,
    price: deal.price,
    originalPrice: deal.originalPrice,
    discount: Math.round(
      ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
    ),
    rating: 5,
    image: deal.image,
    category: "Laptops",
    stock: 10,
    ratingCount: 260,
    images: [deal.image],
    badge: deal.badge,
    descriptionList: deal.description,
  };
}

function buildProductDetail(product: Product & { descriptionList?: string[]; features?: string[]; _isDjangoProduct?: boolean }) {
  const defaultDescriptions =
    product.descriptionList ||
    (product as any).descriptionBlocks ||
    [
      "Premium quality guaranteed",
      "Fast shipping across Kenya",
      "Official warranty included",
      "Perfect for work and play",
    ];

  // Get images array, filtering out invalid/empty images
  // For Django products, use images as-is (they're already URLs)
  // For static products, filter out placeholders
  const rawImages = product.images?.length ? product.images : (product.image ? [product.image] : []);
  
  let images: string[];
  if (product._isDjangoProduct) {
    // Django products: use images as-is, only filter empty strings
    images = rawImages.filter(
      (img) => img && typeof img === "string" && img.trim() !== ""
    );
  } else {
    // Static products: filter out placeholders and empty strings
    images = rawImages.filter(
      (img) => img && typeof img === "string" && img.trim() !== "" && !img.includes("placeholder")
    );
  }
  
  // Ensure we have at least one image (use primary image as fallback)
  if (images.length === 0 && product.image) {
    images = [product.image];
  }

  return {
    ...product,
    descriptionList: defaultDescriptions,
    images,
    features: "features" in product && product.features ? product.features : undefined,
    // Ensure specGroups and addons are always defined as arrays to simplify rendering
    specGroups: (product as any).specGroups ?? [],
    addons: (product as any).addons ?? [],
  };
}

export async function generateStaticParams() {
  const ids = [
    ...catalogProducts.map((product) => ({ id: product.id })),
    ...featuredDeals.map((deal) => ({ id: deal.id })),
  ];
  return ids;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  // Await params and searchParams (Next.js 15+ requirement)
  const { id } = await params;
  const { category: categorySlugFromUrl,  brand: brandSlugFromUrl, from } = (await searchParams) as {  category?: string;  brand?: string;  from?: string;};  
  let product =
    catalogProducts.find((item) => item.id === id) || getFeaturedProduct(id);

  // If product not found in static data, try fetching from Django API using Next.js API route
  if (!product) {
    try {
      // Use the app URL from env config for server-side fetch
      const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Try by slug first (most common case for URLs like /product/test-product)
      let response = await fetch(
        `${baseUrl}/api/products?slug=${encodeURIComponent(id)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: 'no-store', // Ensure fresh data
        }
      );

      if (!response.ok) {
        // If slug lookup fails, try by ID (in case id is numeric)
        response = await fetch(
          `${baseUrl}/api/products?id=${encodeURIComponent(id)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            cache: 'no-store',
          }
        );
      }

      if (response.ok) {
        const djangoProduct = await response.json();
        if (djangoProduct && !djangoProduct.error) {
          product = transformDjangoProduct(djangoProduct);
        }
      } else {
        // Log the error for debugging
        const errorText = await response.text();
        console.error(`Failed to fetch product ${id}:`, response.status, errorText);
      }
    } catch (error) {
      console.error("Failed to fetch product from Django:", error);
    }
  }

  if (!product) {
    notFound();
  }

  // Only apply image mapper to static products, not Django products
  const productWithLocalImages = isDjangoProduct(product)
    ? product
    : mapProductsToLocalImages([product])[0];
  
  const productWithLocalImagesComplete = {
   ...productWithLocalImages,
   slug: (productWithLocalImages as any).slug ?? productWithLocalImages.name.toLowerCase().replace(/\s+/g, '-'),
   features: (productWithLocalImages as any).features ?? [],
   _isDjangoProduct: true,
  };

 const detailedProduct = buildProductDetail(productWithLocalImagesComplete);

  const saving = detailedProduct.originalPrice - detailedProduct.price;
  
  // Fetch similar products and addons from Django API - related to this product's category
  // "You may also like" and "Add On's and Accessories" should show products from the same category, from database
  const productCategory = (product as any).category || (product as any).category_slug || "";
  
  let similarProducts: Product[] = [];
  let addons: any[] = [];
  
  if (productCategory) {
    try {
      const API_BASE_URL = env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";
      
      const response = await fetch(
        `${API_BASE_URL}/products/queries/?category_slug=${productCategory}&page_size=20`,
        {
          headers: { "Content-Type": "application/json" },
          cache: 'no-store',
          next: { revalidate: 0 },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Get products from same category, excluding current product
        const categoryProducts = (data.results || [])
          .filter((p: any) => p.id?.toString() !== product.id?.toString())
          .map((p: any) => transformDjangoProduct(p));
        
        // Similar products: first 4 products from same category
        similarProducts = categoryProducts.slice(0, 4);
        
        // Addons: next 5 products from same category
        addons = categoryProducts.slice(4, 9).map((addon: any) => ({
          id: addon.id,
          name: addon.name,
          price: addon.price,
          originalPrice: addon.originalPrice,
          image: addon.image || "",
          discount: addon.originalPrice ? Math.round(((addon.originalPrice - addon.price) / addon.originalPrice) * 100) : 0,
        }));
      }
    } catch (error: any) {
      // Silently fail - no similar products/addons if API unavailable
      if (process.env.NODE_ENV === 'development') {
        console.warn("Failed to fetch category products from Django API:", error.message || error);
      }
    }
  }
  
  // Fallback to static similar products only if no Django products found
  if (similarProducts.length === 0) {
    const similarProductsRaw = getSimilarProductsFrontend(
      product as Product,
      catalogProducts,
      4
    );
    // Map similar products to local images (only for static products)
    similarProducts = similarProductsRaw.map(p => 
      isDjangoProduct(p) ? p : mapProductsToLocalImages([p])[0]
    );
  }
  
  // Fallback to static addons only if no Django addons found
  if (addons.length === 0) {
    const explicitAddons = (product as any).addons || [];
    const fallbackAddons = explicitAddons.length > 0
      ? explicitAddons
      : getFallbackAddons(product as Product);
    
    addons = fallbackAddons;
  }
  
  // Map addon images to local paths (only for static addons)
  const computedAddons = addons.map((addon) => {
    const localImage = isDjangoProduct(addon) 
      ? addon.image 
      : getProductImage(addon.name, addon.image);
    return {
      ...addon,
      image: localImage,
    };
  });

  // Get category slug for navigation - prefer URL param, then product's category_slug, fallback to mapping
  const categorySlug = categorySlugFromUrl || (product as any).category_slug || getCategorySlug(detailedProduct.category);
  const brandSlug = brandSlugFromUrl || (product as any).brand;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gray-50 py-3 sm:py-4">
          <div className="section-wrapper">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#A7E059] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              {from === 'brand' && brandSlug ? (
                <>
                  <Link
                    href="/popular-brands"
                    className="text-gray-600 hover:text-[#A7E059] transition-colors truncate"
                  >
                    Brands
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link
                    href={`/brands/${brandSlug}`}
                    className="text-gray-600 hover:text-[#A7E059] transition-colors truncate"
                  >
                    {detailedProduct.brand || brandSlug}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              ) : categorySlug ? (
                <>
                  <Link
                    href={`/category/${categorySlug}`}
                    className="text-gray-600 hover:text-[#A7E059] transition-colors truncate"
                  >
                    {detailedProduct.category}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              ) : (
                <>
                  <span className="text-gray-900 font-medium truncate">
                    {detailedProduct.category}
                  </span>
                  <span className="text-gray-400">/</span>
                </>
              )}
              <span className="text-gray-900 font-semibold truncate">
                {detailedProduct.name}
              </span>
            </div>
          </div>
        </section>

        <section className="py-4 sm:py-6 md:py-8 lg:py-12 bg-white">
          <div className="section-wrapper">
            <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              {/* Left column: gallery */}
              <div className="space-y-6">
                <ProductGallery
                  images={detailedProduct.images!}
                  name={detailedProduct.name}
                />
              </div>

              {/* Right column: purchase card and services */}
              <div className="space-y-6">
                {("badge" in detailedProduct || detailedProduct.hot) && (
                  <Badge className="bg-[#A7E059] text-white">
                    {("badge" in detailedProduct && detailedProduct.badge)
                      ? String(detailedProduct.badge)
                      : "HOT DEAL"}
                  </Badge>
                )}

                <div className="space-y-1">
                  <h1 className="font-public-sans text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                    {detailedProduct.name}
                  </h1>
                  {(detailedProduct as any).model && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      {(detailedProduct as any).model}
                    </p>
                  )}
                  {(detailedProduct as any).sku && (
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      SKU: {(detailedProduct as any).sku}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                  <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-400">
                    ★★★★★
                  </div>
                  <span className="text-gray-500">
                    ({detailedProduct.ratingCount ?? 120} reviews)
                  </span>
                </div>

                {/* Pricing block (prices only) */}
                <div className="bg-gray-50 rounded-none p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 border border-gray-200">
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 md:gap-4">
                    <span className="text-base sm:text-lg text-gray-500 line-through">
                      KSh {detailedProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      KSh {detailedProduct.price.toLocaleString()}
                    </span>
                    <Badge className="bg-red-500 text-white text-xs sm:text-sm">
                      {Math.round(
                        ((detailedProduct.originalPrice - detailedProduct.price) /
                          detailedProduct.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    You save{" "}
                    <span className="font-semibold">
                      KSh {saving.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Stock & key hardware features directly under price */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p className="text-green-600 font-semibold">
                    In stock - order now, ready for delivery
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs sm:text-sm">
                    {detailedProduct.processor && (
                      <li>Processor: {detailedProduct.processor}</li>
                    )}
                    {detailedProduct.ram && <li>RAM: {detailedProduct.ram}</li>}
                    {detailedProduct.storage && (
                      <li>Storage: {detailedProduct.storage}</li>
                    )}
                    {detailedProduct.screen && (
                      <li>Screen size: {detailedProduct.screen}</li>
                    )}
                    {detailedProduct.os && <li>OS: {detailedProduct.os}</li>}
                    {detailedProduct.generation && (
                      <li>Generation: {detailedProduct.generation}</li>
                    )}
                  </ul>
                </div>

                {/* Quantity + add to cart / buy now / wishlist & share row */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Quantity and Add to Cart on same row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="inline-flex items-center border border-gray-300 rounded-none self-center sm:self-auto">
                      <button
                        type="button"
                        className="px-2.5 sm:px-3 py-2 text-gray-700 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 border-x border-gray-300 min-w-[2.5rem] text-center">
                        1
                      </span>
                      <button
                        type="button"
                        className="px-2.5 sm:px-3 py-2 text-gray-700 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-none flex-1"
                    >
                      ADD TO CART
                    </Button>
                  </div>

                  {/* Full-width Buy Now bar (solid red like design) */}
                  <Link
                    href={`/checkout?productId=${product.id}`}
                    className="block w-full"
                  >
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base py-2.5 sm:py-3 rounded-none">
                      BUY NOW
                    </Button>
                  </Link>

                  {/* Wishlist / Compare / Share */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
                    <ProductDetailWishlistButton productId={product.id} />
                    <ProductDetailCompareButton productId={product.id} />
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto sm:ml-auto justify-center sm:justify-start">
                      <span className="text-gray-500">Share:</span>
                      {/* Copy link */}
                      <button
                        type="button"
                        className="p-1.5 border border-gray-300 rounded-full hover:border-[#A7E059]"
                        aria-label="Copy link"
                      >
                        <LinkIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      {/* WhatsApp (icons8) */}
                      <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600"
                        aria-label="Share on WhatsApp"
                      >
                        <img
                          src="https://img.icons8.com/color/48/whatsapp--v1.png"
                          alt="WhatsApp"
                          className="h-4 w-4"
                        />
                      </button>
                      {/* Facebook (icons8) */}
                      <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700"
                        aria-label="Share on Facebook"
                      >
                        <img
                          src="https://img.icons8.com/color/48/facebook-new.png"
                          alt="Facebook"
                          className="h-4 w-4"
                        />
                      </button>
                      {/* LinkedIn (icons8) */}
                      <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-sky-700 hover:bg-sky-800"
                        aria-label="Share on LinkedIn"
                      >
                        <img
                          src="https://img.icons8.com/color/48/linkedin.png"
                          alt="LinkedIn"
                          className="h-4 w-4"
                        />
                      </button>
                      {/* Pinterest (icons8) */}
                      <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
                        aria-label="Share on Pinterest"
                      >
                        <img
                          src="https://img.icons8.com/color/48/pinterest--v1.png"
                          alt="Pinterest"
                          className="h-4 w-4"
                        />
                      </button>
                      {/* Email (icons8) */}
                      <button
                        type="button"
                        className="p-1.5 border border-gray-300 rounded-full hover:border-[#A7E059]"
                        aria-label="Share via Email"
                      >
                        <img
                          src="https://img.icons8.com/fluency/48/new-post.png"
                          alt="Email"
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service information & contact options */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="border border-gray-200 rounded-none divide-y divide-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800 text-xs sm:text-sm">
                          Delivery
                        </span>
                      </div>
                      <span className="text-gray-600 text-left sm:text-right text-xs sm:text-sm">
                        {(detailedProduct as any).deliveryTime ?? "Same day delivery (within Nairobi)"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2">
                        <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800 text-xs sm:text-sm">
                          Easy Returns
                        </span>
                      </div>
                      <span className="text-gray-600 text-left sm:text-right text-xs sm:text-sm">
                         {(detailedProduct as any).returnPolicyNote ?? "Easy returns within 7 days"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800 text-xs sm:text-sm">
                          Warranty
                        </span>
                      </div>
                      <span className="text-gray-600 text-right">
                        {detailedProduct.warrantyNote ??
                          "12 months warranty on all electronics"}
                      </span>
                    </div>
                  </div>
                  {/* Contact Options (WhatsApp / Call) */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <a
                      href={`https://wa.me/254710505234?text=Hi, I'm interested in ${encodeURIComponent(
                        detailedProduct.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-none transition-colors border border-green-600"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="whitespace-nowrap">Chat on WhatsApp</span>
                    </a>
                    <a
                      href="tel:+254710505234"
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-none transition-colors border border-blue-600"
                    >
                      <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="whitespace-nowrap">Call Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product overview with dynamic add-ons */}
        <section className="py-6 sm:py-8 md:py-10 bg-white">
          <div className="section-wrapper grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 items-start">
            {/* Left: description header, product name, paragraph, supporting image */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 uppercase tracking-wide">
                Description
              </h3>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                {detailedProduct.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                {detailedProduct.longDescription ||
                  detailedProduct.description ||
                  detailedProduct.descriptionList?.join(" ") ||
                  "This product combines reliable performance, modern design and everyday practicality – ideal for work, study and entertainment."}
              </p>
              {detailedProduct.images && detailedProduct.images.length > 0 && (
                <div className="relative w-full max-w-xl aspect-[4/3] rounded-none overflow-hidden border border-gray-200">
                  <Image
                    src={detailedProduct.images[0]}
                    alt={detailedProduct.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              )}
            </div>

            {/* Right: Add-ons / accessories */}
            <aside className="space-y-4">
              {(() => {
                if (!computedAddons.length) return null;

                return (
                  <div className="border border-gray-200 rounded-none">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="text-sm font-semibold text-gray-900">
                        Add On&apos;s and Accessories
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {computedAddons.slice(0, 4).map((addon, index) => (
                        <AddonCardDetailed key={`${addon.id}-${index}`} addon={addon} index={index} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </aside>
          </div>
        </section>

        {/* Extended feature highlights (continuation of description) */}
        <section className="py-8 bg-white">
          <div className="section-wrapper grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10 items-start">
            {/* Left: feature label on left, description on right */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Key Features
              </h2>
              <div className="border border-gray-200 rounded-none bg-white">
                <dl className="divide-y divide-gray-200">
                  {getFeatureHighlights(product as Product).map(
                    (feature, index) => (
                      <div
                        key={index}
                        className="grid md:grid-cols-[220px,1fr] gap-3 px-4 py-3 text-xs sm:text-sm md:text-base"
                      >
                        <dt className="font-semibold text-gray-900">
                          {feature.title}
                        </dt>
                        <dd className="text-gray-700 leading-relaxed">
                          {feature.body}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </div>

            {/* Right: supporting image */}
            {detailedProduct.images && detailedProduct.images.length > 0 && (
              <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-gray-200">
                <Image
                  src={detailedProduct.images[0]}
                  alt={detailedProduct.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            )}
          </div>
        </section>

        {/* Technical Specifications */}
        {getTechnicalSpecs(detailedProduct).length > 0 && (
          <section className="py-8 bg-white">
            <div className="section-wrapper">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Technical Specifications
              </h2>
              <div className="border border-gray-200 rounded-none bg-white overflow-x-auto">
                <table className="w-full min-w-[280px] text-xs sm:text-sm md:text-base">
                  <tbody>
                    {getTechnicalSpecs(detailedProduct).map((spec, index) => (
                      <tr
                        key={`${spec.label}-${index}`}
                        className="border-t first:border-t-0 border-gray-200"
                      >
                        <th className="w-40 px-4 py-2 text-left font-semibold text-gray-800 align-top">
                          {spec.label}
                        </th>
                        <td className="px-4 py-2 text-gray-700">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* You may also like / similar products */}
        {similarProducts.length > 0 && (
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="section-heading mb-6">
                You may also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((product, index) => (
                  <Link
                    key={`${product.id}-${index}`}
                    href={`/product/${product.id}`}
                    className="border border-gray-200 bg-white rounded-none p-4 flex flex-col gap-3 hover:border-[#A7E059] transition-colors hover:shadow-md"
                  >
                    <div className="relative h-40 bg-white rounded-none overflow-hidden border border-gray-200 p-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-2"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        Ksh {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        Ksh {product.price.toLocaleString()}
                      </span>
                    </div>
                    {product.hot && (
                      <Badge variant="destructive" className="text-xs w-fit">
                        HOT
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

