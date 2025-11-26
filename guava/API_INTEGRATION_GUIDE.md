# Frontend API Integration Guide

This guide explains how to replace mock data with API calls throughout the frontend.

## Overview

The frontend has been set up with:
- ✅ API client (`lib/api/`) - Axios-based client with type-safe interfaces
- ✅ React hooks (`lib/hooks/`) - Custom hooks for data fetching
- ⚠️ Mock data still in use - Needs to be replaced

## Migration Strategy

### Step 1: Use React Hooks (Recommended)

The easiest way is to use the provided hooks:

```tsx
// Before (using mock data)
import { laptopDeals } from "@/lib/data/products";

export default function Page() {
  return <ProductList products={laptopDeals} />;
}

// After (using API)
'use client';
import { useHotDeals } from "@/lib/hooks";

export default function Page() {
  const { products, loading, error } = useHotDeals();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <ProductList products={products} />;
}
```

### Step 2: Direct API Calls (For Server Components)

For Next.js server components, use the API directly:

```tsx
// Server component
import { productsApi } from "@/lib/api";

export default async function Page() {
  const products = await productsApi.getHotDeals();
  return <ProductList products={products} />;
}
```

## Available Hooks

### Products
- `useProducts(params?)` - List products with filters
- `useProduct(id)` - Get single product
- `useHotDeals()` - Get hot deals
- `useProductsByCategory(slug)` - Get products by category
- `useProductsByBrand(slug)` - Get products by brand

### Catalog
- `useCategories()` - List categories
- `useCategory(idOrSlug)` - Get single category
- `useBrands()` - List brands
- `useBrand(idOrSlug)` - Get single brand

### CMS
- `useHomepage()` - Get homepage data
- `useNavigation()` - Get navigation
- `useFooter()` - Get footer
- `useServiceGuarantees()` - Get service guarantees

## Files to Update

### High Priority (User-facing pages)

1. **`app/page.tsx`** - Homepage
   - Replace `laptopDeals`, `printerDeals` with API calls
   - Use `useHotDeals()`, `useProducts({ category: 'laptops' })`

2. **`app/product/[id]/page.tsx`** - Product detail
   - Replace mock product with `useProduct(id)`

3. **`app/category/[slug]/page.tsx`** - Category page
   - Replace `categoryProducts` with `useProductsByCategory(slug)`

4. **`app/brands/[brandSlug]/page.tsx`** - Brand page
   - Replace mock data with `useProductsByBrand(brandSlug)`

5. **`app/hot-deals/page.tsx`** - Hot deals page
   - Replace `hotDeals` with `useHotDeals()`

### Medium Priority (Section pages)

6. **`app/top-laptop-deals/page.tsx`**
7. **`app/computer-accessories/page.tsx`**
8. **`app/printers-scanners/page.tsx`**
9. **`app/audio-headphones/page.tsx`**
10. **`app/popular-brands/page.tsx`**
11. **`app/popular-categories/page.tsx`**

### Components

12. **`components/HotDealsSection.tsx`**
13. **`components/TopLaptopDealsSection.tsx`**
14. **`components/PrinterScannerSection.tsx`**
15. **`components/AccessoriesSection.tsx`**
16. **`components/AudioSection.tsx`**
17. **`components/BrandSection.tsx`**
18. **`components/PopularBrands.tsx`**
19. **`components/PopularCategories.tsx`**
20. **`components/Header.tsx`** - Use `useNavigation()`
21. **`components/Footer.tsx`** - Use `useFooter()`
22. **`components/ServiceGuarantees.tsx`** - Use `useServiceGuarantees()`

## Example: Updating Homepage

```tsx
// app/page.tsx
'use client';

import { useHotDeals, useProducts } from "@/lib/hooks";
import { HotDealsSection } from "@/components/HotDealsSection";
import { TopLaptopDealsSection } from "@/components/TopLaptopDealsSection";

export default function Home() {
  const { products: hotDeals, loading: hotDealsLoading } = useHotDeals();
  const { products: laptops, loading: laptopsLoading } = useProducts({ 
    category: 'laptops',
    page_size: 4 
  });
  const { products: printers, loading: printersLoading } = useProducts({ 
    category: 'printers',
    page_size: 4 
  });

  return (
    <main className="min-h-screen">
      <HotDealsSection products={hotDeals} loading={hotDealsLoading} />
      <TopLaptopDealsSection products={laptops} loading={laptopsLoading} />
      <PrinterScannerSection products={printers} loading={printersLoading} />
    </main>
  );
}
```

## Error Handling

Always handle loading and error states:

```tsx
const { products, loading, error } = useProducts();

if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error.message} />;
}

return <ProductList products={products} />;
```

## Fallback to Mock Data

During development, you can fallback to mock data if API fails:

```tsx
const { products, loading, error } = useProducts();
const fallbackProducts = laptopDeals; // Mock data

const displayProducts = error ? fallbackProducts : products;
```

## Testing

After updating a page:

1. Check browser console for errors
2. Verify data loads correctly
3. Test error states (disconnect API, check fallback)
4. Test loading states

## Next Steps

1. Start with homepage (`app/page.tsx`)
2. Update product detail page
3. Update category pages
4. Update components one by one
5. Remove mock data files once all pages are updated

## Notes

- Mock data files in `lib/data/` can be kept for development/testing
- API calls are cached by Next.js automatically
- Use server components where possible for better performance
- Client components need `'use client'` directive when using hooks

