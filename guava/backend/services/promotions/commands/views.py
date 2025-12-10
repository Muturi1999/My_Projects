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
from .models import Discount, Coupon, PromotionalBanner, Deal
from .serializers import DiscountWriteSerializer, CouponWriteSerializer, PromotionalBannerWriteSerializer, DealWriteSerializer


class DiscountCommandViewSet(BaseCommandViewSet):
    """ViewSet for discount command operations"""
    queryset = Discount.objects.filter(is_active=True)
    serializer_class = DiscountWriteSerializer
    lookup_field = 'id'
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete a discount"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CouponCommandViewSet(BaseCommandViewSet):
    """ViewSet for coupon command operations"""
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponWriteSerializer
    lookup_field = 'id'
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete a coupon"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PromotionalBannerCommandViewSet(BaseCommandViewSet):
    """ViewSet for promotional banner command operations"""
    queryset = PromotionalBanner.objects.filter(is_active=True)
    serializer_class = PromotionalBannerWriteSerializer
    lookup_field = 'id'
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete a promotional banner"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DealCommandViewSet(BaseCommandViewSet):
    """ViewSet for deal command operations"""
    queryset = Deal.objects.filter(is_active=True)
    serializer_class = DealWriteSerializer
    lookup_field = 'id'
    
    def create(self, request, *args, **kwargs):
        """Create a new deal"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Validate slug uniqueness
        if Deal.objects.filter(slug=serializer.validated_data['slug']).exists():
            from shared.exceptions.exceptions import ValidationException
            raise ValidationException(f"Deal with slug '{serializer.validated_data['slug']}' already exists")
        
        deal = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update a deal"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Validate slug uniqueness (excluding current instance)
        slug = serializer.validated_data.get('slug', instance.slug)
        if slug != instance.slug and Deal.objects.filter(slug=slug).exists():
            from shared.exceptions.exceptions import ValidationException
            raise ValidationException(f"Deal with slug '{slug}' already exists")
        
        deal = serializer.save()
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete a deal"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


