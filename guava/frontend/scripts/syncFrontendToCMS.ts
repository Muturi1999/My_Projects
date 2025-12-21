/**
 * Sync Frontend Data to CMS
 * 
 * This script copies all frontend hardcoded data into the CMS store:
 * - Hero slides
 * - All 12 categories
 * - Top laptop deals
 * - Printers and scanners deals
 * - Today's hot deals
 * - Computer accessories deals
 * - Shop popular brands
 * - Audio & headphones deals
 * - Popular categories
 * - All products from categories
 */

import { 
  hotDeals, 
  laptopDeals, 
  printerDeals, 
  accessoriesDeals, 
  audioDeals,
  brandLaptops,
  Product 
} from "@/lib/data/products";
import { shopCategories, popularBrands, popularCategories } from "@/lib/data/categories";
import { categoryProducts } from "@/lib/data/categoryProducts";
import { catalogProducts } from "@/lib/data/productCatalog";
import { getHomepageCMS, updateHomepageCMS } from "@/lib/data/cms/store";
import { HomepageCMSData, ProductHighlight, CategoryCardContent } from "@/lib/types/cms";
import { getProductImage } from "@/lib/utils/imageMapper";

/**
 * Convert Product to ProductHighlight (CMS format)
 */
function productToHighlight(product: Product, slug?: string): ProductHighlight {
  return {
    id: product.id,
    name: product.name,
    image: getProductImage(product.name, product.image),
    price: product.price,
    originalPrice: product.originalPrice,
    inStock: (product.stock ?? 0) > 0,
    rating: product.rating,
    badge: product.discount ? `${product.discount}% OFF` : undefined,
    slug: slug || `/product/${product.id}`,
  };
}

/**
 * Convert Product to CategoryCardContent (for brands)
 */
function productToCategoryCard(product: Product): CategoryCardContent {
  return {
    id: product.id,
    title: product.name,
    image: getProductImage(product.name, product.image),
    slug: `/product/${product.id}`,
  };
}

/**
 * Main sync function
 */
