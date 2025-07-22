from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    is_sold_out = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'
