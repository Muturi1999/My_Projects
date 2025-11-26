"""
Optimized serializers for product queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Product, ProductSpecification, ProductImage, ProductRating


class ProductSpecificationReadSerializer(serializers.ModelSerializer):
    """Optimized serializer for product specifications (read)"""
    
    class Meta:
        model = ProductSpecification
        fields = ['processor', 'ram', 'storage', 'screen', 'os', 'generation', 'printer_type', 'features']
        read_only = True


class ProductImageReadSerializer(serializers.ModelSerializer):
    """Optimized serializer for product images (read)"""
    
    class Meta:
        model = ProductImage
        fields = ['image_url', 'alt_text', 'order']
        read_only = True


class ProductListSerializer(BaseReadSerializer):
    """
    Optimized serializer for product list (minimal fields for performance).
    """
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'original_price', 'discount_percentage',
            'image', 'category_slug', 'brand_slug', 'hot', 'rating', 'rating_count',
            'stock_quantity', 'created_at'
        ]


class ProductDetailSerializer(BaseReadSerializer):
    """
    Detailed serializer for single product (includes all fields and relationships).
    """
    specifications = ProductSpecificationReadSerializer(source='specifications', read_only=True)
    product_images = ProductImageReadSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'original_price',
            'discount_percentage', 'image', 'images', 'category_slug', 'brand_slug',
            'hot', 'featured', 'rating', 'rating_count', 'stock_quantity',
            'specifications', 'product_images', 'created_at', 'updated_at'
        ]


class ProductRatingReadSerializer(serializers.ModelSerializer):
    """Serializer for product ratings (read)"""
    
    class Meta:
        model = ProductRating
        fields = ['id', 'rating', 'comment', 'user_name', 'created_at']
        read_only = True


