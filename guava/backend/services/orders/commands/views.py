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
from .models import Order, Cart, Wishlist
from .serializers import OrderWriteSerializer, CartWriteSerializer, WishlistWriteSerializer


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
    
    @action(detail=False, methods=['post'], url_path='from-cart')
    def create_from_cart(self, request):
        """Create order from cart items"""
        session_id = request.data.get('session_id')
        user_id = request.data.get('user_id')
        
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get cart
        try:
            cart = Cart.objects.get(session_id=session_id)
            cart_items = cart.items.filter(is_active=True)
            
            if not cart_items.exists():
                return Response(
                    {'error': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Build order items from cart
            from .models import OrderItem
            import uuid
            from decimal import Decimal
            
            order_items_data = []
            subtotal = Decimal('0.00')
            
            # Note: In a real implementation, you'd fetch product details from products service
            # For now, we'll use the data provided in the request
            items_data = request.data.get('items', [])
            
            for item_data in items_data:
                product_id = item_data.get('product_id')
                quantity = int(item_data.get('quantity', 1))
                unit_price = Decimal(str(item_data.get('unit_price', 0)))
                total_price = unit_price * quantity
                subtotal += total_price
                
                order_items_data.append({
                    'product_id': product_id,
                    'product_name': item_data.get('product_name', ''),
                    'product_slug': item_data.get('product_slug', ''),
                    'product_image': item_data.get('product_image', ''),
                    'quantity': quantity,
                    'unit_price': unit_price,
                    'total_price': total_price,
                })
            
            # Calculate totals
            tax = Decimal(str(request.data.get('tax', 0)))
            shipping_cost = Decimal(str(request.data.get('shipping_cost', 0)))
            discount = Decimal(str(request.data.get('discount', 0)))
            total = subtotal + tax + shipping_cost - discount
            
            # Create order
            order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            order = Order.objects.create(
                order_number=order_number,
                user_id=user_id if user_id else None,
                session_id=session_id,
                customer_name=request.data.get('customer_name', ''),
                customer_email=request.data.get('customer_email', ''),
                customer_phone=request.data.get('customer_phone', ''),
                shipping_address=request.data.get('shipping_address', ''),
                shipping_city=request.data.get('shipping_city', ''),
                shipping_postal_code=request.data.get('shipping_postal_code', ''),
                shipping_country=request.data.get('shipping_country', 'Kenya'),
                subtotal=subtotal,
                tax=tax,
                shipping_cost=shipping_cost,
                discount=discount,
                total=total,
                payment_method=request.data.get('payment_method', ''),
                payment_status=request.data.get('payment_status', 'pending'),
            )
            
            # Create order items
            for item_data in order_items_data:
                OrderItem.objects.create(order=order, **item_data)
            
            # Clear cart
            cart_items.update(is_active=False)
            
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
            
            serializer = OrderWriteSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='buy-now')
    def buy_now(self, request):
        """Create order for a single product (Buy Now flow)"""
        session_id = request.data.get('session_id')
        user_id = request.data.get('user_id')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build order item from product
        import uuid
        from decimal import Decimal
        
        unit_price = Decimal(str(request.data.get('unit_price', 0)))
        total_price = unit_price * quantity
        subtotal = total_price
        
        # Calculate totals
        tax = Decimal(str(request.data.get('tax', 0)))
        shipping_cost = Decimal(str(request.data.get('shipping_cost', 0)))
        discount = Decimal(str(request.data.get('discount', 0)))
        total = subtotal + tax + shipping_cost - discount
        
        # Create order
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order.objects.create(
            order_number=order_number,
            user_id=user_id if user_id else None,
            session_id=session_id,
            customer_name=request.data.get('customer_name', ''),
            customer_email=request.data.get('customer_email', ''),
            customer_phone=request.data.get('customer_phone', ''),
            shipping_address=request.data.get('shipping_address', ''),
            shipping_city=request.data.get('shipping_city', ''),
            shipping_postal_code=request.data.get('shipping_postal_code', ''),
            shipping_country=request.data.get('shipping_country', 'Kenya'),
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,
            payment_method=request.data.get('payment_method', ''),
            payment_status=request.data.get('payment_status', 'pending'),
        )
        
        # Create order item
        from .models import OrderItem
        OrderItem.objects.create(
            order=order,
            product_id=product_id,
            product_name=request.data.get('product_name', ''),
            product_slug=request.data.get('product_slug', ''),
            product_image=request.data.get('product_image', ''),
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
        )
        
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
        
        serializer = OrderWriteSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartCommandViewSet(BaseCommandViewSet):
    """ViewSet for cart command operations"""
    queryset = Cart.objects.all()
    serializer_class = CartWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        """Add item to cart or update quantity"""
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        user_id = request.data.get('user_id')
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create cart
        cart, created = Cart.objects.get_or_create(
            session_id=session_id,
            defaults={'user_id': user_id} if user_id else {}
        )
        
        # Get or create cart item
        from .models import CartItem
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not item_created:
            # Update quantity
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartWriteSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-quantity')
    def update_quantity(self, request):
        """Update cart item quantity"""
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.get(session_id=session_id)
            from .models import CartItem
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
            
            serializer = CartWriteSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='remove-item')
    def remove_item(self, request):
        """Remove item from cart"""
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.get(session_id=session_id)
            from .models import CartItem
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
            
            serializer = CartWriteSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='clear')
    def clear_cart(self, request):
        """Clear all items from cart"""
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.get(session_id=session_id)
            from .models import CartItem
            CartItem.objects.filter(cart=cart).delete()
            
            serializer = CartWriteSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)


class WishlistCommandViewSet(BaseCommandViewSet):
    """ViewSet for wishlist command operations"""
    queryset = Wishlist.objects.filter(is_active=True)
    serializer_class = WishlistWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle(self, request):
        """Add or remove product from wishlist"""
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        user_id = request.data.get('user_id')
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if item exists
        wishlist_item = Wishlist.objects.filter(
            session_id=session_id,
            product_id=product_id,
            is_active=True
        ).first()
        
        if wishlist_item:
            # Remove from wishlist
            wishlist_item.is_active = False
            wishlist_item.save()
            return Response({'action': 'removed', 'product_id': product_id}, status=status.HTTP_200_OK)
        else:
            # Add to wishlist
            wishlist_item = Wishlist.objects.create(
                session_id=session_id,
                product_id=product_id,
                user_id=user_id if user_id else None
            )
            serializer = WishlistWriteSerializer(wishlist_item)
            return Response({'action': 'added', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], url_path='remove')
    def remove_item(self, request):
        """Remove product from wishlist"""
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wishlist_item = Wishlist.objects.filter(
            session_id=session_id,
            product_id=product_id,
            is_active=True
        ).first()
        
        if wishlist_item:
            wishlist_item.is_active = False
            wishlist_item.save()
            return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Item not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'], url_path='clear')
    def clear_wishlist(self, request):
        """Clear all items from wishlist"""
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        Wishlist.objects.filter(session_id=session_id, is_active=True).update(is_active=False)
        return Response({'message': 'Wishlist cleared'}, status=status.HTTP_200_OK)

