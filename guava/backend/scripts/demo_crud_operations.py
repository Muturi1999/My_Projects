#!/usr/bin/env python3
"""
Demonstration script for CRUD operations via API.

This script shows how to:
- CREATE: Add new products/categories/brands
- READ: Fetch data from API
- UPDATE: Modify existing records
- DELETE: Remove records

Usage:
    python3 backend/scripts/demo_crud_operations.py
"""

import argparse
import requests
import json
from urllib.parse import urljoin
from typing import Dict, Any, Optional

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")


def print_success(text: str):
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")


def print_error(text: str):
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")


def print_info(text: str):
    print(f"{Colors.OKCYAN}ℹ️  {text}{Colors.ENDC}")


class CRUDDemo:
    """Demonstrate CRUD operations"""
    
    def __init__(self, api_base_url: str = "http://localhost:8000/api/v1"):
        self.api_base_url = api_base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Optional[Dict]:
        """Make API request"""
        url = urljoin(self.api_base_url + '/', endpoint)
        
        try:
            if method == 'GET':
                response = self.session.get(url, timeout=10)
            elif method == 'POST':
                response = self.session.post(url, json=data, timeout=10)
            elif method == 'PUT':
                response = self.session.put(url, json=data, timeout=10)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, timeout=10)
            elif method == 'DELETE':
                response = self.session.delete(url, timeout=10)
            else:
                return None
            
            if response.status_code in [200, 201, 204]:
                try:
                    return response.json() if response.content else {}
                except:
                    return {'status': 'success'}
            else:
                error_data = response.json() if response.content else {}
                return {'error': error_data.get('error', f'HTTP {response.status_code}')}
        
        except requests.exceptions.ConnectionError:
            return {'error': 'Connection refused - services not running'}
        except Exception as e:
            return {'error': str(e)}
    
    def demo_create(self):
        """Demonstrate CREATE operations"""
        print_header("CREATE Operations")
        
        # Create a category
        print_info("Creating a test category...")
        category_data = {
            'name': 'Test Category',
            'slug': 'test-category',
            'description': 'A test category created via API',
            'is_active': True
        }
        result = self._request('POST', 'catalog/commands/categories/', category_data)
        if result and 'error' not in result:
            category_id = result.get('id')
            print_success(f"Created category: {category_data['name']} (ID: {category_id})")
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to create category: {error}")
            return None
        
        # Create a brand
        print_info("Creating a test brand...")
        brand_data = {
            'name': 'Test Brand',
            'slug': 'test-brand',
            'description': 'A test brand created via API',
            'is_active': True
        }
        result = self._request('POST', 'catalog/commands/brands/', brand_data)
        if result and 'error' not in result:
            brand_id = result.get('id')
            print_success(f"Created brand: {brand_data['name']} (ID: {brand_id})")
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to create brand: {error}")
            brand_id = None
        
        # Create a product
        print_info("Creating a test product...")
        product_data = {
            'name': 'Test Product',
            'slug': 'test-product',
            'description': 'A test product created via API',
            'price': 9999.99,
            'original_price': 12999.99,
            'category_slug': 'test-category',
            'brand_slug': 'test-brand' if brand_id else None,
            'stock_quantity': 10,
            'is_active': True
        }
        result = self._request('POST', 'products/commands/', product_data)
        if result and 'error' not in result:
            product_id = result.get('id')
            print_success(f"Created product: {product_data['name']} (ID: {product_id})")
            return {'category_id': category_id, 'brand_id': brand_id, 'product_id': product_id}
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to create product: {error}")
            return {'category_id': category_id, 'brand_id': brand_id, 'product_id': None}
    
    def demo_read(self, product_id: Optional[str] = None):
        """Demonstrate READ operations"""
        print_header("READ Operations")
        
        # Read all products
        print_info("Fetching all products...")
        result = self._request('GET', 'products/queries/')
        if result and 'error' not in result:
            products = result if isinstance(result, list) else result.get('results', [])
            print_success(f"Found {len(products)} products")
            if products:
                print(f"   First product: {products[0].get('name', 'N/A')}")
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to fetch products: {error}")
        
        # Read specific product
        if product_id:
            print_info(f"Fetching product {product_id}...")
            result = self._request('GET', f'products/queries/{product_id}/')
            if result and 'error' not in result:
                print_success(f"Product details: {result.get('name', 'N/A')}")
                print(f"   Price: ${result.get('price', 0)}")
                print(f"   Stock: {result.get('stock_quantity', 0)}")
            else:
                error = result.get('error', 'Unknown error') if result else 'No response'
                print_error(f"Failed to fetch product: {error}")
        
        # Read categories
        print_info("Fetching categories...")
        result = self._request('GET', 'catalog/queries/categories/')
        if result and 'error' not in result:
            categories = result if isinstance(result, list) else result.get('results', [])
            print_success(f"Found {len(categories)} categories")
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to fetch categories: {error}")
    
    def demo_update(self, product_id: Optional[str] = None):
        """Demonstrate UPDATE operations"""
        print_header("UPDATE Operations")
        
        if not product_id:
            print_warning("No product ID provided - skipping update demo")
            return
        
        print_info(f"Updating product {product_id}...")
        update_data = {
            'price': 8999.99,  # Reduced price
            'stock_quantity': 5,  # Reduced stock
            'description': 'Updated description via API'
        }
        
        result = self._request('PATCH', f'products/commands/{product_id}/', update_data)
        if result and 'error' not in result:
            print_success(f"Updated product: {result.get('name', 'N/A')}")
            print(f"   New price: ${result.get('price', 0)}")
            print(f"   New stock: {result.get('stock_quantity', 0)}")
        else:
            error = result.get('error', 'Unknown error') if result else 'No response'
            print_error(f"Failed to update product: {error}")
    
    def demo_delete(self, product_id: Optional[str] = None, category_id: Optional[str] = None):
        """Demonstrate DELETE operations"""
        print_header("DELETE Operations")
        
        # Delete product
        if product_id:
            print_info(f"Deleting product {product_id}...")
            result = self._request('DELETE', f'products/commands/{product_id}/')
            if result is None or 'error' not in result:
                print_success(f"Deleted product {product_id}")
            else:
                error = result.get('error', 'Unknown error')
                print_error(f"Failed to delete product: {error}")
        
        # Delete category
        if category_id:
            print_info(f"Deleting category {category_id}...")
            result = self._request('DELETE', f'catalog/commands/categories/{category_id}/')
            if result is None or 'error' not in result:
                print_success(f"Deleted category {category_id}")
            else:
                error = result.get('error', 'Unknown error')
                print_error(f"Failed to delete category: {error}")
    
    def run_full_demo(self):
        """Run complete CRUD demonstration"""
        print_header("CRUD Operations Demo")
        print_info("This demo will create, read, update, and delete records via API")
        
        # CREATE
        created = self.demo_create()
        if not created or not created.get('product_id'):
            print_error("Failed to create test data - cannot continue demo")
            return
        
        product_id = created.get('product_id')
        category_id = created.get('category_id')
        
        # READ
        self.demo_read(product_id)
        
        # UPDATE
        self.demo_update(product_id)
        
        # DELETE (optional - comment out to keep test data)
        response = input("\nDelete test data? (y/n): ")
        if response.lower() == 'y':
            self.demo_delete(product_id, category_id)
        else:
            print_info("Test data kept - you can delete it manually later")
        
        print_success("\n🎉 CRUD demo completed!")


def main():
    parser = argparse.ArgumentParser(description='Demonstrate CRUD operations via API')
    parser.add_argument(
        '--api-url',
        default='http://localhost:8000/api/v1',
        help='API Gateway base URL'
    )
    parser.add_argument(
        '--operation',
        choices=['create', 'read', 'update', 'delete', 'all'],
        default='all',
        help='Which operation to demonstrate'
    )
    
    args = parser.parse_args()
    
    demo = CRUDDemo(args.api_url)
    
    if args.operation == 'all':
        demo.run_full_demo()
    elif args.operation == 'create':
        demo.demo_create()
    elif args.operation == 'read':
        demo.demo_read()
    elif args.operation == 'update':
        print_error("Update requires a product ID - use 'all' for full demo")
    elif args.operation == 'delete':
        print_error("Delete requires IDs - use 'all' for full demo")


if __name__ == '__main__':
    main()

