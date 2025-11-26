"""
Optimized serializers for promotion queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Discount, Coupon, PromotionalBanner


class DiscountReadSerializer(BaseReadSerializer):
    """Serializer for discounts (read)"""
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Discount
        fields = [
            'id', 'name', 'description', 'discount_type', 'value', 'min_purchase',
            'max_discount', 'category_slug', 'brand_slug', 'product_ids',
            'start_date', 'end_date', 'is_valid', 'created_at'
        ]


class CouponReadSerializer(BaseReadSerializer):
    """Serializer for coupons (read)"""
    is_valid = serializers.BooleanField(read_only=True)
    discount = DiscountReadSerializer(read_only=True)
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount', 'usage_limit', 'usage_count',
            'user_limit', 'is_valid', 'created_at'
        ]


class PromotionalBannerReadSerializer(BaseReadSerializer):
    """Serializer for promotional banners (read)"""
    
    class Meta:
        model = PromotionalBanner
        fields = [
            'id', 'title', 'subtitle', 'description', 'image', 'background_color',
            'cta_label', 'cta_href', 'position', 'order', 'start_date', 'end_date',
            'created_at'
        ]
        read_only = True


