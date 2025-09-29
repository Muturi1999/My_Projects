// import 'dart:convert';
// import 'dart:io';

// import 'package:backend/core/models/order.dart';
// import 'package:backend/platforms/abstractions/platform_order.dart';
// import 'package:backend/platforms/uber_eats/models/uber_order.dart';
// import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';

// class UberOrderService implements PlatformOrderHandler {
//   final String baseUrl;
//   final UberAuthService authService;
//   final HttpClient httpClient;
//   final Logger logger;
//   String? _cachedToken;
//   DateTime? _tokenExpiry;

//   UberOrderService({
//     required this.authService,
//     required this.logger,
//     this.baseUrl = 'https://api.uber.com',
//   }) : httpClient = HttpClient();

//   @override
//   Future<void> acceptOrder(String orderId, String storeId) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v1/eats/orders/$orderId/accept_pos_order');
      
//       final request = await httpClient.postUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
      
//       // Uber Eats expects specific payload structure
//       final body = jsonEncode({
//         'reason': 'POS_ORDER_ACCEPTED'
//       });
//       request.write(body);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         logger.info('Successfully accepted Uber Eats order: $orderId');
//       } else {
//         throw UberEatsApiException(
//           'Failed to accept order: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error accepting Uber order $orderId: $e');
//       throw e;
//     }
//   }

//   @override
//   Future<void> denyOrder(String orderId, String storeId, String reason) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v1/eats/orders/$orderId/deny_pos_order');
      
//       final request = await httpClient.postUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
      
//       // Map our denial reasons to Uber Eats expected reasons
//       final uberReason = _mapDenialReason(reason);
//       final body = jsonEncode({
//         'reason': uberReason,
//         'explanation': reason,
//       });
//       request.write(body);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         logger.info('Successfully denied Uber Eats order: $orderId, reason: $reason');
//       } else {
//         throw UberEatsApiException(
//           'Failed to deny order: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error denying Uber order $orderId: $e');
//       throw e;
//     }
//   }

//   @override
//   Future<Order> getOrderDetails(String orderId) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v1/eats/orders/$orderId');
      
//       final request = await httpClient.getUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         final data = jsonDecode(responseBody);
//         final uberOrder = UberOrder.fromJson(data);
        
//         // Convert to our universal Order format (this would be in the webhook service)
//         // For now, return the raw data
//         logger.info('Successfully retrieved Uber Eats order: $orderId');
//         return _convertUberOrderToCoreOrder(uberOrder);
//       } else {
//         throw UberEatsApiException(
//           'Failed to get order details: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error getting Uber order details for $orderId: $e');
//       throw e;
//     }
//   }

//   @override
//   Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
//     // Uber Eats doesn't support general order status updates via API
//     // Status changes happen through accept/deny or are managed by Uber
//     logger.info('Order status update requested for $orderId to $status (Note: Uber manages order states)');
//   }

//   // Cancel order - used for store-initiated cancellations
//   Future<void> cancelOrder(String orderId, String storeId, String reason) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v1/eats/orders/$orderId/cancel');
      
//       final request = await httpClient.postUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
      
//       final body = jsonEncode({
//         'reason': reason,
//       });
//       request.write(body);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         logger.info('Successfully cancelled Uber Eats order: $orderId');
//       } else {
//         throw UberEatsApiException(
//           'Failed to cancel order: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error cancelling Uber order $orderId: $e');
//       throw e;
//     }
//   }

//   // Resolve fulfillment issues (when items are unavailable)
//   Future<void> resolveFulfillmentIssues(String orderId, Map<String, dynamic> issues) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v1/eats/orders/$orderId/fulfillment_issues');
      
//       final request = await httpClient.postUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
      
//       request.write(jsonEncode(issues));
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         logger.info('Successfully reported fulfillment issues for order: $orderId');
//       } else {
//         throw UberEatsApiException(
//           'Failed to resolve fulfillment issues: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error resolving fulfillment issues for $orderId: $e');
//       throw e;
//     }
//   }

//   Future<String> _getValidToken() async {
//     // Check if cached token is still valid
//     if (_cachedToken != null && _tokenExpiry != null && DateTime.now().isBefore(_tokenExpiry!)) {
//       return _cachedToken!;
//     }

//     // Get new token with required scopes for order operations
//     final token = await authService.getClientCredentialsToken(['eats.order', 'eats.store']);
    
//     _cachedToken = token;
//     _tokenExpiry = DateTime.now().add(Duration(days: 29)); // Uber tokens last 30 days, refresh 1 day early
    
//     return token;
//   }

//   String _mapDenialReason(String reason) {
//     // Map our generic denial reasons to Uber Eats specific codes
//     final reasonLower = reason.toLowerCase();
    
//     if (reasonLower.contains('inventory') || reasonLower.contains('out of stock')) {
//       return 'ITEM_UNAVAILABLE';
//     }
//     if (reasonLower.contains('system') || reasonLower.contains('pos')) {
//       return 'STORE_NOT_READY';
//     }
//     if (reasonLower.contains('hours') || reasonLower.contains('closed')) {
//       return 'STORE_CLOSED';
//     }
//     if (reasonLower.contains('delivery') || reasonLower.contains('range')) {
//       return 'DELIVERY_AREA_TOO_FAR';
//     }
    
//     // Default reason
//     return 'OTHER';
//   }