export function syncFrontendToCMS(): {
  success: boolean;
  message: string;
  stats: {
    heroSlides: number;
    categories: number;
    hotDeals: number;
    laptopDeals: number;
    printerDeals: number;
    accessoriesDeals: number;
    audioDeals: number;
    popularBrands: number;
    popularCategories: number;
    totalProducts: number;
  };
} {
  try {
    const currentCMS = getHomepageCMS();
    
    // 1. Sync Hero Slides (keep existing, don't overwrite)
    const heroSlides = currentCMS.heroSlides.length > 0 
      ? currentCMS.heroSlides 
      : [
          { id: "hero-1", title: "Hero slide 1", eyebrow: "", description: "", ctaLabel: "", ctaHref: "", leftImage: "", rightImage: "/Hero.png", badge: "" },
          { id: "hero-2", title: "Hero slide 2", eyebrow: "", description: "", ctaLabel: "", ctaHref: "", leftImage: "", rightImage: "/Hero.png", badge: "" },
          { id: "hero-3", title: "Hero slide 3", eyebrow: "", description: "", ctaLabel: "", ctaHref: "", leftImage: "", rightImage: "/Hero.png", badge: "" },
        ];

    // 2. Sync All 12 Categories
    const shopByCategoryItems: CategoryCardContent[] = shopCategories.map((cat) => ({
      id: `cat-${cat.slug}`,
      title: cat.name,
      image: cat.image,
      slug: cat.slug,
    }));

    // 3. Sync Today's Hot Deals
    const hotDealsItems: ProductHighlight[] = hotDeals.map((product) => 
      productToHighlight(product, `/product/${product.id}`)
    );

    // 4. Sync Top Laptop Deals
    const laptopDealsItems: ProductHighlight[] = laptopDeals.map((product) => 
      productToHighlight(product, `/product/${product.id}`)
    );

    // 5. Sync Printers & Scanners Deals (ALL products)
    const printerDealsItems: ProductHighlight[] = printerDeals.map((product) => 
      productToHighlight(product, `/product/${product.id}`)
    );
    console.log(`Syncing ${printerDealsItems.length} printer deals`);

    // 6. Sync Computer Accessories Deals (ALL products)
    const accessoriesDealsItems: ProductHighlight[] = accessoriesDeals.map((product) => 
      productToHighlight(product, `/product/${product.id}`)
    );
    console.log(`Syncing ${accessoriesDealsItems.length} accessories deals`);

    // 7. Sync Audio & Headphones Deals (ALL products)
    const audioDealsItems: ProductHighlight[] = audioDeals.map((product) => 
      productToHighlight(product, `/product/${product.id}`)
    );
    console.log(`Syncing ${audioDealsItems.length} audio deals`);

    // 8. Sync Popular Brands (convert to CategoryCardContent)
    const popularBrandsItems: CategoryCardContent[] = popularBrands.map((brand) => ({
      id: `brand-${brand.slug}`,
      title: brand.name,
      image: brand.image || brand.logo,
      slug: `/brand/${brand.slug}`,
    }));

    // 9. Sync Popular Categories
    const popularCategoriesItems: CategoryCardContent[] = popularCategories.map((cat) => ({
      id: `pop-cat-${cat.slug}`,
      title: cat.name,
      image: cat.image,
      slug: `/category/${cat.slug}`,
      variant: "highlight" as const,
    }));

    // Build updated CMS data
    const updatedCMS: HomepageCMSData = {
      heroSlides,
      shopByCategory: {
        id: "shop-by-category",
        title: "Shop by Category",
        description: "Explore essentials across laptops, accessories, networking, and more.",
        layout: "grid",
        items: shopByCategoryItems,
      },
      featuredDeals: currentCMS.featuredDeals || {
        id: "featured-deals",
        title: "Featured Deals",
        description: "Hero banners for seasonal promotions like HP OMEN flyer.",
        layout: "carousel",
        items: [],
      },
      hotDeals: {
        id: "hot-deals",
        title: "Today's Hot Deals",
        description: "Rotating 4-card grid with discounts and stock info.",
        layout: "grid",
        items: hotDealsItems,
      },
      printerScanner: {
        id: "printer-scanner-section",
        title: "Printers & Scanner Deals",
        description: "Highlighted SKUs for the Printers & Scanner homepage section.",
        layout: "grid",
        items: printerDealsItems,
      },
      accessories: {
        id: "accessories-section",
        title: "Computer Accessories Deals",
        description: "Computer accessories and peripherals.",
        layout: "grid",
        items: accessoriesDealsItems,
      },
      audio: {
        id: "audio-section",
        title: "Audio & Headphones Deals",
        description: "Audio equipment and headphones.",
        layout: "grid",
        items: audioDealsItems,
      },
      popularBrands: {
        id: "popular-brands",
        title: "Shop Laptop by Brand",
        description: "Browse laptops by popular brands.",
        layout: "grid",
        items: popularBrandsItems,
      },
      popularCategories: {
        id: "popular-categories",
        title: "Popular Categories",
        description: "Browse our most popular product categories.",
        layout: "grid",
        items: popularCategoriesItems,
      },
    };

    // Update CMS store
    updateHomepageCMS(updatedCMS);

    return {
      success: true,
      message: "Successfully synced all frontend data to CMS",
      stats: {
        heroSlides: heroSlides.length,
        categories: shopByCategoryItems.length,
        hotDeals: hotDealsItems.length,
        laptopDeals: laptopDealsItems.length,
        printerDeals: printerDealsItems.length,
        accessoriesDeals: accessoriesDealsItems.length,
        audioDeals: audioDealsItems.length,
        popularBrands: popularBrandsItems.length,
        popularCategories: popularCategoriesItems.length,
        totalProducts: catalogProducts.length,
      },
    };
  } catch (error) {
    console.error("Failed to sync frontend to CMS:", error);
    return {
      success: false,
      message: `Failed to sync: ${error instanceof Error ? error.message : String(error)}`,
      stats: {
        heroSlides: 0,
        categories: 0,
        hotDeals: 0,
        laptopDeals: 0,
        printerDeals: 0,
        accessoriesDeals: 0,
        audioDeals: 0,
        popularBrands: 0,
        popularCategories: 0,
        totalProducts: 0,
      },
    };
  }
}

