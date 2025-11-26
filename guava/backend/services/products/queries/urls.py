"""
URLs for product queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductQueryViewSet

router = DefaultRouter()
router.register(r'', ProductQueryViewSet, basename='product-query')

urlpatterns = [
    path('', include(router.urls)),
]


