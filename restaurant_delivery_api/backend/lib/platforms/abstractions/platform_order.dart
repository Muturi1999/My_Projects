import 'package:backend/core/models/order.dart';

abstract class PlatformOrderHandler {
  Future<void> acceptOrder(String orderId, String storeId);
  Future<void> denyOrder(String orderId, String storeId, String reason);
  Future<Order> getOrderDetails(String orderId);
  Future<void> updateOrderStatus(String orderId, OrderStatus status);
}