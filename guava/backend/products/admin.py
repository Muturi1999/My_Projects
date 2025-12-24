"""
Django admin configuration for products app.
"""
from django.contrib import admin
from .models import Category, Brand, Product, ProductVariant, ProductImage, ProductSpecification


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'order', 'created_at')
    list_filter = ('parent', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'discount', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


class ProductSpecificationInline(admin.StackedInline):
    model = ProductSpecification
    extra = 0


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'image_url', 'alt_text', 'order')


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('ram', 'storage', 'color', 'sku', 'price', 'original_price', 'stock_quantity', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'brand', 'price', 'hot', 'featured', 'rating', 'created_at')
    list_filter = ('category', 'brand', 'hot', 'featured', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductSpecificationInline, ProductImageInline, ProductVariantInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'category', 'brand')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price')
        }),
        ('Flags & Ratings', {
            'fields': ('hot', 'featured', 'rating', 'rating_count')
        }),
        ('Media', {
            'fields': ('image', 'image_url')
        }),
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'ram', 'storage', 'color', 'sku', 'effective_price', 'stock_quantity', 'is_active')
    list_filter = ('is_active', 'product__category', 'product__brand')
    search_fields = ('product__name', 'sku', 'ram', 'storage', 'color')
    readonly_fields = ('effective_price', 'effective_original_price')

