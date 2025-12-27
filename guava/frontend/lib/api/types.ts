/**
 * TypeScript interfaces matching backend API responses.
 * These should match the Django serializers.
 */

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image: string;
  images?: string[];
  category_slug: string;
  brand_slug?: string;
  hot: boolean;
  featured: boolean;
  rating: number;
  rating_count: number;
  stock_quantity: number;
  specifications?: ProductSpecification;
  product_images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductSpecification {
  processor?: string;
  ram?: string;
  storage?: string;
  screen?: string;
  os?: string;
  generation?: string;
  printer_type?: string;
  features?: string[];
}

export interface ProductImage {
  image_url: string;
  alt_text?: string;
  order: number;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  total_pages: number;
  current_page: number;
  results: Product[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parent?: string;
  subcategories?: Category[];
  brands?: Brand[];
  order: number;
  created_at: string;
}
export interface DetailedProduct extends Product {
  warrantyNote?: string;
  descriptionList?: any;
  features?: string[];
  specGroups?: any;
  addons?: any;
  _isDjangoProduct?: boolean;
  // Add any other optional fields you know exist in the API response
}

export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

// Brand types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  image?: string;
  color?: string;
  description?: string;
  discount?: number;
  categories?: Category[];
  created_at: string;
}

export interface BrandListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Brand[];
}

// CMS types
export interface Homepage {
  id: string;
  title: string;
  description?: string;
  hero_slides: HeroSlide[];
  shop_by_category: ShopByCategory;
  featured_deals: FeaturedDeals;
  // Optional hot deals block from CMS (may not be present on older data)
  hot_deals?: {
    id: string;
    title: string;
    description?: string;
    layout?: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
      price: number;
      originalPrice?: number;
      inStock?: boolean;
      rating?: number;
      badge?: string;
      slug: string;
    }>;
  };
  custom_sections: CustomSection[];
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  cta_label?: string;
  cta_href?: string;
  left_image?: string;
  right_image?: string;
  badge?: string;
}

export interface ShopByCategory {
  id: string;
  title: string;
  description?: string;
  layout: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  title: string;
  image: string;
  slug: string;
}

export interface FeaturedDeals {
  id: string;
  title: string;
  description?: string;
  layout: string;
  items: FeaturedDealItem[];
}

export interface FeaturedDealItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  discount?: string;
  cta_label?: string;
  cta_href?: string;
}

export interface CustomSection {
  id: string;
  type: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface Navigation {
  id: string;
  name: string;
  items: NavigationItem[];
  footer_items: NavigationItem[];
  updated_at: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface Footer {
  id: string;
  copyright_text: string;
  social_links: Record<string, string>;
  columns: FooterColumn[];
  payment_methods: string[];
  updated_at: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ServiceGuarantee {
  id: string;
  title: string;
  description?: string;
  icon: string;
  order: number;
}

export interface ServiceGuaranteeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceGuarantee[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
}


