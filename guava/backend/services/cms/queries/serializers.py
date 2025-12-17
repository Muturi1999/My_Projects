"""
Optimized serializers for CMS queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import serializers
from shared.common.serializers import BaseReadSerializer
from .models import Homepage, Navigation, Footer, ServiceGuarantee


class HomepageReadSerializer(BaseReadSerializer):
    """Serializer for homepage (read)"""
    
    class Meta:
        model = Homepage
        fields = [
            'id', 'title', 'description', 'hero_slides', 'shop_by_category',
            'featured_deals', 'hot_deals', 'custom_sections', 'updated_at'
        ]


class NavigationReadSerializer(BaseReadSerializer):
    """Serializer for navigation (read)"""
    
    class Meta:
        model = Navigation
        fields = ['id', 'name', 'items', 'footer_items', 'updated_at']


class FooterReadSerializer(BaseReadSerializer):
    """Serializer for footer (read)"""
    
    class Meta:
        model = Footer
        fields = [
            'id', 'copyright_text', 'social_links', 'columns', 'payment_methods', 'updated_at'
        ]


class ServiceGuaranteeReadSerializer(BaseReadSerializer):
    """Serializer for service guarantees (read)"""
    
    class Meta:
        model = ServiceGuarantee
        fields = ['id', 'title', 'description', 'icon', 'order']
        read_only = True


