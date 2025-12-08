# ecommerce-backend/store/views.py

import time
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from django.db.models import Sum, Count, F, Q
from django.db.models.functions import TruncDay
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, views, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

import stripe

from .models import (
    Product, ProductVariant, Category, Cart, CartItem, Order, OrderItem, Payment, 
    StockMovement, OrderStatusHistory
)
from .serializers import (
    ProductSerializer, AdminProductSerializer, CategorySerializer,
    OrderSerializer, OrderItemSerializer, CartSerializer
)
from .utils import validate_coupon, calculate_discount

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

LOW_STOCK_THRESHOLD = getattr(settings, 'LOW_STOCK_THRESHOLD', 10)

# ----------------------------
# Product ViewSet
# ----------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('images', 'variants__attributes')
    
    # Serializer based on action
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminProductSerializer
        return ProductSerializer

    # Permissions based on action
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'related']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    # Queryset
    def get_queryset(self):
        if self.request.user.is_staff:
            return Product.objects.all().prefetch_related('images', 'variants__attributes')
        return Product.objects.filter(is_active=True).prefetch_related('images', 'variants__attributes')

    # Featured products
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)[:8]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    # Best-selling products
    @action(detail=False, methods=['get'])
    def best_selling(self, request):
        best_selling_products = self.get_queryset().filter(is_best_selling=True)[:8]
        serializer = self.get_serializer(best_selling_products, many=True)
        return Response(serializer.data)

    # Related products
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """Fetches products related to the current product."""
        product = self.get_object()

        if product.category:
            related_products_qs = Product.objects.filter(
                category=product.category,
                is_active=True
            ).exclude(id=product.id).order_by('?')[:4]
        else:
            related_products_qs = Product.objects.filter(is_active=True).exclude(id=product.id).order_by('?')[:4]

        serializer = ProductSerializer(related_products_qs, many=True)
        return Response(serializer.data)

    # Filtering, searching, ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['category__slug', 'brand', 'is_featured', 'current_price']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['current_price', 'created_at', 'name', 'stock_quantity']
    ordering = ['-created_at']

# ----------------------------
# Category ViewSet
# ----------------------------
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

# ----------------------------
# Checkout / Order APIs
# ----------------------------
SHIPPING_RATES = {
    'standard': {'name': 'Standard Delivery (5-7 days)', 'cost': 5.00},
    'express': {'name': 'Express Delivery (2-3 days)', 'cost': 15.00},
    'free': {'name': 'Standard Delivery (Free)', 'cost': 0.00},
}

class CheckoutView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user if request.user.is_authenticated else None

        # Identify cart
        try:
            cart = Cart.objects.get(user=user) if user else Cart.objects.get(session_key=request.session.session_key)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found or empty.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.select_related('product')
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_info = data.get('shipping_address', {})
        customer_info = data.get('customer_info', {})
        shipping_method_key = data.get('shipping_method', 'standard')
        shipping_cost = SHIPPING_RATES.get(shipping_method_key, SHIPPING_RATES['standard'])['cost']

        cart_subtotal = sum(item.total_price for item in cart_items)
        order_total = cart_subtotal + shipping_cost

        # Process Order in transaction
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                full_name=shipping_info.get('full_name'),
                email=customer_info.get('email'),
                shipping_address=f"{shipping_info.get('address_line_1')}, {shipping_info.get('city')}, {shipping_info.get('postal_code')}",
                total_amount=order_total,
                status='Processing'
            )

            # Create OrderItems and update stock & log stock movements
            for item in cart_items:
                product = item.product
                old_stock = product.stock_quantity
                product.stock_quantity -= item.quantity
                product.save(update_fields=['stock_quantity'])

                StockMovement.objects.create(
                    product=product,
                    movement_type='SALE',
                    quantity_change=-item.quantity,
                    current_stock=product.stock_quantity,
                    reason=f"Order #{order.id} placement",
                    moved_by=user if user else None
                )

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item.quantity,
                    price_at_purchase=product.get_price()
                )

            cart_items.all().delete()
            cart.delete()

            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

# ----------------------------
# Orders ViewSet
# ----------------------------
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    lookup_field = 'id'

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Order.objects.filter(user=self.request.user).order_by('-order_date')
        return Order.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        old_status = order.status

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': f'Invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save(update_fields=['status'])

        OrderStatusHistory.objects.create(
            order=order,
            old_status=old_status,
            new_status=new_status,
            changed_by=request.user
        )

        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['patch'], permission_classes=[IsAdminUser])
    def bulk_update_status(self, request):
        order_ids = request.data.get('order_ids', [])
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': f'Invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        updated_count = 0
        with transaction.atomic():
            orders = Order.objects.filter(id__in=order_ids)
            for order in orders:
                old_status = order.status
                if old_status != new_status:
                    order.status = new_status
                    order.save(update_fields=['status'])
                    updated_count += 1
                    OrderStatusHistory.objects.create(
                        order=order,
                        old_status=old_status,
                        new_status=new_status,
                        changed_by=request.user
                    )

        return Response({'success': f'{updated_count} orders successfully updated to {new_status}'})

