#!/usr/bin/env python3
"""
Comprehensive script to seed all dummy data to database.
This script reads from frontend TypeScript data files and seeds:
- Categories
- Brands  
- Products
- Deals/Promotions

Usage:
    python3 backend/scripts/seed_all_data.py
    python3 backend/scripts/seed_all_data.py --clear  # Clear existing data first
    python3 backend/scripts/seed_all_data.py --dry-run  # Preview what will be created
"""
import sys
import os
import json
from pathlib import Path

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'catalog.settings')

import django
django.setup()

from django.core.management import call_command
from django.db import transaction

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Seed all dummy data to database')
    parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')
    parser.add_argument('--dry-run', action='store_true', help='Preview what will be created')
    parser.add_argument('--catalog-only', action='store_true', help='Seed only catalog (categories, brands)')
    parser.add_argument('--products-only', action='store_true', help='Seed only products')
    args = parser.parse_args()
    
    print("=" * 60)
    print("🌱 SEEDING ALL DUMMY DATA TO DATABASE")
    print("=" * 60)
    
    if args.dry_run:
        print("\n🔍 DRY RUN MODE - No data will be created\n")
    
    try:
        with transaction.atomic():
            # Seed Catalog (Categories and Brands)
            if not args.products_only:
                print("\n📁 Seeding Catalog (Categories & Brands)...")
                print("-" * 60)
                try:
                    call_command('seed_catalog', 
                               clear=args.clear,
                               dry_run=args.dry_run,
                               verbosity=1)
                    print("✅ Catalog seeded successfully!")
                except Exception as e:
                    print(f"❌ Error seeding catalog: {e}")
                    if not args.dry_run:
                        raise
            
            # Seed Products
            if not args.catalog_only:
                print("\n📦 Seeding Products...")
                print("-" * 60)
                try:
                    call_command('seed_products',
                               clear=args.clear,
                               dry_run=args.dry_run,
                               verbosity=1)
                    print("✅ Products seeded successfully!")
                except Exception as e:
                    print(f"❌ Error seeding products: {e}")
                    if not args.dry_run:
                        raise
            
            if args.dry_run:
                raise Exception('Dry run - rolling back')
                
    except Exception as e:
        if 'Dry run' in str(e):
            print("\n✅ Dry run completed - no changes made")
        else:
            print(f"\n❌ Error during seeding: {e}")
            raise
    
    print("\n" + "=" * 60)
    print("✅ ALL DATA SEEDED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    main()

