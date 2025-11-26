"""
URL configuration for inventory service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/inventory/commands/', include('commands.urls')),
    path('api/v1/inventory/queries/', include('queries.urls')),
]


