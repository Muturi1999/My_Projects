# Mock Data to Database Migration Guide

## 🎯 Overview

This guide explains how to migrate all your mock data to the database while **keeping your frontend exactly as it is**. The migration is **fully reversible** - you can clear and re-seed anytime.

## ✅ What This Does

1. **Exports** all TypeScript mock data to JSON
2. **Seeds** the database with all products, categories, brands, and CMS data
3. **Preserves** all data structure and relationships
4. **Keeps frontend unchanged** - no modifications to components
5. **Enables CRUD** operations through API

## 📋 Prerequisites

- Backend services set up and running
- Database migrations completed
- TypeScript/Node.js available for export script

## 🚀 Step-by-Step Migration

### Step 1: Export Mock Data to JSON

```bash
cd frontend
npx ts-node scripts/export-mock-data.ts
```

**Output:** `backend/data/mock-data-export.json`

This creates a JSON file with all your mock data:
- Products (hotDeals, laptopDeals, printerDeals, etc.)
- Catalog (categories, brands)
- CMS (homepage, navigation, footer)

### Step 2: Seed Catalog (Categories & Brands)

**Important:** Seed catalog first, as products reference categories and brands.

```bash
cd backend/services/catalog
python manage.py seed_catalog
```

**Options:**
- `--file path/to/file.json` - Custom JSON file path
- `--clear` - Clear existing catalog before seeding
- `--dry-run` - Preview what would be created (no changes)

**Example:**
```bash
python manage.py seed_catalog --clear --dry-run  # Preview
python manage.py seed_catalog --clear             # Actually seed
```

### Step 3: Seed Products

```bash
cd backend/services/products
python manage.py seed_products
```

**Options:**
- `--file path/to/file.json` - Custom JSON file path
- `--clear` - Clear existing products before seeding
- `--dry-run` - Preview what would be created

**Example:**
```bash
python manage.py seed_products --clear --dry-run  # Preview
python manage.py seed_products --clear             # Actually seed
```

This will create:
- All products from hotDeals, laptopDeals, printerDeals, etc.
- Product specifications (processor, RAM, storage, etc.)
- Product images
- Proper category and brand relationships

### Step 4: Seed CMS Data

```bash
cd backend/services/cms
python manage.py seed_cms
```

**Options:**
- `--file path/to/file.json` - Custom JSON file path
- `--clear` - Clear existing CMS data before seeding
- `--dry-run` - Preview what would be created

**Example:**
```bash
python manage.py seed_cms --clear --dry-run  # Preview
python manage.py seed_cms --clear             # Actually seed
```

### Step 5: Verify Data

Check that data was seeded correctly:

```bash
# Check products
cd backend/services/products
python manage.py shell
>>> from commands.models import Product
>>> Product.objects.count()
>>> Product.objects.filter(hot=True).count()

# Check catalog
cd ../catalog
python manage.py shell
>>> from commands.models import Category, Brand
>>> Category.objects.count()
>>> Brand.objects.count()
```

## 🔄 Reversibility

### Clear All Seeded Data

```bash
# Clear products
cd backend/services/products
python manage.py seed_products --clear --dry-run  # Preview
# Then manually delete or use Django admin

# Clear catalog
cd ../catalog
python manage.py seed_catalog --clear --dry-run  # Preview

# Clear CMS
cd ../cms
python manage.py seed_cms --clear --dry-run  # Preview
```

### Re-seed Data

Simply run the seeding commands again:

```bash
python manage.py seed_catalog --clear
python manage.py seed_products --clear
python manage.py seed_cms --clear
```

## 📊 Data Mapping

### Products

| Mock Data Field | Database Field | Notes |
|----------------|----------------|-------|
| `id` | `id` | New UUID generated |
| `name` | `name` | Direct mapping |
| `price` | `price` | Direct mapping |
| `originalPrice` | `original_price` | Direct mapping |
| `discount` | `discount` | Calculated if not provided |
| `rating` | `rating` | Direct mapping |
| `ratingCount` | `rating_count` | Direct mapping |
| `image` | `image` | Direct mapping |
| `images` | `ProductImage` records | Multiple records created |
| `category` | `category_slug` | Mapped to slug |
| `brand` | `brand_slug` | Direct mapping |
| `hot` | `hot` | Direct mapping |
| `stock` | `stock_quantity` | Direct mapping |
| `processor`, `ram`, etc. | `ProductSpecification` | Nested model |

