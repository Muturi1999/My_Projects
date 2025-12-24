"""
Promotion models: Discount, FlashSale.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from products.models import Product, ProductVariant, Category, Brand


class Discount(models.Model):
    """Discount model - percentage or fixed amount discounts."""
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    
    # Discount type and value
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Percentage discount (0-100)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                     validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Applicable to
    products = models.ManyToManyField(Product, blank=True, related_name='discounts')
    variants = models.ManyToManyField(ProductVariant, blank=True, related_name='discounts')
    categories = models.ManyToManyField(Category, blank=True, related_name='discounts')
    brands = models.ManyToManyField(Brand, blank=True, related_name='discounts')
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    # Usage limits
    max_uses = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    used_count = models.IntegerField(default=0)
    
    # Minimum order value
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                           validators=[MinValueValidator(0)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'valid_from', 'valid_until']),
        ]
    
    def is_valid(self):
        """Check if discount is currently valid."""
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.max_uses and self.used_count >= self.max_uses:
            return False
        return True
    
    def calculate_discount(self, amount):
        """Calculate discount amount for a given price."""
        if not self.is_valid():
            return 0
        
        if self.discount_type == 'percentage':
            if self.percentage:
                return (amount * self.percentage) / 100
            # Fallback to discount_value if percentage not set
            return (amount * self.discount_value) / 100
        else:
            # Fixed amount
            return min(self.discount_value, amount)  # Never exceed the amount
    
    def __str__(self):
        return f"{self.name} ({self.code or 'No Code'})"


class FlashSale(models.Model):
    """Flash sale model - time-limited sales with stock limits."""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # Products on sale
    products = models.ManyToManyField(Product, related_name='flash_sales')
    variants = models.ManyToManyField(ProductVariant, related_name='flash_sales')
    
    # Sale timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    # Discount
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2,
                                              validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Stock limits
    max_stock_per_product = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    total_stock_limit = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    sold_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['is_active', 'start_time', 'end_time']),
        ]
    
    def is_active_now(self):
        """Check if flash sale is currently active."""
        now = timezone.now()
        if not self.is_active:
            return False
        return self.start_time <= now <= self.end_time
    
    def __str__(self):
        return f"{self.name} ({self.start_time} - {self.end_time})"

