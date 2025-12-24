#!/usr/bin/env python3
"""
Bulk import products from Excel file to Django backend.

Usage:
    python import_excel_products.py <excel_file_path>

Example:
    python import_excel_products.py "DN Solutions Ltd - Price list for the month of December 2025 Ver 2.0.xlsx"
"""

import os
import sys
import json
import requests
import pandas as pd
from datetime import datetime
from pathlib import Path

# Add parent directory to path for Django imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# API Configuration
API_BASE_URL = "http://localhost:8000/api"
PRODUCTS_ENDPOINT = f"{API_BASE_URL}/products/queries/"


def generate_sku(brand_code, part_number):
    """Generate a unique SKU based on brand and part number."""
    timestamp = datetime.now().strftime("%y%m%d%H%M%S")
    clean_part = (part_number or "").replace(" ", "").upper()[:10]
    return f"{brand_code}-{clean_part}-{timestamp}"


def slugify(text):
    """Convert text to slug format."""
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


def map_availability(excel_value):
    """Map Excel availability values to system codes."""
    mapping = {
        "ex-stock": "in_stock",
        "ex stock": "in_stock",
        "in stock": "in_stock",
        "check availability": "check_availability",
        "check avail": "check_availability",
        "expecting": "expecting",
        "special offer": "special_offer",
        "clearance price": "clearance",
        "clearance": "clearance",
        "out of stock": "out_of_stock",
        "out-of-stock": "out_of_stock",
    }
    if not excel_value or pd.isna(excel_value):
        return "in_stock"
    
    value_lower = str(excel_value).lower().strip()
    return mapping.get(value_lower, "in_stock")


def determine_brand_category(sheet_name):
    """Determine brand and category from sheet name."""
    sheet_lower = sheet_name.lower()
    
    # Brand mapping
    brand_map = {
        "hp": "hp",
        "lenovo": "lenovo",
        "dell": "dell",
        "asus": "asus",
        "samsung": "samsung",
        "acer": "acer",
        "msi": "msi",
        "apple": "apple",
        "microsoft": "microsoft",
    }
    
    # Category mapping
    category_map = {
        "laptop": "laptops",
        "monitor": "monitors",
        "ram": "ram-memory",
        "graphics": "graphics-cards",
        "gpu": "graphics-cards",
        "vga": "graphics-cards",
        "accessories": "accessories",
        "accessory": "accessories",
        "bag": "laptop-bags",
        "keyboard": "keyboards",
        "mouse": "mice",
        "printer": "printers",
        "scanner": "scanners",
        "storage": "storage",
        "ssd": "storage",
        "hdd": "storage",
    }
    
    brand_slug = None
    category_slug = "laptops"  # Default
    
    # Extract brand
    for brand_key, brand_val in brand_map.items():
        if brand_key in sheet_lower:
            brand_slug = brand_val
            break
    
    # Extract category
    for cat_key, cat_val in category_map.items():
        if cat_key in sheet_lower:
            category_slug = cat_val
            break
    
    return brand_slug, category_slug


def get_stock_quantity(availability_code):
    """Estimate stock quantity based on availability status."""
    stock_map = {
        "in_stock": 10,
        "check_availability": 0,
        "expecting": 0,
        "special_offer": 5,
        "clearance": 3,
        "out_of_stock": 0,
    }
    return stock_map.get(availability_code, 0)


