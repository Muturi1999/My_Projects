# ecommerce-backend/store/serializers.py
from django.db import transaction
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import (
    Product, Category, ProductImage, ProductVariant, Attribute, AttributeValue, Review,
    Order, OrderItem
)

# ----------------------------
# Product Serializers
# ----------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_main')


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(source='get_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'category', 'category_name',
            'price', 'discounted_price', 'current_price', 'stock_quantity',
            'is_available', 'short_description', 'images',
            'is_featured', 'is_best_selling', 'created_at'
        )


# ----------------------------
# Variant & Attribute Serializers
# ----------------------------
class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = AttributeValue
        fields = ('id', 'value', 'attribute_name')


class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = AttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ('id', 'sku', 'price', 'stock_quantity', 'attributes')


# ----------------------------
# Review Serializers
# ----------------------------
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'user_name', 'rating', 'title', 'content', 'image', 'created_at')
        read_only_fields = ('user', 'created_at')


# ----------------------------
# Order & Cart Serializers
# ----------------------------
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('product_name', 'quantity', 'price_at_purchase', 'subtotal')
        read_only_fields = ('product_name', 'price_at_purchase', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'full_name', 'email', 'order_date', 'status', 'total_amount', 'shipping_address', 'items')
        read_only_fields = ('user', 'order_date', 'status', 'total_amount')


# ----------------------------
# Category Serializer
# ----------------------------
class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image', 'product_count')

    def get_product_count(self, obj):
        return obj.products.count()

# ecommerce-backend/store/serializers.py (Update and add to the file)

# ... imports (including ProductImage, ProductVariant, AttributeValue, etc.) ...
from django.db import transaction

# --- Existing ProductImageSerializer ---
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_main', 'sort_order')

# --- Existing ProductVariantSerializer (Read-only) ---
class ProductVariantWriteSerializer(serializers.ModelSerializer):
    # Use PKs for attributes during write
    attributes = serializers.PrimaryKeyRelatedField(
        queryset=AttributeValue.objects.all(), 
        many=True, 
        required=False
    )
    
    class Meta:
        model = ProductVariant
        fields = ('id', 'sku', 'price', 'stock_quantity', 'attributes')


# --- Master ProductSerializer for Admin CRUD ---
class AdminProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    variants = ProductVariantWriteSerializer(many=True, required=False)
    
    # Expose category slug and name for display
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'current_price', 'stock_quantity',
            'category', 'category_slug', 'category_name', 'brand', 'is_active', 
            'is_featured', 'images', 'variants'
        )
        lookup_field = 'slug'

    # Handle Nested Creation (Images and Variants)
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])

        with transaction.atomic():
            product = Product.objects.create(**validated_data)
            
            # Create Images
            for image_data in images_data:
                ProductImage.objects.create(product=product, **image_data)
            
            # Create Variants
            for variant_data in variants_data:
                attributes = variant_data.pop('attributes', [])
                variant = ProductVariant.objects.create(product=product, **variant_data)
                variant.attributes.set(attributes) # Set M2M relationship

            return product

    # Handle Nested Update (More complex, focuses on replacement/partial update)
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        variants_data = validated_data.pop('variants', None)

        # Update base fields
        instance.name = validated_data.get('name', instance.name)
        # ... update other base fields ...
        instance.save()

        # Handle Images (simple replace logic for this example)
        if images_data is not None:
            instance.images.all().delete() # Delete all existing images
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)

        # Handle Variants (complex: requires checking IDs for update/create/delete)
        if variants_data is not None:
            # For simplicity, we'll only allow adding new variants here.
            # A robust system would use explicit IDs to manage updates/deletes.
            for variant_data in variants_data:
                variant_id = variant_data.get('id')
                attributes = variant_data.pop('attributes', [])
                
                if variant_id:
                    # Update existing variant logic here...
                    pass
                else:
                    # Create new variant
                    variant = ProductVariant.objects.create(product=instance, **variant_data)
                    variant.attributes.set(attributes)
            
        return instance