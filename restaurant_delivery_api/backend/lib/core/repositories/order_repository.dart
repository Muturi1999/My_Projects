// lib/core/repositories/order_repository.dart
import 'package:backend/core/models/order.dart';

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
  Future<Order?> getById(String id);
  Future<List<Order>> getAll();
}

/// Stub implementation (to be backed by DB later).
class OrderRepositoryImpl implements OrderRepository {
  @override
  Future<Order?> getByPlatformOrderId(String platformOrderId, String platform) async {
    // TODO: Implement DB fetch
    return null;
  }

  @override
  Future<Order> create(Order order) async {
    // TODO: Implement DB insert
    return order;
  }

  @override
  Future<void> update(Order order) async {
    // TODO: Implement DB update
  }

  @override
  Future<List<Order>> getByBranchAndDateRange(
    String branchId, {
    DateTime? startDate,
    DateTime? endDate,
    List<OrderStatus>? statuses,
  }) async {
    // TODO: Implement DB fetch with filters
    return [];
  }

  @override
  Future<List<Order>> getByStatus(OrderStatus status) async {
    // TODO: Implement DB fetch by status
    return [];
  }

  @override
  Future<void> logStatusChange(OrderStatusLog log) async {
    // TODO: Persist status log
  }

  @override
  Future<Order?> getById(String id) async {
    // TODO: Implement DB fetch
    return null;
  }

  @override
  Future<List<Order>> getAll() async {
    // TODO: Implement DB fetch
    return [];
  }
}
