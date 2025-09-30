
// lib/core/models/order_exceptions.dart

class OrderException implements Exception {
  final String message;
  OrderException(this.message);

  @override
  String toString() => "OrderException: $message";
}

class OrderNotFoundException extends OrderException {
  OrderNotFoundException(String id) : super("Order with ID $id not found");
}

class InvalidOrderStatusException extends OrderException {
  InvalidOrderStatusException(String status) : super("Invalid order status: $status");
}