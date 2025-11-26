"""
Base serializers for all microservices.
"""
from rest_framework import serializers
from .models import BaseModel


class BaseSerializer(serializers.ModelSerializer):
    """
    Base serializer with common fields.
    """
    id = serializers.UUIDField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = BaseModel
        fields = ['id', 'created_at', 'updated_at', 'is_active']


class BaseReadSerializer(BaseSerializer):
    """
    Optimized serializer for read operations (queries).
    Excludes write-only fields and includes computed fields.
    """
    pass


class BaseWriteSerializer(BaseSerializer):
    """
    Serializer for write operations (commands).
    Includes validation and write-only fields.
    """
    pass


