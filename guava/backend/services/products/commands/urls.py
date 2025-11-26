"""
URLs for product commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCommandViewSet

router = DefaultRouter()
router.register(r'', ProductCommandViewSet, basename='product-command')

urlpatterns = [
    path('', include(router.urls)),
]


