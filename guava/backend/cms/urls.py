"""
URLs for CMS app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HomepageSectionViewSet, HeroSlideViewSet

router = DefaultRouter()
router.register(r'sections', HomepageSectionViewSet, basename='section')
router.register(r'hero-slides', HeroSlideViewSet, basename='heroslide')

urlpatterns = [
    path('', include(router.urls)),
]

