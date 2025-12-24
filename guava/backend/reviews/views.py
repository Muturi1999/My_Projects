"""
Views for reviews app.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProductReview
from .serializers import ProductReviewSerializer
from products.models import Product


class ProductReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for ProductReview model."""
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['product', 'rating', 'is_verified_purchase']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = ProductReview.objects.filter(is_approved=True)
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        """Create review and check if user purchased the product."""
        review = serializer.save()
        # Check if user has purchased this product (for verified purchase badge)
        user = self.request.user
        from orders.models import OrderItem
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product=review.product,
            order__status__in=['paid', 'shipped', 'delivered']
        ).exists()
        review.is_verified_purchase = has_purchased
        review.save()
    
    @action(detail=False, methods=['get'], url_path='by-product/(?P<product_id>[^/.]+)')
    def by_product(self, request, product_id=None):
        """Get reviews for a specific product."""
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = self.get_queryset().filter(product=product)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

