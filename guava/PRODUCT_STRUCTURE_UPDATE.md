# Product Structure Update - Excel Integration

## Overview
Updated the entire product management stack to align with the Excel file structure from "DN Solutions Ltd - Price list for the month of December 2025 Ver 2.0.xlsx". The system now supports the 4-column format used in the Excel file.

## Changes Made

### 1. Backend Model Updates (`backend/products/models.py`)

Added three new fields to the `Product` model:

```python
# New fields
availability = models.CharField(
    max_length=30,
    choices=AVAILABILITY_CHOICES,
    default='in_stock',
    db_index=True
)
part_number = models.CharField(max_length=100, blank=True, null=True, db_index=True)
subcategory = models.CharField(max_length=100, blank=True, null=True, db_index=True)
```

**Availability Choices:**
- `in_stock` - Ex-Stock (default)
- `check_availability` - Check Availability
- `expecting` - Expecting
- `special_offer` - Special Offer
- `clearance` - Clearance Price
- `out_of_stock` - Out of Stock

### 2. Backend Serializer Updates (`backend/products/serializers.py`)

Added write fields and updated create/update methods:

```python
# New write fields
part_number_write = serializers.CharField(required=False, allow_blank=True, allow_null=True)
availability_write = serializers.CharField(required=False, allow_blank=True, allow_null=True)
subcategory_slug = serializers.CharField(required=False, allow_blank=True, allow_null=True)
```

The serializer now:
- Accepts `part_number_write`, `availability_write`, and `subcategory_slug` in create/update operations
- Validates availability against the 6 allowed choices
- Stores part_number and subcategory as provided
- Handles null/empty values gracefully

### 3. Frontend Wizard Updates (`frontend/components/admin/products/AddProductWizard.tsx`)

#### ProductFormData Interface:
```typescript
interface ProductFormData {
  // ... existing fields
  part_number: string;
  availability: string;
  subcategory_slug: string;
}
```

#### UI Components Added:

**Details Step (Step 1):**
- Part Number/Model No input field (after Product Name)
- Availability Status dropdown with 6 options

**Categorization Step (Step 4):**
- Sub Category input field (optional, for sub-groupings like "HP Consumer Laptops")

#### Payload Mapping:
```typescript
const payload = {
  // ... existing fields
  part_number_write: formData.part_number || null,
  availability_write: formData.availability || "in_stock",
  subcategory_slug: formData.subcategory_slug || null,
};
```

### 4. API Route Updates (`frontend/app/api/admin/products/route.ts`)

Updated PUT handler to extract and map new fields:

```typescript
const partNumber = data.part_number_write || data.part_number;
const availability = data.availability_write || data.availability;
const subcategory = data.subcategory_slug || data.subcategory;

if (partNumber) {
  djangoPayload.part_number_write = partNumber;
}
if (availability) {
  djangoPayload.availability_write = availability;
}
if (subcategory) {
  djangoPayload.subcategory_slug = subcategory;
}
```

### 5. Database Migration

Created and applied migration:
```bash
cd backend
source venv/bin/activate
python manage.py makemigrations products
python manage.py migrate products
```

Migration adds:
- `availability` column with default 'in_stock'
- `part_number` column (nullable)
- `subcategory` column (nullable)
- Database indexes on all three new fields

## Excel File Structure Mapping

The Excel file has 4 columns that map to our system as follows:

| Excel Column | System Field | Notes |
|--------------|-------------|-------|
| Part No / Model No | `part_number` | Manufacturer's part/model number |
| Product Description | `name` | Product name/title |
| Availability | `availability` | 6 status options |
| Sale Price | `price` | Product price |

Additional fields not in Excel but in our system:
- `brand_slug` - Derived from sheet name (HP, Lenovo, Dell, etc.)
- `category_slug` - Derived from sheet name (Monitors, RAM, Graphics Cards, etc.)
- `subcategory` - Can be extracted from product description or sheet sub-sections
- `sku` - Auto-generated unique identifier
- `stock_quantity` - Set based on availability status

