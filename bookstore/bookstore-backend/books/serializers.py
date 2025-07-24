from rest_framework import serializers
from .models import Book, BookRating, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, source='category')

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'price', 'discount_price', 'category', 'category_id', 'stock', 'image', 'is_offer', 'is_featured', 'is_sold_out']

    def get_is_sold_out(self, obj):
        return obj.stock == 0
    
class BookRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRating
        fields = ['id', 'book', 'rating', 'comment', 'created_at']

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, source='category')
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'description', 'price', 'discount_price', 'category',
            'category_id', 'stock', 'image', 'is_offer', 'is_featured', 'average_rating'
        ]

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        return round(sum(r.rating for r in ratings) / len(ratings), 2) if ratings else 0

