from django.shortcuts import render
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from .models import Product
from .serializers import ProductSerializer

class ListProductsAPIView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CreateProductsAPIView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class RetrieveProductsAPIView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'


class UpdateProductsAPIView(UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class DestroyProductsAPIView(DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'