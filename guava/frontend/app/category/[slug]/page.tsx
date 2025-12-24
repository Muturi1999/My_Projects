"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryFilters } from "@/components/CategoryFilters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@heroicons/react/24/solid";
import { Squares2X2Icon, ListBulletIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { shopCategories } from "@/lib/data/categories";
import { categoryProducts } from "@/lib/data/categoryProducts";
import { laptopDeals, Product } from "@/lib/data/products";
import { WishlistIcon } from "@/components/ui/WishlistIcon";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/admin/ToastContainer";
import { useRouter } from "next/navigation";
import { mapProductsToLocalImages } from "@/lib/utils/imageMapper";
import { isDjangoProduct, transformDjangoProduct } from "@/lib/utils/productTransformer";

// Products are now fetched from Django API only - no static data

const sortOptions = [
  "Most Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
  "Highest Rated",
  "Best Sellers",
];

function ProductCard({
  product,
  viewMode,
  isInWishlist,
  onWishlistToggle,
  categorySlug,
}: {
  product: Product & {
    type?: string;
    cpuManufacturer?: string;
    cpuSpeed?: string;
    graphics?: string;
  };
  viewMode: "grid" | "list";
  isInWishlist: boolean;
  onWishlistToggle: (id: string, e: React.MouseEvent) => void;
  categorySlug: string;
}) {
  const router = useRouter();
  
  const discountPercentage = product.originalPrice > 0 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="group p-4 hover:shadow-lg transition-all border border-gray-200 rounded-none">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-48 h-40 sm:h-48 bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
            {product.image && product.image.trim() !== "" ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 200px, 200px"
                className="object-contain p-3 sm:p-4"
                unoptimized={isDjangoProduct(product) && (product.image?.startsWith('http://') || product.image?.startsWith('https://'))}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-4">
                No Image Available
              </div>
            )}
            {/* Wishlist Hover Icon */}
            <WishlistIcon
              isActive={isInWishlist}
              onClick={(e) => onWishlistToggle(product.id, e)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-600 ml-1">({product.ratingCount || 0})</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {product.hot && <Badge variant="destructive" className="text-xs">HOT</Badge>}
                <span className="inline-flex items-center bg-[#A7E059] text-black px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  {discountPercentage}% OFF
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
              {product.processor && <div><span className="font-medium">Processor: </span>{product.processor}</div>}
              {product.ram && <div><span className="font-medium">RAM: </span>{product.ram}</div>}
              {product.storage && <div><span className="font-medium">SSD/Storage: </span>{product.storage}</div>}
              {product.screen && <div><span className="font-medium">Screen: </span>{product.screen}</div>}
              {product.os && <div><span className="font-medium">OS: </span>{product.os}</div>}
              {product.generation && <div><span className="font-medium">Generation: </span>{product.generation}</div>}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                {product.stock !== undefined && (
                  <div className="mb-2">
                    <span className="text-xs sm:text-sm text-[#A7E059] font-medium">In stock</span>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      Ksh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    Ksh {product.price?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
              <AddToCartButton
                onClick={() => {
        // Use product slug for better URLs, fallback to ID if slug not available
        const productPath = product.slug || product.id;
        router.push(`/product/${productPath}?category=${categorySlug}`);
      }}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border border-gray-200 cursor-pointer rounded-none"
      onClick={() => {
        // Use product slug for better URLs, fallback to ID if slug not available
        const productPath = product.slug || product.id;
        router.push(`/product/${productPath}?category=${categorySlug}`);
      }}
    >
      <div className="px-4 pt-4 flex flex-col gap-2 items-start">
        <span className="inline-flex items-center bg-[#A7E059] text-black px-2.5 py-1 rounded-full text-xs font-semibold">
          {discountPercentage}% OFF
        </span>
        {product.hot && (
          <Badge variant="destructive" className="rounded-full text-xs font-semibold px-2.5 py-1">
            HOT
          </Badge>
        )}
      </div>
      <div className="relative p-4 border-b border-gray-200">
        <div className="relative bg-white w-full h-48 md:h-52 overflow-hidden border border-gray-200">
          {product.image && product.image.trim() !== "" ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-4"
              unoptimized={isDjangoProduct(product) && (product.image?.startsWith('http://') || product.image?.startsWith('https://'))}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-4">
              No Image Available
            </div>
          )}
           {/* Wishlist Hover Icon */}
           <WishlistIcon
             isActive={isInWishlist}
             onClick={(e) => onWishlistToggle(product.id, e)}
             className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
           />
        </div>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
            <StarIcon key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
          {product.processor && (
            <div>
              <span className="font-medium">Processor: </span>
              <span>{product.processor}</span>
            </div>
          )}
          {product.ram && (
            <div>
              <span className="font-medium">RAM: </span>
              <span>{product.ram}</span>
            </div>
          )}
          {product.storage && (
            <div>
              <span className="font-medium">SSD/Storage: </span>
              <span>{product.storage}</span>
            </div>
          )}
          {product.screen && (
            <div>
              <span className="font-medium">Screen: </span>
              <span>{product.screen}</span>
            </div>
          )}
          {product.os && (
            <div>
              <span className="font-medium">OS: </span>
              <span>{product.os}</span>
            </div>
          )}
          {product.generation && (
            <div>
              <span className="font-medium">Generation: </span>
              <span>{product.generation}</span>
            </div>
          )}
        </div>
        {product.stock !== undefined && (
          <div className="mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm text-[#A7E059] font-medium">In stock</span>
          </div>
        )}
        <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              Ksh {product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            Ksh {product.price?.toLocaleString() || '0'}
          </span>
          </div>
        </div>
        <AddToCartButton
          product={product}
          className="mt-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    </Card>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const category = shopCategories.find((cat) => cat.slug === slug);

  // Optional search query from the global header search bar
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  const { ids: wishlistIds, toggle } = useWishlist();
  const toast = useToast();
  const [djangoProducts, setDjangoProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const productsPerPage = 12;

  // Fetch products from Django API (directly, not via Next.js proxy)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api";

        const response = await fetch(
          `${baseUrl}/products/queries/?category_slug=${slug}&page_size=1000`,
          {
            cache: 'no-store', // Always fetch fresh data
          }
        );

        if (!response.ok) {
          console.error(
            "[Category Page] Failed to fetch products from Django. Status:",
            response.status
          );
          setDjangoProducts([]);
          return;
        }

        const data = await response.json();
        const djangoRawProducts = data.results || data || [];

        console.log(`[Category Page] Fetched ${djangoRawProducts.length} products for category: ${slug}`);

        // Transform raw Django products into frontend Product format
        const transformed = Array.isArray(djangoRawProducts)
          ? djangoRawProducts.map((p: any) => {
              const transformedProduct = transformDjangoProduct(p);
              console.log(`[Category Page] Transformed product: ${transformedProduct.name}, category_slug: ${(transformedProduct as any).category_slug}`);
              return transformedProduct;
            })
          : [];

        console.log(`[Category Page] Transformed ${transformed.length} products`);
        setDjangoProducts(transformed);
      } catch (error) {
        console.error("[Category Page] Failed to fetch products from Django:", error);
        setDjangoProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  // Generate products for each category - ONLY from database
  // Since API already filters by category_slug, we just use all fetched products
  const generateCategoryProducts = useMemo(() => {
    console.log(`[Category Page] Using Django products for category "${slug}"`);
    console.log(`[Category Page] Total Django products: ${djangoProducts.length}`);
    
    // API already filtered by category_slug, so just return all fetched products
    // No need to filter again unless category_slug somehow doesn't match
    return djangoProducts;
  }, [slug, djangoProducts]);

  // Get products for this category
  const categoryProductsList = useMemo(() => {
    return generateCategoryProducts;
  }, [generateCategoryProducts]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...categoryProductsList];

    // Apply free-text search within this category when ?q= is present
    if (searchQuery) {
      filtered = filtered.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = ((p as any).brand || "").toLowerCase();
        const categoryName = (p.category || "").toLowerCase();
        return (
          name.includes(searchQuery) ||
          brand.includes(searchQuery) ||
          categoryName.includes(searchQuery)
        );
      });
    }

    // Apply filters - ONLY if explicitly selected by user
    // Availability filters
    if (filters.availability?.inStock === true) {
      filtered = filtered.filter((p) => {
        const availability = (p as any).availability || 'in_stock';
        const stock = (p as any).stock_quantity ?? (p as any).stock ?? 0;
        // Consider in_stock, special_offer, clearance as "in stock"
        return ['in_stock', 'special_offer', 'clearance'].includes(availability) || stock > 0;
      });
      console.log(`[Category Page] Applied inStock filter: ${filtered.length} products`);
    }
    if (filters.availability?.outOfStock === true) {
      filtered = filtered.filter((p) => {
        const availability = (p as any).availability || 'in_stock';
        const stock = (p as any).stock_quantity ?? (p as any).stock ?? 0;
        // Consider out_of_stock, check_availability, expecting as "out of stock" if stock is 0
        return !['in_stock', 'special_offer', 'clearance'].includes(availability) && stock === 0;
      });
      console.log(`[Category Page] Applied outOfStock filter: ${filtered.length} products`);
    }
    
    // Price range filter - ONLY apply if user changed it from default [0, 500]
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange;
      // Only apply if it's different from default [0, 500]
      if (min !== 0 || max !== 500) {
        const minPrice = min * 1000;
        const maxPrice = max === 500 ? Infinity : max * 1000;
        filtered = filtered.filter(
          (p) => p.price >= minPrice && p.price <= maxPrice
        );
        console.log(`[Category Page] Applied price range filter [${minPrice}, ${maxPrice === Infinity ? 'Infinity' : maxPrice}]: ${filtered.length} products`);
      }
    }
    // Brand filter - ONLY apply if user selected brands
    if (filters.brands && Array.isArray(filters.brands) && filters.brands.length > 0) {
      filtered = filtered.filter((p) => {
        // Check both brand name and brand_slug
        const productBrand = (p as any).brand || (p as any).brand_slug || "";
        return filters.brands.some((b: string) => 
          productBrand?.toLowerCase() === b.toLowerCase() ||
          productBrand?.toLowerCase() === b.toLowerCase().replace(/\s+/g, "-")
        );
      });
      console.log(`[Category Page] Applied brand filter [${filters.brands.join(', ')}]: ${filtered.length} products`);
    }
    if (filters.types?.length > 0) {
      filtered = filtered.filter((p) => filters.types.includes((p as any).type));
    }
    if (filters.cpuTypes?.length > 0) {
      filtered = filtered.filter((p) => 
        filters.cpuTypes.some((cpu: string) => (p as any).processor?.includes(cpu))
      );
    }
    if (filters.generations?.length > 0) {
      filtered = filtered.filter((p) => 
        filters.generations.some((gen: string) => (p as any).generation?.includes(gen))
      );
    }
    if (filters.storage?.length > 0) {
      filtered = filtered.filter((p) => {
        const productStorage = (p as any).storage?.toLowerCase().replace(/\s/g, "");
        return filters.storage.some((s: string) => productStorage?.includes(s.toLowerCase()));
      });
    }
    if (filters.screenSizes?.length > 0) {
      filtered = filtered.filter((p) => {
        const screen = (p as any).screen;
        return filters.screenSizes.some((size: string) => {
          if (size.includes("13 to 13.9")) return screen?.includes("13");
          if (size.includes("14 to 14.9")) return screen?.includes("14");
          if (size.includes("15 to 16.9")) return screen?.includes("15") || screen?.includes("16");
          if (size.includes("17")) return screen?.includes("17");
          return false;
        });
      });
    }
    if (filters.cpuManufacturers?.length > 0) {
      filtered = filtered.filter((p) => 
        filters.cpuManufacturers.some((man: string) => 
          (p as any).cpuManufacturer === man || (p as any).processor?.includes(man)
        )
      );
    }
    if (filters.cpuSpeeds?.length > 0) {
      filtered = filtered.filter((p) => filters.cpuSpeeds.includes((p as any).cpuSpeed));
    }
    if (filters.graphics?.length > 0) {
      filtered = filtered.filter((p) => filters.graphics.includes((p as any).graphics));
    }
    
    // Additional filters for other categories
    if (filters.connectivity?.length > 0) {
      filtered = filtered.filter((p) => filters.connectivity.includes((p as any).connectivity));
    }
    if (filters.compatibility?.length > 0) {
      filtered = filtered.filter((p) => filters.compatibility.includes((p as any).compatibility));
    }
    if (filters.resolution?.length > 0) {
      filtered = filtered.filter((p) => filters.resolution.includes((p as any).resolution));
    }
    if (filters.refreshRate?.length > 0) {
      filtered = filtered.filter((p) => filters.refreshRate.includes((p as any).refreshRate));
    }
    if (filters.panelType?.length > 0) {
      filtered = filtered.filter((p) => filters.panelType.includes((p as any).panelType));
    }
    if (filters.ram?.length > 0) {
      filtered = filtered.filter((p) => filters.ram.includes((p as any).ram));
    }
    if (filters.camera?.length > 0) {
      filtered = filtered.filter((p) => filters.camera.includes((p as any).camera));
    }
    if (filters.battery?.length > 0) {
      filtered = filtered.filter((p) => filters.battery.includes((p as any).battery));
    }
    if (filters.network?.length > 0) {
      filtered = filtered.filter((p) => filters.network.includes((p as any).network));
    }
    if (filters.operatingSystem?.length > 0) {
      filtered = filtered.filter((p) => filters.operatingSystem.includes((p as any).operatingSystem));
    }
    if (filters.printerType?.length > 0) {
      filtered = filtered.filter((p) => filters.printerType.includes((p as any).printerType));
    }
    if (filters.functionality?.length > 0) {
      filtered = filtered.filter((p) => filters.functionality.includes((p as any).functionality));
    }
    if (filters.color?.length > 0) {
      filtered = filtered.filter((p) => filters.color.includes((p as any).color));
    }
    if (filters.processor?.length > 0) {
      filtered = filtered.filter((p) => 
        filters.processor.some((proc: string) => (p as any).processor?.includes(proc))
      );
    }
    if (filters.features?.length > 0) {
      filtered = filtered.filter((p) => 
        filters.features.some((feature: string) => (p as any).features?.includes(feature))
      );
    }
    if (filters.wifiStandard?.length > 0) {
      filtered = filtered.filter((p) => filters.wifiStandard.includes((p as any).wifiStandard));
    }
    if (filters.speed?.length > 0) {
      filtered = filtered.filter((p) => filters.speed.includes((p as any).speed));
    }
    if (filters.ports?.length > 0) {
      filtered = filtered.filter((p) => filters.ports.includes((p as any).ports));
    }
    if (filters.license?.length > 0) {
      filtered = filtered.filter((p) => filters.license.includes((p as any).license));
    }
    if (filters.capacity?.length > 0) {
      filtered = filtered.filter((p) => {
        const productCapacity = (p as any).capacity?.toLowerCase().replace(/\s/g, "");
        return filters.capacity.some((c: string) => productCapacity?.includes(c.toLowerCase()));
      });
    }
    if (filters.interface?.length > 0) {
      filtered = filtered.filter((p) => filters.interface.includes((p as any).interface));
    }
    if (filters.consoleType?.length > 0) {
      filtered = filtered.filter((p) => filters.consoleType.includes((p as any).consoleType));
    }

    // Apply sorting
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Highest Rated":
        filtered.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
        break;
      case "Newest First":
        filtered.reverse();
        break;
      default:
        // Most Popular - keep original order
        break;
    }

    console.log(`[Category Page] Final filtered products: ${filtered.length}`);
    return filtered;
  }, [categoryProductsList, filters, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProductsRaw = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  
  console.log(`[Category Page] Pagination: total=${filteredAndSortedProducts.length}, page=${currentPage}, perPage=${productsPerPage}, raw=${paginatedProductsRaw.length}`);
  
  // Map products to use local images
  // Only map local images for static products, not Django products
  // Show all products from database (even without images) - they'll display with a "no image" state
  const paginatedProducts = paginatedProductsRaw.map((p) => {
    // Only apply image mapper to static products
    if (isDjangoProduct(p)) {
      return p; // Django products already have their images from database (or empty string if none)
    }
    return mapProductsToLocalImages([p])[0];
  });
  
  console.log(`[Category Page] Final paginated products: ${paginatedProducts.length}`);

  const handleFilterChange = useCallback((newFilters: any) => {
      setFilters(newFilters);
      const newActiveFilters: string[] = [];
      if (newFilters.availability?.inStock) newActiveFilters.push("In Stock");
      if (newFilters.availability?.outOfStock) newActiveFilters.push("Out of Stock");
      if (newFilters.brands?.length > 0) {
        newActiveFilters.push(...newFilters.brands);
      }
      if (newFilters.types?.length > 0) {
        newActiveFilters.push(...newFilters.types);
      }
      if (newFilters.cpuTypes?.length > 0) {
        newActiveFilters.push(...newFilters.cpuTypes);
      }
      if (newFilters.generations?.length > 0) {
        newActiveFilters.push(...newFilters.generations);
      }
      if (newFilters.storage?.length > 0) {
        newActiveFilters.push(...newFilters.storage.map((s: string) => s.toUpperCase()));
      }
      if (newFilters.screenSizes?.length > 0) {
        newActiveFilters.push(...newFilters.screenSizes);
      }
      if (newFilters.cpuManufacturers?.length > 0) {
        newActiveFilters.push(...newFilters.cpuManufacturers);
      }
      if (newFilters.cpuSpeeds?.length > 0) {
        newActiveFilters.push(...newFilters.cpuSpeeds);
      }
      if (newFilters.graphics?.length > 0) {
        newActiveFilters.push(...newFilters.graphics);
      }
      setActiveFilters(newActiveFilters);
      setCurrentPage(1);
    }, []);

  const removeFilter = (filter: string) => {
    if (filter === "In Stock") {
      setFilters((prev: any) => ({ ...prev, availability: { ...prev.availability, inStock: false } }));
    } else if (filter === "Out of Stock") {
      setFilters((prev: any) => ({ ...prev, availability: { ...prev.availability, outOfStock: false } }));
    } else {
      // Try to remove from all filter arrays
      setFilters((prev: any) => {
        const updated = { ...prev };
        if (updated.brands?.includes(filter)) {
          updated.brands = updated.brands.filter((b: string) => b !== filter);
        }
        if (updated.types?.includes(filter)) {
          updated.types = updated.types.filter((t: string) => t !== filter);
        }
        if (updated.cpuTypes?.includes(filter)) {
          updated.cpuTypes = updated.cpuTypes.filter((c: string) => c !== filter);
        }
        if (updated.generations?.includes(filter)) {
          updated.generations = updated.generations.filter((g: string) => g !== filter);
        }
        if (updated.storage?.some((s: string) => s.toUpperCase() === filter)) {
          updated.storage = updated.storage.filter((s: string) => s.toUpperCase() !== filter);
        }
        if (updated.screenSizes?.includes(filter)) {
          updated.screenSizes = updated.screenSizes.filter((s: string) => s !== filter);
        }
        if (updated.cpuManufacturers?.includes(filter)) {
          updated.cpuManufacturers = updated.cpuManufacturers.filter((m: string) => m !== filter);
        }
        if (updated.cpuSpeeds?.includes(filter)) {
          updated.cpuSpeeds = updated.cpuSpeeds.filter((s: string) => s !== filter);
        }
        if (updated.graphics?.includes(filter)) {
          updated.graphics = updated.graphics.filter((g: string) => g !== filter);
        }
        return updated;
      });
    }
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    setCurrentPage(1);
  };

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-3 sm:py-4">
          <div className="section-wrapper">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#A7E059] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{category.name}</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-4 sm:py-6 md:py-8 bg-white">
          <div className="section-wrapper">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Left Sidebar - Filters (Desktop) */}
              <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                <CategoryFilters 
                  categorySlug={slug} 
                  onFilterChange={handleFilterChange} 
                  products={djangoProducts}
                />
              </aside>

              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 w-full sm:w-auto"
                >
                  <FunnelIcon className="h-5 w-5" />
                  <span>Filters</span>
                  {activeFilters.length > 0 && (
                    <span className="bg-[#A7E059] text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Filters Drawer */}
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
                  <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="p-4">
                      <CategoryFilters 
                        categorySlug={slug} 
                        onFilterChange={handleFilterChange} 
                        products={djangoProducts}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{category.name}</h1>
                {/* Top Bar - Sort, View, Results */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A7E059]"
                    >
                      {sortOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 sm:p-2 ${viewMode === "grid" ? "bg-[#A7E059] text-white" : "bg-white text-gray-600"}`}
                        aria-label="Grid view"
                      >
                        <Squares2X2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 sm:p-2 ${viewMode === "list" ? "bg-[#A7E059] text-white" : "bg-white text-gray-600"}`}
                        aria-label="List view"
                      >
                        <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {filteredAndSortedProducts.length.toLocaleString()} Results
                    </span>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Active Filters:</span>
                    {activeFilters.map((filter) => (
                      <div
                        key={filter}
                        className="flex items-center gap-1 bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        <span className="truncate max-w-[120px] sm:max-w-none">{filter}</span>
                        <button
                          onClick={() => removeFilter(filter)}
                          className="ml-1 hover:text-red-600 flex-shrink-0"
                          aria-label={`Remove ${filter} filter`}
                        >
                          <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products Grid/List */}
                {loadingProducts ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : paginatedProducts.length > 0 ? (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8"
                          : "space-y-3 sm:space-y-4 mb-6 sm:mb-8"
                      }
                    >
            {paginatedProducts.map((product) => {
              const isInWishlist = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  isInWishlist={isInWishlist}
                  categorySlug={slug}
                  onWishlistToggle={(id, e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const willAdd = !wishlistIds.includes(id);
                    toggle(id);
                    if (willAdd) {
                      toast.success("Added to wishlist");
                    } else {
                      toast.info("Removed from wishlist");
                    }
                  }}
                />
              );
            })}
      </div>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex-shrink-0"
                          aria-label="Previous page"
                        >
                          <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 6) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 5 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm flex-shrink-0 ${
                                currentPage === pageNum
                                  ? "bg-[#A7E059] text-white border-[#A7E059]"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {String(pageNum).padStart(2, "0")}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex-shrink-0"
                          aria-label="Next page"
                        >
                          <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg">No products found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
