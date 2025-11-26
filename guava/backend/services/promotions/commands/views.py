"""
Views for promotion commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from .models import Discount, Coupon, PromotionalBanner
from .serializers import DiscountWriteSerializer, CouponWriteSerializer, PromotionalBannerWriteSerializer


class DiscountCommandViewSet(BaseCommandViewSet):
    """ViewSet for discount command operations"""
    queryset = Discount.objects.filter(is_active=True)
    serializer_class = DiscountWriteSerializer
    lookup_field = 'id'


class CouponCommandViewSet(BaseCommandViewSet):
    """ViewSet for coupon command operations"""
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponWriteSerializer
    lookup_field = 'id'


class PromotionalBannerCommandViewSet(BaseCommandViewSet):
    """ViewSet for promotional banner command operations"""
    queryset = PromotionalBanner.objects.filter(is_active=True)
    serializer_class = PromotionalBannerWriteSerializer
    lookup_field = 'id'


