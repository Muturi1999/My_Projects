"""
URL configuration for products service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/products/commands/', include('commands.urls')),
    path('api/v1/products/queries/', include('queries.urls')),
]


