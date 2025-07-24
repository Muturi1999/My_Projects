from django.urls import path
from .views import RegisterView, SubscribeNewsletterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
        path('subscribe/', SubscribeNewsletterView.as_view(), name='subscribe-newsletter'),

]
