"""
Promotion models for commands (write side of CQRS).
"""
import sys
from pathlib import Path
from django.utils import timezone

# commands/models.py is in: backend/services/promotions/commands/
# We need to go up 4 levels to get to backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from django.db import models
from shared.common.models import BaseModel


class Discount(BaseModel):
    """
    Discount model.
    """
    DISCOUNT_TYPES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default='percentage')
    value = models.DecimalField(max_digits=10, decimal_places=2)  # Percentage or amount
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Applicability
    category_slug = models.CharField(max_length=100, blank=True)  # Apply to category
    brand_slug = models.CharField(max_length=100, blank=True)  # Apply to brand
    product_ids = models.JSONField(default=list, blank=True)  # Specific products
    
    # Validity
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'promotions_discount'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def is_valid(self):
        """Check if discount is currently valid"""
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date


class Coupon(BaseModel):
    """
    Coupon code model.
    """
    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, related_name='coupons')
    usage_limit = models.IntegerField(null=True, blank=True)  # Total usage limit
    usage_count = models.IntegerField(default=0)
    user_limit = models.IntegerField(default=1)  # Per user limit
    
    class Meta:
        db_table = 'promotions_coupon'
    
    def __str__(self):
        return self.code
    
    def is_valid(self):
        """Check if coupon is valid"""
        if not self.discount.is_valid():
            return False
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        return True


class PromotionalBanner(BaseModel):
    """
    Promotional banner model (for homepage, sections, etc.).
    """
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True)
    background_color = models.CharField(max_length=7, blank=True)  # Hex color
    cta_label = models.CharField(max_length=100, blank=True)
    cta_href = models.URLField(max_length=500, blank=True)
    position = models.CharField(max_length=50, blank=True)  # homepage, section, etc.
    order = models.IntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        db_table = 'promotions_promotionalbanner'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return self.title


class Deal(BaseModel):
    """
    Deal model for hot deals, featured deals, etc.
    """
    DEAL_TYPES = [
        ('hot', 'Hot Deal'),
        ('featured', 'Featured Deal'),
        ('flash', 'Flash Sale'),
        ('seasonal', 'Seasonal Deal'),
    ]
    
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True)
    deal_type = models.CharField(max_length=20, choices=DEAL_TYPES, default='hot', db_index=True)
    
    # Product references (can reference multiple products)
    product_ids = models.JSONField(default=list, blank=True)  # List of product UUIDs
    category_slug = models.CharField(max_length=100, blank=True, db_index=True)
    brand_slug = models.CharField(max_length=100, blank=True, db_index=True)
    
    # Visual
    image = models.URLField(max_length=500, blank=True)
    badge_text = models.CharField(max_length=50, blank=True)  # e.g., "HOT", "NEW", "32% OFF"
    badge_color = models.CharField(max_length=7, blank=True)  # Hex color
    
    # Discount info
    discount_percentage = models.IntegerField(default=0)
    min_discount = models.IntegerField(default=0)
    max_discount = models.IntegerField(default=0)
    
    # Validity
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    order = models.IntegerField(default=0)  # For ordering deals
    
    class Meta:
        db_table = 'promotions_deal'
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['deal_type', 'is_active']),
            models.Index(fields=['category_slug', 'is_active']),
            models.Index(fields=['brand_slug', 'is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    def is_valid(self):
        """Check if deal is currently valid"""
        if not self.is_active:
            return False
        now = timezone.now()
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True


