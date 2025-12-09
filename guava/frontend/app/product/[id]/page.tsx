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
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  categorySubcategoryProducts,
  type Product,
} from "@/lib/data/products";
import { categoryProducts } from "@/lib/data/categoryProducts";
import { ProductDetailWishlistButton } from "./ProductDetailWishlistButton";
import { ProductDetailCompareButton } from "./ProductDetailCompareButton";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Build a unified catalog of all products used across sections, categories and brands
// so that any product ID clicked in the UI can be resolved on the detail page.
const categoryProductsList: Product[] = Object.values(categoryProducts).flat();
const categorySubcategoryList: Product[] = Object.values(
  categorySubcategoryProducts
).flatMap((group) => Object.values(group).flat());

const catalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
  ...categoryProductsList,
  ...categorySubcategoryList,
];

function getFallbackAddons(product: Product) {
  // Pre-compute category-specific pools from structured data
  const computerAccessoryGroups =
    categorySubcategoryProducts["computer-accessories"] ?? {};
  const computerAccessories: Product[] = Object.values(
    computerAccessoryGroups
  ).flat();

  const tvAudioGroups = categorySubcategoryProducts["tv-audio-video"] ?? {};
  const tvAudioAccessories: Product[] = Object.values(tvAudioGroups)
    .flat()
    // Prefer smaller items like soundbars, speakers, webcams, etc.
    .filter((item) =>
      /soundbar|speaker|webcam|video bar|headphone|earbud|subwoofer/i.test(
        item.name
      )
    );

  const storageGroups = categorySubcategoryProducts["drives-storage"] ?? {};
  const storageAccessories: Product[] = Object.values(storageGroups).flat();

  const cctvGroups = categorySubcategoryProducts["cctv-security"] ?? {};
  const cctvAccessories: Product[] = Object.entries(cctvGroups)
    .filter(([sub]) => sub.toLowerCase().includes("accessories"))
    .flatMap(([, products]) => products);

  // Software pool from full catalog (e.g. Office, antivirus, OS licences)
  const softwareProducts: Product[] = catalogProducts.filter((p) =>
    (p.category || "").toLowerCase().includes("software")
  );

  // Generic pools
  const genericPool: Product[] = [...accessoriesDeals, ...computerAccessories];
  const allAccessoriesPool: Product[] = [
    ...genericPool,
    ...tvAudioAccessories,
    ...storageAccessories,
    ...cctvAccessories,
  ];

  let source: Product[] = genericPool;

  const categoryLower = (product.category || "").toLowerCase();

  if (product.category === "Laptops") {
    // Laptop add-ons: bags, hubs, mice, keyboards, cables, storage, etc.
    source = computerAccessories.length > 0 ? computerAccessories : [];
    if (!source.length) {
      source = allAccessoriesPool.filter((item) =>
        /bag|backpack|case|sleeve|mouse|keyboard|hub|dock|charger|cable|stand|cooling pad|ssd|hdd|usb/i.test(
          item.name
        )
      );
    }
  } else if (product.category === "Smartphones") {
    // Phone add-ons: cases, protectors, earbuds, chargers, power banks, cables
    source = allAccessoriesPool.filter((item) =>
      /case|cover|protector|earbud|earphone|headphone|power bank|charger|cable|adapter|car charger/i.test(
        item.name
      )
    );
  } else if (product.category === "Printers" || product.category === "Scanners") {
    // Printer / scanner add-ons: ink, spares, paper, accessories from printerDeals set
    source = printerDeals.filter((item) =>
      /ink|cartridge|paper|spare|accessor/i.test(item.name)
    );
    if (!source.length) {
      source = allAccessoriesPool.filter((item) =>
        /usb cable|printer cable|surge|ups|rack|stand/i.test(item.name)
      );
    }
  } else if (product.category === "TV, Audio & Video" || product.category === "Audio") {
    // TV & audio add-ons: soundbars, speakers, HDMI cables, mounts
    source =
      tvAudioAccessories.length > 0
        ? tvAudioAccessories
        : allAccessoriesPool.filter((item) =>
            /soundbar|speaker|hdmi|mount|bracket|subwoofer|audio cable|aux/i.test(
              item.name
            )
          );
  } else if (product.category === "Drives & Storage") {
    // Storage add-ons: extra drives, enclosures, USB sticks
    source = storageAccessories.length > 0 ? storageAccessories : [];
    if (!source.length) {
      source = allAccessoriesPool.filter((item) =>
        /ssd|hdd|drive|usb|enclosure|nas|backup|dock/i.test(item.name)
      );
    }
  } else if (product.category === "CCTV & Security") {
    // CCTV add-ons: cables, brackets, power supplies, housings
    source = cctvAccessories.length > 0 ? cctvAccessories : [];
    if (!source.length) {
      source = allAccessoriesPool.filter((item) =>
        /cable|bracket|mount|housing|power supply|adapter|surge/i.test(
          item.name
        )
      );
    }
  } else if (categoryLower.includes("software")) {
    // Software add-ons: other suites, antivirus, operating systems, utilities
    source = softwareProducts.filter(
      (item) =>
        item.id !== product.id &&
        /office|365|windows|antivirus|security|kaspersky|mcafee|norton|license|licence|utility/i.test(
          item.name
        )
    );
    // If still empty, fall back to any other software items
    if (!source.length) {
      source = softwareProducts.filter((item) => item.id !== product.id);
    }
  } else if (
    categoryLower.includes("audio") ||
    categoryLower.includes("headphone")
  ) {
    // Audio add-ons: headphones, speakers, stands, audio cables
    source = allAccessoriesPool.filter((item) =>
      /headphone|earbud|earphone|speaker|soundbar|stand|audio cable|aux/i.test(
        item.name
      )
    );
  }

  if (!source.length) {
    // Last-resort: use a generic accessory pool that excludes obviously unrelated
    // heavy items by preferring smaller accessories.
    source = allAccessoriesPool.filter((item) =>
      /bag|backpack|case|sleeve|mouse|keyboard|hub|dock|charger|cable|stand|earbud|earphone|headphone|power bank|ssd|hdd|usb/i.test(
        item.name
      )
    );

    if (!source.length) {
      source = genericPool;
    }
  }

  // Remove the current product from addons and limit to distinct items
  const unique: Record<string, Product> = {};
  for (const item of source) {
    if (!item || item.id === product.id) continue;
    if (!unique[item.id]) unique[item.id] = item;
  }

  return Object.values(unique)
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image:
        item.image ||
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
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

function buildProductDetail(product: Product & { descriptionList?: string[]; features?: string[] }) {
  const defaultDescriptions =
    product.descriptionList ||
    (product as any).descriptionBlocks ||
    [
      "Premium quality guaranteed",
      "Fast shipping across Kenya",
      "Official warranty included",
      "Perfect for work and play",
    ];

  const images = product.images?.length ? product.images : [product.image];

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product =
    catalogProducts.find((item) => item.id === id) || getFeaturedProduct(id);

  if (!product) {
    notFound();
  }

  const detailedProduct = buildProductDetail(product);
  const saving = detailedProduct.originalPrice - detailedProduct.price;
  // Compute similar products on the frontend using category, brand and subtype
  const similarProducts = getSimilarProductsFrontend(
    product as Product,
    catalogProducts,
    4
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gray-50 py-4">
          <div className="section-wrapper">
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#A7E059] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {detailedProduct.category}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">
                {detailedProduct.name}
              </span>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 bg-white">
          <div className="section-wrapper">
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
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
                  <h1 className="font-public-sans text-2xl md:text-3xl font-semibold text-gray-900">
                    {detailedProduct.name}
                  </h1>
                  {(detailedProduct as any).model && (
                    <p className="text-sm text-gray-500">
                      {(detailedProduct as any).model}
                    </p>
                  )}
                  {(detailedProduct as any).sku && (
                    <p className="text-xs text-gray-400">
                      SKU: {(detailedProduct as any).sku}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-yellow-400">
                    ★★★★★
                  </div>
                  <span className="text-gray-500">
                    ({detailedProduct.ratingCount ?? 120} reviews)
                  </span>
                </div>

                {/* Pricing block (prices only) */}
                <div className="bg-gray-50 rounded-none p-6 space-y-3 border border-gray-200">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-lg text-gray-500 line-through">
                      KSh {detailedProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                      KSh {detailedProduct.price.toLocaleString()}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {Math.round(
                        ((detailedProduct.originalPrice - detailedProduct.price) /
                          detailedProduct.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    You save{" "}
                    <span className="font-semibold">
                      KSh {saving.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Stock & key hardware features directly under price */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="text-green-600 font-semibold">
                    In stock - order now, ready for delivery
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
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
                <div className="space-y-4">
                  {/* Quantity and Add to Cart on same row */}
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center border border-gray-300 rounded-none">
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-900 border-x border-gray-300">
                        1
                      </span>
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm md:text-base px-8 py-3 rounded-none flex-1"
                    >
                      ADD TO CART
                    </Button>
                  </div>

                  {/* Full-width Buy Now bar (solid red like design) */}
                  <Link
                    href={`/checkout?productId=${product.id}`}
                    className="block w-full"
                  >
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm md:text-base py-3 rounded-none">
                      BUY NOW
                    </Button>
                  </Link>

                  {/* Wishlist / Compare / Share */}
                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-700">
                    <ProductDetailWishlistButton productId={product.id} />
                    <ProductDetailCompareButton productId={product.id} />
                    <div className="flex items-center gap-2 ml-auto">
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
                <div className="space-y-3 text-sm">
                  <div className="border border-gray-200 rounded-none divide-y divide-gray-200">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          Delivery
                        </span>
                      </div>
                      <span className="text-gray-600 text-right">
                        {detailedProduct.deliveryTime ??
                          "Same day delivery (within Nairobi)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          Easy Returns
                        </span>
                      </div>
                      <span className="text-gray-600 text-right">
                        {detailedProduct.returnPolicyNote ??
                          "Easy returns within 7 days"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
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
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={`https://wa.me/254710505234?text=Hi, I'm interested in ${encodeURIComponent(
                        detailedProduct.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-none transition-colors border border-green-600"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                    <a
                      href="tel:+254710505234"
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-none transition-colors border border-blue-600"
                    >
                      <PhoneIcon className="h-5 w-5" />
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product overview with dynamic add-ons */}
        <section className="py-8 bg-white">
          <div className="section-wrapper grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10 items-start">
            {/* Left: description header, product name, paragraph, supporting image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                Description
              </h3>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {detailedProduct.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {detailedProduct.longDescription ||
                  detailedProduct.description ||
                  detailedProduct.descriptionList?.join(" ") ||
                  "This product combines reliable performance, modern design and everyday practicality – ideal for work, study and entertainment."}
              </p>
              <div className="relative w-full max-w-xl aspect-[4/3] rounded-none overflow-hidden border border-gray-200">
                <Image
                  src={detailedProduct.images![0]}
                  alt={detailedProduct.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>

            {/* Right: Add-ons / accessories */}
            <aside className="space-y-4">
              {(() => {
                const explicitAddons = (product as any).addons || [];
                const computedAddons =
                  explicitAddons.length > 0
                    ? explicitAddons
                    : getFallbackAddons(product as Product);

                if (!computedAddons.length) return null;

                return (
                  <div className="border border-gray-200 rounded-none">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="text-sm font-semibold text-gray-900">
                        Add On&apos;s and Accessories
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {computedAddons.slice(0, 4).map((addon, index) => {
                        const addonSaving =
                          addon.originalPrice &&
                          addon.originalPrice > addon.price
                            ? addon.originalPrice - addon.price
                            : 0;
                        return (
                          <div
                            key={`${addon.id}-${index}`}
                            className="flex items-stretch gap-4 px-4 py-4"
                          >
                            {/* Image column takes full row height on the left, responsive sizes */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-200 rounded-none overflow-hidden bg-white flex-shrink-0">
                              <Image
                                src={addon.image}
                                alt={addon.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-base font-semibold text-gray-900 line-clamp-2">
                                {addon.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                {addon.originalPrice && (
                                  <span className="text-gray-500 line-through">
                                    KSh {addon.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                <span className="font-semibold text-gray-900">
                                  KSh {addon.price.toLocaleString()}
                                </span>
                                {addonSaving > 0 && (
                                  <span className="text-xs text-red-600">
                                    Save KSh {addonSaving.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm px-4 py-2 rounded-none">
                              Add to cart
                            </Button>
                          </div>
                        );
                      })}
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
            <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-gray-200">
              <Image
                src={detailedProduct.images![0]}
                alt={detailedProduct.name}
                fill
                className="object-contain p-4"
              />
            </div>
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

