"""
Django management command to seed products from mock data JSON export.

This command reads the exported JSON file and creates Product, ProductSpecification,
and ProductImage records in the database.

Usage:
    python manage.py seed_products
    python manage.py seed_products --file backend/data/mock-data-export.json
    python manage.py seed_products --clear  # Clear existing products first
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

from commands.models import Product, ProductSpecification, ProductImage


class Command(BaseCommand):
    help = 'Seed products from mock data JSON export'

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
            help='Clear existing products before seeding'
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
        
        # Clear existing data if requested
        if options['clear']:
            if options['dry_run']:
                self.stdout.write(self.style.WARNING('🔍 DRY RUN: Would clear existing products'))
            else:
                self.stdout.write('🗑️  Clearing existing products...')
                Product.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('✅ Cleared existing products'))
        
        # Load JSON data
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'❌ Invalid JSON file: {e}'))
            return
        
        products_data = data.get('products', {})
        
        if not products_data:
            self.stdout.write(self.style.ERROR('❌ No products data found in JSON file'))
            return
        
        # Track statistics
        stats = {
            'created': 0,
            'skipped': 0,
            'errors': 0
        }
        
        # Seed each product collection
        if options['dry_run']:
            self.stdout.write(self.style.WARNING('\n🔍 DRY RUN MODE - No data will be created\n'))
        
        try:
            with transaction.atomic():
                stats['hot_deals'] = self.seed_hot_deals(
                    products_data.get('hotDeals', []), 
                    dry_run=options['dry_run']
                )
                stats['laptop_deals'] = self.seed_laptop_deals(
                    products_data.get('laptopDeals', []), 
                    dry_run=options['dry_run']
                )
                stats['printer_deals'] = self.seed_printer_deals(
                    products_data.get('printerDeals', []), 
                    dry_run=options['dry_run']
                )
                stats['accessories_deals'] = self.seed_accessories_deals(
                    products_data.get('accessoriesDeals', []), 
                    dry_run=options['dry_run']
                )
                stats['audio_deals'] = self.seed_audio_deals(
                    products_data.get('audioDeals', []), 
                    dry_run=options['dry_run']
                )
                stats['brand_laptops'] = self.seed_brand_laptops(
                    products_data.get('brandLaptops', {}), 
                    dry_run=options['dry_run']
                )
                
                if options['dry_run']:
                    # Rollback in dry run mode
                    raise Exception('Dry run - rolling back')
                
        except Exception as e:
            if 'Dry run' in str(e):
                self.stdout.write(self.style.WARNING('\n✅ Dry run completed - no changes made'))
            else:
                self.stdout.write(self.style.ERROR(f'\n❌ Error during seeding: {e}'))
                raise
        
        # Print summary
        total_created = sum([
            stats.get('hot_deals', 0),
            stats.get('laptop_deals', 0),
            stats.get('printer_deals', 0),
            stats.get('accessories_deals', 0),
            stats.get('audio_deals', 0),
            stats.get('brand_laptops', 0)
        ])
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully seeded {total_created} products!'))
        self.stdout.write(f'   - Hot Deals: {stats.get("hot_deals", 0)}')
        self.stdout.write(f'   - Laptop Deals: {stats.get("laptop_deals", 0)}')
        self.stdout.write(f'   - Printer Deals: {stats.get("printer_deals", 0)}')
        self.stdout.write(f'   - Accessories Deals: {stats.get("accessories_deals", 0)}')
        self.stdout.write(f'   - Audio Deals: {stats.get("audio_deals", 0)}')
        self.stdout.write(f'   - Brand Laptops: {stats.get("brand_laptops", 0)}')

    def seed_hot_deals(self, products, dry_run=False):
        """Seed hot deals products"""
        count = len(products)
        if count > 0:
            self.stdout.write(f'🔥 Seeding {count} hot deals...')
            created = 0
            for product_data in products:
                if self.create_product(product_data, hot=True, dry_run=dry_run):
                    created += 1
            return created
        return 0

    def seed_laptop_deals(self, products, dry_run=False):
        """Seed laptop deals"""
        count = len(products)
        if count > 0:
            self.stdout.write(f'💻 Seeding {count} laptop deals...')
            created = 0
            for product_data in products:
                if self.create_product(
                    product_data, 
                    category_slug='laptops', 
                    featured=True,
                    dry_run=dry_run
                ):
                    created += 1
            return created
        return 0

    def seed_printer_deals(self, products, dry_run=False):
        """Seed printer deals"""
        count = len(products)
        if count > 0:
            self.stdout.write(f'🖨️  Seeding {count} printer deals...')
            created = 0
            for product_data in products:
                if self.create_product(
                    product_data, 
                    category_slug='printers-scanners',
                    dry_run=dry_run
                ):
                    created += 1
            return created
        return 0

    def seed_accessories_deals(self, products, dry_run=False):
        """Seed accessories deals"""
        count = len(products)
        if count > 0:
            self.stdout.write(f'⌨️  Seeding {count} accessories deals...')
            created = 0
            for product_data in products:
                if self.create_product(
                    product_data, 
                    category_slug='computer-accessories',
                    dry_run=dry_run
                ):
                    created += 1
            return created
        return 0

    def seed_audio_deals(self, products, dry_run=False):
        """Seed audio deals"""
        count = len(products)
        if count > 0:
            self.stdout.write(f'🎧 Seeding {count} audio deals...')
            created = 0
            for product_data in products:
                if self.create_product(
                    product_data, 
                    category_slug='audio-headphones',
                    dry_run=dry_run
                ):
                    created += 1
            return created
        return 0

    def seed_brand_laptops(self, brand_laptops_dict, dry_run=False):
        """Seed brand laptops"""
        total = sum(len(products) for products in brand_laptops_dict.values())
        if total > 0:
            self.stdout.write(f'🏷️  Seeding {total} brand laptops...')
            created = 0
            for brand_slug, products in brand_laptops_dict.items():
                for product_data in products:
                    if self.create_product(
                        product_data, 
                        category_slug='laptops',
                        brand_slug=brand_slug,
                        dry_run=dry_run
                    ):
                        created += 1
            return created
        return 0

    def create_product(self, product_data, **defaults):
        """Create a product from mock data"""
        try:
            # Generate slug from name
            name = product_data.get('name', '')
            if not name:
                self.stdout.write(self.style.WARNING('⚠️  Skipping product with no name'))
                return False
            
            slug = slugify(name)
            
            # Check if product already exists
            if Product.objects.filter(slug=slug).exists():
                if not defaults.get('dry_run'):
                    self.stdout.write(self.style.WARNING(f'⚠️  Product already exists: {name} (skipping)'))
                return False
            
            # Ensure unique slug
            base_slug = slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            # Calculate discount if not provided
            discount = product_data.get('discount', 0)
            original_price = product_data.get('originalPrice', product_data.get('price', 0))
            price = product_data.get('price', 0)
            
            if discount == 0 and original_price > 0 and price < original_price:
                discount = int(((original_price - price) / original_price) * 100)
            
            # Map category name to slug if needed
            category = product_data.get('category', '')
            category_slug = defaults.get('category_slug', '')
            if not category_slug and category:
                # Try to map common category names to slugs
                category_map = {
                    'Smartphones': 'smartphones',
                    'Printers': 'printers-scanners',
                    'Accessories': 'computer-accessories',
                    'Audio': 'audio-headphones',
                    'Laptops': 'laptops',
                }
                category_slug = category_map.get(category, slugify(category))
            
            if defaults.get('dry_run'):
                self.stdout.write(f'   [DRY RUN] Would create: {name}')
                return True
            
            # Create product
            product = Product.objects.create(
                name=name,
                slug=slug,
                description=product_data.get('description', ''),
                price=price,
                original_price=original_price,
                discount=discount,
                image=product_data.get('image', ''),
                images=product_data.get('images', []),
                category_slug=category_slug,
                brand_slug=product_data.get('brand') or defaults.get('brand_slug'),
                hot=product_data.get('hot', defaults.get('hot', False)),
                featured=defaults.get('featured', False),
                rating=product_data.get('rating', 0),
                rating_count=product_data.get('ratingCount', 0),
                stock_quantity=product_data.get('stock', 0),
            )
            
            # Create specifications if any exist
            has_specs = any([
                product_data.get('processor'),
                product_data.get('ram'),
                product_data.get('storage'),
                product_data.get('screen'),
                product_data.get('os'),
                product_data.get('generation'),
                product_data.get('printerType'),
                product_data.get('features')
            ])
            
            if has_specs:
                ProductSpecification.objects.create(
                    product=product,
                    processor=product_data.get('processor', ''),
                    ram=product_data.get('ram', ''),
                    storage=product_data.get('storage', ''),
                    screen=product_data.get('screen', ''),
                    os=product_data.get('os', ''),
                    generation=product_data.get('generation', ''),
                    printer_type=product_data.get('printerType', ''),
                    features=product_data.get('features', [])
                )
            
            # Create product images
            images = product_data.get('images', [])
            for idx, img_url in enumerate(images):
                if img_url:  # Only create if URL is not empty
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_url,
                        alt_text=f"{product.name} - Image {idx + 1}",
                        order=idx
                    )
            
            return True
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error creating product {product_data.get("name", "unknown")}: {e}'))
            return False

