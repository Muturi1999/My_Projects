# ecommerce-backend/accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from store.models import Product, Cart, CartItem, Order, OrderItem
from .models import Address  # New Address model
from store.serializers import ProductSerializer # Reuse the existing ProductSerializer
from .models import Wishlist


# ----------------------------
# User Serializers
# ----------------------------

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


# ----------------------------
# Cart Serializers
# ----------------------------

class CartItemProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'current_price')


class CartItemSerializer(serializers.ModelSerializer):
    product = CartItemProductSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity', 'total_price')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'subtotal', 'item_count', 'created_at')

    def get_subtotal(self, obj):
        return sum(item.total_price for item in obj.items.all())

    def get_item_count(self, obj):
        return obj.items.count()


# ----------------------------
# Address Serializer
# ----------------------------

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user',)

class WishlistSerializer(serializers.ModelSerializer):
    # Only serialize the essential product information
    products = ProductSerializer(many=True, read_only=True) 

    class Meta:
        model = Wishlist
        fields = ('products', 'created_at')