from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CategoryViewSet
from .views import BookRatingCreateView

router = DefaultRouter()
router.register('books', BookViewSet)
router.register('categories', CategoryViewSet)


urlpatterns = router.urls + [
    path('rate/', BookRatingCreateView.as_view(), name='rate-book')
]