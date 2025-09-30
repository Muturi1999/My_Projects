import 'package:backend/core/models/order.dart' hide OrderStatusLog;
// import 'package:backend/core/service/notification_service.dart';
import 'package:backend/core/services/notification_service.dart'; // For OrderStatusLog

/// Repository contract for persisting and querying orders.
abstract class OrderRepository {
  Future<Order?> getByPlatformOrderId(String platformOrderId, String platform);
  Future<Order> create(Order order);
  Future<void> update(Order order);
  Future<List<Order>> getByBranchAndDateRange(
    String branchId, {
    DateTime? startDate,
    DateTime? endDate,
    List<OrderStatus>? statuses,
  });
  Future<List<Order>> getByStatus(OrderStatus status);
  Future<void> logStatusChange(OrderStatusLog log);
}
