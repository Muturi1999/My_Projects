export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  leftImage?: string;
  rightImage?: string;
  badge?: string;
}

export interface CategoryCardContent {
  id: string;
  title: string;
  image: string;
  slug: string;
  variant?: "default" | "highlight";
}

export interface FeaturedTile {
  id: string;
  title: string;
  subtitle?: string;
  description: string[];
  price: number;
  originalPrice?: number;
  saving?: number;
  badge?: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ProductHighlight {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  rating?: number;
  badge?: string;
  slug: string;
}

export interface SectionBlock<T> {
  id: string;
  title: string;
  description?: string;
  items: T[];
  layout?: "grid" | "carousel" | "list";
  background?: string;
}

export interface HomepageCMSData {
  heroSlides: HeroSlide[];
  shopByCategory: SectionBlock<CategoryCardContent>;
  featuredDeals: SectionBlock<FeaturedTile>;
  hotDeals: SectionBlock<ProductHighlight>;
  printerScanner: SectionBlock<ProductHighlight>;
  accessories: SectionBlock<ProductHighlight>;
  audio: SectionBlock<ProductHighlight>;
  popularBrands: SectionBlock<CategoryCardContent>;
  popularCategories: SectionBlock<CategoryCardContent>;
}

// Navigation & Footer Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
  order: number;
}

export interface NavDropdownItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export interface NavigationCMSData {
  primaryNav: NavItem[];
  categoryNav: NavItem[];
  whatsappLink?: string;
  phoneNumber?: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterCMSData {
  columns: FooterColumn[];
  companyInfo: {
    name: string;
    description: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  copyright?: string;
}

// Shop Page Config
export interface FilterConfig {
  id: string;
  label: string;
  type: "checkbox" | "range" | "select";
  options?: string[];
  category?: string;
  order: number;
}

export interface ShopPageCMSData {
  defaultView: "grid" | "list";
  itemsPerPage: number;
  sortOptions: string[];
  filters: FilterConfig[];
  featuredBrands: string[];
  bannerText?: string;
}

// Product Detail Page Config
export interface DetailPageCMSData {
  showSimilarProducts: boolean;
  similarProductsCount: number;
  showSpecs: boolean;
  showReviews: boolean;
  showShippingInfo: boolean;
  ctaBlocks: CTABlock[];
  seoSections: SEOSection[];
}

export interface CTABlock {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
}

export interface SEOSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

// Service Guarantees
export interface ServiceGuarantee {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface ServiceGuaranteesCMSData {
  guarantees: ServiceGuarantee[];
}

// Custom Sections
export interface CustomSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: "html" | "markdown" | "component";
  placement: string[];
  order: number;
  published: boolean;
}

export interface CustomSectionsCMSData {
  sections: CustomSection[];
}
