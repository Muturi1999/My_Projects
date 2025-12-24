"""
Serializers for promotions app.
"""
from rest_framework import serializers
from .models import Discount, FlashSale
from products.serializers import ProductListSerializer, ProductVariantSerializer


class DiscountSerializer(serializers.ModelSerializer):
    """Serializer for Discount model."""
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = ('id', 'name', 'code', 'description', 'discount_type', 'discount_value',
                  'percentage', 'valid_from', 'valid_until', 'is_active', 'max_uses',
                  'used_count', 'min_order_value', 'is_valid', 'created_at', 'updated_at')
        read_only_fields = ('id', 'used_count', 'created_at', 'updated_at')
    
    def get_is_valid(self, obj):
        return obj.is_valid()


class FlashSaleSerializer(serializers.ModelSerializer):
    """Serializer for FlashSale model."""
    products = ProductListSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    is_active_now = serializers.SerializerMethodField()
    
    class Meta:
        model = FlashSale
        fields = ('id', 'name', 'description', 'products', 'variants', 'start_time',
                  'end_time', 'discount_percentage', 'max_stock_per_product',
                  'total_stock_limit', 'sold_count', 'is_active', 'is_active_now',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'sold_count', 'created_at', 'updated_at')
    
    def get_is_active_now(self, obj):
        return obj.is_active_now()

