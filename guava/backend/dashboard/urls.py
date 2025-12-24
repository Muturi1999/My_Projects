"""
URLs for dashboard app.
"""
from django.urls import path
from .views import DashboardStatsView, RecentOrdersView, TopProductsView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('recent-orders/', RecentOrdersView.as_view(), name='recent-orders'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
]

