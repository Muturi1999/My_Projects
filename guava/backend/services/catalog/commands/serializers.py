"""
Serializers for catalog commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Category, Brand, CategoryBrand


class CategoryWriteSerializer(BaseWriteSerializer):
    """Serializer for creating and updating categories"""
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'image',
            'parent', 'order', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BrandWriteSerializer(BaseWriteSerializer):
    """Serializer for creating and updating brands"""
    
    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'slug', 'logo', 'image', 'color',
            'description', 'discount', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CategoryBrandSerializer(serializers.ModelSerializer):
    """Serializer for category-brand relationships"""
    
    class Meta:
        model = CategoryBrand
        fields = ['id', 'category', 'brand', 'created_at']
        read_only_fields = ['id', 'created_at']