//   Order _convertUberOrderToCoreOrder(UberOrder uberOrder) {
//     // This conversion logic would typically be in the webhook service
//     // but needed here for getOrderDetails response
//     return Order(
//       id: 'ord_${DateTime.now().millisecondsSinceEpoch}',
//       branchId: '', // Will be filled by webhook service
//       platformOrderId: uberOrder.id,
//       platform: 'uber_eats',
//       customer: Customer(
//         id: uberOrder.customer?.id ?? 'anonymous',
//         name: uberOrder.customer?.name ?? 'Customer',
//         phone: uberOrder.customer?.phone,
//         email: uberOrder.customer?.email,
//       ),
//       items: uberOrder.cart?.items.map((item) => OrderItem(
//         id: item.id,
//         name: item.title,
//         quantity: item.quantity,
//         price: item.price ?? 0.0,
//         platformItemId: item.instanceId,
//         specialInstructions: item.specialInstructions,
//         modifiers: [], // Would be converted from selectedModifierGroups
//       )).toList() ?? [],
//       status: _mapUberOrderState(uberOrder.orderState),
//       paymentInfo: PaymentInfo(method: 'online', status: 'paid', amount: uberOrder.cart?.total ?? 0.0),
//       deliveryInfo: DeliveryInfo(
//         type: uberOrder.type == 'PICKUP' ? DeliveryType.pickup : DeliveryType.delivery,
//         estimatedTime: uberOrder.estimatedReadyForPickupTime,
//       ),
//       subtotal: uberOrder.cart?.subTotal ?? 0.0,
//       tax: uberOrder.cart?.tax ?? 0.0,
//       deliveryFee: uberOrder.cart?.deliveryFee ?? 0.0,
//       total: uberOrder.cart?.total ?? 0.0,
//       specialInstructions: uberOrder.specialInstructions,
//       createdAt: DateTime.fromMillisecondsSinceEpoch(uberOrder.placedAt * 1000),
//       scheduledFor: uberOrder.scheduledFor != null 
//           ? DateTime.fromMillisecondsSinceEpoch(uberOrder.scheduledFor! * 1000) 
//           : null,
//       platformData: uberOrder.toJson(),
//     );
//   }

//   OrderStatus _mapUberOrderState(String uberState) {
//     switch (uberState.toUpperCase()) {
//       case 'CREATED':
//         return OrderStatus.PENDING;
//       case 'ACCEPTED':
//         return OrderStatus.ACCEPTED;
//       case 'DENIED':
//         return OrderStatus.DENIED;
//       case 'FINISHED':
//         return OrderStatus.COMPLETED;
//       case 'CANCELLED':
//         return OrderStatus.CANCELLED;
//       default:
//         return OrderStatus.PENDING;
//     }
//   }
// }

// // Custom exception for Uber Eats API errors
// class UberEatsApiException implements Exception {
//   final String message;
//   final int? statusCode;
//   final String? responseBody;

//   UberEatsApiException(this.message, {this.statusCode, this.responseBody});

//   @override
//   String toString() {
//     return 'UberEatsApiException: $message (Status: $statusCode)${responseBody != null ? '\nResponse: $responseBody' : ''}';
//   }
// }


// backend/lib/services/uber_order_service.dart
// Enhanced Uber Eats Order Service (v2 APIs)

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/uber_order.dart';

class UberOrderService {
  final String baseUrl = 'https://api.uber.com/v1/delivery';
  final String accessToken;

  UberOrderService(this.accessToken);

  Future<Map<String, dynamic>> _post(
      String endpoint, Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
          'Request failed: ${response.statusCode}, ${response.body}');
    }
  }

  Future<Map<String, dynamic>> _get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl/$endpoint'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
          'Request failed: ${response.statusCode}, ${response.body}');
    }
  }

  // Accept order
  Future<void> acceptOrder(String orderId) async {
    await _post('order/$orderId/accept', {});
  }

  // Deny order
  Future<void> denyOrder(String orderId, String reason) async {
    await _post('order/$orderId/deny', {
      'reason': reason,
    });
  }

  // Mark order ready
  Future<void> markOrderReady(String orderId) async {
    await _post('order/$orderId/ready', {});
  }

  // Update ready time
  Future<void> updateOrderReadyTime(String orderId, int minutes) async {
    await _post('order/$orderId/ready_time', {
      'minutes': minutes,
    });
  }

  // Adjust price
  Future<void> adjustOrderPrice(
      String orderId, double newTotal, String reason) async {
    await _post('order/$orderId/adjust_price', {
      'newTotal': newTotal,
      'reason': reason,
    });
  }

  // Resolve fulfillment issues
  Future<void> resolveFulfillmentIssues(String orderId, String resolution) async {
    await _post('order/$orderId/resolve', {
      'resolution': resolution,
    });
  }

  // Get order details (v2)
  Future<UberOrderV2> getOrderDetails(String orderId) async {
    final json = await _get('order/$orderId');
    return UberOrderV2.fromJson(json);
  }

  // List orders
  Future<List<UberOrderV2>> listOrders(
      {String? state, int limit = 20, int offset = 0}) async {
    final query =
        '?limit=$limit&offset=$offset${state != null ? "&state=$state" : ""}';
    final json = await _get('orders$query');

    final orders = (json['orders'] as List<dynamic>? ?? [])
        .map((o) => UberOrderV2.fromJson(o))
        .toList();

    return orders;
  }
}

