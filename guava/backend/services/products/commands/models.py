"""
Product models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

# Add shared to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class Product(BaseModel):
    """
    Product model with all fields for write operations.
    """
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)  # Percentage
    
    # Images
    image = models.URLField(max_length=500)
    images = models.JSONField(default=list, blank=True)  # Array of image URLs
    
    # Category and Brand
    category_slug = models.CharField(max_length=100, db_index=True)  # Reference to catalog service
    brand_slug = models.CharField(max_length=100, db_index=True, blank=True, null=True)
    
    # Product flags
    hot = models.BooleanField(default=False, db_index=True)
    featured = models.BooleanField(default=False, db_index=True)
    
    # Ratings
    rating = models.IntegerField(default=0)  # 0-5
    rating_count = models.IntegerField(default=0)
    
    # Stock (reference to inventory service)
    stock_quantity = models.IntegerField(default=0, db_index=True)
    
    class Meta:
        db_table = 'products_product'
        indexes = [
            models.Index(fields=['category_slug', 'is_active']),
            models.Index(fields=['brand_slug', 'is_active']),
            models.Index(fields=['hot', 'is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage"""
        if self.original_price > 0:
            return int(((self.original_price - self.price) / self.original_price) * 100)
        return 0


class ProductSpecification(BaseModel):
    """
    Product specifications (laptop, printer, etc.)
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications')
    
    # Laptop specifications
    processor = models.CharField(max_length=255, blank=True)
    ram = models.CharField(max_length=100, blank=True)
    storage = models.CharField(max_length=100, blank=True)
    screen = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    generation = models.CharField(max_length=50, blank=True)
    
    # Printer specifications
    printer_type = models.CharField(max_length=50, blank=True)  # ink-jet, laser, scanner, etc.
    features = models.JSONField(default=list, blank=True)  # Array of features
    
    class Meta:
        db_table = 'products_productspecification'
    
    def __str__(self):
        return f"{self.product.name} - Specifications"


class ProductImage(BaseModel):
    """
    Additional product images.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')
    image_url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'products_productimage'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductRating(BaseModel):
    """
    Product ratings and reviews.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField()  # 1-5
    comment = models.TextField(blank=True)
    user_id = models.UUIDField()  # Reference to user service (future)
    user_name = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'products_productrating'
        unique_together = ['product', 'user_id']
    
    def __str__(self):
        return f"{self.product.name} - {self.rating} stars"


