from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RespondentViewSet, InterviewViewSet, DashboardViewSet

router = DefaultRouter()
router.register(r'respondents', RespondentViewSet)
router.register(r'interviews', InterviewViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]