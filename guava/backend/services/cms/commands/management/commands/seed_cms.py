"""
Django management command to seed CMS data from mock data JSON export.

This command reads the exported JSON file and creates Homepage, Navigation,
Footer, and ServiceGuarantee records.

Usage:
    python manage.py seed_cms
    python manage.py seed_cms --file backend/data/mock-data-export.json
    python manage.py seed_cms --clear  # Clear existing CMS data first
"""
import json
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction

# Add shared to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from commands.models import Homepage, Navigation, Footer, ServiceGuarantee


class Command(BaseCommand):
    help = 'Seed CMS data from mock data JSON export'

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
            help='Clear existing CMS data before seeding'
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
                self.stdout.write(self.style.WARNING('🔍 DRY RUN: Would clear existing CMS data'))
            else:
                self.stdout.write('🗑️  Clearing existing CMS data...')
                Homepage.objects.all().delete()
                Navigation.objects.all().delete()
                Footer.objects.all().delete()
                ServiceGuarantee.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('✅ Cleared existing CMS data'))
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'❌ Invalid JSON file: {e}'))
            return
        
        cms_data = data.get('cms', {})
        
        if not cms_data:
            self.stdout.write(self.style.WARNING('⚠️  No CMS data found in JSON file (this is okay)'))
        
        stats = {
            'homepage': 0,
            'navigation': 0,
            'footer': 0,
            'service_guarantees': 0
        }
        
        if options['dry_run']:
            self.stdout.write(self.style.WARNING('\n🔍 DRY RUN MODE - No data will be created\n'))
        
        try:
            with transaction.atomic():
                # Seed homepage
                if cms_data.get('homepage'):
                    stats['homepage'] = self.seed_homepage(
                        cms_data['homepage'],
                        dry_run=options['dry_run']
                    )
                
                # Seed navigation
                if cms_data.get('navigation'):
                    stats['navigation'] = self.seed_navigation(
                        cms_data['navigation'],
                        dry_run=options['dry_run']
                    )
                
                # Seed footer
                if cms_data.get('footer'):
                    stats['footer'] = self.seed_footer(
                        cms_data['footer'],
                        dry_run=options['dry_run']
                    )
                
                # Seed service guarantees
                if cms_data.get('serviceGuarantees'):
                    stats['service_guarantees'] = self.seed_service_guarantees(
                        cms_data['serviceGuarantees'],
                        dry_run=options['dry_run']
                    )
                else:
                    # Create default service guarantees if none exist
                    stats['service_guarantees'] = self.seed_default_service_guarantees(
                        dry_run=options['dry_run']
                    )
                
                if options['dry_run']:
                    raise Exception('Dry run - rolling back')
                    
        except Exception as e:
            if 'Dry run' in str(e):
                self.stdout.write(self.style.WARNING('\n✅ Dry run completed - no changes made'))
            else:
                self.stdout.write(self.style.ERROR(f'\n❌ Error during seeding: {e}'))
                raise
        
        # Print summary
        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully seeded CMS data!'))
        if stats['homepage'] > 0:
            self.stdout.write(f'   🏠 Homepage: {stats["homepage"]} created')
        if stats['navigation'] > 0:
            self.stdout.write(f'   🧭 Navigation: {stats["navigation"]} created')
        if stats['footer'] > 0:
            self.stdout.write(f'   📄 Footer: {stats["footer"]} created')
        if stats['service_guarantees'] > 0:
            self.stdout.write(f'   ✅ Service Guarantees: {stats["service_guarantees"]} created')

    def seed_homepage(self, homepage_data, dry_run=False):
        """Seed homepage configuration"""
        if dry_run:
            self.stdout.write('   [DRY RUN] Would create/update homepage')
            return 1
        
        homepage, created = Homepage.objects.get_or_create(
            title='Homepage',
            defaults={
                'description': '',
                'hero_slides': homepage_data.get('heroSlides', []),
                'shop_by_category': homepage_data.get('shopByCategory', {}),
                'featured_deals': homepage_data.get('featuredDeals', {}),
                'hot_deals': homepage_data.get('hotDeals', {}),
                'custom_sections': homepage_data.get('customSections', [])
            }
        )
        
        if not created:
            # Update existing
            homepage.hero_slides = homepage_data.get('heroSlides', homepage.hero_slides)
            homepage.shop_by_category = homepage_data.get('shopByCategory', homepage.shop_by_category)
            homepage.featured_deals = homepage_data.get('featuredDeals', homepage.featured_deals)
            homepage.hot_deals = homepage_data.get('hotDeals', homepage.hot_deals)
            homepage.custom_sections = homepage_data.get('customSections', homepage.custom_sections)
            homepage.save()
        
        self.stdout.write('🏠 Seeded homepage configuration')
        return 1

    def seed_navigation(self, navigation_data, dry_run=False):
        """Seed navigation configuration"""
        if dry_run:
            self.stdout.write('   [DRY RUN] Would create/update navigation')
            return 1
        
        navigation, created = Navigation.objects.get_or_create(
            name='Main Navigation',
            defaults={
                'items': navigation_data.get('items', []),
                'footer_items': navigation_data.get('footerItems', [])
            }
        )
        
        if not created:
            navigation.items = navigation_data.get('items', navigation.items)
            navigation.footer_items = navigation_data.get('footerItems', navigation.footer_items)
            navigation.save()
        
        self.stdout.write('🧭 Seeded navigation configuration')
        return 1

    def seed_footer(self, footer_data, dry_run=False):
        """Seed footer configuration"""
        if dry_run:
            self.stdout.write('   [DRY RUN] Would create/update footer')
            return 1
        
        footer, created = Footer.objects.get_or_create(
            defaults={
                'copyright_text': footer_data.get('copyrightText', ''),
                'social_links': footer_data.get('socialLinks', {}),
                'columns': footer_data.get('columns', []),
                'payment_methods': footer_data.get('paymentMethods', [])
            }
        )
        
        if not created:
            footer.copyright_text = footer_data.get('copyrightText', footer.copyright_text)
            footer.social_links = footer_data.get('socialLinks', footer.social_links)
            footer.columns = footer_data.get('columns', footer.columns)
            footer.payment_methods = footer_data.get('paymentMethods', footer.payment_methods)
            footer.save()
        
        self.stdout.write('📄 Seeded footer configuration')
        return 1

    def seed_service_guarantees(self, guarantees_data, dry_run=False):
        """Seed service guarantees from data"""
        if isinstance(guarantees_data, list):
            guarantees_list = guarantees_data
        else:
            guarantees_list = guarantees_data.get('items', [])
        
        if len(guarantees_list) == 0:
            return self.seed_default_service_guarantees(dry_run)
        
        if dry_run:
            self.stdout.write(f'   [DRY RUN] Would create {len(guarantees_list)} service guarantees')
            return len(guarantees_list)
        
        created = 0
        for idx, guarantee_data in enumerate(guarantees_list):
            ServiceGuarantee.objects.get_or_create(
                title=guarantee_data.get('title', ''),
                defaults={
                    'description': guarantee_data.get('description', ''),
                    'icon': guarantee_data.get('icon', ''),
                    'order': idx
                }
            )
            created += 1
        
        self.stdout.write(f'✅ Seeded {created} service guarantees')
        return created

    def seed_default_service_guarantees(self, dry_run=False):
        """Seed default service guarantees if none provided"""
        default_guarantees = [
            {'title': 'FAST DELIVERY', 'description': 'Delivery in 24H', 'icon': 'fast-delivery'},
            {'title': '24 HOURS RETURN', 'description': '100% money-back guarantee', 'icon': '24-hour-return'},
            {'title': 'SECURE PAYMENT', 'description': 'Your money is safe', 'icon': 'secure-payment'},
            {'title': 'SUPPORT 24/7', 'description': 'Live contact/message', 'icon': 'support-24-7'},
        ]
        
        if dry_run:
            self.stdout.write(f'   [DRY RUN] Would create {len(default_guarantees)} default service guarantees')
            return len(default_guarantees)
        
        # Only create if none exist
        if ServiceGuarantee.objects.count() == 0:
            created = 0
            for idx, guarantee_data in enumerate(default_guarantees):
                ServiceGuarantee.objects.create(
                    title=guarantee_data['title'],
                    description=guarantee_data['description'],
                    icon=guarantee_data['icon'],
                    order=idx
                )
                created += 1
            
            self.stdout.write(f'✅ Created {created} default service guarantees')
            return created
        else:
            self.stdout.write('ℹ️  Service guarantees already exist, skipping defaults')
            return 0

