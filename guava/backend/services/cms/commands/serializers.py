"""
Serializers for CMS commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseWriteSerializer
from .models import Homepage, Navigation, Footer, ServiceGuarantee


class HomepageWriteSerializer(BaseWriteSerializer):
    """Serializer for homepage"""
    
    class Meta:
        model = Homepage
        fields = [
            'id', 'title', 'description', 'hero_slides', 'shop_by_category',
            'featured_deals', 'custom_sections', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NavigationWriteSerializer(BaseWriteSerializer):
    """Serializer for navigation"""
    
    class Meta:
        model = Navigation
        fields = [
            'id', 'name', 'items', 'footer_items', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FooterWriteSerializer(BaseWriteSerializer):
    """Serializer for footer"""
    
    class Meta:
        model = Footer
        fields = [
            'id', 'copyright_text', 'social_links', 'columns', 'payment_methods',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceGuaranteeWriteSerializer(BaseWriteSerializer):
    """Serializer for service guarantees"""
    
    class Meta:
        model = ServiceGuarantee
        fields = [
            'id', 'title', 'description', 'icon', 'order',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


