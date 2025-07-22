from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from cart.models import CartItem, Cart
from .serializers import OrderSerializer
from django.db import transaction

class CheckoutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        items = cart.items.all()

        if not items:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in items)

        order = Order.objects.create(user=request.user, total_price=total)

        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price
            )
            item.product.stock -= item.quantity
            item.product.save()

        items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OrderHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    serializer_class = OrderSerializer
