"""
Serializers for products app.
"""
from rest_framework import serializers
from .models import Category, Brand, Product, ProductVariant, ProductImage, ProductSpecification


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'icon', 'image', 'parent', 'subcategories', 'order', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_subcategories(self, obj):
        if hasattr(obj, 'subcategories'):
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model."""
    
    class Meta:
        model = Brand
        fields = ('id', 'name', 'slug', 'logo', 'image', 'color', 'description', 'discount', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductSpecificationSerializer(serializers.ModelSerializer):
    """Serializer for ProductSpecification model."""
    
    class Meta:
        model = ProductSpecification
        fields = ('processor', 'ram', 'storage', 'screen', 'os', 'generation', 'printer_type', 'features')


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'image_url', 'alt_text', 'order')
        read_only_fields = ('id',)
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for ProductVariant model."""
    effective_price = serializers.ReadOnlyField()
    effective_original_price = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = ('id', 'ram', 'storage', 'color', 'sku', 'price', 'original_price',
                  'effective_price', 'effective_original_price', 'stock_quantity',
                  'image', 'image_url', 'is_active')
        read_only_fields = ('id', 'effective_price', 'effective_original_price')
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    discount_percentage = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    product_images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    stock_quantity = serializers.SerializerMethodField()
    
    # Make category optional during write (we'll set it from category_slug_write)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, write_only=True)
    
    # Write fields for category/brand slugs
    category_slug_write = serializers.CharField(write_only=True, required=True, allow_blank=False)
    brand_slug_write = serializers.CharField(write_only=True, required=True, allow_blank=False)  # Made mandatory
    subcategory_slug = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    # Mandatory fields for product creation
    stock_quantity_write = serializers.IntegerField(write_only=True, required=True, min_value=0, help_text='Stock quantity is mandatory')
    image_url_write = serializers.URLField(write_only=True, required=True, allow_blank=False, help_text='Product image URL is mandatory')
    part_number_write = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True, help_text='Manufacturer part number')
    availability_write = serializers.CharField(write_only=True, required=False, allow_blank=True, help_text='Availability status')
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'description', 'price', 'original_price',
                  'discount_percentage', 'image', 'image_url', 'images', 'product_images',
                  'category', 'category_slug', 'category_slug_write', 'subcategory', 'subcategory_slug',
                  'brand', 'brand_slug', 'brand_name', 'brand_slug_write', 'part_number', 'part_number_write',
                  'availability', 'availability_write', 'hot', 'featured',
                  'rating', 'rating_count', 'stock_quantity', 'stock_quantity_write',
                  'image_url_write', 'specifications', 'variants',
                  'sku', 'tags', 'condition', 'created_at', 'updated_at')
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')
        extra_kwargs = {
            'category': {'required': False},  # Make category optional during write (we use category_slug_write)
        }
    
    def validate_category_slug_write(self, value):
        """Validate that category_slug_write is provided and category exists."""
        if not value or (isinstance(value, str) and value.strip() == ''):
            raise serializers.ValidationError('Category slug is required.')
        
        from .models import Category
        try:
            Category.objects.get(slug=value.strip())
        except Category.DoesNotExist:
            available = list(Category.objects.values_list('slug', flat=True))
            error_msg = f'Category with slug "{value}" not found.'
            if available:
                error_msg += f' Available: {", ".join(available)}'
            raise serializers.ValidationError(error_msg)
        
        return value.strip() if isinstance(value, str) else value
    
    def validate_brand_slug_write(self, value):
        """Validate that brand_slug_write is provided and brand exists."""
        if not value or (isinstance(value, str) and value.strip() == ''):
            raise serializers.ValidationError('Brand slug is required.')
        
        from .models import Brand
        try:
            Brand.objects.get(slug=value.strip())
        except Brand.DoesNotExist:
            available = list(Brand.objects.values_list('slug', flat=True))
            error_msg = f'Brand with slug "{value}" not found.'
            if available:
                error_msg += f' Available: {", ".join(available)}'
            raise serializers.ValidationError(error_msg)
        
        return value.strip() if isinstance(value, str) else value
    
    def validate_name(self, value):
        """Validate that name is provided."""
        if not value or (isinstance(value, str) and value.strip() == ''):
            raise serializers.ValidationError('Product name is required.')
        return value.strip() if isinstance(value, str) else value
    
    def validate_image_url_write(self, value):
        """Validate that image_url_write is provided."""
        if not value or (isinstance(value, str) and value.strip() == ''):
            raise serializers.ValidationError('Product image URL is required.')
        return value.strip() if isinstance(value, str) else value
    
    def create(self, validated_data):
        """Create product with category/brand from slugs."""
        # category_slug_write is already validated by validate_category_slug_write method
        category_slug = validated_data.pop('category_slug_write')
        brand_slug = validated_data.pop('brand_slug_write')  # Now mandatory
        subcategory_name = validated_data.pop('subcategory_slug', None)
        
        # Get category (already validated to exist in validate_category_slug_write)
        category = Category.objects.get(slug=category_slug)
        
        # Set category in validated_data (required field)
        validated_data['category'] = category
        
        # Get brand (now mandatory)
        brand = Brand.objects.get(slug=brand_slug)
        validated_data['brand'] = brand
        
        # Handle subcategory
        if subcategory_name:
            validated_data['subcategory'] = subcategory_name
        
        # Handle part_number_write
        part_number = validated_data.pop('part_number_write', None)
        if part_number:
            validated_data['part_number'] = part_number
        
        # Handle availability_write
        availability = validated_data.pop('availability_write', None)
        if availability:
            validated_data['availability'] = availability
        
        # Handle image_url_write (mandatory)
        image_url = validated_data.pop('image_url_write', None)
        if image_url:
            validated_data['image_url'] = image_url
        
        # Handle stock_quantity_write (mandatory)
        stock_quantity = validated_data.pop('stock_quantity_write', 0)
        
        # Create product
        product = Product.objects.create(**validated_data)
        
        # Create default variant with stock_quantity (mandatory)
        from .models import ProductVariant
        sku = validated_data.get('sku') or f"{product.slug}-default"
        ProductVariant.objects.create(
            product=product,
            sku=sku,
            stock_quantity=stock_quantity,
            is_active=True
        )
        
        return product
    
    def update(self, instance, validated_data):
        """Update product with category/brand from slugs."""
        category_slug = validated_data.pop('category_slug_write', None)
        brand_slug = validated_data.pop('brand_slug_write', None)
        subcategory_name = validated_data.pop('subcategory_slug', None)
        part_number = validated_data.pop('part_number_write', None)
        availability = validated_data.pop('availability_write', None)
        image_url = validated_data.pop('image_url_write', None)
        stock_quantity = validated_data.pop('stock_quantity_write', None)
        
        # Update category
        if subcategory_name:
            try:
                instance.category = Category.objects.get(slug=subcategory_name)
            except Category.DoesNotExist:
                pass
        elif category_slug:
            try:
                instance.category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                pass
        
        # Update brand
        if brand_slug:
            try:
                instance.brand = Brand.objects.get(slug=brand_slug)
            except Brand.DoesNotExist:
                instance.brand = None
        elif brand_slug is not None and brand_slug == '':
            instance.brand = None
        
        # Update new fields
        if subcategory_name:
            instance.subcategory = subcategory_name
        if part_number is not None:
            instance.part_number = part_number
        if availability is not None:
            instance.availability = availability
        if image_url is not None:
            instance.image_url = image_url
        
        # Update stock quantity on default variant
        if stock_quantity is not None:
            from .models import ProductVariant
            default_variant = instance.variants.first()
            if default_variant:
                default_variant.stock_quantity = stock_quantity
                default_variant.save()
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url
    
    def get_images(self, obj):
        """Get all product images as a list of URLs."""
        images = []
        if obj.image:
            request = self.context.get('request')
            if request:
                images.append(request.build_absolute_uri(obj.image.url))
            else:
                images.append(obj.image.url)
        
        # Add product_images
        for img in obj.product_images.all():
            if img.image:
                request = self.context.get('request')
                if request:
                    images.append(request.build_absolute_uri(img.image.url))
                else:
                    images.append(img.image.url)
            elif img.image_url:
                images.append(img.image_url)
        
        return images if images else [obj.image_url] if obj.image_url else []
    
    def get_stock_quantity(self, obj):
        """Get total stock quantity from all variants."""
        return sum(variant.stock_quantity for variant in obj.variants.filter(is_active=True))


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True)
    discount_percentage = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    product_images = ProductImageSerializer(many=True, read_only=True)
    stock_quantity = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'price', 'original_price', 'discount_percentage',
                  'image', 'image_url', 'images', 'product_images', 'category_slug', 'brand_slug', 
                  'hot', 'featured', 'rating', 'rating_count', 'stock_quantity', 'sku', 'tags', 'condition')
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url
    
    def get_images(self, obj):
        """Get all product images as a list of URLs."""
        images = []
        if obj.image:
            request = self.context.get('request')
            if request:
                images.append(request.build_absolute_uri(obj.image.url))
            else:
                images.append(obj.image.url)
        
        # Add product_images
        for img in obj.product_images.all():
            if img.image:
                request = self.context.get('request')
                if request:
                    images.append(request.build_absolute_uri(img.image.url))
                else:
                    images.append(img.image.url)
            elif img.image_url:
                images.append(img.image_url)
        
        return images if images else [obj.image_url] if obj.image_url else []
    
    def get_stock_quantity(self, obj):
        """Get total stock quantity from all active variants."""
        return sum(variant.stock_quantity for variant in obj.variants.filter(is_active=True))

