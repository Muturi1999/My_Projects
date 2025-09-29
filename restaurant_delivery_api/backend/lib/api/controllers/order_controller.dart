// import 'dart:convert';

// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
// import 'package:http/http.dart';

// class OrderController {
//   final CoreOrderService coreOrderService;
//   final PosIntegrationService posIntegrationService;
//   final Logger logger;

//   OrderController({
//     required this.coreOrderService,
//     required this.posIntegrationService,
//     required this.logger,
//   });

//   // Get orders for a branch
//   Future<Response> getOrders(Request request) async {
//     try {
//       final branchId = request.params['branchId'];
//       if (branchId == null) {
//         return Response.badRequest(body: jsonEncode({'error': 'Branch ID required'}));
//       }

//       final queryParams = request.url.queryParameters;
//       final startDateStr = queryParams['start_date'];
//       final endDateStr = queryParams['end_date'];
//       final statusFilter = queryParams['status'];

//       DateTime? startDate = startDateStr != null ? DateTime.tryParse(startDateStr) : null;
//       DateTime? endDate = endDateStr != null ? DateTime.tryParse(endDateStr) : null;
//       List<OrderStatus>? statuses = statusFilter != null 
//           ? [OrderStatus.values.firstWhere((s) => s.toString() == statusFilter)]
//           : null;

//       final orders = await coreOrderService.getOrdersByBranch(
//         branchId,
//         startDate: startDate,
//         endDate: endDate,
//         statuses: statuses,
//       );

//       return Response.ok(
//         jsonEncode({
//           'orders': orders.map((o) => o.toJson()).toList(),
//           'count': orders.length,
//         }),
//         headers: {'Content-Type': 'application/json'},
//       );

//     } catch (e) {
//       logger.error('Failed to get orders: $e');
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Failed to retrieve orders'}),
//       );
//     }
//   }

//   // Get specific order details
//   Future<Response> getOrder(Request request) async {
//     try {
//       final orderId = request.params['orderId'];
//       if (orderId == null) {
//         return Response.badRequest(body: jsonEncode({'error': 'Order ID required'}));
//       }

//       final order = await coreOrderService.getOrderByPlatformId(orderId, '');
//       if (order == null) {
//         return Response.notFound(jsonEncode({'error': 'Order not found'}));
//       }

//       return Response.ok(
//         jsonEncode(order.toJson()),
//         headers: {'Content-Type': 'application/json'},
//       );

//     } catch (e) {
//       logger.error('Failed to get order: $e');
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Failed to retrieve order'}),
//       );
//     }
//   }

//   // Manual order retry (if POS injection failed)
//   Future<Response> retryOrderInjection(Request request) async {
//     try {
//       final orderId = request.params['orderId'];
//       if (orderId == null) {
//         return Response.badRequest(body: jsonEncode({'error': 'Order ID required'}));
//       }

//       final order = await coreOrderService.getOrderByPlatformId(orderId, '');
//       if (order == null) {
//         return Response.notFound(jsonEncode({'error': 'Order not found'}));
//       }

//       // Retry POS injection
//       final result = await posIntegrationService.injectOrderToPOS(order);

//       return Response.ok(
//         jsonEncode({
//           'success': result.success,
//           'pos_order_id': result.posOrderId,
//           'error': result.errorMessage,
//         }),
//         headers: {'Content-Type': 'application/json'},
//       );

//     } catch (e) {
//       logger.error('Failed to retry order injection: $e');
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Failed to retry order injection'}),
//       );
//     }
//   }
// }


import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
// Import your own core order and POS services + logger here
// import 'package:backend/core/services/core_order_service.dart';
// import 'package:backend/core/services/pos_integration_service.dart';
// import 'package:backend/core/logger.dart';

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
      logger.error('Failed to get orders: $e\n$st');
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
      logger.error('Failed to get order: $e\n$st');
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
      logger.error('Failed to retry order injection: $e\n$st');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retry order injection'}),
      );
    }
  }
}
