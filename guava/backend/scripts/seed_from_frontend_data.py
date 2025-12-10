#!/usr/bin/env python3
"""
Seed all data from frontend TypeScript files directly.
This script parses TypeScript data files and seeds:
- Categories (from categories.ts)
- Brands (from categories.ts)
- Products (from products.ts)
- Deals (from products.ts - hot deals, featured deals, etc.)

Usage:
    python3 backend/scripts/seed_from_frontend_data.py
    python3 backend/scripts/seed_from_frontend_data.py --clear
    python3 backend/scripts/seed_from_frontend_data.py --dry-run
"""
import sys
import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))
sys.path.insert(0, str(BASE_DIR / 'backend' / 'services' / 'catalog'))
sys.path.insert(0, str(BASE_DIR / 'backend' / 'services' / 'products'))
sys.path.insert(0, str(BASE_DIR / 'backend' / 'services' / 'promotions'))

# Set Django settings for catalog service (categories and brands)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'catalog.settings')

import django
django.setup()

from django.db import transaction
from django.utils.text import slugify
from django.utils import timezone
from datetime import timedelta

# Import models
from commands.models import Category, Brand
from products.commands.models import Product
from promotions.commands.models import Deal


def parse_typescript_file(file_path: Path) -> Dict[str, Any]:
    """Parse TypeScript file and extract data"""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    content = file_path.read_text(encoding='utf-8')
    
    # Extract export const data
    # This is a simple parser - for production, consider using a proper TS parser
    data = {}
    
    # Find all export const declarations
    const_pattern = r'export const (\w+):\s*(\w+)\[\]\s*=\s*\[(.*?)\];'
    matches = re.finditer(const_pattern, content, re.DOTALL)
    
    for match in matches:
        var_name = match.group(1)
        # Try to extract the array content
        array_content = match.group(3)
        # This is simplified - in production, use a proper parser
        # For now, we'll use JSON export approach
    
    return data


def load_json_data() -> Dict[str, Any]:
    """Load data from exported JSON file"""
    json_file = BASE_DIR / 'backend' / 'data' / 'mock-data-export.json'
    
    if not json_file.exists():
        raise FileNotFoundError(
            f"JSON file not found: {json_file}\n"
            "Please run: npx ts-node frontend/scripts/export-mock-data.ts"
        )
    
    with open(json_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def seed_categories(data: Dict[str, Any], dry_run: bool = False) -> Dict[str, int]:
    """Seed categories from data"""
    stats = {'created': 0, 'updated': 0}
    
    catalog_data = data.get('catalog', {})
    shop_categories = catalog_data.get('shopCategories', [])
    popular_categories = catalog_data.get('popularCategories', [])
    
    all_categories = shop_categories + popular_categories
    
    if not all_categories:
        print("⚠️  No categories found in data")
        return stats
    
    print(f"📁 Seeding {len(all_categories)} categories...")
    
    for idx, cat_data in enumerate(all_categories):
        name = cat_data.get('name', '')
        if not name:
            continue
        
        slug = cat_data.get('slug') or slugify(name)
        
        if dry_run:
            print(f"   [DRY RUN] Would create/update: {name} ({slug})")
            stats['created'] += 1
            continue
        
        category, created = Category.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'icon': cat_data.get('icon', ''),
                'image': cat_data.get('image', ''),
                'description': ', '.join(cat_data.get('subCategories', [])) if cat_data.get('subCategories') else '',
                'order': idx,
            }
        )
        
        if created:
            stats['created'] += 1
        else:
            stats['updated'] += 1
    
    return stats


def seed_brands(data: Dict[str, Any], dry_run: bool = False) -> Dict[str, int]:
    """Seed brands from data"""
    stats = {'created': 0, 'updated': 0}
    
    catalog_data = data.get('catalog', {})
    popular_brands = catalog_data.get('popularBrands', [])
    brand_sections = catalog_data.get('brandSections', [])
    
    all_brands = popular_brands + brand_sections
    
    if not all_brands:
        print("⚠️  No brands found in data")
        return stats
    
    print(f"🏷️  Seeding {len(all_brands)} brands...")
    
    for brand_data in all_brands:
        name = brand_data.get('name', '')
        if not name:
            continue
        
        slug = brand_data.get('slug') or slugify(name)
        
        if dry_run:
            print(f"   [DRY RUN] Would create/update: {name} ({slug})")
            stats['created'] += 1
            continue
        
        brand, created = Brand.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'logo': brand_data.get('logo', ''),
                'image': brand_data.get('image', ''),
                'color': brand_data.get('color', ''),
                'discount': brand_data.get('discount', 0),
                'description': brand_data.get('text') or brand_data.get('description', ''),
            }
        )
        
        if created:
            stats['created'] += 1
        else:
            stats['updated'] += 1
    
    return stats


