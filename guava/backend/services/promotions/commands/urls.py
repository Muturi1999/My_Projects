"""
URLs for promotion commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscountCommandViewSet, CouponCommandViewSet, PromotionalBannerCommandViewSet, DealCommandViewSet

router = DefaultRouter()
router.register(r'discounts', DiscountCommandViewSet, basename='discount-command')
router.register(r'coupons', CouponCommandViewSet, basename='coupon-command')
router.register(r'banners', PromotionalBannerCommandViewSet, basename='banner-command')
router.register(r'deals', DealCommandViewSet, basename='deal-command')

urlpatterns = [
    path('', include(router.urls)),
]


