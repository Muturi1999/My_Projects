"""
Management command to sync categories from frontend static data to Django database.
"""
from django.core.management.base import BaseCommand
from products.models import Category

# Frontend categories data (from frontend/lib/data/categories.ts)
FRONTEND_CATEGORIES = [
    {
        "id": "1",
        "name": "Laptops & Computers",
        "slug": "laptops-computers",
        "icon": "laptop",
        "image": "/laptop.png",
    },
    {
        "id": "2",
        "name": "Computer Accessories",
        "slug": "computer-accessories",
        "icon": "keyboard",
        "image": "/Computer Accessories.png",
    },
    {
        "id": "3",
        "name": "Monitors",
        "slug": "monitors",
        "icon": "monitor",
        "image": "/Monitors.png",
    },
    {
        "id": "4",
        "name": "Smartphones",
        "slug": "smartphones",
        "icon": "smartphone",
        "image": "/Smartphones.png",
    },
    {
        "id": "5",
        "name": "Tablets & iPads",
        "slug": "tablets-ipads",
        "icon": "tablet",
        "image": "/Tablets & Ipads.png",
    },
    {
        "id": "6",
        "name": "Printers & Scanners",
        "slug": "printers-scanners",
        "icon": "printer",
        "image": "/Printers & Scanners.png",
    },
    {
        "id": "7",
        "name": "Desktops",
        "slug": "desktops",
        "icon": "desktop",
        "image": "/Desktops.png",
    },
    {
        "id": "8",
        "name": "Audio & Headphones",
        "slug": "audio-headphones",
        "icon": "headphones",
        "image": "/Audio & Headphones.png",
    },
    {
        "id": "9",
        "name": "WiFi & Networking",
        "slug": "wifi-networking",
        "icon": "wifi",
        "image": "/Wifi & Networking.png",
    },
    {
        "id": "10",
        "name": "Software",
        "slug": "software",
        "icon": "software",
        "image": "/Software.png",
    },
    {
        "id": "11",
        "name": "Drives & Storage",
        "slug": "drives-storage",
        "icon": "hard-drive",
        "image": "/Drivers & Storage.png",
    },
    {
        "id": "12",
        "name": "Gaming",
        "slug": "gaming",
        "icon": "gamepad",
        "image": "/Gaming.png",
    },
]


class Command(BaseCommand):
    help = 'Sync categories from frontend static data to Django database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing categories if they already exist',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing categories before syncing',
        )

    def handle(self, *args, **options):
        if options['clear']:
            deleted_count, _ = Category.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing categories')
            )

        created_count = 0
        updated_count = 0
        skipped_count = 0

        for cat_data in FRONTEND_CATEGORIES:
            slug = cat_data['slug']
            name = cat_data['name']
            
            category, created = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'description': f'{name} category',
                    'icon': cat_data.get('icon', ''),
                }
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {name} ({slug})')
                )
            else:
                if options['update']:
                    category.name = name
                    category.description = f'{name} category'
                    if cat_data.get('icon'):
                        category.icon = cat_data['icon']
                    category.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'Updated category: {name} ({slug})')
                    )
                else:
                    skipped_count += 1
                    self.stdout.write(
                        self.style.NOTICE(f'Skipped existing category: {name} ({slug})')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSync complete: {created_count} created, {updated_count} updated, {skipped_count} skipped'
            )
        )

