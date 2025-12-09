"""
Views for account queries (read operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from shared.common.viewsets import BaseQueryViewSet
from .models import User, Admin, Address
from .serializers import (
    UserProfileSerializer, UserListSerializer,
    AddressReadSerializer, AdminReadSerializer
)


class UserQueryViewSet(BaseQueryViewSet):
    """ViewSet for querying users"""
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]  # Only admins can list users
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['email_verified', 'phone_verified', 'is_admin']
    search_fields = ['email', 'phone', 'name', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'last_login']
    ordering = ['-date_joined']
    
    @action(detail=True, methods=['get'], url_path='profile')
    def profile(self, request, pk=None):
        """Get detailed user profile"""
        user = self.get_object()
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)


class AddressQueryViewSet(BaseQueryViewSet):
    """ViewSet for querying addresses"""
    serializer_class = AddressReadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_default', 'city', 'country']
    ordering_fields = ['created_at', 'is_default']
    ordering = ['-is_default', '-created_at']
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user, is_active=True)
    
    @action(detail=False, methods=['get'], url_path='default')
    def default(self, request):
        """Get default address"""
        try:
            address = Address.objects.get(
                user=request.user,
                is_default=True,
                is_active=True
            )
            serializer = self.get_serializer(address)
            return Response(serializer.data)
        except Address.DoesNotExist:
            return Response(
                {'message': 'No default address found'},
                status=404
            )


class AdminQueryViewSet(BaseQueryViewSet):
    """ViewSet for querying admins"""
    queryset = Admin.objects.filter(is_active=True)
    serializer_class = AdminReadSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'department']
    search_fields = ['user__email', 'user__phone', 'user__name', 'department']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

