// // lib/core/repositories/order_repository_impl.dart
// import 'package:backend/core/models/order.dart';
// import 'package:backend/core/repositories/order_repository.dart';
// import 'package:backend/core/database/database_connection.dart';

// /// Concrete implementation of OrderRepository
// class OrderRepositoryImpl implements OrderRepository {
//   final DatabaseConnection _database;

//   OrderRepositoryImpl(this._database);

//   @override
//   Future<Order?> getByPlatformOrderId(String platformOrderId, String platform) async {
//     final row = await _database.query(
//       'SELECT * FROM orders WHERE platform_order_id = @platformOrderId AND platform = @platform LIMIT 1',
//       substitutionValues: {
//         'platformOrderId': platformOrderId,
//         'platform': platform,
//       },
//     );

//     if (row.isEmpty) return null;
//     return Order.fromMap(row.first);
//   }

//   @override
//   Future<Order> create(Order order) async {
//     final result = await _database.query(
//       '''
//       INSERT INTO orders (id, branch_id, platform_order_id, platform, status, created_at, updated_at)
//       VALUES (@id, @branchId, @platformOrderId, @platform, @status, @createdAt, @updatedAt)
//       RETURNING *
//       ''',
//       substitutionValues: {
//         'id': order.id,
//         'branchId': order.branchId,
//         'platformOrderId': order.platformOrderId,
//         'platform': order.platform,
//         'status': order.status.name,
//         'createdAt': order.createdAt.toIso8601String(),
//         'updatedAt': order.updatedAt.toIso8601String(),
//       },
//     );

//     return Order.fromMap(result.first);
//   }

//   @override
//   Future<void> update(Order order) async {
//     await _database.execute(
//       '''
//       UPDATE orders
//       SET branch_id = @branchId,
//           platform_order_id = @platformOrderId,
//           platform = @platform,
//           status = @status,
//           updated_at = @updatedAt
//       WHERE id = @id
//       ''',
//       substitutionValues: {
//         'id': order.id,
//         'branchId': order.branchId,
//         'platformOrderId': order.platformOrderId,
//         'platform': order.platform,
//         'status': order.status.name,
//         'updatedAt': order.updatedAt.toIso8601String(),
//       },
//     );
//   }

//   @override
//   Future<List<Order>> getByBranchAndDateRange(
//     String branchId, {
//     DateTime? startDate,
//     DateTime? endDate,
//     List<OrderStatus>? statuses,
//   }) async {
//     final conditions = <String>['branch_id = @branchId'];
//     final substitutions = {'branchId': branchId};

//     if (startDate != null) {
//       conditions.add('created_at >= @startDate');
//       substitutions['startDate'] = startDate.toIso8601String();
//     }
//     if (endDate != null) {
//       conditions.add('created_at <= @endDate');
//       substitutions['endDate'] = endDate.toIso8601String();
//     }
//     if (statuses != null && statuses.isNotEmpty) {
//       final statusList = statuses.map((s) => "'${s.name}'").join(',');
//       conditions.add('status IN ($statusList)');
//     }

//     final query = 'SELECT * FROM orders WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC';
//     final rows = await _database.query(query, substitutionValues: substitutions);

//     return rows.map((r) => Order.fromMap(r)).toList();
//   }

//   @override
//   Future<List<Order>> getByStatus(OrderStatus status) async {
//     final rows = await _database.query(
//       'SELECT * FROM orders WHERE status = @status',
//       substitutionValues: {'status': status.name},
//     );
//     return rows.map((r) => Order.fromMap(r)).toList();
//   }

//   @override
//   Future<void> logStatusChange(OrderStatusLog log) async {
//     await _database.execute(
//       '''
//       INSERT INTO order_status_logs (order_id, old_status, new_status, created_at)
//       VALUES (@orderId, @oldStatus, @newStatus, @createdAt)
//       ''',
//       substitutionValues: {
//         'orderId': log.orderId,
//         'oldStatus': log.oldStatus.name,
//         'newStatus': log.newStatus.name,
//         'createdAt': log.createdAt.toIso8601String(),
//       },
//     );
//   }
// }
