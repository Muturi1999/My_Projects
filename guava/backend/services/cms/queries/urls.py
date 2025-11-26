"""
URLs for CMS queries.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HomepageQueryViewSet, NavigationQueryViewSet,
    FooterQueryViewSet, ServiceGuaranteeQueryViewSet
)

router = DefaultRouter()
router.register(r'homepage', HomepageQueryViewSet, basename='homepage-query')
router.register(r'navigation', NavigationQueryViewSet, basename='navigation-query')
router.register(r'footer', FooterQueryViewSet, basename='footer-query')
router.register(r'service-guarantees', ServiceGuaranteeQueryViewSet, basename='service-guarantee-query')

urlpatterns = [
    path('', include(router.urls)),
]


