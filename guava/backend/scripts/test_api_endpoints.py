#!/usr/bin/env python3
"""
Test script to verify API endpoints are working.

Usage:
    python3 backend/scripts/test_api_endpoints.py
    python3 backend/scripts/test_api_endpoints.py --api-url http://localhost:8000/api/v1
"""

import argparse
import requests
from urllib.parse import urljoin

def test_endpoint(base_url: str, endpoint: str, method: str = 'GET', data: dict = None):
    """Test a single API endpoint"""
    url = urljoin(base_url.rstrip('/') + '/', endpoint)
    
    try:
        if method == 'GET':
            response = requests.get(url, timeout=5)
        elif method == 'POST':
            response = requests.post(url, json=data, timeout=5)
        else:
            return False, f"Unsupported method: {method}"
        
        if response.status_code in [200, 201]:
            try:
                result = response.json()
                count = len(result) if isinstance(result, list) else 1
                return True, f"✅ {endpoint} - {response.status_code} ({count} items)"
            except:
                return True, f"✅ {endpoint} - {response.status_code}"
        else:
            return False, f"❌ {endpoint} - {response.status_code}: {response.text[:100]}"
    
    except requests.exceptions.ConnectionError:
        return False, f"❌ {endpoint} - Connection refused (service not running?)"
    except Exception as e:
        return False, f"❌ {endpoint} - Error: {str(e)}"


def main():
    parser = argparse.ArgumentParser(description='Test API endpoints')
    parser.add_argument(
        '--api-url',
        default='http://localhost:8000/api/v1',
        help='API Gateway base URL'
    )
    
    args = parser.parse_args()
    
    print(f"\n🧪 Testing API endpoints at: {args.api_url}\n")
    print("=" * 60)
    
    # Test endpoints
    endpoints = [
        # Products
        ('products/queries/', 'GET'),
        ('products/queries/?limit=5', 'GET'),
        
        # Catalog
        ('catalog/queries/categories/', 'GET'),
        ('catalog/queries/brands/', 'GET'),
        
        # CMS
        ('cms/queries/homepage/', 'GET'),
        ('cms/queries/navigation/', 'GET'),
        ('cms/queries/footer/', 'GET'),
        ('cms/queries/service-guarantees/', 'GET'),
    ]
    
    results = []
    for endpoint, method in endpoints:
        success, message = test_endpoint(args.api_url, endpoint, method)
        results.append((success, message))
        print(message)
    
    print("\n" + "=" * 60)
    
    # Summary
    success_count = sum(1 for success, _ in results if success)
    total_count = len(results)
    
    print(f"\n📊 Summary: {success_count}/{total_count} endpoints working")
    
    if success_count == total_count:
        print("✅ All endpoints are working!")
    elif success_count > 0:
        print("⚠️  Some endpoints are not working - check service status")
    else:
        print("❌ No endpoints are working - make sure services are running")
        print("\n💡 To start services:")
        print("   cd backend && docker-compose up -d")
        print("   OR")
        print("   Start each service manually")


if __name__ == '__main__':
    main()

