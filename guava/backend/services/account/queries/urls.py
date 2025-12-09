"""
URLs for account queries (read operations).
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserQueryViewSet, AddressQueryViewSet, AdminQueryViewSet

router = DefaultRouter()
router.register(r'users', UserQueryViewSet, basename='user-query')
router.register(r'addresses', AddressQueryViewSet, basename='address-query')
router.register(r'admins', AdminQueryViewSet, basename='admin-query')

urlpatterns = [
    path('', include(router.urls)),
]

