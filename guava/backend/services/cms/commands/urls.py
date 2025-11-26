"""
URLs for CMS commands.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HomepageCommandViewSet, NavigationCommandViewSet,
    FooterCommandViewSet, ServiceGuaranteeCommandViewSet
)

router = DefaultRouter()
router.register(r'homepage', HomepageCommandViewSet, basename='homepage-command')
router.register(r'navigation', NavigationCommandViewSet, basename='navigation-command')
router.register(r'footer', FooterCommandViewSet, basename='footer-command')
router.register(r'service-guarantees', ServiceGuaranteeCommandViewSet, basename='service-guarantee-command')

urlpatterns = [
    path('', include(router.urls)),
]


