"""
Django admin configuration for accounts app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    list_display = ('email', 'username', 'phone', 'is_customer', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_customer', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'phone')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Customer Profile', {
            'fields': ('phone', 'address', 'city', 'postal_code', 'country', 'is_customer')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Customer Profile', {
            'fields': ('email', 'phone', 'is_customer')
        }),
    )

