"""
URLs for report commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SalesReportCommandViewSet, ProductReportCommandViewSet,
    InventoryReportCommandViewSet
)

router = DefaultRouter()
router.register(r'sales', SalesReportCommandViewSet, basename='sales-report-command')
router.register(r'products', ProductReportCommandViewSet, basename='product-report-command')
router.register(r'inventory', InventoryReportCommandViewSet, basename='inventory-report-command')

urlpatterns = [
    path('', include(router.urls)),
]

