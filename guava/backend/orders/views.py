"""
Views for orders app.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import Cart, CartItem, Order, OrderItem, Shipping, Warranty
from .serializers import (
    CartSerializer, CartItemSerializer,
    OrderSerializer, CreateOrderSerializer,
    ShippingSerializer, WarrantySerializer
)
from products.models import ProductVariant
from promotions.models import Discount
from inventory.models import SerialNumber


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet for Cart model."""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    @action(detail=True, methods=['post', 'put', 'patch'])
    def add_item(self, request, pk=None):
        """Add item to cart."""
        cart = self.get_object()
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            variant = ProductVariant.objects.get(id=variant_id, is_active=True)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Product variant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check stock
        if variant.stock_quantity < quantity:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            if cart_item.quantity > variant.stock_quantity:
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        """Remove item from cart."""
        cart = self.get_object()
        variant_id = request.data.get('variant_id')
        
        try:
            cart_item = CartItem.objects.get(cart=cart, variant_id=variant_id)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def update_quantity(self, request, pk=None):
        """Update item quantity in cart."""
        cart = self.get_object()
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))
        
        if quantity < 1:
            return Response({'error': 'Quantity must be at least 1'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(cart=cart, variant_id=variant_id)
            variant = cart_item.variant
            
            if variant.stock_quantity < quantity:
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            cart_item.quantity = quantity
            cart_item.save()
            
            serializer = CartItemSerializer(cart_item)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Order.objects.filter(user=user)
        # For guest orders, would need order_number lookup
        return Order.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create order from cart or direct items."""
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        user = request.user if request.user.is_authenticated else None
        
        # Get items from cart or direct items
        items_data = []
        if data.get('items'):
            # Direct items (buy-now or guest checkout)
            items_data = data['items']
        elif user:
            # Get from cart
            try:
                cart = Cart.objects.get(user=user)
                for cart_item in cart.items.all():
                    items_data.append({
                        'variant_id': cart_item.variant.id,
                        'quantity': cart_item.quantity
                    })
            except Cart.DoesNotExist:
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'No items provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not items_data:
            return Response({'error': 'No items to order'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate totals
        subtotal = 0
        order_items_data = []
        
        for item_data in items_data:
            variant_id = item_data['variant_id']
            quantity = item_data['quantity']
            
            try:
                variant = ProductVariant.objects.select_for_update().get(id=variant_id, is_active=True)
            except ProductVariant.DoesNotExist:
                return Response({'error': f'Product variant {variant_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Check stock (atomic)
            if variant.stock_quantity < quantity:
                return Response({'error': f'Insufficient stock for {variant.product.name}'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Reserve stock
            variant.stock_quantity -= quantity
            variant.save()
            
            price = variant.effective_price
            line_total = price * quantity
            subtotal += line_total
            
            order_items_data.append({
                'variant': variant,
                'product': variant.product,
                'price': price,
                'quantity': quantity,
                'line_total': line_total
            })
        
        # Apply discount
        discount_amount = 0
        discount = None
        if data.get('discount_code'):
            try:
                discount = Discount.objects.get(code=data['discount_code'])
                if discount.is_valid():
                    discount_amount = discount.calculate_discount(subtotal)
                    if discount.min_order_value and subtotal < discount.min_order_value:
                        discount_amount = 0
                    else:
                        discount.used_count += 1
                        discount.save()
            except Discount.DoesNotExist:
                pass  # Invalid code, continue without discount
        
        # Calculate shipping and tax
        shipping_cost = float(data.get('shipping_cost', 0))
        # TODO: Calculate shipping based on shipping_method and location
        # For now, use provided shipping_cost or calculate based on method
        shipping_method = data.get('shipping_method', '')
        if shipping_cost == 0:
            # Calculate based on method (matching frontend logic)
            if shipping_method == 'nairobi':
                shipping_cost = 0
            elif shipping_method == 'near-nairobi':
                shipping_cost = 400
            elif shipping_method == 'outside-nairobi':
                shipping_cost = 600
            else:  # pickup
                shipping_cost = 0
        
        tax = 0  # Can be calculated based on location
        total = subtotal - discount_amount + shipping_cost + tax
        
        # Create order
        order = Order.objects.create(
            user=user,
            guest_email=data.get('guest_email'),
            guest_phone=data.get('guest_phone'),
            status='pending',
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_cost=shipping_cost,
            tax=tax,
            total=total,
            payment_method=data.get('payment_method'),
            shipping_name=data['shipping_name'],
            shipping_phone=data['shipping_phone'],
            shipping_email=data['shipping_email'],
            shipping_address=data['shipping_address'],
            shipping_city=data['shipping_city'],
            shipping_postal_code=data.get('shipping_postal_code', ''),
            shipping_country=data.get('shipping_country', 'Kenya'),
            shipping_method=data.get('shipping_method', ''),
        )
        
        # Create order items
        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                variant=item_data['variant'],
                product=item_data['product'],
                price=item_data['price'],
                quantity=item_data['quantity'],
                line_total=item_data['line_total'],
                discount=discount
            )
        
        # Clear cart if user is authenticated
        if user:
            CartItem.objects.filter(cart__user=user).delete()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def warranty(self, request, pk=None):
        """Get warranty information for order items."""
        order = self.get_object()
        warranties = []
        for item in order.items.all():
            try:
                warranty = item.warranty
                warranties.append(WarrantySerializer(warranty).data)
            except Warranty.DoesNotExist:
                pass
        return Response(warranties)

