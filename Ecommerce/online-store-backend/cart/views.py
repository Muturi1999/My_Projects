from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

class CartDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddToCartView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart = Cart.objects.get(user=request.user)
        data = request.data.copy()
        data['cart'] = cart.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(cart=cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        CartItem.objects.filter(id=pk, cart__user=request.user).delete()
        return Response({"message": "Item removed from cart."}, status=204)
