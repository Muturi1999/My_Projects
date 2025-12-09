"""
Serializers for account queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from commands.models import User, Admin, Address


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile (read-only)"""
    full_name = serializers.SerializerMethodField()
    addresses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'name', 'first_name', 'last_name',
            'full_name', 'date_of_birth', 'gender', 'profile_picture',
            'email_verified', 'phone_verified', 'date_joined', 'last_login',
            'addresses_count'
        ]
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def get_addresses_count(self, obj):
        return obj.addresses.filter(is_active=True).count()


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for user list (minimal fields)"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'name', 'full_name',
            'email_verified', 'phone_verified', 'is_active', 'date_joined'
        ]
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class AddressReadSerializer(serializers.ModelSerializer):
    """Serializer for reading addresses"""
    class Meta:
        model = Address
        fields = [
            'id', 'label', 'first_name', 'last_name', 'phone',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = fields


class AdminReadSerializer(serializers.ModelSerializer):
    """Serializer for reading admin details"""
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Admin
        fields = [
            'id', 'user', 'user_details', 'role', 'permissions',
            'department', 'created_at', 'updated_at'
        ]
        read_only_fields = fields
    
    def get_user_details(self, obj):
        return {
            'id': str(obj.user.id),
            'email': obj.user.email,
            'phone': obj.user.phone,
            'name': obj.user.get_full_name(),
            'is_active': obj.user.is_active,
        }

