export interface CategoryTaxonomy {
  id: string;
  title: string;
  slug: string;
  parentId?: string | null;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroHeadline?: string;
  heroDescription?: string;
  tags?: string[];
}

export interface TaxonomyCMSData {
  categories: CategoryTaxonomy[];
}

