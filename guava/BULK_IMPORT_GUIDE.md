# Bulk Product Import from Excel

This guide explains how to use the bulk import script to load products from the Excel file into the system.

## Prerequisites

1. Django backend must be running on port 8000
2. Python packages required: `pandas`, `openpyxl`, `requests`

Install dependencies:
```bash
cd backend
source venv/bin/activate
pip install pandas openpyxl requests
```

## Excel File Format

The script expects an Excel file with multiple sheets, each representing a brand or category. Each sheet should have these columns:

- **Part No / Model No** - Manufacturer's part number
- **Product Description** - Full product name/description  
- **Availability** - Stock status (Ex-Stock, Check Availability, etc.)
- **Sale Price** - Product price

## Usage

### Dry Run (Preview Only)

Test the import without creating products:

```bash
cd backend/scripts
python import_excel_products.py "/path/to/excel-file.xlsx" --dry-run
```

This will:
- Parse the Excel file
- Show what would be imported
- Not create any products in the database

### Import with Limit

Import only the first 10 products (useful for testing):

```bash
python import_excel_products.py "/path/to/excel-file.xlsx" --limit 10
```

### Full Import

Import all products from the Excel file:

```bash
python import_excel_products.py "/path/to/excel-file.xlsx"
```

## How It Works

1. **Sheet Processing**: Each sheet in the Excel file is processed separately
2. **Brand/Category Detection**: Sheet names are analyzed to determine:
   - Brand (HP, Lenovo, Dell, etc.)
   - Category (Laptops, Monitors, RAM, etc.)
3. **Data Mapping**: Excel columns are mapped to product fields:
   - Part Number → `part_number_write`
   - Product Description → `name`
   - Availability → `availability_write` (mapped to system codes)
   - Sale Price → `price`
4. **SKU Generation**: Automatic SKU generation: `{BRAND}-{PART_NUMBER}-{TIMESTAMP}`
5. **Stock Estimation**: Stock quantity estimated from availability status
6. **API Creation**: Products are created via POST to `/api/products/queries/`

## Availability Mapping

Excel values are automatically mapped:

| Excel Value | System Code | Stock Qty |
|-------------|-------------|-----------|
| Ex-Stock | in_stock | 10 |
| Check Availability | check_availability | 0 |
| Expecting | expecting | 0 |
| Special Offer | special_offer | 5 |
| Clearance Price | clearance | 3 |
| Out of Stock | out_of_stock | 0 |

## Brand/Category Detection

The script automatically detects brands and categories from sheet names:

**Brands**: HP, Lenovo, Dell, Asus, Samsung, Acer, MSI, Apple, Microsoft

**Categories**: Laptops, Monitors, RAM, Graphics Cards, Accessories, Laptop Bags, Keyboards, Mice, Printers, Scanners, Storage

Example sheet names:
- "HP Consumer Laptops" → Brand: hp, Category: laptops
- "Dell Monitors" → Brand: dell, Category: monitors  
- "RAM" → Brand: unknown, Category: ram-memory
- "Graphics Cards" → Brand: unknown, Category: graphics-cards

## Output Format

The script provides real-time feedback:

```
==============================================================
Importing products from: DN Solutions Ltd - Price list.xlsx
Dry Run: False
==============================================================

Found 20 sheets: HP, Lenovo, Dell, Asus, Monitors, ...

--- Processing sheet: HP ---
Columns: ['Part No / Model No', 'Product Description', 'Availability', 'Sale Price']
Rows: 45
Brand: hp
Category: laptops
✓ Created: HP EliteBook 840 G8 (ID: 123)
✓ Created: HP ProBook 450 G9 (ID: 124)
...
Processed 45 products from HP

==============================================================
Import Summary:
  Total Created: 245
  Total Failed: 3
==============================================================
```

## Error Handling

If a product fails to create, the script will:
- Print the error message
- Continue processing remaining products
- Show a summary at the end

Common errors:
- Missing brand/category in system (create them first)
- Invalid price values (defaults to 0)
- Duplicate SKUs (script generates unique timestamps)

## Pre-Import Checklist

Before running the import:

1. ✅ Ensure Django backend is running
2. ✅ Create all required brands in the system
3. ✅ Create all required categories in the system
4. ✅ Backup database (if importing to production)
5. ✅ Run dry-run first to verify data
6. ✅ Test with `--limit 5` on a few products

## Post-Import Tasks

After importing:

1. Review imported products in admin panel
2. Add product images (currently uses placeholder)
3. Update descriptions where needed
4. Set featured/hot flags for special products
5. Verify pricing and availability
6. Add product specifications and features

## Example Command

Import from the DN Solutions Ltd Excel file with a test limit:

```bash
cd /home/mike/Desktop/My_Projects/guava/backend/scripts

# Dry run to preview
python import_excel_products.py \
  "/home/mike/Downloads/DN Solutions Ltd - Price list for the month of December 2025 Ver 2.0.xlsx" \
  --dry-run

# Import first 20 products
python import_excel_products.py \
  "/home/mike/Downloads/DN Solutions Ltd - Price list for the month of December 2025 Ver 2.0.xlsx" \
  --limit 20

# Full import
python import_excel_products.py \
  "/home/mike/Downloads/DN Solutions Ltd - Price list for the month of December 2025 Ver 2.0.xlsx"
```

## Customization

Edit `import_excel_products.py` to customize:

- **Brand/Category Mapping**: Update `brand_map` and `category_map` dictionaries
- **Stock Quantities**: Modify `get_stock_quantity()` function
- **SKU Format**: Change `generate_sku()` function
- **Default Values**: Update product_data dictionary in main loop

## Troubleshooting

**Error: "No module named 'pandas'"**
```bash
pip install pandas openpyxl
```

**Error: "Failed to connect to backend"**
- Check if Django server is running: `lsof -ti:8000`
- Verify API_BASE_URL in script matches your setup

**Error: "Brand not found"**
- Create the brand first in admin panel
- Or update script to create brands automatically

**Error: "Category is required"**
- Create categories before importing
- Check category slug matches system slugs

## Advanced Usage

### Import Only Specific Sheets

Modify the script to skip certain sheets:

```python
for sheet_name in xl.sheet_names:
    if sheet_name not in ["HP", "Lenovo", "Dell"]:
        continue
    # ... rest of processing
```

### Custom Price Calculations

Apply markup or discount during import:

```python
# Add 15% markup
price = float(price) * 1.15

# Apply discount for clearance items
if availability == "clearance":
    original_price = price
    price = price * 0.80  # 20% off
```

### Batch Processing

Split large imports into batches:

```bash
# Import 50 at a time
python import_excel_products.py file.xlsx --limit 50
python import_excel_products.py file.xlsx --limit 100
python import_excel_products.py file.xlsx --limit 150
# etc.
```

## Support

For issues or questions:
1. Check the script output for error messages
2. Review PRODUCT_STRUCTURE_UPDATE.md for API details
3. Check Django logs: `tail -f backend/logs/django.log`
4. Test API manually: `curl http://localhost:8000/api/products/queries/`
