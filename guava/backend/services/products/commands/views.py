"""
Views for product commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from .models import Product, ProductRating
from .serializers import ProductWriteSerializer, ProductRatingSerializer
from .services import ProductCommandService


class ProductCommandViewSet(BaseCommandViewSet):
    """
    ViewSet for product command operations (POST, PUT, PATCH, DELETE).
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductWriteSerializer
    lookup_field = 'id'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.service = ProductCommandService()
    
    def create(self, request, *args, **kwargs):
        """Create a new product"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = self.service.create_product(serializer.validated_data)
        
        response_serializer = self.get_serializer(product)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update a product"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        product = self.service.update_product(str(instance.id), serializer.validated_data)
        
        response_serializer = self.get_serializer(product)
        return Response(response_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete a product"""
        instance = self.get_object()
        self.service.delete_product(str(instance.id))
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='ratings')
    def add_rating(self, request, id=None):
        """Add a rating to a product"""
        product = self.get_object()
        rating_data = request.data.copy()
        rating_data['product'] = product.id
        
        serializer = ProductRatingSerializer(data=rating_data)
        serializer.is_valid(raise_exception=True)
        rating = serializer.save()
        
        # Update product rating average
        ratings = ProductRating.objects.filter(product=product, is_active=True)
        total_rating = sum(r.rating for r in ratings)
        product.rating = round(total_rating / ratings.count()) if ratings.count() > 0 else 0
        product.rating_count = ratings.count()
        product.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


