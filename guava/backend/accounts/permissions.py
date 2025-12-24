"""
Custom permissions for accounts app.
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission to only allow admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsAdminOrStaff(permissions.BasePermission):
    """Permission to only allow admin or staff users."""
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission to only allow object owner or admin."""
    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if request.user and request.user.is_staff:
            return True
        # Users can only access their own objects
        return obj.user == request.user

