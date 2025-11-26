"""
Optimized serializers for inventory queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Warehouse, Stock, StockMovement


class WarehouseReadSerializer(BaseReadSerializer):
    """Serializer for warehouses (read)"""
    
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'address', 'city', 'is_active', 'created_at']


class StockReadSerializer(BaseReadSerializer):
    """Serializer for stock (read)"""
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    available_quantity = serializers.IntegerField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Stock
        fields = [
            'id', 'product_id', 'warehouse', 'warehouse_name', 'quantity',
            'reserved_quantity', 'available_quantity', 'low_stock_threshold',
            'is_low_stock', 'created_at', 'updated_at'
        ]


class StockMovementReadSerializer(BaseReadSerializer):
    """Serializer for stock movements (read)"""
    
    class Meta:
        model = StockMovement
        fields = [
            'id', 'stock', 'movement_type', 'quantity', 'previous_quantity',
            'new_quantity', 'reference', 'notes', 'created_at'
        ]
        read_only = True


