"""
Views for catalog queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from .models import Category, Brand
from .serializers import (
    CategoryListSerializer, CategoryDetailSerializer,
    BrandListSerializer, BrandDetailSerializer
)


class CategoryQueryViewSet(BaseQueryViewSet):
    """ViewSet for category query operations (GET only)"""
    queryset = Category.objects.filter(is_active=True).prefetch_related('subcategories', 'brands__brand')
    serializer_class = CategoryListSerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Use detail serializer for retrieve action"""
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategoryListSerializer
    
    def get_queryset(self):
        """Filter to show only top-level categories in list view"""
        if self.action == 'list':
            return self.queryset.filter(parent=None)
        return self.queryset
    
    @action(detail=True, methods=['get'], url_path='subcategories')
    def subcategories(self, request, id=None):
        """Get subcategories of a category"""
        category = self.get_object()
        subcategories = category.subcategories.filter(is_active=True)
        serializer = CategoryListSerializer(subcategories, many=True)
        return Response(serializer.data)


class BrandQueryViewSet(BaseQueryViewSet):
    """ViewSet for brand query operations (GET only)"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandListSerializer
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Use detail serializer for retrieve action"""
        if self.action == 'retrieve':
            return BrandDetailSerializer
        return BrandListSerializer


