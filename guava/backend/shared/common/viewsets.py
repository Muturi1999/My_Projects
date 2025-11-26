"""
Base viewsets for all microservices.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction

# Import will be resolved at runtime when shared is installed as a package
try:
    from shared.exceptions.exceptions import ServiceException
except ImportError:
    # Fallback for development
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).parent.parent.parent))
    from shared.exceptions.exceptions import ServiceException


class BaseCommandViewSet(viewsets.ModelViewSet):
    """
    Base viewset for command operations (write side of CQRS).
    Handles POST, PUT, PATCH, DELETE operations.
    """
    
    def perform_create(self, serializer):
        """Override to add custom logic before creation"""
        with transaction.atomic():
            serializer.save()
    
    def perform_update(self, serializer):
        """Override to add custom logic before update"""
        with transaction.atomic():
            serializer.save()
    
    def perform_destroy(self, instance):
        """Override to add custom logic before deletion"""
        with transaction.atomic():
            instance.soft_delete() if hasattr(instance, 'soft_delete') else instance.delete()
    
    def handle_exception(self, exc):
        """Custom exception handling"""
        if isinstance(exc, ServiceException):
            return Response(
                {'error': exc.message, 'code': exc.code},
                status=exc.status_code
            )
        return super().handle_exception(exc)


class BaseQueryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Base viewset for query operations (read side of CQRS).
    Handles GET operations only.
    """
    
    def handle_exception(self, exc):
        """Custom exception handling"""
        if isinstance(exc, ServiceException):
            return Response(
                {'error': exc.message, 'code': exc.code},
                status=exc.status_code
            )
        return super().handle_exception(exc)

