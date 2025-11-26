"""
Views for promotion queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from .models import Discount, Coupon, PromotionalBanner
from .serializers import (
    DiscountReadSerializer, CouponReadSerializer, PromotionalBannerReadSerializer
)


class DiscountQueryViewSet(BaseQueryViewSet):
    """ViewSet for discount query operations (GET only)"""
    queryset = Discount.objects.filter(is_active=True)
    serializer_class = DiscountReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='active')
    def active(self, request):
        """Get active discounts"""
        discounts = [d for d in self.queryset if d.is_valid()]
        serializer = self.get_serializer(discounts, many=True)
        return Response(serializer.data)


class CouponQueryViewSet(BaseQueryViewSet):
    """ViewSet for coupon query operations (GET only)"""
    queryset = Coupon.objects.filter(is_active=True).select_related('discount')
    serializer_class = CouponReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='by-code/(?P<code>[^/.]+)')
    def by_code(self, request, code=None):
        """Get coupon by code"""
        coupon = self.queryset.filter(code=code.upper()).first()
        if not coupon:
            return Response({'error': 'Coupon not found'}, status=404)
        serializer = self.get_serializer(coupon)
        return Response(serializer.data)


class PromotionalBannerQueryViewSet(BaseQueryViewSet):
    """ViewSet for promotional banner query operations (GET only)"""
    queryset = PromotionalBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = PromotionalBannerReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='by-position/(?P<position>[^/.]+)')
    def by_position(self, request, position=None):
        """Get banners by position"""
        banners = self.queryset.filter(position=position)
        serializer = self.get_serializer(banners, many=True)
        return Response(serializer.data)


