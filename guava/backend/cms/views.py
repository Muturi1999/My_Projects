"""
Views for CMS app.
"""
from rest_framework import viewsets, permissions
from .models import HomepageSection, HeroSlide
from .serializers import HomepageSectionSerializer, HeroSlideSerializer
from products.permissions import IsAdminOrStaff


class HomepageSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for HomepageSection model - Full CRUD for admin/staff."""
    queryset = HomepageSection.objects.prefetch_related('products').all()
    serializer_class = HomepageSectionSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ['section_type', 'is_active']
    ordering = ['order', 'section_type']


class HeroSlideViewSet(viewsets.ModelViewSet):
    """ViewSet for HeroSlide model - Full CRUD for admin/staff."""
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ['is_active']
    ordering = ['order', 'created_at']

