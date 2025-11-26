"""
Views for CMS queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework.decorators import action
from rest_framework.response import Response
from shared.common.viewsets import BaseQueryViewSet
from .models import Homepage, Navigation, Footer, ServiceGuarantee
from .serializers import (
    HomepageReadSerializer, NavigationReadSerializer,
    FooterReadSerializer, ServiceGuaranteeReadSerializer
)


class HomepageQueryViewSet(BaseQueryViewSet):
    """ViewSet for homepage query operations (GET only)"""
    queryset = Homepage.objects.filter(is_active=True)
    serializer_class = HomepageReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active homepage"""
        homepage = self.queryset.first()
        if not homepage:
            return Response({'error': 'No homepage configured'}, status=404)
        serializer = self.get_serializer(homepage)
        return Response(serializer.data)


class NavigationQueryViewSet(BaseQueryViewSet):
    """ViewSet for navigation query operations (GET only)"""
    queryset = Navigation.objects.filter(is_active=True)
    serializer_class = NavigationReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active navigation"""
        navigation = self.queryset.first()
        if not navigation:
            return Response({'error': 'No navigation configured'}, status=404)
        serializer = self.get_serializer(navigation)
        return Response(serializer.data)


class FooterQueryViewSet(BaseQueryViewSet):
    """ViewSet for footer query operations (GET only)"""
    queryset = Footer.objects.filter(is_active=True)
    serializer_class = FooterReadSerializer
    lookup_field = 'id'
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active footer"""
        footer = self.queryset.first()
        if not footer:
            return Response({'error': 'No footer configured'}, status=404)
        serializer = self.get_serializer(footer)
        return Response(serializer.data)


class ServiceGuaranteeQueryViewSet(BaseQueryViewSet):
    """ViewSet for service guarantee query operations (GET only)"""
    queryset = ServiceGuarantee.objects.filter(is_active=True).order_by('order')
    serializer_class = ServiceGuaranteeReadSerializer
    lookup_field = 'id'


