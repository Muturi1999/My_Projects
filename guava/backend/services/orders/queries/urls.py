"""
URLs for order queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderQueryViewSet, CartQueryViewSet, WishlistQueryViewSet

router = DefaultRouter()
router.register(r'orders', OrderQueryViewSet, basename='order-query')
router.register(r'carts', CartQueryViewSet, basename='cart-query')
router.register(r'wishlists', WishlistQueryViewSet, basename='wishlist-query')

urlpatterns = [
    path('', include(router.urls)),
]