### Categories

| Mock Data Field | Database Field | Notes |
|----------------|----------------|-------|
| `id` | `id` | New UUID generated |
| `name` | `name` | Direct mapping |
| `slug` | `slug` | Generated if not provided |
| `icon` | `icon` | Direct mapping |
| `image` | `image` | Direct mapping |
| `subCategories` | `description` | Stored as comma-separated |

### Brands

| Mock Data Field | Database Field | Notes |
|----------------|----------------|-------|
| `id` | `id` | New UUID generated |
| `name` | `name` | Direct mapping |
| `slug` | `slug` | Generated if not provided |
| `logo` | `logo` | Direct mapping |
| `image` | `image` | Direct mapping |
| `color` | `color` | Direct mapping |
| `text` / `description` | `description` | Direct mapping |

## 🛠️ Troubleshooting

### Error: File not found

**Solution:** Make sure you've run the export script first:
```bash
cd frontend
npx ts-node scripts/export-mock-data.ts
```

### Error: Category/Brand not found

**Solution:** Seed catalog before products:
```bash
# 1. Seed catalog first
cd backend/services/catalog
python manage.py seed_catalog

# 2. Then seed products
cd ../products
python manage.py seed_products
```

### Error: Duplicate slug

**Solution:** The script handles this automatically by appending numbers. If you want to clear and re-seed:
```bash
python manage.py seed_products --clear
```

### Products not appearing in API

**Solution:** 
1. Check that products were created: `Product.objects.count()`
2. Check that query models are synced (CQRS)
3. Restart the service
4. Check API Gateway routing

## 📝 Next Steps After Seeding

### 1. Test API Endpoints

```bash
# List products
curl http://localhost:8000/api/v1/products/queries/

# Get hot deals
curl http://localhost:8000/api/v1/products/queries/hot-deals/

# List categories
curl http://localhost:8000/api/v1/catalog/queries/categories/
```

### 2. Update Frontend (When Ready)

When you're ready to use API data in frontend:

1. Update components to use API hooks (with mock data fallback)
2. Test each component
3. Remove fallback when confident

**Example:**
```typescript
// Before (mock data only)
import { hotDeals } from "@/lib/data/products";

// After (API with fallback)
import { useHotDeals } from "@/lib/hooks";
import { hotDeals } from "@/lib/data/products"; // Fallback
const { products } = useHotDeals();
const data = products.length > 0 ? products : hotDeals;
```

### 3. CRUD Operations

Once data is in database, you can:

**Create:**
```bash
curl -X POST http://localhost:8000/api/v1/products/commands/ \
  -H "Content-Type: application/json" \
  -d '{"name": "New Product", "price": 10000, ...}'
```

**Update:**
```bash
curl -X PUT http://localhost:8000/api/v1/products/commands/{id}/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", ...}'
```

**Delete:**
```bash
curl -X DELETE http://localhost:8000/api/v1/products/commands/{id}/
```

## 🎯 Benefits

✅ **No Frontend Changes** - Components stay exactly as they are  
✅ **Full CRUD** - Edit, delete, update through API  
✅ **Reversible** - Clear and re-seed anytime  
✅ **Section Management** - Update any section independently  
✅ **Data Persistence** - All data in database  
✅ **Scalable** - Easy to add more products/categories  

## 📚 Files Created

- `frontend/scripts/export-mock-data.ts` - Export script
- `backend/services/products/commands/management/commands/seed_products.py` - Products seeder
- `backend/services/catalog/commands/management/commands/seed_catalog.py` - Catalog seeder
- `backend/services/cms/commands/management/commands/seed_cms.py` - CMS seeder
- `backend/data/mock-data-export.json` - Exported data (generated)

## 🔒 Safety

- All commands support `--dry-run` to preview changes
- Use `--clear` carefully (it deletes existing data)
- Data is backed up in JSON file
- Frontend remains unchanged - fully reversible

## 💡 Tips

1. **Always use `--dry-run` first** to see what will happen
2. **Seed in order**: Catalog → Products → CMS
3. **Keep the JSON file** as a backup
4. **Test API endpoints** after seeding
5. **Update frontend gradually** - one component at a time

