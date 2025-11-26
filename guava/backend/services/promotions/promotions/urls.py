"""
URL configuration for promotions service.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/promotions/commands/', include('commands.urls')),
    path('api/v1/promotions/queries/', include('queries.urls')),
]


