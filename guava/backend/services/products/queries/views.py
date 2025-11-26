"""
Views for product queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from shared.common.viewsets import BaseQueryViewSet
from shared.common.pagination import StandardResultsSetPagination
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer
from .filters import ProductFilter


class ProductQueryViewSet(BaseQueryViewSet):
    """
    ViewSet for product query operations (GET only).
    Optimized for read performance.
    """
    queryset = Product.objects.filter(is_active=True).select_related().prefetch_related('specifications', 'product_images')
    serializer_class = ProductListSerializer
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use detail serializer for retrieve action"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    @action(detail=False, methods=['get'], url_path='hot-deals')
    def hot_deals(self, request):
        """Get hot deals products"""
        products = self.queryset.filter(hot=True, is_active=True).order_by('-created_at')[:4]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Get products by category slug"""
        products = self.filter_queryset(
            self.queryset.filter(category_slug=category_slug)
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-brand/(?P<brand_slug>[^/.]+)')
    def by_brand(self, request, brand_slug=None):
        """Get products by brand slug"""
        products = self.filter_queryset(
            self.queryset.filter(brand_slug=brand_slug)
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """Search products by name or description"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter "q" is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = self.queryset.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
        products = self.filter_queryset(products)
        
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


