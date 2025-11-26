"""
Optimized serializers for catalog queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Category, Brand, CategoryBrand, Supplier


class SubcategorySerializer(serializers.ModelSerializer):
    """Serializer for subcategories"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image']
        read_only = True


class CategoryListSerializer(BaseReadSerializer):
    """Optimized serializer for category list"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'order', 'created_at']


class CategoryDetailSerializer(BaseReadSerializer):
    """Detailed serializer for single category with subcategories"""
    subcategories = SubcategorySerializer(many=True, read_only=True)
    brands = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'image',
            'parent', 'subcategories', 'brands', 'order', 'created_at'
        ]
    
    def get_brands(self, obj):
        """Get brands associated with this category"""
        brand_ids = CategoryBrand.objects.filter(category=obj, is_active=True).values_list('brand_id', flat=True)
        brands = Brand.objects.filter(id__in=brand_ids, is_active=True)
        return BrandListSerializer(brands, many=True).data


class BrandListSerializer(BaseReadSerializer):
    """Optimized serializer for brand list"""
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'image', 'color', 'created_at']


class BrandDetailSerializer(BaseReadSerializer):
    """Detailed serializer for single brand"""
    categories = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'slug', 'logo', 'image', 'color',
            'description', 'discount', 'categories', 'created_at'
        ]
    
    def get_categories(self, obj):
        """Get categories associated with this brand"""
        category_ids = CategoryBrand.objects.filter(brand=obj, is_active=True).values_list('category_id', flat=True)
        categories = Category.objects.filter(id__in=category_ids, is_active=True)
        return CategoryListSerializer(categories, many=True).data


class SupplierSerializer(BaseReadSerializer):
    """Serializer for suppliers"""
    
    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'slug', 'contact_name', 'email', 'phone',
            'location', 'tags', 'notes', 'is_active', 'created_at'
        ]


