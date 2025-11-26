"""
Views for report commands (write operations).
"""
import sys
from pathlib import Path
from django.utils import timezone

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from .models import SalesReport, ProductReport, InventoryReport
from .serializers import (
    SalesReportWriteSerializer, ProductReportWriteSerializer,
    InventoryReportWriteSerializer
)


class SalesReportCommandViewSet(BaseCommandViewSet):
    """ViewSet for sales report command operations"""
    queryset = SalesReport.objects.filter(is_active=True)
    serializer_class = SalesReportWriteSerializer
    lookup_field = 'id'
    
    @action(detail=True, methods=['post'], url_path='generate')
    def generate(self, request, id=None):
        """Generate sales report data"""
        report = self.get_object()
        
        # TODO: Implement actual report generation logic
        # This would query orders service, aggregate data, etc.
        
        report.is_generated = True
        report.generated_at = timezone.now()
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)


class ProductReportCommandViewSet(BaseCommandViewSet):
    """ViewSet for product report command operations"""
    queryset = ProductReport.objects.filter(is_active=True)
    serializer_class = ProductReportWriteSerializer
    lookup_field = 'id'


class InventoryReportCommandViewSet(BaseCommandViewSet):
    """ViewSet for inventory report command operations"""
    queryset = InventoryReport.objects.filter(is_active=True)
    serializer_class = InventoryReportWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['post'], url_path='generate')
    def generate_report(self, request):
        """Generate inventory report"""
        report_type = request.data.get('report_type', 'stock_levels')
        
        # TODO: Implement actual report generation
        # Query inventory service, aggregate data
        
        report = InventoryReport.objects.create(
            report_type=report_type,
            total_products=0,
            total_value=0,
            low_stock_count=0,
            out_of_stock_count=0
        )
        
        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

