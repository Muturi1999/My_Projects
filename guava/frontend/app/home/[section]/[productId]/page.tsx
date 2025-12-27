import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { ProductGallery } from "@/app/product/[id]/ProductGallery";
import {
  featuredDeals,
  type Product,
} from "@/lib/data/products";
import { catalogProducts } from "@/lib/data/productCatalog";
import { ProductDetailWishlistButton } from "@/app/product/[id]/ProductDetailWishlistButton";
import { ProductDetailCompareButton } from "@/app/product/[id]/ProductDetailCompareButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { getSectionSlug, getSectionName, type HomeSection } from "@/lib/utils/sectionSlugs";
import { mapProductsToLocalImages, getProductImage } from "@/lib/utils/imageMapper";
import { AddonCard } from "@/components/AddonCard";
import { getCategorySlug } from "@/lib/utils/categoryMapper";

interface HomeProductPageProps {
  params: Promise<{ section: string; productId: string }>;
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

function getRelatedProducts(product: Product, max = 8): Product[] {
  const seen = new Set<string>([product.id]);
  const result: Product[] = [];

  const add = (candidate: Product | undefined | null) => {
    if (!candidate) return;
    if (seen.has(candidate.id)) return;
    if (result.length >= max) return;
    seen.add(candidate.id);
    result.push(candidate);
  };

  const nonCurrent = catalogProducts.filter((p) => p.id !== product.id);

  // 1) Same category + brand
  const strictMatches = nonCurrent.filter((p) => {
    if (p.category !== product.category) return false;
    if (product.brand && p.brand !== product.brand) return false;
    return true;
  });
  strictMatches.forEach(add);
  if (result.length >= max) return result;

  // 2) Same category only
  const categoryMatches = nonCurrent.filter((p) => p.category === product.category);
  categoryMatches.forEach(add);
  if (result.length >= max) return result;

  // 3) Same brand anywhere
  if (product.brand) {
    const brandMatches = nonCurrent.filter((p) => p.brand === product.brand);
    brandMatches.forEach(add);
    if (result.length >= max) return result;
  }

  // 4) Related categories (e.g., laptops -> accessories, printers -> accessories)
  const relatedCategories: Record<string, string[]> = {
    "Laptops": ["Computer Accessories", "Monitors", "Drives & Storage"],
    "Printers": ["Computer Accessories"],
    "Smartphones": ["Audio", "Computer Accessories"],
    "Audio": ["Computer Accessories", "Smartphones"],
    "Computer Accessories": ["Laptops", "Printers"],
  };

  const relatedCats = relatedCategories[product.category] || [];
  if (relatedCats.length > 0) {
    const relatedMatches = nonCurrent.filter((p) =>
      relatedCats.includes(p.category)
    );
    relatedMatches.forEach(add);
  }

  return result.slice(0, max);
}

function getTechnicalSpecs(detailed: any): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  const seen = new Set<string>();

