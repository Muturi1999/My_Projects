"""
Main URL configuration for account service.
"""
from django.urls import path, include

urlpatterns = [
    path('api/account/commands/', include('commands.urls')),
    path('api/account/queries/', include('queries.urls')),
]

