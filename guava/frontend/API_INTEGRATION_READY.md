# API Integration Files - Ready for Future Use

## 📁 Available API Integration Files

All API integration infrastructure is in place and ready to use when needed. The frontend currently uses mock data, but you can switch to API calls anytime.

### 🔌 API Client (`lib/api/`)

- **`client.ts`** - Axios instance configured for API Gateway
- **`types.ts`** - TypeScript interfaces matching backend API responses
- **`products.ts`** - Product API functions (list, get, search, hot deals, etc.)
- **`catalog.ts`** - Catalog API functions (categories, brands)
- **`cms.ts`** - CMS API functions (homepage, navigation, footer, service guarantees)
- **`index.ts`** - Centralized exports

### 🎣 React Hooks (`lib/hooks/`)

- **`useProducts.ts`** - Hook for fetching products with filters
  - `useProducts(params)` - List products
  - `useProduct(id)` - Single product
  - `useHotDeals()` - Hot deals
  - `useProductsByCategory(slug)` - Products by category
  - `useProductsByBrand(slug)` - Products by brand

- **`useCatalog.ts`** - Hook for fetching catalog data
  - `useCategories()` - List categories
  - `useCategory(idOrSlug)` - Single category
  - `useBrands()` - List brands
  - `useBrand(idOrSlug)` - Single brand

- **`useCMS.ts`** - Hook for fetching CMS data
  - `useHomepage()` - Current homepage
  - `useNavigation()` - Current navigation
  - `useFooter()` - Current footer
  - `useServiceGuarantees()` - Service guarantees

- **`index.ts`** - Centralized exports

### 🛠️ Utilities (`lib/utils/`)

- **`productMapper.ts`** - Maps API Product format to component Product format
  - `mapApiProductToComponent(apiProduct)` - Single product mapper
  - `mapApiProductsToComponents(apiProducts)` - Array mapper

### ⚙️ Configuration (`lib/config/`)

- **`env.ts`** - Environment variable loader with defaults
  - Configured for `http://localhost:8000/api/v1` (API Gateway)
  - Has sensible defaults for development

## 🔄 How to Switch from Mock Data to API

When you're ready to use the API, here's what to change:

### Example: HotDealsSection

**Current (Mock Data):**
```typescript
import { hotDeals } from "@/lib/data/products";

export function HotDealsSection() {
  const displayedDeals = hotDeals.slice(0, 4);
  // ...
}
```

**With API:**
```typescript
import { useHotDeals } from "@/lib/hooks";
import { mapApiProductsToComponents } from "@/lib/utils/productMapper";

export function HotDealsSection() {
  const { products, loading, error } = useHotDeals();
  const displayedDeals = mapApiProductsToComponents(products).slice(0, 4);
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  // ...
}
```

## 📋 Checklist for API Integration

When switching to API:

1. ✅ Replace mock data imports with API hooks
2. ✅ Add loading states (skeleton loaders)
3. ✅ Add error handling
4. ✅ Use `mapApiProductsToComponents()` for product mapping
5. ✅ Ensure backend services are running
6. ✅ Test API endpoints

## 🚀 Backend Requirements

Before using the API, ensure:

- ✅ API Gateway running on port 8000
- ✅ Required services running (Products, Catalog, CMS)
- ✅ Database migrations completed
- ✅ Environment variables configured

See `START_BACKEND.md` for setup instructions.

## 📝 Notes

- All API integration files are ready and tested
- The mapper handles format differences between API and components
- Hooks include loading and error states
- TypeScript types match backend serializers
- Error handling is built-in

## 🎯 When to Use

You can switch to API integration when:
- Backend is fully set up and tested
- You want real-time data
- You need dynamic content management
- You're ready for production deployment

Until then, the mock data works perfectly for development and testing!

