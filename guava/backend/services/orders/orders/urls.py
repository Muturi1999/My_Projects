"""
URL configuration for orders service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/orders/commands/', include('commands.urls')),
    path('api/v1/orders/queries/', include('queries.urls')),
]


