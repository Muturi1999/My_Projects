"""
Serializers for promotion commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Discount, Coupon, PromotionalBanner


class DiscountWriteSerializer(BaseWriteSerializer):
    """Serializer for discounts"""
    
    class Meta:
        model = Discount
        fields = [
            'id', 'name', 'description', 'discount_type', 'value', 'min_purchase',
            'max_discount', 'category_slug', 'brand_slug', 'product_ids',
            'start_date', 'end_date', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CouponWriteSerializer(BaseWriteSerializer):
    """Serializer for coupons"""
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount', 'usage_limit', 'usage_count',
            'user_limit', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class PromotionalBannerWriteSerializer(BaseWriteSerializer):
    """Serializer for promotional banners"""
    
    class Meta:
        model = PromotionalBanner
        fields = [
            'id', 'title', 'subtitle', 'description', 'image', 'background_color',
            'cta_label', 'cta_href', 'position', 'order', 'start_date', 'end_date',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


