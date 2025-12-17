"""
URL configuration for products service.
"""
from django.contrib import admin
from django.urls import path, include
from .admin_views import admin_login_bypass, admin_logout_bypass

urlpatterns = [
    path('admin/login/', admin_login_bypass, name='admin_login'),
    path('admin/logout/', admin_logout_bypass, name='admin_logout'),
    path('admin/', admin.site.urls),
    path('api/v1/products/commands/', include('commands.urls')),
    path('api/v1/products/queries/', include('queries.urls')),
]


