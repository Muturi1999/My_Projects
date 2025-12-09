"""
URLs for account commands (write operations).
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationViewSet, UserLoginViewSet, AdminLoginViewSet,
    SocialLoginViewSet, VerificationViewSet, PasswordResetViewSet,
    UserProfileViewSet, AddressViewSet, AdminViewSet
)

router = DefaultRouter()
router.register(r'register', UserRegistrationViewSet, basename='user-register')
router.register(r'login', UserLoginViewSet, basename='user-login')
router.register(r'admin/login', AdminLoginViewSet, basename='admin-login')
router.register(r'social/login', SocialLoginViewSet, basename='social-login')
router.register(r'verify', VerificationViewSet, basename='verification')
router.register(r'password-reset', PasswordResetViewSet, basename='password-reset')
router.register(r'profile', UserProfileViewSet, basename='user-profile')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'admins', AdminViewSet, basename='admin')

urlpatterns = [
    path('', include(router.urls)),
]

