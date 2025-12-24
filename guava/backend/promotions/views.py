"""
Views for promotions app - Discounts and Flash Sales.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Discount, FlashSale
from .serializers import DiscountSerializer, FlashSaleSerializer
from products.permissions import IsAdminOrReadOnly, IsAdminOrStaff


class DiscountViewSet(viewsets.ModelViewSet):
    """ViewSet for Discount model - Full CRUD for admin/staff."""
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAdminOrStaff]
    search_fields = ['name', 'code', 'description']
    filterset_fields = ['discount_type', 'is_active']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active discounts."""
        discounts = self.get_queryset().filter(is_active=True)
        now = timezone.now()
        discounts = [d for d in discounts if d.is_valid()]
        serializer = self.get_serializer(discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def validate_code(self, request, pk=None):
        """Validate a discount code."""
        discount = self.get_object()
        code = request.data.get('code')
        order_amount = float(request.data.get('order_amount', 0))
        
        if discount.code != code:
            return Response({'valid': False, 'message': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not discount.is_valid():
            return Response({'valid': False, 'message': 'Discount is not valid'}, status=status.HTTP_400_BAD_REQUEST)
        
        if discount.min_order_value and order_amount < float(discount.min_order_value):
            return Response({
                'valid': False,
                'message': f'Minimum order value of {discount.min_order_value} required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        discount_amount = discount.calculate_discount(order_amount)
        return Response({
            'valid': True,
            'discount_amount': discount_amount,
            'discount': DiscountSerializer(discount).data
        })


class FlashSaleViewSet(viewsets.ModelViewSet):
    """ViewSet for FlashSale model - Full CRUD for admin/staff."""
    queryset = FlashSale.objects.all()
    serializer_class = FlashSaleSerializer
    permission_classes = [IsAdminOrStaff]
    search_fields = ['name', 'description']
    filterset_fields = ['is_active']
    ordering = ['-start_time']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all currently active flash sales."""
        flash_sales = self.get_queryset().filter(is_active=True)
        now = timezone.now()
        active_sales = [sale for sale in flash_sales if sale.is_active_now()]
        serializer = self.get_serializer(active_sales, many=True)
        return Response(serializer.data)

