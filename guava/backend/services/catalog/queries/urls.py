"""
URLs for catalog queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryQueryViewSet, BrandQueryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryQueryViewSet, basename='category-query')
router.register(r'brands', BrandQueryViewSet, basename='brand-query')

urlpatterns = [
    path('', include(router.urls)),
]


