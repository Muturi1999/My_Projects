"""
URLs for catalog commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryCommandViewSet, BrandCommandViewSet, CategoryBrandCommandViewSet

router = DefaultRouter()
router.register(r'categories', CategoryCommandViewSet, basename='category-command')
router.register(r'brands', BrandCommandViewSet, basename='brand-command')
router.register(r'category-brands', CategoryBrandCommandViewSet, basename='category-brand-command')

urlpatterns = [
    path('', include(router.urls)),
]


