"""
Dashboard views - Admin/Staff statistics and overview.
"""
from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from products.models import Product, ProductVariant, Category, Brand
from orders.models import Order, OrderItem
from reviews.models import ProductReview
from .permissions import IsAdminOrStaff


class DashboardStatsView(views.APIView):
    """Get dashboard statistics for admin/staff."""
    permission_classes = [IsAdminOrStaff]
    
    def get(self, request):
        now = timezone.now()
        today = now.date()
        this_month_start = today.replace(day=1)
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        last_month_end = this_month_start - timedelta(days=1)
        
        # Orders
        total_orders = Order.objects.count()
        today_orders = Order.objects.filter(created_at__date=today).count()
        this_month_orders = Order.objects.filter(created_at__date__gte=this_month_start).count()
        last_month_orders = Order.objects.filter(
            created_at__date__gte=last_month_start,
            created_at__date__lte=last_month_end
        ).count()
        
        # Revenue
        total_revenue = Order.objects.filter(status__in=['paid', 'shipped', 'delivered']).aggregate(
            total=Sum('total')
        )['total'] or 0
        
        this_month_revenue = Order.objects.filter(
            created_at__date__gte=this_month_start,
            status__in=['paid', 'shipped', 'delivered']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        last_month_revenue = Order.objects.filter(
            created_at__date__gte=last_month_start,
            created_at__date__lte=last_month_end,
            status__in=['paid', 'shipped', 'delivered']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        # Products
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(
            variants__stock_quantity__lte=5,
            variants__is_active=True
        ).distinct().count()
        out_of_stock_products = Product.objects.filter(
            variants__stock_quantity=0,
            variants__is_active=True
        ).distinct().count()
        
        # Users
        total_users = User.objects.filter(is_customer=True).count()
        new_users_today = User.objects.filter(date_joined__date=today, is_customer=True).count()
        new_users_this_month = User.objects.filter(
            date_joined__date__gte=this_month_start,
            is_customer=True
        ).count()
        
        # Reviews
        total_reviews = ProductReview.objects.count()
        pending_reviews = ProductReview.objects.filter(is_approved=False).count()
        
        # Categories and Brands
        total_categories = Category.objects.count()
        total_brands = Brand.objects.count()
        
        # Order status breakdown
        order_status_breakdown = Order.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        return Response({
            'orders': {
                'total': total_orders,
                'today': today_orders,
                'this_month': this_month_orders,
                'last_month': last_month_orders,
                'status_breakdown': list(order_status_breakdown),
            },
            'revenue': {
                'total': float(total_revenue),
                'this_month': float(this_month_revenue),
                'last_month': float(last_month_revenue),
                'growth': float(this_month_revenue - last_month_revenue) if last_month_revenue > 0 else 0,
            },
            'products': {
                'total': total_products,
                'low_stock': low_stock_products,
                'out_of_stock': out_of_stock_products,
            },
            'users': {
                'total': total_users,
                'new_today': new_users_today,
                'new_this_month': new_users_this_month,
            },
            'reviews': {
                'total': total_reviews,
                'pending_approval': pending_reviews,
            },
            'catalog': {
                'categories': total_categories,
                'brands': total_brands,
            },
        })


class RecentOrdersView(views.APIView):
    """Get recent orders for dashboard."""
    permission_classes = [IsAdminOrStaff]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        orders = Order.objects.select_related('user').prefetch_related('items').order_by('-created_at')[:limit]
        
        from orders.serializers import OrderSerializer
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class TopProductsView(views.APIView):
    """Get top selling products."""
    permission_classes = [IsAdminOrStaff]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        top_products = Product.objects.annotate(
            total_sold=Sum('order_items__quantity')
        ).filter(total_sold__gt=0).order_by('-total_sold')[:limit]
        
        from products.serializers import ProductListSerializer
        serializer = ProductListSerializer(top_products, many=True, context={'request': request})
        return Response(serializer.data)

