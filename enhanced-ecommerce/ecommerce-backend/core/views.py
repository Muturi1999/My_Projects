# # ecommerce-backend/core/views.py

# from rest_framework import viewsets
# from store.models import Product, Category, Cart
# from store.serializers import ProductSerializer, CategorySerializer, CartSerializer

# class ProductViewSet(viewsets.ModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

# class CartViewSet(viewsets.ModelViewSet):
#     queryset = Cart.objects.all()
#     serializer_class = CartSerializer
# ecommerce-backend/core/views.py

from rest_framework import viewsets
from store.models import Product, Category
from accounts.models import Cart  # Assuming Cart model is in accounts/models.py
from store.serializers import ProductSerializer, CategorySerializer
from accounts.serializers import CartSerializer  # Correct import

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
