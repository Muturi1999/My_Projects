"""
Django management command to seed catalog (categories and brands) from mock data.

This command reads the exported JSON file and creates Category and Brand records.

Usage:
    python manage.py seed_catalog
    python manage.py seed_catalog --file backend/data/mock-data-export.json
    python manage.py seed_catalog --clear  # Clear existing catalog first
"""
import json
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

# Add shared to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from commands.models import Category, Brand, CategoryBrand


class Command(BaseCommand):
    help = 'Seed catalog from mock data JSON export'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default=str(BASE_DIR / 'backend' / 'data' / 'mock-data-export.json'),
            help='Path to mock data JSON file'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing catalog before seeding'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be created without actually creating'
        )

    def handle(self, *args, **options):
        file_path = Path(options['file'])
        
        if not file_path.exists():
            self.stdout.write(self.style.ERROR(f'❌ File not found: {file_path}'))
            self.stdout.write(self.style.WARNING('💡 Run: npx ts-node frontend/scripts/export-mock-data.ts'))
            return
        
        if options['clear']:
            if options['dry_run']:
                self.stdout.write(self.style.WARNING('🔍 DRY RUN: Would clear existing catalog'))
            else:
                self.stdout.write('🗑️  Clearing existing catalog...')
                Category.objects.all().delete()
                Brand.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('✅ Cleared existing catalog'))
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'❌ Invalid JSON file: {e}'))
            return
        
        catalog_data = data.get('catalog', {})
        
        if not catalog_data:
            self.stdout.write(self.style.ERROR('❌ No catalog data found in JSON file'))
            return
        
        stats = {
            'categories_created': 0,
            'categories_updated': 0,
            'brands_created': 0,
            'brands_updated': 0
        }
        
        if options['dry_run']:
            self.stdout.write(self.style.WARNING('\n🔍 DRY RUN MODE - No data will be created\n'))
        
        try:
            with transaction.atomic():
                # Seed categories
                shop_cats = self.seed_shop_categories(
                    catalog_data.get('shopCategories', []),
                    dry_run=options['dry_run']
                )
                stats['categories_created'] += shop_cats['created']
                stats['categories_updated'] += shop_cats['updated']
                
                pop_cats = self.seed_popular_categories(
                    catalog_data.get('popularCategories', []),
                    dry_run=options['dry_run']
                )
                stats['categories_created'] += pop_cats['created']
                stats['categories_updated'] += pop_cats['updated']
                
                # Seed brands
                pop_brands = self.seed_popular_brands(
                    catalog_data.get('popularBrands', []),
                    dry_run=options['dry_run']
                )
                stats['brands_created'] += pop_brands['created']
                stats['brands_updated'] += pop_brands['updated']
                
                brand_sections = self.seed_brand_sections(
                    catalog_data.get('brandSections', []),
                    dry_run=options['dry_run']
                )
                stats['brands_created'] += brand_sections['created']
                stats['brands_updated'] += brand_sections['updated']
                
                if options['dry_run']:
                    raise Exception('Dry run - rolling back')
                    
        except Exception as e:
            if 'Dry run' in str(e):
                self.stdout.write(self.style.WARNING('\n✅ Dry run completed - no changes made'))
            else:
                self.stdout.write(self.style.ERROR(f'\n❌ Error during seeding: {e}'))
                raise
        
        # Print summary
        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully seeded catalog!'))
        self.stdout.write(f'   📁 Categories: {stats["categories_created"]} created, {stats["categories_updated"]} updated')
        self.stdout.write(f'   🏷️  Brands: {stats["brands_created"]} created, {stats["brands_updated"]} updated')

    def seed_shop_categories(self, categories, dry_run=False):
        """Seed shop categories"""
        created = 0
        updated = 0
        
        if len(categories) > 0:
            self.stdout.write(f'📁 Seeding {len(categories)} shop categories...')
            
            for idx, cat_data in enumerate(categories):
                slug = cat_data.get('slug') or slugify(cat_data.get('name', ''))
                name = cat_data.get('name', '')
                
                if not name:
                    continue
                
                if dry_run:
                    self.stdout.write(f'   [DRY RUN] Would create/update category: {name} ({slug})')
                    created += 1
                    continue
                
                category, was_created = Category.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'name': name,
                        'icon': cat_data.get('icon', ''),
                        'image': cat_data.get('image', ''),
                        'order': idx
                    }
                )
                
                if was_created:
                    created += 1
                else:
                    # Update existing
                    category.name = name
                    category.icon = cat_data.get('icon', '') or category.icon
                    category.image = cat_data.get('image', '') or category.image
                    category.order = idx
                    category.save()
                    updated += 1
        
        return {'created': created, 'updated': updated}

    def seed_popular_categories(self, categories, dry_run=False):
        """Seed popular categories"""
        created = 0
        updated = 0
        
        if len(categories) > 0:
            self.stdout.write(f'⭐ Seeding {len(categories)} popular categories...')
            
            for cat_data in categories:
                slug = cat_data.get('slug') or slugify(cat_data.get('name', ''))
                name = cat_data.get('name', '')
                
                if not name:
                    continue
                
                # Get subcategories as description
                subcategories = cat_data.get('subCategories', [])
                description = ', '.join(subcategories) if subcategories else ''
                
                if dry_run:
                    self.stdout.write(f'   [DRY RUN] Would create/update category: {name} ({slug})')
                    created += 1
                    continue
                
                category, was_created = Category.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'name': name,
                        'image': cat_data.get('image', ''),
                        'description': description,
                        'order': 0
                    }
                )
                
                if was_created:
                    created += 1
                else:
                    # Update existing
                    category.name = name
                    category.image = cat_data.get('image', '') or category.image
                    category.description = description or category.description
                    category.save()
                    updated += 1
        
        return {'created': created, 'updated': updated}

    def seed_popular_brands(self, brands, dry_run=False):
        """Seed popular brands"""
        created = 0
        updated = 0
        
        if len(brands) > 0:
            self.stdout.write(f'🏷️  Seeding {len(brands)} popular brands...')
            
            for brand_data in brands:
                slug = brand_data.get('slug') or slugify(brand_data.get('name', ''))
                name = brand_data.get('name', '')
                
                if not name:
                    continue
                
                if dry_run:
                    self.stdout.write(f'   [DRY RUN] Would create/update brand: {name} ({slug})')
                    created += 1
                    continue
                
                brand, was_created = Brand.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'name': name,
                        'logo': brand_data.get('logo', ''),
                        'image': brand_data.get('image', ''),
                        'color': brand_data.get('color', ''),
                        'description': brand_data.get('description', '')
                    }
                )
                
                if was_created:
                    created += 1
                else:
                    # Update existing
                    brand.name = name
                    brand.logo = brand_data.get('logo', '') or brand.logo
                    brand.image = brand_data.get('image', '') or brand.image
                    brand.color = brand_data.get('color', '') or brand.color
                    brand.description = brand_data.get('description', '') or brand.description
                    brand.save()
                    updated += 1
        
        return {'created': created, 'updated': updated}

    def seed_brand_sections(self, brand_sections, dry_run=False):
        """Seed brand sections (extended brand data)"""
        created = 0
        updated = 0
        
        if len(brand_sections) > 0:
            self.stdout.write(f'🎨 Seeding {len(brand_sections)} brand sections...')
            
            for brand_data in brand_sections:
                slug = brand_data.get('slug') or slugify(brand_data.get('name', ''))
                name = brand_data.get('name', '')
                
                if not name:
                    continue
                
                description = brand_data.get('text') or brand_data.get('description', '')
                
                if dry_run:
                    self.stdout.write(f'   [DRY RUN] Would create/update brand: {name} ({slug})')
                    created += 1
                    continue
                
                brand, was_created = Brand.objects.update_or_create(
                    slug=slug,
                    defaults={
                        'name': name,
                        'image': brand_data.get('image', ''),
                        'color': brand_data.get('color', ''),
                        'description': description
                    }
                )
                
                if was_created:
                    created += 1
                else:
                    updated += 1
        
        return {'created': created, 'updated': updated}