def seed_products(data: Dict[str, Any], dry_run: bool = False) -> Dict[str, int]:
    """Seed products from data"""
    stats = {'created': 0, 'updated': 0, 'skipped': 0}
    
    products_data = data.get('products', {})
    
    if not products_data:
        print("⚠️  No products found in data")
        return stats
    
    # Collect all products from different collections
    all_products = []
    all_products.extend(products_data.get('hotDeals', []))
    all_products.extend(products_data.get('laptopDeals', []))
    all_products.extend(products_data.get('printerDeals', []))
    all_products.extend(products_data.get('accessoriesDeals', []))
    all_products.extend(products_data.get('audioDeals', []))
    
    # Add brand laptops
    brand_laptops = products_data.get('brandLaptops', {})
    for brand_slug, products in brand_laptops.items():
        for product in products:
            product['brand'] = brand_slug
            all_products.append(product)
    
    # Add category products
    category_products = products_data.get('categoryProducts', {})
    for category_slug, products in category_products.items():
        for product in products:
            product['category'] = category_slug
            all_products.append(product)
    
    print(f"📦 Seeding {len(all_products)} products...")
    
    for product_data in all_products:
        name = product_data.get('name', '')
        if not name:
            stats['skipped'] += 1
            continue
        
        slug = slugify(name)
        base_slug = slug
        counter = 1
        while Product.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Map category
        category = product_data.get('category', '')
        category_slug = ''
        if category:
            category_map = {
                'Smartphones': 'smartphones',
                'Printers': 'printers-scanners',
                'Accessories': 'computer-accessories',
                'Audio': 'audio-headphones',
                'Laptops': 'laptops-computers',
            }
            category_slug = category_map.get(category, slugify(category))
        
        # Calculate discount
        original_price = product_data.get('originalPrice', product_data.get('price', 0))
        price = product_data.get('price', 0)
        discount = product_data.get('discount', 0)
        if discount == 0 and original_price > 0 and price < original_price:
            discount = int(((original_price - price) / original_price) * 100)
        
        if dry_run:
            print(f"   [DRY RUN] Would create: {name}")
            stats['created'] += 1
            continue
        
        try:
            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'description': product_data.get('description', ''),
                    'price': price,
                    'original_price': original_price,
                    'discount': discount,
                    'image': product_data.get('image', ''),
                    'images': product_data.get('images', []),
                    'category_slug': category_slug,
                    'brand_slug': product_data.get('brand', ''),
                    'hot': product_data.get('hot', False),
                    'featured': product_data.get('featured', False),
                    'rating': product_data.get('rating', 0),
                    'rating_count': product_data.get('ratingCount', 0),
                    'stock_quantity': product_data.get('stock', 0),
                    'sku': product_data.get('id', ''),
                    'model': product_data.get('model', ''),
                    'extra_attributes': {
                        'processor': product_data.get('processor', ''),
                        'ram': product_data.get('ram', ''),
                        'storage': product_data.get('storage', ''),
                        'screen': product_data.get('screen', ''),
                        'os': product_data.get('os', ''),
                        'generation': product_data.get('generation', ''),
                        'printerType': product_data.get('printerType', ''),
                        'features': product_data.get('features', []),
                    },
                }
            )
            
            if created:
                stats['created'] += 1
            else:
                stats['updated'] += 1
        except Exception as e:
            print(f"❌ Error creating product {name}: {e}")
            stats['skipped'] += 1
    
    return stats


