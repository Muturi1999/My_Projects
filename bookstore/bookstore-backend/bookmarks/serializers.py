from rest_framework import serializers
from .models import Bookmark
from books.serializers import BookSerializer

class BookmarkSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = Bookmark
        fields = ['id', 'book']
