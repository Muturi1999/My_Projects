from django.urls import path
from .views import BookmarkListCreateView, BookmarkDeleteView

urlpatterns = [
    path('', BookmarkListCreateView.as_view()),
    path('<int:pk>/delete/', BookmarkDeleteView.as_view()),
]
