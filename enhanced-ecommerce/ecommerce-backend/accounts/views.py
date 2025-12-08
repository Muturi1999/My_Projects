# ecommerce-backend/accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User

from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from store.models import Product 
from .serializers import WishlistSerializer # type: ignore
from store.models import Cart, CartItem
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CartSerializer,
    CartItemSerializer
)


# ----------------------------
# User Views
# ----------------------------

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ----------------------------
# Cart Views
# ----------------------------

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Retrieve or create a cart for the current user
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        # Get or create user's cart
        cart, created = Cart.objects.get_or_create(user=request.user)

        # Check if item already exists
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product_id=product_id)
        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)

        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class WishlistView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    # GET: Retrieve the user's wishlist
    def get(self, request, format=None):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    # POST: Add a product to the wishlist
    def post(self, request, format=None):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        
        # Add the product to the ManyToMany field
        if product not in wishlist.products.all():
            wishlist.products.add(product)
            return Response({'success': 'Product added to wishlist'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'warning': 'Product already in wishlist'}, status=status.HTTP_200_OK)

    # DELETE: Remove a product from the wishlist
    def delete(self, request, format=None):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)

        # Remove the product from the ManyToMany field
        if product in wishlist.products.all():
            wishlist.products.remove(product)
            return Response({'success': 'Product removed from wishlist'}, status=status.HTTP_200_OK)
        else:
            return Response({'warning': 'Product not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)
