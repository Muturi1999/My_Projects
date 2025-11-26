import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { PhoneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import {
  featuredDeals,
  hotDeals,
  laptopDeals,
  printerDeals,
  accessoriesDeals,
  audioDeals,
  brandLaptops,
  type Product,
} from "@/lib/data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const catalogProducts: Product[] = [
  ...hotDeals,
  ...laptopDeals,
  ...printerDeals,
  ...accessoriesDeals,
  ...audioDeals,
  ...Object.values(brandLaptops).flat(),
];

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
    [
      "Premium quality guaranteed",
      "Fast shipping across Kenya",
      "Official warranty included",
      "Perfect for work and play",
    ];

  return {
    ...product,
    descriptionList: defaultDescriptions,
    images: product.images?.length ? product.images : [product.image],
    features: "features" in product && product.features ? product.features : undefined,
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
  // Get similar products from the same category or printer type
  // Deduplicate by id first to avoid duplicate keys
  const seenIds = new Set<string>();
  const similarProducts = catalogProducts
    .filter((item) => {
      if (item.id === id) return false;
      // Skip duplicates
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      // For printers/scanners, match by printerType
      if (detailedProduct.printerType) {
        return item.printerType === detailedProduct.printerType;
      }
      // Otherwise match by category
      return item.category === detailedProduct.category;
    })
    .slice(0, 4);

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
            <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {detailedProduct.images!.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square border border-gray-200 rounded-none overflow-hidden bg-gray-50 p-2"
                    >
                      <Image
                        src={image}
                        alt={`${detailedProduct.name} gallery ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
                <div className="relative w-full aspect-square bg-gray-100 rounded-none overflow-hidden border border-gray-200 p-4">
                  <Image
                    src={detailedProduct.images![0]}
                    alt={detailedProduct.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-6">
                {("badge" in detailedProduct || detailedProduct.hot) && (
                  <Badge className="bg-[#A7E059] text-white">
                    {("badge" in detailedProduct && detailedProduct.badge) 
                      ? String(detailedProduct.badge)
                      : "HOT DEAL"}
                  </Badge>
                )}
                <div>
                  <h1 className="font-public-sans text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {detailedProduct.name}
                  </h1>
                  <p className="text-gray-600">
                    Premium quality • Fast shipping • Warranty included
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-yellow-400">
                    ★★★★★
                  </div>
                  <span className="text-gray-500">
                    ({detailedProduct.ratingCount ?? 120} reviews)
                  </span>
                  <span className="text-[#A7E059] font-semibold">
                    {detailedProduct.stock ?? 10} in stock
                  </span>
                </div>

                <div className="bg-gray-50 rounded-none p-6 space-y-3 border border-gray-200">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-lg text-gray-500 line-through">
                      KSh {detailedProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-4xl font-bold text-gray-900">
                      KSh {detailedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-[#A7E059] text-white">
                      Save: KSh {saving.toLocaleString()}
                    </Badge>
                  </div>
                </div>

                {/* Specifications (for laptops) */}
                {(detailedProduct.processor ||
                  detailedProduct.ram ||
                  detailedProduct.storage ||
                  detailedProduct.screen ||
                  detailedProduct.os ||
                  detailedProduct.generation) && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Specifications
                    </h2>
                    <div className="bg-gray-50 rounded-none p-6 space-y-3 border border-gray-200">
                      {detailedProduct.processor && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-700">
                            Processor:
                          </span>
                          <span className="text-gray-900">
                            {detailedProduct.processor}
                          </span>
                        </div>
                      )}
                      {detailedProduct.ram && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-700">RAM:</span>
                          <span className="text-gray-900">
                            {detailedProduct.ram}
                          </span>
                        </div>
                      )}
                      {detailedProduct.storage && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-700">
                            SSD/Storage:
                          </span>
                          <span className="text-gray-900">
                            {detailedProduct.storage}
                          </span>
                        </div>
                      )}
                      {detailedProduct.screen && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-700">
                            Screen:
                          </span>
                          <span className="text-gray-900">
                            {detailedProduct.screen}
                          </span>
                        </div>
                      )}
                      {detailedProduct.os && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="font-medium text-gray-700">OS:</span>
                          <span className="text-gray-900">
                            {detailedProduct.os}
                          </span>
                        </div>
                      )}
                      {detailedProduct.generation && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            Generation:
                          </span>
                          <span className="text-gray-900">
                            {detailedProduct.generation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {detailedProduct.description && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Description
                    </h2>
                    <p className="text-gray-700">{detailedProduct.description}</p>
                  </div>
                )}

                {/* Features List */}
                {detailedProduct.features && detailedProduct.features.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Features
                    </h2>
                    <ul className="space-y-2 text-gray-700">
                      {detailedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-[#A7E059] rounded-full mt-2 flex-shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Description List (fallback) */}
                {!detailedProduct.description && detailedProduct.descriptionList && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Description
                    </h2>
                    <ul className="space-y-2 text-gray-700">
                      {detailedProduct.descriptionList.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-[#A7E059] rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-none flex-1">
                      BUY NOW
                    </Button>
                    <AddToCartButton
                      variant="outline"
                      className="border-2 border-[#A7E059] text-[#A7E059] hover:bg-[#A7E059] hover:text-white font-semibold px-8 py-6 rounded-none"
                      fullWidth={false}
                    />
                  </div>

                  {/* Contact Options */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/254710505234?text=Hi, I'm interested in ${encodeURIComponent(detailedProduct.name)}`}
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

        {similarProducts.length > 0 && (
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="section-heading mb-6">
                Similar Products
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

