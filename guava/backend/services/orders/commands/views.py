"""
Views for order commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from shared.messaging.publisher import OrderEventPublisher
from .models import Order, Cart
from .serializers import OrderWriteSerializer, CartWriteSerializer


class OrderCommandViewSet(BaseCommandViewSet):
    """ViewSet for order command operations"""
    queryset = Order.objects.filter(is_active=True)
    serializer_class = OrderWriteSerializer
    lookup_field = 'id'
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Generate order number
        import uuid
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        serializer.validated_data['order_number'] = order_number
        
        order = serializer.save()
        
        # Publish event
        event_publisher = OrderEventPublisher()
        with event_publisher:
            event_publisher.order_created(
                str(order.id),
                {
                    'order_number': order.order_number,
                    'total': float(order.total),
                    'status': order.status,
                }
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, id=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        old_status = order.status
        
        if new_status not in dict(Order.ORDER_STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        # Publish event
        event_publisher = OrderEventPublisher()
        with event_publisher:
            event_publisher.order_status_changed(str(order.id), old_status, new_status)
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)


class CartCommandViewSet(BaseCommandViewSet):
    """ViewSet for cart command operations"""
    queryset = Cart.objects.all()
    serializer_class = CartWriteSerializer
    lookup_field = 'id'

