"""
URLs for inventory queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseQueryViewSet, StockQueryViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseQueryViewSet, basename='warehouse-query')
router.register(r'stocks', StockQueryViewSet, basename='stock-query')

urlpatterns = [
    path('', include(router.urls)),
]


