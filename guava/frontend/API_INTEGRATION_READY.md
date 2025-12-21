# Frontend-Only Architecture

## 📁 Current Architecture

The frontend now operates entirely with local data stores. All backend dependencies have been removed.

### 🗄️ Local Data Store (`lib/data/cms/store.ts`)

- **Homepage CMS** - `getHomepageCMS()`, `updateHomepageCMS()`
- **Navigation CMS** - `getNavigationCMS()`, `updateNavigationCMS()`
- **Footer CMS** - `getFooterCMS()`, `updateFooterCMS()`
- **Service Guarantees** - `getServiceGuaranteesCMS()`, `updateServiceGuaranteesCMS()`
- **Taxonomy** - `getTaxonomyCMS()`, `updateTaxonomyCMS()`

### 🎣 React Hooks (`lib/hooks/useCMS.ts`)

All hooks now read from local data stores only:

- **`useHomepage()`** - Reads from local CMS store
- **`useNavigation()`** - Reads from local CMS store
- **`useFooter()`** - Reads from local CMS store
- **`useServiceGuarantees()`** - Reads from local CMS store

### 🛠️ Admin API Routes (`app/api/admin/`)

All admin API routes now operate on local data stores:

- `/api/admin/homepage` - GET/PUT for homepage CMS
- `/api/admin/navigation` - GET/PUT for navigation CMS
- `/api/admin/footer` - GET/PUT for footer CMS
- `/api/admin/service-guarantees` - CRUD operations
- `/api/admin/products` - Product management (reads from static files)
- `/api/admin/catalog/categories` - Category management
- `/api/admin/catalog/brands` - Brand management

### 📝 Data Sources

- **CMS Data**: `lib/data/cms/store.ts` (in-memory state)
- **Products**: `lib/data/products.ts` (static TypeScript files)
- **Categories**: `lib/data/categories.ts` (static TypeScript files)

## 🔄 How It Works

### Reading Data

```typescript
import { useHomepage } from "@/lib/hooks/useCMS";

export function MyComponent() {
  const { homepage, loading, error } = useHomepage();
  // homepage is read from local store
}
```

### Updating Data (Admin)

```typescript
// Admin API route automatically updates local store
await fetch('/api/admin/homepage', {
  method: 'PUT',
  body: JSON.stringify(newHomepageData)
});
```

## 📋 Notes

- All data is stored in-memory (resets on page refresh)
- Products and categories are read from static TypeScript files
- Admin UI updates persist in the current session only
- No backend services required
- No database required
