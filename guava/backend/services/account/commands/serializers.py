"""
Serializers for account commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta
import secrets
import string
from .models import User, Admin, Address, VerificationCode, PasswordResetToken


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'name', 'first_name', 'last_name',
            'password', 'confirm_password', 'date_of_birth', 'gender',
            'verification_method', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if not attrs.get('email') and not attrs.get('phone'):
            raise serializers.ValidationError("Either email or phone must be provided.")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email_or_phone = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')
        
        # Try to find user by email or phone
        user = None
        if '@' in email_or_phone:
            try:
                user = User.objects.get(email=email_or_phone, is_active=True)
            except User.DoesNotExist:
                pass
        else:
            try:
                user = User.objects.get(phone=email_or_phone, is_active=True)
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        
        # Authenticate user
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials.")
        
        attrs['user'] = user
        return attrs


class AdminLoginSerializer(serializers.Serializer):
    """Serializer for admin login"""
    email_or_phone = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')
        
        # Try to find admin user by email or phone
        user = None
        if '@' in email_or_phone:
            try:
                user = User.objects.get(email=email_or_phone, is_active=True, is_admin=True)
            except User.DoesNotExist:
                pass
        else:
            try:
                user = User.objects.get(phone=email_or_phone, is_active=True, is_admin=True)
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError("Invalid admin credentials.")
        
        # Authenticate user
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid admin credentials.")
        
        attrs['user'] = user
        return attrs


class SocialLoginSerializer(serializers.Serializer):
    """Serializer for social login (Google, Apple, Facebook)"""
    provider = serializers.ChoiceField(choices=['google', 'apple', 'facebook'], required=True)
    provider_id = serializers.CharField(required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email_or_phone = serializers.CharField(required=True)
    method = serializers.ChoiceField(choices=['email', 'phone'], required=True)


class PasswordResetVerifySerializer(serializers.Serializer):
    """Serializer for password reset verification"""
    email_or_phone = serializers.CharField(required=True)
    code = serializers.CharField(required=True, max_length=6, min_length=6)


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset"""
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs


class VerificationCodeSerializer(serializers.Serializer):
    """Serializer for verification code"""
    email_or_phone = serializers.CharField(required=True)
    code = serializers.CharField(required=True, max_length=6, min_length=6)
    verification_type = serializers.ChoiceField(
        choices=['email_verification', 'phone_verification'],
        required=True
    )


class ResendVerificationCodeSerializer(serializers.Serializer):
    """Serializer for resending verification code"""
    email_or_phone = serializers.CharField(required=True)
    verification_type = serializers.ChoiceField(
        choices=['email_verification', 'phone_verification', 'password_reset'],
        required=True
    )


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = User
        fields = [
            'id', 'name', 'first_name', 'last_name', 'date_of_birth',
            'gender', 'profile_picture', 'email', 'phone'
        ]
        read_only_fields = ['id', 'email', 'phone']  # Email/phone changes require verification


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for user addresses"""
    class Meta:
        model = Address
        fields = [
            'id', 'label', 'first_name', 'last_name', 'phone',
            'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # If this is set as default, unset other defaults
        if validated_data.get('is_default', False):
            Address.objects.filter(user=user, is_default=True).update(is_default=False)
        
        return Address.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # If this is set as default, unset other defaults
        if validated_data.get('is_default', False):
            Address.objects.filter(user=instance.user, is_default=True).exclude(id=instance.id).update(is_default=False)
        
        return super().update(instance, validated_data)


class AdminSerializer(serializers.ModelSerializer):
    """Serializer for admin"""
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_admin=True))
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Admin
        fields = [
            'id', 'user', 'user_details', 'role', 'permissions',
            'department', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_details(self, obj):
        return {
            'id': str(obj.user.id),
            'email': obj.user.email,
            'phone': obj.user.phone,
            'name': obj.user.get_full_name(),
        }

