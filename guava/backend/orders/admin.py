"""
Django admin configuration for orders app.
"""
from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Shipping, Warranty


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'subtotal', 'updated_at')
    inlines = [CartItemInline]
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'variant', 'quantity', 'line_total', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('cart__user__email', 'variant__product__name')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('line_total',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'guest_email', 'status', 'total', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'user__email', 'guest_email', 'guest_phone')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'completed_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'guest_email', 'guest_phone', 'status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'discount_amount', 'shipping_cost', 'tax', 'total')
        }),
        ('Payment', {
            'fields': ('payment_method', 'payment_status', 'paid_at')
        }),
        ('Shipping', {
            'fields': ('shipping_name', 'shipping_phone', 'shipping_email', 'shipping_address',
                      'shipping_city', 'shipping_postal_code', 'shipping_country', 'shipping_method')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'variant', 'quantity', 'price', 'line_total', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('order__order_number', 'product__name')
    readonly_fields = ('line_total',)


@admin.register(Shipping)
class ShippingAdmin(admin.ModelAdmin):
    list_display = ('order', 'tracking_number', 'carrier', 'shipped_at', 'delivered_at')
    list_filter = ('carrier', 'shipped_at', 'delivered_at')
    search_fields = ('order__order_number', 'tracking_number')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Warranty)
class WarrantyAdmin(admin.ModelAdmin):
    list_display = ('order_item', 'warranty_period_months', 'starts_at', 'expires_at', 'is_active', 'days_remaining')
    list_filter = ('warranty_period_months', 'starts_at', 'expires_at')
    search_fields = ('order_item__order__order_number', 'order_item__product__name')
    readonly_fields = ('is_active', 'days_remaining', 'created_at', 'updated_at')

