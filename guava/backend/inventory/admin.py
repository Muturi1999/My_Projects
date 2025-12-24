"""
Django admin configuration for inventory app.
"""
from django.contrib import admin
from .models import SerialNumber


@admin.register(SerialNumber)
class SerialNumberAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'imei', 'variant', 'status', 'order_item', 'assigned_at', 'created_at')
    list_filter = ('status', 'variant__product__category', 'created_at')
    search_fields = ('serial_number', 'imei', 'variant__product__name', 'variant__sku')
    readonly_fields = ('assigned_at', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Serial/IMEI Information', {
            'fields': ('serial_number', 'imei', 'variant')
        }),
        ('Assignment', {
            'fields': ('order_item', 'status', 'assigned_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

