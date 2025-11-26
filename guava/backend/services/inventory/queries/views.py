"""
Views for inventory queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from .models import Warehouse, Stock
from .serializers import WarehouseReadSerializer, StockReadSerializer


class WarehouseQueryViewSet(BaseQueryViewSet):
    """ViewSet for warehouse query operations (GET only)"""
    queryset = Warehouse.objects.filter(is_active=True)
    serializer_class = WarehouseReadSerializer
    lookup_field = 'id'


class StockQueryViewSet(BaseQueryViewSet):
    """ViewSet for stock query operations (GET only)"""
    queryset = Stock.objects.filter(is_active=True).select_related('warehouse')
    serializer_class = StockReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'], url_path='by-product/(?P<product_id>[^/.]+)')
    def by_product(self, request, product_id=None):
        """Get stock for a product"""
        stocks = self.queryset.filter(product_id=product_id)
        serializer = self.get_serializer(stocks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock(self, request):
        """Get all low stock items"""
        stocks = [s for s in self.queryset if s.is_low_stock()]
        serializer = self.get_serializer(stocks, many=True)
        return Response(serializer.data)


