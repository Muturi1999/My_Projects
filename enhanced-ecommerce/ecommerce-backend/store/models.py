# ecommerce-backend/store/models.py

from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
# ecommerce-backend/store/models.py (Add to the file)
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db import models
from django.contrib.auth.models import User

# ========================
# CATEGORY MODEL
# ========================
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ========================
# PRODUCT MODEL
# ========================
class Product(models.Model):
    # Core Product Info
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    # Pricing & Stock
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)

    # Descriptions
    short_description = models.TextField(max_length=500, blank=True)
    long_description = models.TextField(blank=True)

    # Features for "Featured Sections"
    is_featured = models.BooleanField(default=False)
    is_best_selling = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    related_products = models.ManyToManyField(
        'self', 
        symmetrical=False, 
        blank=True, 
        related_name='upsells_cross_sells'
    )

    class Meta:
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_price(self):
        return self.discounted_price if self.discounted_price else self.price

    def __str__(self):
        return self.name


# ========================
# PRODUCT IMAGE MODEL
# ========================
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"


# ========================
# SHOPPING CART MODELS
# ========================
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)  # For guest checkout
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username if self.user else self.session_key}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Future: Add variation/attribute selection here (e.g., size='L', color='red')

    @property
    def total_price(self):
        return self.product.get_price() * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"


# ========================
# ORDER MODELS
# ========================
class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending Payment'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
        ('Refunded', 'Refunded'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')

    # Billing/Shipping Address Placeholder
    shipping_address = models.TextField()

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order {self.id} by {self.full_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.quantity * self.price_at_purchase

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Removed Product'}"
class Attribute(models.Model):
    name = models.CharField(max_length=50, unique=True) # e.g., "Color", "Size"
    
    def __str__(self):
        return self.name

class AttributeValue(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=50) # e.g., "Red", "Blue", "XL"
    
    class Meta:
        unique_together = ('attribute', 'value')

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    # A variant can have multiple attributes (e.g., Red + Size L)
    attributes = models.ManyToManyField(AttributeValue) 
    sku = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Override product price
    stock_quantity = models.IntegerField(default=0)
    
    # We can add a unique image field here if variants change the main image.
    
    class Meta:
        unique_together = ('product', 'sku')

    def __str__(self):
        attribute_names = ", ".join([av.value for av in self.attributes.all()])
        return f"{self.product.name} ({attribute_names})"
# ecommerce-backend/store/models.py (Add to the bottom)

from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='review_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False) # Requires moderation

    class Meta:
        # Prevent a user from reviewing the same product more than once (optional constraint)
        unique_together = ('product', 'user') 

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating} stars)"
    

class Payment(models.Model):
    METHOD_CHOICES = (
        ('CARD', 'Bank Card (Stripe)'),
        ('MPESA', 'M-Pesa'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    status = models.CharField(max_length=20, default='PENDING') # PENDING, COMPLETE, FAILED
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} via {self.method}"
    



class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ('SALE', 'Sale (via Order)'),
        ('RETURN', 'Customer Return'),
        ('ADJUST_IN', 'Manual Adjustment In'),
        ('ADJUST_OUT', 'Manual Adjustment Out'),
        ('TRANSFER', 'Stock Transfer'),
    )
    
    product = models.ForeignKey(
        'Product', 
        on_delete=models.CASCADE, 
        related_name='stock_history',
        null=True, blank=True # Null for safety, though it should always be linked
    )
    product_variant = models.ForeignKey(
        'ProductVariant', 
        on_delete=models.SET_NULL, 
        related_name='stock_history',
        null=True, blank=True
    )
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity_change = models.IntegerField() # Negative for stock out, positive for stock in
    current_stock = models.IntegerField() # Snapshot of stock *after* the change
    reason = models.TextField(blank=True, null=True)
    moved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    moved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-moved_at']

    def __str__(self):
        item = self.product_variant if self.product_variant else self.product
        return f"{self.movement_type}: {self.quantity_change} of {item.name if item else 'N/A'}"
    
class Coupon(models.Model):
    DISCOUNT_TYPES = (
        ('PERCENTAGE', 'Percentage Discount'),
        ('FIXED', 'Fixed Amount Discount'),
    )

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES, default='PERCENTAGE')
    value = models.DecimalField(max_digits=5, decimal_places=2, help_text="The discount value (e.g., 10 for 10% or $10)")
    
    # Usage Constraints
    active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    minimum_cart_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_usage_count = models.IntegerField(default=None, null=True, blank=True, help_text="Max total uses across all customers")
    used_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code
    
class Cart(models.Model):
    # ... existing fields ...
    applied_coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Update get_total_price method to include the discount
    def get_total_price(self):
        base_total = sum(item.get_sub_total() for item in self.items.all())
        # Deduct discount only if the applied coupon is still active/valid
        if self.applied_coupon:
             # Recalculate discount just in case prices changed
             discount = calculate_discount(self.applied_coupon, base_total)
             return (base_total - discount).quantize(Decimal('0.01'))
        return base_total.quantize(Decimal('0.01'))
    
# ecommerce-backend/store/models.py (Add to the file)

class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['changed_at']

    def __str__(self):
        return f"Order {self.order.id}: {self.old_status} -> {self.new_status}"