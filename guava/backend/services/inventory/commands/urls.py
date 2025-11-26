"""
URLs for inventory commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseCommandViewSet, StockCommandViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseCommandViewSet, basename='warehouse-command')
router.register(r'stocks', StockCommandViewSet, basename='stock-command')

urlpatterns = [
    path('', include(router.urls)),
]


