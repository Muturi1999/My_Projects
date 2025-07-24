from django.urls import path
from .views import CartDetailView, AddToCartView, RemoveFromCartView

urlpatterns = [
    path('', CartDetailView.as_view()),
    path('add/', AddToCartView.as_view()),
    path('remove/<int:pk>/', RemoveFromCartView.as_view()),
]