# ----------------------------
# Low Stock Alerts
# ----------------------------
class LowStockAlertsView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        low_products = Product.objects.filter(
            stock_quantity__lte=LOW_STOCK_THRESHOLD,
            stock_quantity__gt=0,
            is_active=True
        ).order_by('stock_quantity').values('id', 'name', 'stock_quantity')

        low_variants = ProductVariant.objects.filter(
            stock_quantity__lte=LOW_STOCK_THRESHOLD,
            stock_quantity__gt=0
        ).select_related('product').order_by('stock_quantity').values(
            'id', 'sku', 'stock_quantity', 'product__name'
        )

        alerts = {
            'products': list(low_products),
            'variants': list(low_variants),
            'threshold': LOW_STOCK_THRESHOLD
        }

        return Response(alerts)

# ----------------------------
# Sales Metrics
# ----------------------------
class SalesMetricsView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        total_revenue = Order.objects.filter(status__in=['Processing', 'Shipped', 'Delivered']).aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        daily_sales = Order.objects.filter(status__in=['Processing', 'Shipped', 'Delivered']) \
            .annotate(day=TruncDay('order_date')) \
            .values('day') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('day')
        top_selling_products = OrderItem.objects.values('product__name') \
            .annotate(total_sold=Sum('quantity')) \
            .order_by('-total_sold')[:10]

        return Response({
            'total_revenue': round(total_revenue, 2),
            'total_orders': total_orders,
            'daily_revenue_chart': list(daily_sales),
            'top_products': list(top_selling_products),
        })

# ----------------------------
# Payment Views
# ----------------------------
class StripePaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        order.status = 'Processing'
        order.save()
        Payment.objects.create(
            order=order,
            method='CARD',
            amount=order.total_amount,
            transaction_id=f'STRIPE_MOCK_{order_id}_{int(time.time())}',
            status='COMPLETE'
        )
        return Response({'success': 'Card payment mock successful', 'order_id': order.id})

class MpesaPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        order_id = request.data.get('order_id')

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        Payment.objects.create(
            order=order,
            method='MPESA',
            amount=order.total_amount,
            transaction_id=f'MPESA_PENDING_{order_id}_{int(time.time())}',
            status='PENDING'
        )

        return Response({'status': 'M-Pesa STK push initiated', 'order_id': order.id})

class MpesaCallbackView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return Response({'ResultCode': 0, 'ResultDesc': 'C2B Registered Successfully'})

# ----------------------------
# Search Suggestions
# ----------------------------
class SearchSuggestionView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        if not query or len(query) < 3:
            return Response([])

        products = Product.objects.filter(
            Q(name__icontains=query) | Q(sku__icontains=query),
            is_active=True
        ).select_related('category').only('name', 'slug', 'current_price').distinct()[:8]

        suggestions = [{
            'name': p.name,
            'slug': p.slug,
            'price': p.current_price,
            'category': p.category.name if p.category else 'N/A'
        } for p in products]

        return Response(suggestions)

# ----------------------------
# Coupon Apply
# ----------------------------
class CouponApplyView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        coupon_code = request.data.get('coupon_code')
        session_key = request.session.session_key or request.data.get('session_key')

        try:
            cart = Cart.objects.get(session_key=session_key)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

        is_valid, result = validate_coupon(coupon_code, cart.get_total_price())

        if not is_valid:
            cart.applied_coupon = None
            cart.save()
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        coupon = result
        discount_amount = calculate_discount(coupon, cart.get_total_price())
        cart.applied_coupon = coupon
        cart.discount_amount = discount_amount
        cart.save()

        return Response({
            'success': 'Coupon applied successfully.',
            'discount_amount': discount_amount,
            'cart_total_after_discount': cart.get_total_price(),
            'cart': CartSerializer(cart).data
        })

# ----------------------------
# Refund / Invoice / PaymentIntent
# ----------------------------
class RefundView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')

        try:
            order = Order.objects.get(id=order_id)
            payment = Payment.objects.get(order=order, status='COMPLETE')
        except (Order.DoesNotExist, Payment.DoesNotExist):
            return Response({'error': 'Order or completed payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.status == 'Refunded':
            return Response({'warning': 'Order is already refunded.'})

        order.status = 'Refunded'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            old_status=order.status,
            new_status='Refunded',
            changed_by=request.user
        )

        return Response({'success': f'Refund of ${amount} processed for Order {order_id}.'}, status=status.HTTP_200_OK)

class GenerateInvoiceView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, order_id, *args, **kwargs):
        return Response({'note': f'Invoice generation API endpoint configured for Order {order_id}'})

class CreatePaymentIntentView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        try:
            order = get_object_or_404(Order, id=order_id)
        except Exception:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        amount_cents = int(order.total_amount * Decimal(100))
        if amount_cents <= 0:
            return Response({'error': 'Payment amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='usd',
                payment_method_types=['card'],
                metadata={'order_id': order.id}
            )
            return Response({'client_secret': intent.client_secret, 'intent_id': intent.id})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
