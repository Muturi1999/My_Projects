"""
Views for report queries (read operations).
"""
import sys
from pathlib import Path
from django.utils import timezone
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from shared.common.pagination import StandardResultsSetPagination
from .models import SalesReport, ProductReport, InventoryReport
from .serializers import (
    SalesReportReadSerializer, ProductReportReadSerializer,
    InventoryReportReadSerializer
)


class SalesReportQueryViewSet(BaseQueryViewSet):
    """ViewSet for sales report query operations (GET only)"""
    queryset = SalesReport.objects.filter(is_active=True, is_generated=True)
    serializer_class = SalesReportReadSerializer
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination
    
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Get sales summary for dashboard"""
        # Get last 30 days
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)
        
        reports = self.queryset.filter(
            start_date__gte=start_date,
            end_date__lte=end_date
        )
        
        total_revenue = sum(float(r.total_revenue) for r in reports)
        total_orders = sum(r.total_orders for r in reports)
        
        return Response({
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'average_order_value': total_revenue / total_orders if total_orders > 0 else 0
        })


class ProductReportQueryViewSet(BaseQueryViewSet):
    """ViewSet for product report query operations (GET only)"""
    queryset = ProductReport.objects.filter(is_active=True)
    serializer_class = ProductReportReadSerializer
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination
    
    @action(detail=False, methods=['get'], url_path='top-selling')
    def top_selling(self, request):
        """Get top selling products"""
        limit = int(request.query_params.get('limit', 10))
        products = self.queryset.order_by('-total_sold')[:limit]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class InventoryReportQueryViewSet(BaseQueryViewSet):
    """ViewSet for inventory report query operations (GET only)"""
    queryset = InventoryReport.objects.filter(is_active=True).order_by('-generated_at')
    serializer_class = InventoryReportReadSerializer
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination
    
    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        """Get latest inventory report"""
        report = self.queryset.first()
        if not report:
            return Response({'error': 'No reports available'}, status=404)
        serializer = self.get_serializer(report)
        return Response(serializer.data)

