"""
Order models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class Order(BaseModel):
    """
    Order model.
    """
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    user_id = models.UUIDField(null=True, blank=True)  # Reference to user service (future)
    session_id = models.CharField(max_length=255, db_index=True)  # For guest orders
    
    # Customer information
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)
    
    # Shipping address
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20, blank=True)
    shipping_country = models.CharField(max_length=100, default='Kenya')
    
    # Order totals
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending', db_index=True)
    
    # Payment
    payment_method = models.CharField(max_length=50, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    
    class Meta:
        db_table = 'orders_order'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number}"


class OrderItem(BaseModel):
    """
    Order item model.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.UUIDField()  # Reference to products service
    product_name = models.CharField(max_length=255)
    product_slug = models.SlugField(max_length=255)
    product_image = models.URLField(max_length=500, blank=True)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'orders_orderitem'
    
    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


class Cart(BaseModel):
    """
    Shopping cart model (session-based, pre-auth).
    """
    session_id = models.CharField(max_length=255, unique=True, db_index=True)
    user_id = models.UUIDField(null=True, blank=True)  # If user is logged in
    
    class Meta:
        db_table = 'orders_cart'
    
    def __str__(self):
        return f"Cart {self.session_id}"


class CartItem(BaseModel):
    """
    Cart item model.
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_id = models.UUIDField()  # Reference to products service
    quantity = models.IntegerField(default=1)
    
    class Meta:
        db_table = 'orders_cartitem'
        unique_together = ['cart', 'product_id']
    
    def __str__(self):
        return f"CartItem {self.product_id} x{self.quantity}"


