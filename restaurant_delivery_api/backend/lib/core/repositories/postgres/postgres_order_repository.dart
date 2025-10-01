import 'package:backend/core/models/order.dart';
import 'package:backend/core/repositories/order_repository.dart';
import 'package:postgres/src/connection.dart';

/// Postgres implementation of the OrderRepository contract.
class PostgresOrderRepository implements OrderRepository {
  PostgresOrderRepository(PostgreSQLConnection dbConnection);

  @override
  Future<Order?> getById(String id) async {
    // TODO: Implement actual Postgres fetch
    return null;
  }

  @override
  Future<Order> create(Order order) async {
    // TODO: Implement actual Postgres insert
    return order;
  }

  @override
  Future<void> update(Order order) async {
    // TODO: Implement Postgres update
  }

  @override
  Future<List<Order>> getAll() async {
    // TODO: Implement actual fetch
    return [];
  }
  
  @override
  Future<List<Order>> getByBranchAndDateRange(String branchId, {DateTime? startDate, DateTime? endDate, List<OrderStatus>? statuses}) {
    // TODO: implement getByBranchAndDateRange
    throw UnimplementedError();
  }
  
  @override
  Future<Order?> getByPlatformOrderId(String platformOrderId, String platform) {
    // TODO: implement getByPlatformOrderId
    throw UnimplementedError();
  }
  
  @override
  Future<List<Order>> getByStatus(OrderStatus status) {
    // TODO: implement getByStatus
    throw UnimplementedError();
  }
  
  @override
  Future<void> logStatusChange(OrderStatusLog log) {
    // TODO: implement logStatusChange
    throw UnimplementedError();
  }
}
