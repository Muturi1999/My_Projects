"""
URLs for report queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SalesReportQueryViewSet, ProductReportQueryViewSet,
    InventoryReportQueryViewSet
)

router = DefaultRouter()
router.register(r'sales', SalesReportQueryViewSet, basename='sales-report-query')
router.register(r'products', ProductReportQueryViewSet, basename='product-report-query')
router.register(r'inventory', InventoryReportQueryViewSet, basename='inventory-report-query')

urlpatterns = [
    path('', include(router.urls)),
]