  const normaliseLabel = (label: string) => {
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

  push("Product", detailed.name);
  push("Processor", detailed.processor);
  push("Brand", (detailed as Product).brand);
  push("Processor generation", detailed.generation);
  push("Memory (RAM)", detailed.ram);
  push("Display", detailed.screen);
  push("Operating system", detailed.os);
  push("Rating", detailed.rating);
  push("Printer / device type", detailed.printerType);
  push("Condition", detailed.condition);
  push("Rating count", detailed.ratingCount);
  push("Stock quantity", detailed.stock_quantity ?? detailed.stock);

  if (Array.isArray(detailed.specGroups) && detailed.specGroups.length > 0) {
    detailed.specGroups.forEach(
      (group: { title: string; items: { label: string; value: string }[] }) => {
        group.items.forEach((item) => {
          push(`${group.title} – ${item.label}`, item.value);
        });
      }
    );
  }

  if (Array.isArray(detailed.technicalSpecs)) {
    detailed.technicalSpecs.forEach(
      (item: { label: string; value: string }) => {
        if (!item) return;
        push(item.label, item.value);
      }
    );
  }

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
    slug: deal.id,
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

  // Get images array, filtering out invalid/empty images
  const rawImages = product.images?.length ? product.images : (product.image ? [product.image] : []);
  
  // Filter out only empty or placeholder images
  // Allow both local paths and URLs (including unsplash.com) as valid images
  const images = rawImages.filter(
    (img) => img && typeof img === "string" && img.trim() !== "" && !img.includes("placeholder")
  );

  return {
    ...product,
    descriptionList: defaultDescriptions,
    images,
    features: "features" in product && product.features ? product.features : undefined,
    specGroups: (product as any).specGroups ?? [],
    addons: (product as any).addons ?? [],
  };
}

export default async function HomeProductPage({ params }: HomeProductPageProps) {
  const { section, productId } = await params;
  
  // Validate section and get display name
  const validSection = getSectionSlug(section) as HomeSection;
  const sectionName = getSectionName(validSection);

  // Find product
  let product =
    catalogProducts.find((item) => item.id === productId) || getFeaturedProduct(productId);

  if (!product) {
    notFound();
  }

  // Map product images to local paths
  const productWithLocalImages = mapProductsToLocalImages([product])[0];
  const detailedProduct = buildProductDetail(productWithLocalImages);
  const saving = detailedProduct.originalPrice - detailedProduct.price;
  
  // Get addons
  const explicitAddons = (product as any).addons || [];
  const computedAddonsRaw =
    explicitAddons.length > 0
      ? explicitAddons
      : getFallbackAddons(product as Product);
  
  // Map addon images to local paths
  // const computedAddons = computedAddonsRaw.map((addon) => {
  //  const localImage = getProductImage(addon.name, addon.image);
   // return {
     // ...addon,
      //image: localImage,
   // };
 // });
 // // Map addon images to local paths
  const computedAddons = computedAddonsRaw.map((addon: any) => {
   const localImage = getProductImage(addon.name, addon.image);
   return {
      ...addon,
      image: localImage,
     };
   });
 

  // Get related products from related categories
  const relatedProducts = getRelatedProducts(product as Product, 8);
  const relatedProductsWithImages = mapProductsToLocalImages(relatedProducts);

  // Get category slug for navigation
  const categorySlug = getCategorySlug(detailedProduct.category);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
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
              <Link
                href={`/home/${validSection}`}
                className="text-gray-600 hover:text-[#A7E059] transition-colors"
              >
                {sectionName}
              </Link>
              {/* Show category if available */}
              {categorySlug && (
                <>
                  <span className="text-gray-400">/</span>
                  <Link
                    href={`/category/${categorySlug}`}
                    className="text-gray-600 hover:text-[#A7E059] transition-colors truncate"
                  >
                    {detailedProduct.category}
                  </Link>
                </>
              )}
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold truncate">
                {detailedProduct.name}
              </span>
            </div>
          </div>
        </section>

        {/* Product Details */}
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
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                  <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-400">
                    ★★★★★
                  </div>
                  <span className="text-gray-500">
                    ({detailedProduct.ratingCount ?? 120} reviews)
                  </span>
                </div>

                {/* Pricing block */}
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

                {/* Stock & key hardware features */}
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

                {/* Quantity + add to cart / buy now */}
                <div className="space-y-3 sm:space-y-4">
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
                      <button
                        type="button"
                        className="p-1.5 border border-gray-300 rounded-full hover:border-[#A7E059]"
                        aria-label="Copy link"
                      >
                        <LinkIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service information */}
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
                        Same day delivery (within Nairobi)
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
                        Easy returns within 7 days
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
                        12 months warranty on all electronics
                      </span>
                    </div>
                  </div>
                  {/* Contact Options */}
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

        {/* Product overview with add-ons */}
        <section className="py-6 sm:py-8 md:py-10 bg-white">
          <div className="section-wrapper grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 items-start">
            {/* Left: description */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 uppercase tracking-wide">
                Description
              </h3>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                {detailedProduct.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                {(detailedProduct as any).longDescription ||
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
              {computedAddons.length > 0 && (
                <div className="border border-gray-200 rounded-none">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Add On&apos;s and Accessories
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {computedAddons.slice(0, 4).map((addon: any, index: number) => (
                      <AddonCard key={`${addon.id}-${index}`} addon={addon} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </aside>
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

        {/* You may also like - Related products from related categories */}
        {relatedProductsWithImages.length > 0 && (
          <section className="py-10 bg-gray-50">
            <div className="section-wrapper">
              <h2 className="section-heading mb-6">You may also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProductsWithImages.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    variant="default"
                    imageHeight="h-48"
                    // Related products link to generic product route since they may be from different sections
                  />
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

