#!/usr/bin/env python3
"""
Standalone script to seed database via API endpoints.

This script reads the exported mock data JSON and creates records through the API Gateway.
It doesn't require Django management commands - just needs the services to be running.

Usage:
    python3 backend/scripts/seed_via_api.py
    python3 backend/scripts/seed_via_api.py --api-url http://localhost:8000/api/v1
    python3 backend/scripts/seed_via_api.py --clear  # Clear existing data first
"""

import json
import sys
import argparse
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
from urllib.parse import urljoin

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str):
    """Print a header message"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")


def print_success(text: str):
    """Print a success message"""
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")


def print_error(text: str):
    """Print an error message"""
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")


def print_warning(text: str):
    """Print a warning message"""
    print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")


def print_info(text: str):
    """Print an info message"""
    print(f"{Colors.OKCYAN}ℹ️  {text}{Colors.ENDC}")


class APISeeder:
    """Class to handle API-based seeding"""
    
    def __init__(self, api_base_url: str = "http://localhost:8000/api/v1", clear_existing: bool = False):
        self.api_base_url = api_base_url.rstrip('/')
        self.clear_existing = clear_existing
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Track created items for relationships
        self.created_categories: Dict[str, str] = {}  # slug -> id
        self.created_brands: Dict[str, str] = {}  # slug -> id
        self.created_products: List[str] = []
        
        # Statistics
        self.stats = {
            'categories': {'created': 0, 'errors': 0},
            'brands': {'created': 0, 'errors': 0},
            'products': {'created': 0, 'errors': 0},
            'cms': {'created': 0, 'errors': 0}
        }
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Optional[Dict]:
        """Make an API request"""
        url = urljoin(self.api_base_url + '/', endpoint)
        
        try:
            if method == 'GET':
                response = self.session.get(url, timeout=10)
            elif method == 'POST':
                response = self.session.post(url, json=data, timeout=10)
            elif method == 'PUT':
                response = self.session.put(url, json=data, timeout=10)
            elif method == 'DELETE':
                response = self.session.delete(url, timeout=10)
            else:
                return None
            
            if response.status_code in [200, 201]:
                try:
                    return response.json()
                except:
                    return {'status': 'success'}
            else:
                error_msg = f"HTTP {response.status_code}"
                try:
                    error_data = response.json()
                    if 'error' in error_data:
                        error_msg += f": {error_data['error']}"
                    elif 'message' in error_data:
                        error_msg += f": {error_data['message']}"
                except:
                    error_msg += f": {response.text[:100]}"
                return {'error': error_msg}
        
        except requests.exceptions.ConnectionError:
            return {'error': 'Connection refused - is the API Gateway running?'}
        except requests.exceptions.Timeout:
            return {'error': 'Request timeout'}
        except Exception as e:
            return {'error': str(e)}
    
    def _slugify(self, text: str) -> str:
        """Convert text to slug"""
        import re
        text = text.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)
        return text
    
    def seed_catalog(self, catalog_data: Dict[str, Any]) -> bool:
        """Seed catalog (categories and brands)"""
        print_header("Seeding Catalog (Categories & Brands)")
        
        # Seed categories
        if 'shopCategories' in catalog_data:
            print_info("Creating categories...")
            for cat in catalog_data['shopCategories']:
                category_data = {
                    'name': cat.get('name', ''),
                    'slug': self._slugify(cat.get('name', '')),
                    'description': cat.get('description', ''),
                    'icon': cat.get('icon', ''),
                    'image': cat.get('image', ''),
                    'order': cat.get('order', 0),
                    'is_active': True
                }
                
                result = self._make_request('POST', 'catalog/commands/categories/', category_data)
                if result and 'error' not in result:
                    self.created_categories[category_data['slug']] = result.get('id', '')
                    self.stats['categories']['created'] += 1
                    print_success(f"Created category: {category_data['name']}")
                else:
                    error = result.get('error', 'Unknown error') if result else 'No response'
                    # Check if it's a duplicate (already exists)
                    if 'already exists' in error.lower() or 'unique' in error.lower():
                        print_warning(f"Category already exists: {category_data['name']}")
                        # Try to get existing category
                        get_result = self._make_request('GET', f"catalog/queries/categories/?slug={category_data['slug']}")
                        if get_result and isinstance(get_result, list) and len(get_result) > 0:
                            self.created_categories[category_data['slug']] = get_result[0].get('id', '')
                    else:
                        self.stats['categories']['errors'] += 1
                        print_error(f"Failed to create category {category_data['name']}: {error}")
        
        # Seed brands
        if 'popularBrands' in catalog_data:
            print_info("Creating brands...")
            for brand in catalog_data['popularBrands']:
                brand_data = {
                    'name': brand.get('name', ''),
                    'slug': self._slugify(brand.get('name', '')),
                    'logo': brand.get('logo', ''),
                    'image': brand.get('image', ''),
                    'color': brand.get('color', ''),
                    'description': brand.get('description', ''),
                    'discount': brand.get('discount', 0),
                    'is_active': True
                }
                
                result = self._make_request('POST', 'catalog/commands/brands/', brand_data)
                if result and 'error' not in result:
                    self.created_brands[brand_data['slug']] = result.get('id', '')
                    self.stats['brands']['created'] += 1
                    print_success(f"Created brand: {brand_data['name']}")
                else:
                    error = result.get('error', 'Unknown error') if result else 'No response'
                    if 'already exists' in error.lower() or 'unique' in error.lower():
                        print_warning(f"Brand already exists: {brand_data['name']}")
                        get_result = self._make_request('GET', f"catalog/queries/brands/?slug={brand_data['slug']}")
                        if get_result and isinstance(get_result, list) and len(get_result) > 0:
                            self.created_brands[brand_data['slug']] = get_result[0].get('id', '')
                    else:
                        self.stats['brands']['errors'] += 1
                        print_error(f"Failed to create brand {brand_data['name']}: {error}")
        
        return True
    
    def seed_products(self, products_data: Dict[str, Any]) -> bool:
        """Seed products"""
        print_header("Seeding Products")
        
        # Process all product types
        product_types = [
            ('hotDeals', 'Hot Deals'),
            ('laptopDeals', 'Laptop Deals'),
            ('printerDeals', 'Printer Deals'),
            ('accessoriesDeals', 'Accessories Deals'),
            ('audioDeals', 'Audio Deals'),
            ('brandLaptops', 'Brand Laptops'),
            ('featuredDeals', 'Featured Deals')
        ]
        
        for product_key, product_label in product_types:
            if product_key not in products_data:
                continue
            
            print_info(f"Creating {product_label}...")
            products = products_data[product_key]
            
            for product in products:
                # Map category name to slug
                category_name = product.get('category', '')
                category_slug = self._slugify(category_name) if category_name else ''
                
                # Extract brand from name or category
                brand_slug = None
                product_name = product.get('name', '')
                for brand_name, brand_slug_val in self.created_brands.items():
                    if brand_name.replace('-', ' ').lower() in product_name.lower():
                        brand_slug = brand_slug_val
                        break
                
                # Prepare product data
                product_data = {
                    'name': product_name,
                    'slug': self._slugify(product_name),
                    'description': product.get('description', ''),
                    'price': float(product.get('price', 0)),
                    'original_price': float(product.get('originalPrice', product.get('price', 0))),
                    'discount': product.get('discount', 0),
                    'image': product.get('image', ''),
                    'category_slug': category_slug,
                    'brand_slug': brand_slug,
                    'hot': product.get('hot', False),
                    'featured': product.get('featured', False),
                    'rating': product.get('rating', 0),
                    'rating_count': product.get('ratingCount', 0),
                    'stock_quantity': product.get('stock', 0),
                    'is_active': True
                }
                
                # Add specifications if available
                if 'specifications' in product:
                    product_data['specifications'] = product['specifications']
                
                # Add images if available
                if 'images' in product and product['images']:
                    product_data['images'] = [
                        {
                            'image_url': img,
                            'alt_text': product_name,
                            'order': idx
                        }
                        for idx, img in enumerate(product['images'])
                    ]
                
                result = self._make_request('POST', 'products/commands/', product_data)
                if result and 'error' not in result:
                    self.created_products.append(result.get('id', ''))
                    self.stats['products']['created'] += 1
                    print_success(f"Created product: {product_name}")
                else:
                    error = result.get('error', 'Unknown error') if result else 'No response'
                    self.stats['products']['errors'] += 1
                    print_error(f"Failed to create product {product_name}: {error}")
        
        return True
    
    def seed_cms(self, cms_data: Dict[str, Any]) -> bool:
        """Seed CMS content"""
        print_header("Seeding CMS Content")
        
        # Seed homepage
        if 'homepage' in cms_data and cms_data['homepage']:
            print_info("Creating homepage...")
            homepage = cms_data['homepage']
            homepage_data = {
                'title': homepage.get('title', 'Homepage'),
                'description': homepage.get('description', ''),
                'hero_slides': homepage.get('heroSlides', []),
                'shop_by_category': homepage.get('shopByCategory', []),
                'featured_deals': homepage.get('featuredDeals', []),
                'custom_sections': homepage.get('customSections', []),
                'is_active': True
            }
            
            result = self._make_request('POST', 'cms/commands/homepage/', homepage_data)
            if result and 'error' not in result:
                self.stats['cms']['created'] += 1
                print_success("Created homepage")
            else:
                error = result.get('error', 'Unknown error') if result else 'No response'
                self.stats['cms']['errors'] += 1
                print_error(f"Failed to create homepage: {error}")
        
        # Seed navigation
        if 'navigation' in cms_data and cms_data['navigation']:
            print_info("Creating navigation...")
            nav = cms_data['navigation']
            nav_data = {
                'name': nav.get('name', 'Main Navigation'),
                'items': nav.get('items', []),
                'footer_items': nav.get('footerItems', []),
                'is_active': True
            }
            
            result = self._make_request('POST', 'cms/commands/navigation/', nav_data)
            if result and 'error' not in result:
                self.stats['cms']['created'] += 1
                print_success("Created navigation")
            else:
                error = result.get('error', 'Unknown error') if result else 'No response'
                self.stats['cms']['errors'] += 1
                print_error(f"Failed to create navigation: {error}")
        
        # Seed footer
        if 'footer' in cms_data and cms_data['footer']:
            print_info("Creating footer...")
            footer = cms_data['footer']
            footer_data = {
                'copyright_text': footer.get('copyrightText', ''),
                'social_links': footer.get('socialLinks', []),
                'columns': footer.get('columns', []),
                'payment_methods': footer.get('paymentMethods', []),
                'is_active': True
            }
            
            result = self._make_request('POST', 'cms/commands/footer/', footer_data)
            if result and 'error' not in result:
                self.stats['cms']['created'] += 1
                print_success("Created footer")
            else:
                error = result.get('error', 'Unknown error') if result else 'No response'
                self.stats['cms']['errors'] += 1
                print_error(f"Failed to create footer: {error}")
        
        # Seed service guarantees
        if 'serviceGuarantees' in cms_data and cms_data['serviceGuarantees']:
            print_info("Creating service guarantees...")
            guarantees = cms_data['serviceGuarantees']
            if isinstance(guarantees, list):
                for idx, guarantee in enumerate(guarantees):
                    guarantee_data = {
                        'title': guarantee.get('title', ''),
                        'description': guarantee.get('description', ''),
                        'icon': guarantee.get('icon', ''),
                        'order': guarantee.get('order', idx),
                        'is_active': True
                    }
                    
                    result = self._make_request('POST', 'cms/commands/service-guarantees/', guarantee_data)
                    if result and 'error' not in result:
                        self.stats['cms']['created'] += 1
                        print_success(f"Created service guarantee: {guarantee_data['title']}")
                    else:
                        error = result.get('error', 'Unknown error') if result else 'No response'
                        self.stats['cms']['errors'] += 1
                        print_error(f"Failed to create service guarantee {guarantee_data['title']}: {error}")
        
        return True
    
    def print_summary(self):
        """Print seeding summary"""
        print_header("Seeding Summary")
        
        total_created = (
            self.stats['categories']['created'] +
            self.stats['brands']['created'] +
            self.stats['products']['created'] +
            self.stats['cms']['created']
        )
        
        total_errors = (
            self.stats['categories']['errors'] +
            self.stats['brands']['errors'] +
            self.stats['products']['errors'] +
            self.stats['cms']['errors']
        )
        
        print(f"{Colors.BOLD}Categories:{Colors.ENDC}")
        print(f"  Created: {Colors.OKGREEN}{self.stats['categories']['created']}{Colors.ENDC}")
        print(f"  Errors: {Colors.FAIL if self.stats['categories']['errors'] > 0 else Colors.OKGREEN}{self.stats['categories']['errors']}{Colors.ENDC}")
        
        print(f"\n{Colors.BOLD}Brands:{Colors.ENDC}")
        print(f"  Created: {Colors.OKGREEN}{self.stats['brands']['created']}{Colors.ENDC}")
        print(f"  Errors: {Colors.FAIL if self.stats['brands']['errors'] > 0 else Colors.OKGREEN}{self.stats['brands']['errors']}{Colors.ENDC}")
        
        print(f"\n{Colors.BOLD}Products:{Colors.ENDC}")
        print(f"  Created: {Colors.OKGREEN}{self.stats['products']['created']}{Colors.ENDC}")
        print(f"  Errors: {Colors.FAIL if self.stats['products']['errors'] > 0 else Colors.OKGREEN}{self.stats['products']['errors']}{Colors.ENDC}")
        
        print(f"\n{Colors.BOLD}CMS:{Colors.ENDC}")
        print(f"  Created: {Colors.OKGREEN}{self.stats['cms']['created']}{Colors.ENDC}")
        print(f"  Errors: {Colors.FAIL if self.stats['cms']['errors'] > 0 else Colors.OKGREEN}{self.stats['cms']['errors']}{Colors.ENDC}")
        
        print(f"\n{Colors.BOLD}Total:{Colors.ENDC}")
        print(f"  Created: {Colors.OKGREEN}{total_created}{Colors.ENDC}")
        print(f"  Errors: {Colors.FAIL if total_errors > 0 else Colors.OKGREEN}{total_errors}{Colors.ENDC}")


def main():
    parser = argparse.ArgumentParser(description='Seed database via API endpoints')
    parser.add_argument(
        '--api-url',
        default='http://localhost:8000/api/v1',
        help='API Gateway base URL (default: http://localhost:8000/api/v1)'
    )
    parser.add_argument(
        '--data-file',
        default='backend/data/mock-data-export.json',
        help='Path to mock data JSON file (default: backend/data/mock-data-export.json)'
    )
    parser.add_argument(
        '--clear',
        action='store_true',
        help='Clear existing data before seeding (not implemented - use API directly)'
    )
    
    args = parser.parse_args()
    
    # Check if data file exists
    data_file = Path(args.data_file)
    if not data_file.exists():
        print_error(f"Data file not found: {data_file}")
        print_info(f"Please run: cd frontend && npx --yes tsx scripts/export-mock-data.ts")
        sys.exit(1)
    
    # Load data
    print_info(f"Loading data from: {data_file}")
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print_error(f"Failed to load data file: {e}")
        sys.exit(1)
    
    # Test API connection
    print_info(f"Testing API connection to: {args.api_url}")
    seeder = APISeeder(args.api_url, args.clear)
    test_result = seeder._make_request('GET', 'products/queries/')
    if test_result is None or 'error' in (test_result if isinstance(test_result, dict) else {}):
        print_warning("API connection test failed - services may not be running")
        print_info("Make sure the API Gateway and all services are running")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    else:
        print_success("API connection successful!")
    
    # Seed data in order
    try:
        # 1. Catalog first (categories and brands)
        if 'catalog' in data:
            seeder.seed_catalog(data['catalog'])
            time.sleep(0.5)  # Small delay between sections
        
        # 2. Products (depends on catalog)
        if 'products' in data:
            seeder.seed_products(data['products'])
            time.sleep(0.5)
        
        # 3. CMS content
        if 'cms' in data:
            seeder.seed_cms(data['cms'])
        
        # Print summary
        seeder.print_summary()
        
        print_success("\n🎉 Seeding completed!")
        print_info("\nNext steps:")
        print_info("1. Test API endpoints: curl http://localhost:8000/api/v1/products/queries/")
        print_info("2. Update frontend to use API (with mock data fallback)")
        
    except KeyboardInterrupt:
        print_warning("\n\nSeeding interrupted by user")
        seeder.print_summary()
        sys.exit(1)
    except Exception as e:
        print_error(f"\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()
        seeder.print_summary()
        sys.exit(1)


if __name__ == '__main__':
    main()

