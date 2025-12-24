"""
Django management command to sync brands from frontend data to database.
"""
from django.core.management.base import BaseCommand
from products.models import Brand, Product
from django.utils.text import slugify


# Brands from frontend/lib/data/categories.ts
FRONTEND_BRANDS = [
    {"name": "EPSON", "slug": "epson", "color": "#00a6e0", "image": "https://cdn.simpleicons.org/epson/00a6e0"},
    {"name": "SAMSUNG", "slug": "samsung", "color": "#1428a0", "image": "https://cdn.simpleicons.org/samsung/1428a0"},
    {"name": "LG", "slug": "lg", "color": "#a50034", "image": "https://cdn.simpleicons.org/lg/a50034"},
    {"name": "Canon", "slug": "canon", "color": "#bc002d", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Canon_logo.svg/512px-Canon_logo.svg.png"},
    {"name": "tp-link", "slug": "tp-link", "color": "#4a90e2", "image": "https://cdn.simpleicons.org/tplink/4a90e2"},
    {"name": "SEAGATE", "slug": "seagate", "color": "#0066cc", "image": "https://cdn.simpleicons.org/seagate/0066cc"},
    {"name": "HP", "slug": "hp", "color": "#0096d6", "image": "https://cdn.simpleicons.org/hp/0096d6"},
    {"name": "Dell", "slug": "dell", "color": "#007DB8", "image": "https://cdn.simpleicons.org/dell/007DB8"},
    {"name": "Lenovo", "slug": "lenovo", "color": "#E2231A", "image": "https://cdn.simpleicons.org/lenovo/E2231A"},
    {"name": "Apple", "slug": "apple", "color": "#000000", "image": "https://cdn.simpleicons.org/apple/000000"},
    {"name": "Acer", "slug": "acer", "color": "#83B81A", "image": "https://cdn.simpleicons.org/acer/83B81A"},
    {"name": "ASUS", "slug": "asus", "color": "#000000", "image": "https://cdn.simpleicons.org/asus/000000"},
    {"name": "Microsoft", "slug": "microsoft", "color": "#00A4EF", "image": "https://cdn.simpleicons.org/microsoft/00A4EF"},
    {"name": "Logitech", "slug": "logitech", "color": "#00B8FC", "image": "https://upload.wikimedia.org/wikipedia/commons/6/69/Logitech_logo.svg"},
    {"name": "Sony", "slug": "sony", "color": "#000000", "image": "https://cdn.simpleicons.org/sony/000000"},
    {"name": "Intel", "slug": "intel", "color": "#0071C5", "image": "https://cdn.simpleicons.org/intel/0071C5"},
    {"name": "AMD", "slug": "amd", "color": "#ED1C24", "image": "https://cdn.simpleicons.org/amd/ED1C24"},
    {"name": "NVIDIA", "slug": "nvidia", "color": "#76B900", "image": "https://cdn.simpleicons.org/nvidia/76B900"},
    {"name": "Corsair", "slug": "corsair", "color": "#000000", "image": "https://cdn.simpleicons.org/corsair/000000"},
    {"name": "Razer", "slug": "razer", "color": "#00FF00", "image": "https://cdn.simpleicons.org/razer/00FF00"},
]


class Command(BaseCommand):
    help = 'Sync brands from frontend data and assign brands to existing products'

    def handle(self, *args, **options):
        self.stdout.write('Syncing brands...')
        
        # Create or update brands
        created_count = 0
        updated_count = 0
        for brand_data in FRONTEND_BRANDS:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={
                    'name': brand_data['name'],
                    'color': brand_data['color'],
                    'image': None,  # Brand model uses ImageField, not image_url
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created brand: {brand.name}'))
            else:
                # Update existing brand
                brand.name = brand_data['name']
                brand.color = brand_data['color']
                # Note: image is an ImageField, so we can't set it from URL directly
                brand.save()
                updated_count += 1
                self.stdout.write(f'Updated brand: {brand.name}')
        
        self.stdout.write(self.style.SUCCESS(f'\nCreated {created_count} brands, updated {updated_count} brands'))
        
        # Assign brands to existing products based on product name
        self.stdout.write('\nAssigning brands to existing products...')
        assigned_count = 0
        
        # Get all products without brands
        products_without_brands = Product.objects.filter(brand__isnull=True)
        
        for product in products_without_brands:
            product_name_lower = product.name.lower()
            
            # Try to match brand by name in product
            brand_assigned = None
            for brand_data in FRONTEND_BRANDS:
                brand_name_lower = brand_data['name'].lower()
                if brand_name_lower in product_name_lower:
                    try:
                        brand_assigned = Brand.objects.get(slug=brand_data['slug'])
                        product.brand = brand_assigned
                        product.save()
                        assigned_count += 1
                        self.stdout.write(f'Assigned {brand_assigned.name} to product: {product.name}')
                        break
                    except Brand.DoesNotExist:
                        continue
            
            if not brand_assigned:
                self.stdout.write(self.style.WARNING(f'Could not assign brand to product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nAssigned brands to {assigned_count} products'))
        self.stdout.write(self.style.SUCCESS('\nBrand sync completed!'))

