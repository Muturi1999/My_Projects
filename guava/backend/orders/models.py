"""
Order models: Cart, Order, OrderItem, Shipping, Warranty.
"""
from django.db import models
from django.db.models import Sum, F
from django.core.validators import MinValueValidator
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from products.models import Product, ProductVariant
from promotions.models import Discount


class Cart(models.Model):
    """Shopping cart model (for authenticated users)."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Cart for {self.user.email}"
    
    @property
    def total_items(self):
        return self.items.aggregate(total=Sum('quantity'))['total'] or 0
    
    @property
    def subtotal(self):
        total = 0
        for item in self.items.all():
            total += item.line_total
        return total


class CartItem(models.Model):
    """Cart item model."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['cart', 'variant']]
        ordering = ['-created_at']
    
    @property
    def line_total(self):
        return self.variant.effective_price * self.quantity
    
    def __str__(self):
        return f"{self.quantity}x {self.variant.product.name} in {self.cart.user.email}'s cart"


class Order(models.Model):
    """Order model."""
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('card', 'Credit/Debit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash_on_delivery', 'Cash on Delivery'),
    ]
    
    # Order identification
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    
    # User (can be null for guest checkout)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    guest_email = models.EmailField(null=True, blank=True, help_text='Email for guest checkout')
    guest_phone = models.CharField(max_length=20, null=True, blank=True, help_text='Phone for guest checkout')
    
    # Order status
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Payment
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Shipping
    shipping_name = models.CharField(max_length=200)
    shipping_phone = models.CharField(max_length=20)
    shipping_email = models.EmailField()
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20, blank=True, null=True)
    shipping_country = models.CharField(max_length=100, default='Kenya')
    shipping_method = models.CharField(max_length=50, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate unique order number
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            self.order_number = f"ORD-{timestamp}-{self.id or 'NEW'}"
        super().save(*args, **kwargs)
        if not self.order_number or 'NEW' in self.order_number:
            # Update order number with actual ID
            self.order_number = f"ORD-{timezone.now().strftime('%Y%m%d%H%M%S')}-{self.id}"
            super().save(update_fields=['order_number'])
    
    def __str__(self):
        return f"Order {self.order_number} - {self.status}"


class OrderItem(models.Model):
    """Order item model."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    
    # Pricing at time of order
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    line_total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Discount applied
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Order {self.order.order_number}"


class Shipping(models.Model):
    """Shipping tracking model."""
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shipping')
    tracking_number = models.CharField(max_length=100, unique=True, null=True, blank=True)
    carrier = models.CharField(max_length=100, blank=True, null=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Shipping for Order {self.order.order_number}"


class Warranty(models.Model):
    """Warranty model - tracks warranty for each order item."""
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='warranty')
    warranty_period_months = models.IntegerField(default=12, validators=[MinValueValidator(0)])
    starts_at = models.DateTimeField(null=True, blank=True, help_text='Usually order completion date')
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Warranties'
    
    def save(self, *args, **kwargs):
        # Auto-calculate expiry if start date is set
        if self.starts_at and self.warranty_period_months:
            self.expires_at = self.starts_at + timedelta(days=30 * self.warranty_period_months)
        super().save(*args, **kwargs)
    
    @property
    def is_active(self):
        """Check if warranty is still active."""
        if not self.expires_at:
            return False
        return timezone.now() < self.expires_at
    
    @property
    def days_remaining(self):
        """Get days remaining in warranty."""
        if not self.expires_at:
            return 0
        delta = self.expires_at - timezone.now()
        return max(0, delta.days)
    
    def __str__(self):
        return f"Warranty for {self.order_item.product.name} - {self.order_item.order.order_number}"

