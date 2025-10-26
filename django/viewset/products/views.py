from django.shortcuts import get_object_or_404, render
# from rest_framework import Status
from rest_framework import status
from rest_framework.response import Response  
from rest_framework.viewsets import ViewSet
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(ViewSet):
    lookup_field = "slug"

    def list(self, request):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # serializer.create(serializer.validated_data)
        serializer.save()


        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, slug=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, slug=slug)
        serializer = ProductSerializer(product)

        return Response(serializer.data)
    
    def update(self, request, slug=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, slug=slug)
        serializer = ProductSerializer(product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(product, serializer.validated_data)
        
        return Response(serializer.data)
    
    def partial_update(self, request, slug=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, slug=slug)
        serializer = ProductSerializer(product, data=request.data, partial = True,)
        serializer.is_valid(raise_exception=True)
        serializer.update(product,serializer.validated_data)
        
        return Response(serializer.data)

    def destroy(self, request, slug=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, slug=slug)
        product.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
