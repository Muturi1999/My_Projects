"""
URL configuration for reports service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/reports/commands/', include('commands.urls')),
    path('api/v1/reports/queries/', include('queries.urls')),
]

