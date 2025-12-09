"""
Django admin configuration for account models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Admin, Address, VerificationCode, PasswordResetToken, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    list_display = ['email', 'phone', 'name', 'is_active', 'is_admin', 'email_verified', 'phone_verified', 'date_joined']
    list_filter = ['is_active', 'is_admin', 'is_staff', 'is_superuser', 'email_verified', 'phone_verified', 'date_joined']
    search_fields = ['email', 'phone', 'name', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'password')}),
        ('Personal info', {'fields': ('name', 'first_name', 'last_name', 'date_of_birth', 'gender', 'profile_picture')}),
        ('Verification', {'fields': ('email_verified', 'phone_verified', 'verification_method')}),
        ('Social Login', {'fields': ('google_id', 'apple_id', 'facebook_id')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_admin', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'password1', 'password2', 'is_staff', 'is_admin'),
        }),
    )


@admin.register(Admin)
class AdminProfileAdmin(admin.ModelAdmin):
    """Admin interface for Admin model"""
    list_display = ['user', 'role', 'department', 'created_at']
    list_filter = ['role', 'department', 'created_at']
    search_fields = ['user__email', 'user__phone', 'user__name', 'department']
    raw_id_fields = ['user']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Admin interface for Address model"""
    list_display = ['user', 'label', 'city', 'country', 'is_default', 'created_at']
    list_filter = ['country', 'city', 'is_default', 'created_at']
    search_fields = ['user__email', 'user__phone', 'address_line_1', 'city', 'postal_code']
    raw_id_fields = ['user']


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    """Admin interface for VerificationCode model"""
    list_display = ['user', 'code', 'verification_type', 'target', 'is_used', 'expires_at', 'created_at']
    list_filter = ['verification_type', 'is_used', 'expires_at', 'created_at']
    search_fields = ['user__email', 'user__phone', 'code', 'target']
    raw_id_fields = ['user']
    readonly_fields = ['code', 'created_at']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Admin interface for PasswordResetToken model"""
    list_display = ['user', 'token', 'is_used', 'expires_at', 'created_at']
    list_filter = ['is_used', 'expires_at', 'created_at']
    search_fields = ['user__email', 'user__phone', 'token']
    raw_id_fields = ['user']
    readonly_fields = ['token', 'created_at']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin interface for UserSession model"""
    list_display = ['user', 'session_key', 'ip_address', 'is_active', 'last_activity', 'created_at']
    list_filter = ['is_active', 'last_activity', 'created_at']
    search_fields = ['user__email', 'user__phone', 'session_key', 'ip_address']
    raw_id_fields = ['user']
    readonly_fields = ['session_key', 'created_at']

