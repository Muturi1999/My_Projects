"""
Views for inventory commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from shared.messaging.publisher import InventoryEventPublisher
from .models import Warehouse, Stock, StockMovement
from .serializers import WarehouseWriteSerializer, StockWriteSerializer, StockMovementSerializer


class WarehouseCommandViewSet(BaseCommandViewSet):
    """ViewSet for warehouse command operations"""
    queryset = Warehouse.objects.filter(is_active=True)
    serializer_class = WarehouseWriteSerializer
    lookup_field = 'id'


class StockCommandViewSet(BaseCommandViewSet):
    """ViewSet for stock command operations"""
    queryset = Stock.objects.filter(is_active=True)
    serializer_class = StockWriteSerializer
    lookup_field = 'id'
    
    def update(self, request, *args, **kwargs):
        """Update stock and publish event"""
        instance = self.get_object()
        previous_quantity = instance.quantity
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        stock = serializer.save()
        
        # Create movement record
        StockMovement.objects.create(
            stock=stock,
            movement_type='adjustment',
            quantity=stock.quantity - previous_quantity,
            previous_quantity=previous_quantity,
            new_quantity=stock.quantity,
            notes=request.data.get('notes', '')
        )
        
        # Publish event
        event_publisher = InventoryEventPublisher()
        with event_publisher:
            event_publisher.stock_updated(
                str(stock.product_id),
                stock.quantity,
                str(stock.warehouse.id) if stock.warehouse else None
            )
            
            # Check for low stock
            if stock.is_low_stock():
                event_publisher.stock_low(
                    str(stock.product_id),
                    stock.available_quantity,
                    stock.low_stock_threshold
                )
        
        return Response(serializer.data)


