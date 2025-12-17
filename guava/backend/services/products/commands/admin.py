"""
Django admin configuration for Products service.
"""
from django.contrib import admin
from .models import Product, ProductSpecification, ProductImage, ProductRating


class ProductSpecificationInline(admin.TabularInline):
    """Inline admin for product specifications"""
    model = ProductSpecification
    extra = 1
    fields = ('processor', 'ram', 'storage', 'screen', 'os', 'generation', 'printer_type', 'features')


class ProductImageInline(admin.TabularInline):
    """Inline admin for product images"""
    model = ProductImage
    extra = 1
    fields = ('image_url', 'alt_text', 'order')


class ProductRatingInline(admin.TabularInline):
    """Inline admin for product ratings"""
    model = ProductRating
    extra = 0
    readonly_fields = ('created_at',)
    fields = ('rating', 'comment', 'user_id', 'user_name', 'created_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin interface for Product model"""
    list_display = ('name', 'slug', 'price', 'original_price', 'discount', 'category_slug', 'brand_slug', 'hot', 'featured', 'stock_quantity', 'rating', 'is_active', 'created_at')
    list_filter = ('is_active', 'hot', 'featured', 'condition', 'category_slug', 'brand_slug', 'created_at')
    search_fields = ('name', 'slug', 'description', 'sku', 'model', 'category_slug', 'brand_slug')
    readonly_fields = ('id', 'created_at', 'updated_at', 'discount_percentage')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'long_description', 'sku', 'model')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'discount', 'discount_percentage')
        }),
        ('Images', {
            'fields': ('image', 'images')
        }),
        ('Categorization', {
            'fields': ('category_slug', 'subcategory_slug', 'brand_slug', 'supplier_id', 'supplier_name')
        }),
        ('Product Flags', {
            'fields': ('hot', 'featured', 'sections', 'campaigns', 'condition')
        }),
        ('Ratings', {
            'fields': ('rating', 'rating_count')
        }),
        ('Stock & Inventory', {
            'fields': ('stock_quantity', 'tags', 'feature_list', 'extra_attributes')
        }),
        ('Enhanced Details', {
            'fields': ('description_blocks', 'service_info', 'spec_groups', 'addons', 'similar_product_ids'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active', 'id', 'created_at', 'updated_at')
        }),
    )
    
    inlines = [ProductSpecificationInline, ProductImageInline, ProductRatingInline]
    
    def discount_percentage(self, obj):
        """Display calculated discount percentage"""
        return f"{obj.discount_percentage}%"
    discount_percentage.short_description = 'Discount %'


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(admin.ModelAdmin):
    """Admin interface for ProductSpecification model"""
    list_display = ('product', 'processor', 'ram', 'storage', 'screen', 'printer_type', 'created_at')
    list_filter = ('printer_type', 'os', 'created_at')
    search_fields = ('product__name', 'processor', 'ram', 'storage')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Admin interface for ProductImage model"""
    list_display = ('product', 'image_url', 'alt_text', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('product__name', 'alt_text')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ProductRating)
class ProductRatingAdmin(admin.ModelAdmin):
    """Admin interface for ProductRating model"""
    list_display = ('product', 'rating', 'user_name', 'user_id', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__name', 'user_name', 'comment')
    readonly_fields = ('id', 'created_at', 'updated_at')

