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
    
    def _get_similar_products(self, product, limit=4):
        """
        Compute similar products based on category, brand, subcategory/printer type,
        and hot flag as a final fallback.
        """
        candidates = self.queryset.exclude(id=product.id)
        results = []
        seen_ids = {product.id}

        def add_from(qs):
            nonlocal results
            for obj in qs:
                if len(results) >= limit:
                    break
                if obj.id in seen_ids:
                    continue
                seen_ids.add(obj.id)
                results.append(obj)

        # 1) Same category + brand + subcategory/printer_type
        base_filters = {"category_slug": product.category_slug}
        if product.brand_slug:
            base_filters["brand_slug"] = product.brand_slug
        strict_qs = candidates.filter(**base_filters)
        if product.subcategory_slug:
            strict_qs = strict_qs.filter(subcategory_slug=product.subcategory_slug)
        if hasattr(product, "specifications") and product.specifications.exists():
            printer_type = product.specifications.first().printer_type
            if printer_type:
                strict_qs = strict_qs.filter(specifications__printer_type=printer_type)
        add_from(strict_qs.order_by("-rating", "-hot", "-created_at"))

        if len(results) >= limit:
            return results

        # 2) Same category + brand (ignore subcategory)
        if base_filters:
            broader_qs = candidates.filter(**base_filters)
            add_from(broader_qs.order_by("-rating", "-created_at"))

        if len(results) >= limit:
            return results

        # 3) Same category only
        category_qs = candidates.filter(category_slug=product.category_slug)
        add_from(category_qs.order_by("-rating", "-created_at"))

        if len(results) >= limit:
            return results

        # 4) Same brand across categories
        if product.brand_slug:
            brand_qs = candidates.filter(brand_slug=product.brand_slug)
            add_from(brand_qs.order_by("-rating", "-created_at"))

        if len(results) >= limit:
            return results

        # 5) Hot deals / featured as final fallback
        hot_qs = candidates.filter(hot=True)
        add_from(hot_qs.order_by("-rating", "-created_at"))

        return results
    
    @action(detail=False, methods=['get'], url_path='hot-deals')
    def hot_deals(self, request):
        """Get hot deals products"""
        products = self.queryset.filter(hot=True, is_active=True).order_by('-created_at')[:4]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='similar')
    def similar(self, request, id=None):
        """
        Return products that are similar to the given product.
        Uses category, brand, subcategory/printer type and hot flag.
        """
        product = self.get_object()
        limit_param = request.query_params.get("limit")
        try:
            limit = int(limit_param) if limit_param else 4
        except ValueError:
            limit = 4
        
        similar_products = self._get_similar_products(product, limit=limit)
        serializer = ProductListSerializer(similar_products, many=True)
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


