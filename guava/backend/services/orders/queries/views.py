"""
Views for order queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from shared.common.pagination import StandardResultsSetPagination
from .models import Order, Cart, Wishlist
from .serializers import OrderListSerializer, OrderDetailSerializer, CartReadSerializer, WishlistReadSerializer


class OrderQueryViewSet(BaseQueryViewSet):
    """ViewSet for order query operations (GET only)"""
    queryset = Order.objects.filter(is_active=True).prefetch_related('items')
    serializer_class = OrderListSerializer
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination
    
    def get_serializer_class(self):
        """Use detail serializer for retrieve action"""
        if self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderListSerializer
    
    @action(detail=False, methods=['get'], url_path='by-session/(?P<session_id>[^/.]+)')
    def by_session(self, request, session_id=None):
        """Get orders by session ID"""
        orders = self.queryset.filter(session_id=session_id)
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class CartQueryViewSet(BaseQueryViewSet):
    """ViewSet for cart query operations (GET only)"""
    queryset = Cart.objects.all().prefetch_related('items')
    serializer_class = CartReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='by-session/(?P<session_id>[^/.]+)')
    def by_session(self, request, session_id=None):
        """Get cart by session ID"""
        cart = self.queryset.filter(session_id=session_id).first()
        if not cart:
            return Response({'error': 'Cart not found'}, status=404)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)


class WishlistQueryViewSet(BaseQueryViewSet):
    """ViewSet for wishlist query operations (GET only)"""
    queryset = Wishlist.objects.filter(is_active=True)
    serializer_class = WishlistReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='by-session/(?P<session_id>[^/.]+)')
    def by_session(self, request, session_id=None):
        """Get wishlist items by session ID"""
        wishlist_items = self.queryset.filter(session_id=session_id)
        serializer = self.get_serializer(wishlist_items, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='product-ids/(?P<session_id>[^/.]+)')
    def product_ids(self, request, session_id=None):
        """Get list of product IDs in wishlist for a session"""
        product_ids = list(
            self.queryset.filter(session_id=session_id, is_active=True)
            .values_list('product_id', flat=True)
        )
        return Response({'product_ids': product_ids})


