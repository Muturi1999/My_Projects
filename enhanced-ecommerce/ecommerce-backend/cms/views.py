# ecommerce-backend/cms/views.py

from rest_framework import viewsets, permissions
from .models import Category, Post, StaticPage
from .serializers import CategorySerializer, PostSerializer, StaticPageSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def get_permissions(self):
        # Allow read access for everyone, require IsAdminUser for write access
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.AllowAny]
            # Only show PUBLISHED posts to the public
            if not self.request.user.is_staff:
                self.queryset = Post.objects.filter(status='PUBLISHED')
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Ensure the creating user is set as the author
        serializer.save(author=self.request.user)

class StaticPageViewSet(viewsets.ModelViewSet):
    queryset = StaticPage.objects.all()
    serializer_class = StaticPageSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        # Allow public read access to active pages via slug, Admin write access
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.AllowAny]
            if not self.request.user.is_staff:
                self.queryset = StaticPage.objects.filter(is_active=True)
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()