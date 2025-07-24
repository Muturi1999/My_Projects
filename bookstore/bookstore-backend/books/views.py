from rest_framework import viewsets
from .models import Book,Category 
from .serializers import BookSerializer, CategorySerializer
from .serializers import BookRatingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import BookRating


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-id')
    serializer_class = BookSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookRatingCreateView(generics.CreateAPIView):
    serializer_class = BookRatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)