import 'dart:convert';
import 'package:backend/core/models/order.dart';
import 'package:backend/core/services/order_service.dart';
import 'package:backend/pos_integration/services/pos_integration_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import

class OrderController {
  final CoreOrderService coreOrderService;
  final PosIntegrationService posIntegrationService;
  final Logger logger;

  OrderController({
    required this.coreOrderService,
    required this.posIntegrationService,
    required this.logger,
  });

  Router get router {
    final router = Router();

    router.get('/orders/<branchId>', getOrders);
    router.get('/order/<orderId>', getOrder);
    router.post('/order/<orderId>/retry', retryOrderInjection);

    return router;
  }
  

  // Get orders for a branch
  Future<Response> getOrders(Request request, String branchId) async {
    try {
      final queryParams = request.url.queryParameters;
      final startDateStr = queryParams['start_date'];
      final endDateStr = queryParams['end_date'];
      final statusFilter = queryParams['status'];

      DateTime? startDate =
          startDateStr != null ? DateTime.tryParse(startDateStr) : null;
      DateTime? endDate =
          endDateStr != null ? DateTime.tryParse(endDateStr) : null;

      List<OrderStatus>? statuses = statusFilter != null
          ? [
              OrderStatus.values.firstWhere(
                (s) => s.name == statusFilter,
                orElse: () => throw ArgumentError(
                    'Invalid status: $statusFilter'), // clear error
              )
            ]
          : null;

      final orders = await coreOrderService.getOrdersByBranch(
        branchId,
        startDate: startDate,
        endDate: endDate,
        statuses: statuses,
      );

      return Response.ok(
        jsonEncode({
          'orders': orders.map((o) => o.toJson()).toList(),
          'count': orders.length,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e, st) {
      logger.error('Failed to get orders: $e\n$st', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retrieve orders'}),
      );
    }
  }

  // Get specific order details
  Future<Response> getOrder(Request request, String orderId) async {
    try {
      final order =
          await coreOrderService.getOrderByPlatformId(orderId, 'uber_eats');
      if (order == null) {
        return Response.notFound(jsonEncode({'error': 'Order not found'}));
      }

      return Response.ok(
        jsonEncode(order.toJson()),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e, st) {
      logger.error('Failed to get order: $e\n$st', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retrieve order'}),
      );
    }
  }

  // Manual order retry (if POS injection failed)
  Future<Response> retryOrderInjection(Request request, String orderId) async {
    try {
      final order =
          await coreOrderService.getOrderByPlatformId(orderId, 'uber_eats');
      if (order == null) {
        return Response.notFound(jsonEncode({'error': 'Order not found'}));
      }

      // Retry POS injection
      final result = await posIntegrationService.injectOrderToPOS(order);

      return Response.ok(
        jsonEncode({
          'success': result.success,
          'pos_order_id': result.posOrderId,
          'error': result.errorMessage,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e, st) {
      logger.error('Failed to retry order injection: $e\n$st', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retry order injection'}),
      );
    }
  }
}


