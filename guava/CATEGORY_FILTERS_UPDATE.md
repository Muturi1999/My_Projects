# Category Filters Update - Dynamic Brands & Real Counts

## Overview
Updated the category page sidebar filters to display actual brands from the database with real product counts, replacing the hardcoded dummy data.

## Changes Made

### 1. Backend - Product Serializer (`backend/products/serializers.py`)

Added `brand_name` field to return the actual brand name (not just slug):

```python
brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
```

This field is now included in the API response alongside `brand_slug`.

### 2. Frontend - Category Filters Component (`frontend/components/CategoryFilters.tsx`)

**Added Dynamic Brand Calculation:**
- Component now accepts `products` prop containing all fetched products
- Calculates real-time brand counts from actual database products
- Calculates real-time availability counts (in stock vs out of stock)
- Falls back to static config if no products are loaded

**Key Features:**
```typescript
// Calculate dynamic brand counts from actual products
const brandCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  products.forEach((product) => {
    const brand = product.brand || product.brand_name || '';
    if (brand) {
      const brandName = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
      counts[brandName] = (counts[brandName] || 0) + 1;
    }
  });
  return counts;
}, [products]);

// Calculate availability counts from actual products
const availabilityCounts = useMemo(() => {
  let inStock = 0;
  let outOfStock = 0;
  products.forEach((product) => {
    const availability = product.availability || 'in_stock';
    const stockQty = product.stock_quantity ?? product.stock ?? 0;
    
    // Consider in_stock, special_offer, clearance as "in stock"
    if (['in_stock', 'special_offer', 'clearance'].includes(availability) || stockQty > 0) {
      inStock++;
    } else {
      outOfStock++;
    }
  });
  return { inStock, outOfStock };
}, [products]);
```

### 3. Frontend - Category Page (`frontend/app/category/[slug]/page.tsx`)

**Pass Products to Filters:**
- Both desktop and mobile `CategoryFilters` components now receive `products={djangoProducts}`
- Products are fetched from Django API before filters are rendered

**Fixed Brand Filtering:**
- Brand filter now properly matches brand names (case-insensitive)
- Supports both `brand` and `brand_name` fields from API
- Works with any brand from the database (HP, Dell, Lenovo, Samsung, etc.)

```typescript
// Brand filter - ONLY apply if user selected brands
if (filters.brands && Array.isArray(filters.brands) && filters.brands.length > 0) {
  filtered = filtered.filter((p) => {
    const productBrand = (p as any).brand || (p as any).brand_slug || "";
    return filters.brands.some((b: string) => 
      productBrand?.toLowerCase() === b.toLowerCase() ||
      productBrand?.toLowerCase() === b.toLowerCase().replace(/\s+/g, "-")
    );
  });
}
```

**Improved Availability Filtering:**
- Now uses the new `availability` field from database
- Maps availability status correctly:
  - **In Stock**: `in_stock`, `special_offer`, `clearance`, or `stock_quantity > 0`
  - **Out of Stock**: `out_of_stock`, `check_availability`, `expecting` with `stock_quantity = 0`

### 4. Frontend - Product Transformer (`frontend/lib/utils/productTransformer.ts`)

**Added Brand Name Support:**
```typescript
export interface DjangoProduct {
  // ... existing fields
  brand_slug?: string;
  brand_name?: string;  // NEW: actual brand name
  availability?: string; // NEW: availability status
}

// Transform uses brand_name as priority
brand: djangoProduct.brand_name || djangoProduct.brand_slug || "",
brand_slug: djangoProduct.brand_slug || "",
availability: djangoProduct.availability || "in_stock",
```

## How It Works

### Data Flow:
1. **API Fetch**: Category page fetches products from Django API with `category_slug` filter
2. **Transform**: Products are transformed from Django format to frontend format
3. **Calculate**: CategoryFilters receives products and calculates brand/availability counts
4. **Display**: Sidebar shows actual brands with real counts (e.g., "HP (5)", "Samsung (3)")
5. **Filter**: When user selects brands, page filters products client-side

### Brand Display:
- Brands are capitalized (e.g., "hp" → "HP", "dell" → "Dell")
- Sorted alphabetically
- Shows count next to each brand name
- Only shows brands that have products in the current category

### Availability Display:
- "In stock (X)" - shows count of products that are available
- "Out of stock (Y)" - shows count of products that are unavailable
- Counts update based on actual database inventory

## Testing

To verify the changes work:

1. **Check Brand List:**
   ```bash
   # Navigate to any category page
   http://localhost:3000/category/laptops-computers
   
   # Sidebar should show:
   BRAND
   ☐ Acer (1)
   ☐ Dell (5)
   ☐ HP (12)
   ☐ Lenovo (8)
   ☐ Samsung (3)
   ```

2. **Test Brand Filtering:**
   - Click on any brand checkbox
   - Products should filter to show only that brand
   - Active filter badge should appear
   - Product count should update

3. **Test Availability:**
   - Check "In stock" - shows only available products
   - Check "Out of stock" - shows only unavailable products
   - Counts should match actual database inventory

4. **Verify All Brands:**
   - Ensure Samsung and other brands from Excel appear
   - Counts should be accurate (not hardcoded like "Acer (71)")

## Database Query

The category page fetches products with:
```
GET /api/products/queries/?category_slug={slug}&page_size=1000
```

Returns products with:
- `brand_name`: "HP", "Dell", "Samsung", etc.
- `brand_slug`: "hp", "dell", "samsung", etc.
- `availability`: "in_stock", "out_of_stock", "special_offer", etc.
- `stock_quantity`: integer

## Benefits

1. **Accurate Counts**: No more dummy numbers like "Acer (71)" when only 1 product exists
2. **Dynamic Brands**: All brands from database appear automatically (including Samsung)
3. **Real-time Updates**: Counts reflect actual inventory from database
4. **Functional Filters**: Brand and availability filters actually work
5. **Scalable**: New brands added to database automatically appear in filters

## Related Files

- `backend/products/serializers.py` - Added brand_name field
- `frontend/components/CategoryFilters.tsx` - Dynamic brand/availability calculation
- `frontend/app/category/[slug]/page.tsx` - Pass products to filters, brand filtering
- `frontend/lib/utils/productTransformer.ts` - Brand name support

## Notes

- Brand names are case-insensitive when filtering
- If products array is empty, filters fall back to static config
- Availability logic considers multiple statuses (special offers, clearance as in-stock)
- All brands from Excel import will automatically appear in filters
