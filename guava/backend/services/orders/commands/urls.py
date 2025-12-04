"""
URLs for order commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderCommandViewSet, CartCommandViewSet, WishlistCommandViewSet

router = DefaultRouter()
router.register(r'orders', OrderCommandViewSet, basename='order-command')
router.register(r'carts', CartCommandViewSet, basename='cart-command')
router.register(r'wishlists', WishlistCommandViewSet, basename='wishlist-command')

urlpatterns = [
    path('', include(router.urls)),
]


