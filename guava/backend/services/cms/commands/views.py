"""
Views for CMS commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseCommandViewSet
from .models import Homepage, Navigation, Footer, ServiceGuarantee
from .serializers import (
    HomepageWriteSerializer, NavigationWriteSerializer,
    FooterWriteSerializer, ServiceGuaranteeWriteSerializer
)


class HomepageCommandViewSet(BaseCommandViewSet):
    """ViewSet for homepage command operations"""
    queryset = Homepage.objects.filter(is_active=True)
    serializer_class = HomepageWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['put'], url_path='update')
    def update_homepage(self, request):
        """Update homepage (singleton pattern)"""
        homepage = Homepage.objects.filter(is_active=True).first()
        if not homepage:
            homepage = Homepage.objects.create()
        
        serializer = self.get_serializer(homepage, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class NavigationCommandViewSet(BaseCommandViewSet):
    """ViewSet for navigation command operations"""
    queryset = Navigation.objects.filter(is_active=True)
    serializer_class = NavigationWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['put'], url_path='update')
    def update_navigation(self, request):
        """Update navigation (singleton pattern)"""
        navigation = Navigation.objects.filter(is_active=True).first()
        if not navigation:
            navigation = Navigation.objects.create()
        
        serializer = self.get_serializer(navigation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class FooterCommandViewSet(BaseCommandViewSet):
    """ViewSet for footer command operations"""
    queryset = Footer.objects.filter(is_active=True)
    serializer_class = FooterWriteSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['put'], url_path='update')
    def update_footer(self, request):
        """Update footer (singleton pattern)"""
        footer = Footer.objects.filter(is_active=True).first()
        if not footer:
            footer = Footer.objects.create()
        
        serializer = self.get_serializer(footer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class ServiceGuaranteeCommandViewSet(BaseCommandViewSet):
    """ViewSet for service guarantee command operations"""
    queryset = ServiceGuarantee.objects.filter(is_active=True)
    serializer_class = ServiceGuaranteeWriteSerializer
    lookup_field = 'id'


