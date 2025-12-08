# ecommerce-backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from store.views import ProductViewSet, CategoryViewSet

# For static and media file serving (essential for product images)
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    # Serve media files (product images) in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)