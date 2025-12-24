"""
Serializers for orders app.
"""
from rest_framework import serializers
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem, Shipping, Warranty
from products.serializers import ProductVariantSerializer, ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model."""
    variant = ProductVariantSerializer(read_only=True)
    variant_id = serializers.IntegerField(write_only=True)
    line_total = serializers.ReadOnlyField()
    product = ProductListSerializer(source='variant.product', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ('id', 'variant', 'variant_id', 'product', 'quantity', 'line_total', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model."""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'variant', 'price', 'quantity', 'line_total', 'created_at')
        read_only_fields = ('id', 'created_at')


class ShippingSerializer(serializers.ModelSerializer):
    """Serializer for Shipping model."""
    
    class Meta:
        model = Shipping
        fields = ('id', 'tracking_number', 'carrier', 'shipped_at', 'estimated_delivery',
                  'delivered_at', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class WarrantySerializer(serializers.ModelSerializer):
    """Serializer for Warranty model."""
    is_active = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Warranty
        fields = ('id', 'warranty_period_months', 'starts_at', 'expires_at', 'is_active', 'days_remaining',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    items = OrderItemSerializer(many=True, read_only=True)
    shipping = ShippingSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'order_number', 'user', 'guest_email', 'guest_phone', 'status',
                  'subtotal', 'discount_amount', 'shipping_cost', 'tax', 'total',
                  'payment_method', 'payment_status', 'paid_at',
                  'shipping_name', 'shipping_phone', 'shipping_email', 'shipping_address',
                  'shipping_city', 'shipping_postal_code', 'shipping_country', 'shipping_method',
                  'items', 'shipping', 'created_at', 'updated_at', 'completed_at')
        read_only_fields = ('id', 'order_number', 'created_at', 'updated_at', 'completed_at')


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating an order from cart or direct items."""
    # Guest checkout fields
    guest_email = serializers.EmailField(required=False)
    guest_phone = serializers.CharField(required=False, max_length=20)
    
    # Shipping information
    shipping_name = serializers.CharField(max_length=200)
    shipping_phone = serializers.CharField(max_length=20)
    shipping_email = serializers.EmailField()
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    shipping_country = serializers.CharField(max_length=100, default='Kenya')
    shipping_method = serializers.CharField(max_length=50, required=False, allow_blank=True)
    
    # Payment
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES, required=False)
    
    # Shipping cost (can be calculated or provided)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    
    # Discount code
    discount_code = serializers.CharField(required=False, allow_blank=True)
    
    # Direct order items (for buy-now or guest checkout)
    items = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text='List of {variant_id, quantity} for direct orders'
    )
    
    def validate(self, attrs):
        """Validate order creation."""
        user = self.context['request'].user
        if not user.is_authenticated:
            if not attrs.get('guest_email') and not attrs.get('guest_phone'):
                raise serializers.ValidationError('Either user must be authenticated or guest_email/guest_phone must be provided.')
        return attrs

