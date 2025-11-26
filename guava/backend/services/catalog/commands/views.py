"""
Views for catalog commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from shared.exceptions.exceptions import ValidationException
from .models import Category, Brand, CategoryBrand, Supplier
from .serializers import CategoryWriteSerializer, BrandWriteSerializer, CategoryBrandSerializer, SupplierWriteSerializer


class CategoryCommandViewSet(BaseCommandViewSet):
    """ViewSet for category command operations"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryWriteSerializer
    lookup_field = 'id'
    
    def create(self, request, *args, **kwargs):
        """Create a new category"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Validate slug uniqueness
        if Category.objects.filter(slug=serializer.validated_data['slug']).exists():
            raise ValidationException(f"Category with slug '{serializer.validated_data['slug']}' already exists")
        
        category = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BrandCommandViewSet(BaseCommandViewSet):
    """ViewSet for brand command operations"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandWriteSerializer
    lookup_field = 'id'
    
    def create(self, request, *args, **kwargs):
        """Create a new brand"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Validate slug uniqueness
        if Brand.objects.filter(slug=serializer.validated_data['slug']).exists():
            raise ValidationException(f"Brand with slug '{serializer.validated_data['slug']}' already exists")
        
        brand = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SupplierCommandViewSet(BaseCommandViewSet):
    """ViewSet for supplier command operations"""
    queryset = Supplier.objects.filter(is_active=True)
    serializer_class = SupplierWriteSerializer
    lookup_field = 'id'
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if Supplier.objects.filter(slug=serializer.validated_data['slug']).exists():
            raise ValidationException(f"Supplier with slug '{serializer.validated_data['slug']}' already exists")
        
        supplier = serializer.save()
        return Response(self.get_serializer(supplier).data, status=status.HTTP_201_CREATED)


class CategoryBrandCommandViewSet(BaseCommandViewSet):
    """ViewSet for category-brand relationship operations"""
    queryset = CategoryBrand.objects.all()
    serializer_class = CategoryBrandSerializer
    lookup_field = 'id'


