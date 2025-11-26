"""
Optimized serializers for order queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Order, OrderItem, Cart, CartItem


class OrderItemReadSerializer(serializers.ModelSerializer):
    """Serializer for order items (read)"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_id', 'product_name', 'product_slug', 'product_image',
            'quantity', 'unit_price', 'total_price'
        ]
        read_only = True


class OrderListSerializer(BaseReadSerializer):
    """Optimized serializer for order list"""
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total', 'customer_name',
            'created_at', 'updated_at'
        ]


class OrderDetailSerializer(BaseReadSerializer):
    """Detailed serializer for single order"""
    items = OrderItemReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_id', 'session_id', 'customer_name',
            'customer_email', 'customer_phone', 'shipping_address', 'shipping_city',
            'shipping_postal_code', 'shipping_country', 'subtotal', 'tax',
            'shipping_cost', 'discount', 'total', 'status', 'payment_method',
            'payment_status', 'items', 'created_at', 'updated_at'
        ]


class CartItemReadSerializer(serializers.ModelSerializer):
    """Serializer for cart items (read)"""
    
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']
        read_only = True


class CartReadSerializer(BaseReadSerializer):
    """Serializer for cart (read)"""
    items = CartItemReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'session_id', 'user_id', 'items', 'created_at', 'updated_at']


