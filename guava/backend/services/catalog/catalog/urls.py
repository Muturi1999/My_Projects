"""
URL configuration for catalog service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/catalog/commands/', include('commands.urls')),
    path('api/v1/catalog/queries/', include('queries.urls')),
]


