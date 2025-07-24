from django.urls import path
from .views import CheckoutView, OrderHistoryView, PendingOrdersView

urlpatterns = [
    path('checkout/', CheckoutView.as_view()),
    path('history/', OrderHistoryView.as_view()),
    path('pending/', PendingOrdersView.as_view()),

]
