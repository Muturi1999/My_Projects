"""
Serializers for CMS app.
"""
from rest_framework import serializers
from .models import HomepageSection, HeroSlide
from products.serializers import ProductListSerializer


class HeroSlideSerializer(serializers.ModelSerializer):
    """Serializer for HeroSlide model."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroSlide
        fields = ('id', 'title', 'description', 'cta_label', 'cta_href', 'image',
                  'image_url', 'badge', 'is_active', 'order', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class HomepageSectionSerializer(serializers.ModelSerializer):
    """Serializer for HomepageSection model."""
    products = ProductListSerializer(many=True, read_only=True)
    section_type_display = serializers.CharField(source='get_section_type_display', read_only=True)
    
    class Meta:
        model = HomepageSection
        fields = ('id', 'section_type', 'section_type_display', 'title', 'description',
                  'is_active', 'order', 'products', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

