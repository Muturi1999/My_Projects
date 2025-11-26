"""
URLs for promotion queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscountQueryViewSet, CouponQueryViewSet, PromotionalBannerQueryViewSet

router = DefaultRouter()
router.register(r'discounts', DiscountQueryViewSet, basename='discount-query')
router.register(r'coupons', CouponQueryViewSet, basename='coupon-query')
router.register(r'banners', PromotionalBannerQueryViewSet, basename='banner-query')

urlpatterns = [
    path('', include(router.urls)),
]


