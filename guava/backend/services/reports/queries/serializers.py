"""
Optimized serializers for report queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import SalesReport, ProductReport, InventoryReport


class SalesReportReadSerializer(BaseReadSerializer):
    """Serializer for sales reports (read)"""
    
    class Meta:
        model = SalesReport
        fields = [
            'id', 'report_type', 'start_date', 'end_date', 'total_orders',
            'total_revenue', 'total_items_sold', 'average_order_value',
            'order_data', 'product_data', 'category_data', 'is_generated',
            'generated_at', 'created_at'
        ]


class ProductReportReadSerializer(BaseReadSerializer):
    """Serializer for product reports (read)"""
    
    class Meta:
        model = ProductReport
        fields = [
            'id', 'product_id', 'product_name', 'total_sold', 'total_revenue',
            'average_rating', 'view_count', 'period_start', 'period_end',
            'created_at'
        ]


class InventoryReportReadSerializer(BaseReadSerializer):
    """Serializer for inventory reports (read)"""
    
    class Meta:
        model = InventoryReport
        fields = [
            'id', 'report_type', 'generated_at', 'total_products', 'total_value',
            'low_stock_count', 'out_of_stock_count', 'product_data', 'created_at'
        ]

