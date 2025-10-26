from django.urls import path
from .views import (
    CreateProductsAPIView,
    ListProductsAPIView,
    RetrieveProductsAPIView,
    UpdateProductsAPIView,
    DestroyProductsAPIView,
    
)

urlpatterns = [
    path('products/', ListProductsAPIView.as_view(), name='products-list'),
    path('products/create/', CreateProductsAPIView.as_view(), name='product-create'),
    path('products/retrieve/<slug:slug>/', RetrieveProductsAPIView.as_view(), name='product-retrieve'),
    path('products/update/<slug:slug>/', UpdateProductsAPIView.as_view(), name='product-update'),
    path('products/destroy/<slug:slug>/', DestroyProductsAPIView.as_view(), name='product-destroy'),

]
