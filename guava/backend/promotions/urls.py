"""
URLs for promotions app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscountViewSet, FlashSaleViewSet

router = DefaultRouter()
router.register(r'discounts', DiscountViewSet, basename='discount')
router.register(r'flash-sales', FlashSaleViewSet, basename='flashsale')

urlpatterns = [
    path('', include(router.urls)),
]

