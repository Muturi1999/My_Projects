"""
Tests for product models.
"""
from django.test import TestCase
from commands.models import Product, ProductSpecification


class ProductModelTest(TestCase):
    """Test Product model"""
    
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
            price=999.99,
            original_price=1299.99,
            image="https://example.com/image.jpg",
            category_slug="laptops"
        )
    
    def test_product_creation(self):
        """Test product can be created"""
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.slug, "test-product")
        self.assertTrue(self.product.is_active)
    
    def test_discount_percentage(self):
        """Test discount percentage calculation"""
        discount = self.product.discount_percentage
        expected = int(((1299.99 - 999.99) / 1299.99) * 100)
        self.assertEqual(discount, expected)
    
    def test_soft_delete(self):
        """Test soft delete functionality"""
        self.product.soft_delete()
        self.assertFalse(self.product.is_active)
        self.assertIsNotNone(Product.objects.get(id=self.product.id))


class ProductSpecificationModelTest(TestCase):
    """Test ProductSpecification model"""
    
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Laptop",
            slug="test-laptop",
            price=999.99,
            original_price=999.99,
            image="https://example.com/image.jpg",
            category_slug="laptops"
        )
        self.spec = ProductSpecification.objects.create(
            product=self.product,
            processor="Intel Core i7",
            ram="16GB",
            storage="512GB SSD"
        )
    
    def test_specification_creation(self):
        """Test specification can be created"""
        self.assertEqual(self.spec.product, self.product)
        self.assertEqual(self.spec.processor, "Intel Core i7")