## Using the Updated System

### Creating Products Manually

1. Open Admin Products page
2. Click "Add New Product"
3. Fill in product details:
   - **Product Name**: Full product description
   - **Part Number/Model No**: Manufacturer's model number (e.g., "BY0S6UA")
   - **SKU**: Auto-generated, click "Regenerate" if needed
   - **Availability Status**: Select from dropdown:
     - Ex-Stock (in stock, ready to ship)
     - Check Availability (need to verify stock)
     - Expecting (on order, arriving soon)
     - Special Offer (promotional item)
     - Clearance Price (marked down for clearance)
     - Out of Stock (not available)
4. Set pricing and inventory
5. Upload product images
6. Select category and brand
7. (Optional) Add subcategory for better organization
8. Submit

### Editing Products

All fields including part_number, availability, and subcategory can be edited:

1. Click the edit icon (pencil) on any product
2. Modify fields as needed
3. Click "Update Product"

## Next Steps for Bulk Import

To import products from the Excel file, we need to create a bulk import script:

```python
# Pseudo-code for bulk import script
import pandas as pd

def import_products_from_excel(file_path):
    xl = pd.ExcelFile(file_path)
    
    for sheet_name in xl.sheet_names:
        df = pd.read_excel(xl, sheet_name=sheet_name)
        
        # Determine brand and category from sheet name
        brand_slug = determine_brand(sheet_name)
        category_slug = determine_category(sheet_name)
        
        for _, row in df.iterrows():
            product_data = {
                "name": row["Product Description"],
                "part_number_write": row["Part No / Model No"],
                "availability_write": map_availability(row["Availability"]),
                "price": row["Sale Price"],
                "brand_slug_write": brand_slug,
                "category_slug_write": category_slug,
                "sku": generate_sku(),
                # ... other fields
            }
            
            # POST to /api/admin/products
            create_product(product_data)
```

## Testing Checklist

- [x] Backend model fields added
- [x] Backend serializer updated
- [x] Database migration created and applied
- [x] Frontend form interface updated
- [x] Frontend UI inputs added
- [x] Frontend payload mapping updated
- [x] Backend API route handler updated
- [ ] Manual product creation test
- [ ] Product editing test
- [ ] Availability filtering test
- [ ] Bulk import script creation
- [ ] End-to-end Excel import test

## API Examples

### Create Product with New Fields

```bash
curl -X POST http://localhost:8000/api/products/queries/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HP EliteBook 840 G8",
    "part_number_write": "BY0S6UA",
    "availability_write": "in_stock",
    "price": 60000,
    "category_slug_write": "laptops",
    "brand_slug_write": "hp",
    "subcategory_slug": "hp-elitebook",
    "stock_quantity_write": 10,
    "image_url_write": "/images/hp-elitebook.jpg",
    "sku": "HP-EB840-2024"
  }'
```

### Update Product Availability

```bash
curl -X PUT http://localhost:8000/api/products/queries/hp-elitebook-840-g8/ \
  -H "Content-Type: application/json" \
  -d '{
    "availability_write": "clearance"
  }'
```

### Filter Products by Availability

```bash
# Will need to add to backend queryset
GET /api/products/queries/?availability=in_stock
GET /api/products/queries/?availability=special_offer
```

## Files Modified

1. `backend/products/models.py` - Added availability, part_number, subcategory fields
2. `backend/products/serializers.py` - Added write fields and update logic
3. `frontend/components/admin/products/AddProductWizard.tsx` - Added UI inputs and form data
4. `frontend/app/api/admin/products/route.ts` - Updated PUT handler
5. `backend/products/migrations/0002_product_availability_product_part_number_and_more.py` - Database migration

## Notes

- Default availability is `in_stock` if not specified
- Part numbers are indexed for fast lookup
- Subcategories are optional and can help organize products within main categories
- The availability field displays human-readable labels in UI but stores machine-readable codes in database
- All existing products automatically get `availability='in_stock'` after migration