def seed_deals(data: Dict[str, Any], dry_run: bool = False) -> Dict[str, int]:
    """Seed deals from hot deals and featured products"""
    stats = {'created': 0, 'updated': 0}
    
    products_data = data.get('products', {})
    hot_deals = products_data.get('hotDeals', [])
    
    if not hot_deals:
        print("⚠️  No hot deals found in data")
        return stats
    
    print(f"🔥 Seeding {len(hot_deals)} hot deals...")
    
    # First, we need to get product IDs after products are seeded
    # For now, we'll create deals that reference products by slug
    for idx, deal_data in enumerate(hot_deals):
        name = deal_data.get('name', '')
        if not name:
            continue
        
        slug = f"hot-deal-{slugify(name)}"
        
        # Try to find the product
        product_slug = slugify(name)
        try:
            product = Product.objects.get(slug=product_slug)
            product_ids = [str(product.id)]
        except Product.DoesNotExist:
            product_ids = []
        
        if dry_run:
            print(f"   [DRY RUN] Would create deal: {name}")
            stats['created'] += 1
            continue
        
        deal, created = Deal.objects.update_or_create(
            slug=slug,
            defaults={
                'name': f"Hot Deal: {name}",
                'description': f"Special hot deal on {name}",
                'deal_type': 'hot',
                'product_ids': product_ids,
                'category_slug': deal_data.get('category', ''),
                'image': deal_data.get('image', ''),
                'badge_text': 'HOT',
                'badge_color': '#FF0000',
                'discount_percentage': deal_data.get('discount', 0),
                'start_date': timezone.now(),
                'end_date': timezone.now() + timedelta(days=30),
                'order': idx,
            }
        )
        
        if created:
            stats['created'] += 1
        else:
            stats['updated'] += 1
    
    return stats


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Seed all data from frontend TypeScript files')
    parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')
    parser.add_argument('--dry-run', action='store_true', help='Preview what will be created')
    parser.add_argument('--categories-only', action='store_true', help='Seed only categories')
    parser.add_argument('--brands-only', action='store_true', help='Seed only brands')
    parser.add_argument('--products-only', action='store_true', help='Seed only products')
    parser.add_argument('--deals-only', action='store_true', help='Seed only deals')
    args = parser.parse_args()
    
    print("=" * 70)
    print("🌱 SEEDING ALL DATA FROM FRONTEND TYPESCRIPT FILES")
    print("=" * 70)
    
    if args.dry_run:
        print("\n🔍 DRY RUN MODE - No data will be created\n")
    
    # Load data
    try:
        data = load_json_data()
    except FileNotFoundError as e:
        print(f"❌ {e}")
        return
    
    # Clear data if requested
    if args.clear and not args.dry_run:
        print("\n🗑️  Clearing existing data...")
        if not args.products_only and not args.deals_only:
            Category.objects.all().delete()
            Brand.objects.all().delete()
        if not args.categories_only and not args.brands_only and not args.deals_only:
            Product.objects.all().delete()
        if not args.categories_only and not args.brands_only and not args.products_only:
            Deal.objects.all().delete()
        print("✅ Cleared existing data")
    
    total_stats = {
        'categories': {'created': 0, 'updated': 0},
        'brands': {'created': 0, 'updated': 0},
        'products': {'created': 0, 'updated': 0, 'skipped': 0},
        'deals': {'created': 0, 'updated': 0},
    }
    
    try:
        with transaction.atomic():
            # Seed Categories
            if not args.brands_only and not args.products_only and not args.deals_only:
                total_stats['categories'] = seed_categories(data, dry_run=args.dry_run)
            
            # Seed Brands
            if not args.categories_only and not args.products_only and not args.deals_only:
                total_stats['brands'] = seed_brands(data, dry_run=args.dry_run)
            
            # Seed Products
            if not args.categories_only and not args.brands_only and not args.deals_only:
                total_stats['products'] = seed_products(data, dry_run=args.dry_run)
            
            # Seed Deals (must be after products)
            if not args.categories_only and not args.brands_only and not args.products_only:
                total_stats['deals'] = seed_deals(data, dry_run=args.dry_run)
            
            if args.dry_run:
                raise Exception('Dry run - rolling back')
    
    except Exception as e:
        if 'Dry run' in str(e):
            print("\n✅ Dry run completed - no changes made")
        else:
            print(f"\n❌ Error during seeding: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    # Print summary
    print("\n" + "=" * 70)
    print("✅ SEEDING COMPLETE!")
    print("=" * 70)
    print(f"\n📁 Categories: {total_stats['categories']['created']} created, {total_stats['categories']['updated']} updated")
    print(f"🏷️  Brands: {total_stats['brands']['created']} created, {total_stats['brands']['updated']} updated")
    print(f"📦 Products: {total_stats['products']['created']} created, {total_stats['products']['updated']} updated, {total_stats['products']['skipped']} skipped")
    print(f"🔥 Deals: {total_stats['deals']['created']} created, {total_stats['deals']['updated']} updated")
    print("=" * 70)


if __name__ == '__main__':
    main()

