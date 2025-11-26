"""
Serializers for inventory commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Warehouse, Stock, StockMovement


class WarehouseWriteSerializer(BaseWriteSerializer):
    """Serializer for warehouses"""
    
    class Meta:
        model = Warehouse
        fields = [
            'id', 'name', 'address', 'city', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StockWriteSerializer(BaseWriteSerializer):
    """Serializer for stock operations"""
    
    class Meta:
        model = Stock
        fields = [
            'id', 'product_id', 'warehouse', 'quantity', 'reserved_quantity',
            'low_stock_threshold', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    """Serializer for stock movements"""
    
    class Meta:
        model = StockMovement
        fields = [
            'id', 'stock', 'movement_type', 'quantity', 'previous_quantity',
            'new_quantity', 'reference', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


