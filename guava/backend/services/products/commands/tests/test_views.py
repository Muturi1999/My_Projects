"""
Tests for product command views.
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from commands.models import Product
import json


class ProductCommandViewSetTest(TestCase):
    """Test ProductCommandViewSet"""
    
    def setUp(self):
        self.client = APIClient()
        self.product_data = {
            "name": "Test Product",
            "slug": "test-product",
            "price": 999.99,
            "original_price": 1299.99,
            "image": "https://example.com/image.jpg",
            "category_slug": "laptops"
        }
    
    def test_create_product(self):
        """Test creating a product"""
        response = self.client.post(
            '/api/v1/products/commands/',
            data=json.dumps(self.product_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
    
    def test_create_product_duplicate_slug(self):
        """Test creating product with duplicate slug fails"""
        Product.objects.create(**self.product_data)
        
        response = self.client.post(
            '/api/v1/products/commands/',
            data=json.dumps(self.product_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_product(self):
        """Test updating a product"""
        product = Product.objects.create(**self.product_data)
        
        update_data = {"name": "Updated Product"}
        response = self.client.patch(
            f'/api/v1/products/commands/{product.id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.name, "Updated Product")
    
    def test_delete_product(self):
        """Test soft deleting a product"""
        product = Product.objects.create(**self.product_data)
        
        response = self.client.delete(
            f'/api/v1/products/commands/{product.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        product.refresh_from_db()
        self.assertFalse(product.is_active)