def create_product(product_data, dry_run=False):
    """Send product data to API."""
    if dry_run:
        print(f"[DRY RUN] Would create product: {product_data['name']}")
        print(json.dumps(product_data, indent=2))
        return {"status": "dry_run", "data": product_data}
    
    try:
        response = requests.post(
            PRODUCTS_ENDPOINT,
            json=product_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.ok:
            product = response.json()
            print(f"✓ Created: {product_data['name']} (ID: {product.get('id')})")
            return {"status": "success", "data": product}
        else:
            error_detail = response.json() if response.headers.get("content-type") == "application/json" else response.text
            print(f"✗ Failed: {product_data['name']}")
            print(f"  Error: {error_detail}")
            return {"status": "error", "error": error_detail}
    
    except Exception as e:
        print(f"✗ Exception creating {product_data['name']}: {str(e)}")
        return {"status": "exception", "error": str(e)}


def import_from_excel(file_path, dry_run=False, limit=None):
    """Import products from Excel file."""
    print(f"\n{'='*60}")
    print(f"Importing products from: {file_path}")
    print(f"Dry Run: {dry_run}")
    print(f"{'='*60}\n")
    
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        return
    
    try:
        xl = pd.ExcelFile(file_path)
        print(f"Found {len(xl.sheet_names)} sheets: {', '.join(xl.sheet_names)}\n")
        
        total_created = 0
        total_failed = 0
        
        for sheet_name in xl.sheet_names:
            print(f"\n--- Processing sheet: {sheet_name} ---")
            
            df = pd.read_excel(xl, sheet_name=sheet_name)
            print(f"Columns: {list(df.columns)}")
            print(f"Rows: {len(df)}")
            
            # Determine brand and category
            brand_slug, category_slug = determine_brand_category(sheet_name)
            brand_code = (brand_slug or "UNK").upper()[:3]
            
            print(f"Brand: {brand_slug or 'Unknown'}")
            print(f"Category: {category_slug}")
            
            # Column name variations
            part_col = None
            desc_col = None
            avail_col = None
            price_col = None
            
            # Find columns (case-insensitive partial match)
            for col in df.columns:
                col_lower = str(col).lower()
                if "part" in col_lower or "model" in col_lower:
                    part_col = col
                elif "description" in col_lower or "product" in col_lower:
                    desc_col = col
                elif "availability" in col_lower or "avail" in col_lower or "stock" in col_lower:
                    avail_col = col
                elif "price" in col_lower or "sale" in col_lower:
                    price_col = col
            
            if not desc_col:
                print(f"⚠ Skipping sheet {sheet_name}: No description column found")
                continue
            
            # Process rows
            count = 0
            for idx, row in df.iterrows():
                # Skip if limit reached
                if limit and total_created >= limit:
                    print(f"\nReached limit of {limit} products. Stopping.")
                    break
                
                # Extract data
                name = row.get(desc_col)
                part_number = row.get(part_col) if part_col else None
                availability_raw = row.get(avail_col) if avail_col else "Ex-Stock"
                price = row.get(price_col) if price_col else 0
                
                # Skip empty rows
                if pd.isna(name) or str(name).strip() == "":
                    continue
                
                # Clean data
                name = str(name).strip()
                part_number = str(part_number).strip() if part_number and not pd.isna(part_number) else None
                availability = map_availability(availability_raw)
                
                try:
                    price = float(price) if price and not pd.isna(price) else 0
                except (ValueError, TypeError):
                    price = 0
                
                # Generate SKU
                sku = generate_sku(brand_code, part_number)
                stock_qty = get_stock_quantity(availability)
                
                # Build product payload
                product_data = {
                    "name": name,
                    "slug": slugify(name),
                    "description": name,  # Use name as description initially
                    "price": price,
                    "original_price": None,
                    "discount": 0,
                    "sku": sku,
                    "part_number_write": part_number,
                    "availability_write": availability,
                    "category_slug_write": category_slug,
                    "brand_slug_write": brand_slug or "unknown",
                    "stock_quantity_write": stock_qty,
                    "image_url_write": "/images/placeholder.jpg",  # Placeholder
                    "subcategory_slug": sheet_name,  # Use sheet name as subcategory
                    "condition": "new",
                    "tags": [brand_slug, category_slug, sheet_name] if brand_slug else [category_slug, sheet_name],
                    "feature_list": [],
                    "low_stock_threshold": 5,
                }
                
                # Create product
                result = create_product(product_data, dry_run=dry_run)
                
                if result["status"] in ["success", "dry_run"]:
                    total_created += 1
                else:
                    total_failed += 1
                
                count += 1
                
                # Break if limit reached
                if limit and total_created >= limit:
                    break
            
            print(f"Processed {count} products from {sheet_name}")
        
        print(f"\n{'='*60}")
        print(f"Import Summary:")
        print(f"  Total Created: {total_created}")
        print(f"  Total Failed: {total_failed}")
        print(f"{'='*60}\n")
    
    except Exception as e:
        print(f"Error importing from Excel: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Import products from Excel file")
    parser.add_argument("file", help="Path to Excel file")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be done without creating products")
    parser.add_argument("--limit", type=int, help="Limit number of products to import")
    
    args = parser.parse_args()
    
    import_from_excel(args.file, dry_run=args.dry_run, limit=args.limit)
