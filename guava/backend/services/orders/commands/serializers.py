"""
Serializers for order commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Order, OrderItem, Cart, CartItem, Wishlist


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_id', 'product_name', 'product_slug', 'product_image',
            'quantity', 'unit_price', 'total_price'
        ]
        read_only_fields = ['id']


class OrderWriteSerializer(BaseWriteSerializer):
    """Serializer for creating and updating orders"""
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_id', 'session_id', 'customer_name',
            'customer_email', 'customer_phone', 'shipping_address', 'shipping_city',
            'shipping_postal_code', 'shipping_country', 'subtotal', 'tax',
            'shipping_cost', 'discount', 'total', 'status', 'payment_method',
            'payment_status', 'items', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create order with items"""
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']
        read_only_fields = ['id']


class CartWriteSerializer(BaseWriteSerializer):
    """Serializer for cart operations"""
    items = CartItemSerializer(many=True, required=False)
    
    class Meta:
        model = Cart
        fields = ['id', 'session_id', 'user_id', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WishlistWriteSerializer(BaseWriteSerializer):
    """Serializer for wishlist operations"""
    
    class Meta:
        model = Wishlist
        fields = ['id', 'session_id', 'user_id', 'product_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


