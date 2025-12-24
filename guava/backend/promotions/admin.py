"""
Django admin configuration for promotions app.
"""
from django.contrib import admin
from .models import Discount, FlashSale


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'discount_type', 'discount_value', 'percentage', 'is_active', 'is_valid', 'used_count', 'created_at')
    list_filter = ('discount_type', 'is_active', 'valid_from', 'valid_until')
    search_fields = ('name', 'code', 'description')
    filter_horizontal = ('products', 'variants', 'categories', 'brands')
    readonly_fields = ('used_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Discount Details', {
            'fields': ('discount_type', 'discount_value', 'percentage', 'min_order_value')
        }),
        ('Applicable To', {
            'fields': ('products', 'variants', 'categories', 'brands')
        }),
        ('Validity', {
            'fields': ('valid_from', 'valid_until', 'is_active')
        }),
        ('Usage Limits', {
            'fields': ('max_uses', 'used_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_time', 'end_time', 'discount_percentage', 'is_active', 'is_active_now', 'sold_count', 'created_at')
    list_filter = ('is_active', 'start_time', 'end_time')
    search_fields = ('name', 'description')
    filter_horizontal = ('products', 'variants')
    readonly_fields = ('sold_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Sale Timing', {
            'fields': ('start_time', 'end_time', 'is_active')
        }),
        ('Discount', {
            'fields': ('discount_percentage',)
        }),
        ('Stock Limits', {
            'fields': ('max_stock_per_product', 'total_stock_limit', 'sold_count')
        }),
        ('Products', {
            'fields': ('products', 'variants')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

