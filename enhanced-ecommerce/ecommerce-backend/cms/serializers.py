# ecommerce-backend/cms/serializers.py

from rest_framework import serializers
from .models import Category, Post, StaticPage
from django.contrib.auth.models import User

# --- Blog Serializers ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description')

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('author', 'created_at', 'updated_at')

    def validate_author(self, value):
        # Ensure the author is set automatically on creation/update
        if not self.instance and not value:
            raise serializers.ValidationError("Author must be set.")
        return value

# --- Page Serializer ---
class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = '__all__'
        lookup_field = 'slug'