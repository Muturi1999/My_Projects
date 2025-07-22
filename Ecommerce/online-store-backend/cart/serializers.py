from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

    def create(self, validated_data):
        product = validated_data.pop('product_id')
        return CartItem.objects.create(product=product, **validated_data)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
        read_only_fields = ['user']
