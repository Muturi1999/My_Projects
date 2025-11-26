"""
Serializers for product commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Product, ProductSpecification, ProductImage, ProductRating


class ProductSpecificationSerializer(serializers.ModelSerializer):
    """Serializer for product specifications"""
    
    class Meta:
        model = ProductSpecification
        fields = [
            'id', 'processor', 'ram', 'storage', 'screen', 'os', 'generation',
            'printer_type', 'features'
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'order']


class ProductWriteSerializer(BaseWriteSerializer):
    """
    Serializer for creating and updating products (write operations).
    """
    specifications = ProductSpecificationSerializer(required=False, allow_null=True)
    images = ProductImageSerializer(many=True, required=False)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'original_price',
            'discount', 'image', 'images', 'category_slug', 'brand_slug',
            'hot', 'featured', 'rating', 'rating_count', 'stock_quantity',
            'specifications', 'images', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate product data"""
        if data.get('original_price', 0) < data.get('price', 0):
            raise serializers.ValidationError({
                'price': 'Price cannot be greater than original price'
            })
        
        # Calculate discount if not provided
        if 'discount' not in data or data['discount'] == 0:
            if data.get('original_price') and data.get('price'):
                discount = int(((data['original_price'] - data['price']) / data['original_price']) * 100)
                data['discount'] = discount
        
        return data
    
    def create(self, validated_data):
        """Create product with nested specifications and images"""
        specifications_data = validated_data.pop('specifications', None)
        images_data = validated_data.pop('images', [])
        
        product = Product.objects.create(**validated_data)
        
        if specifications_data:
            ProductSpecification.objects.create(product=product, **specifications_data)
        
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
        
        return product
    
    def update(self, instance, validated_data):
        """Update product with nested specifications and images"""
        specifications_data = validated_data.pop('specifications', None)
        images_data = validated_data.pop('images', None)
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update specifications
        if specifications_data is not None:
            if hasattr(instance, 'specifications'):
                spec = instance.specifications
                for attr, value in specifications_data.items():
                    setattr(spec, attr, value)
                spec.save()
            else:
                ProductSpecification.objects.create(product=instance, **specifications_data)
        
        # Update images
        if images_data is not None:
            instance.product_images.all().delete()
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)
        
        return instance


class ProductRatingSerializer(serializers.ModelSerializer):
    """Serializer for product ratings"""
    
    class Meta:
        model = ProductRating
        fields = ['id', 'product', 'rating', 'comment', 'user_id', 'user_name', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


