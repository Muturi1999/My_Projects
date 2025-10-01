// import 'dart:convert';
// import 'dart:io';

// import 'package:backend/core/models/order.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
// import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
// import 'package:backend/pos_integration/models/pos_models.dart';
// import 'package:backend/shared/exceptions/app_exceptions.dart';
// import 'package:backend/core/models/order.dart' as core;
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide Order;


// class SquarePosAdapter implements PosAdapter {
//   @override
//   String get posSystemName => 'Square';
  
//   @override
//   String get version => '1.0';
  
//   final HttpClient httpClient;
//   final Logger logger;

//   SquarePosAdapter({
//     required this.logger,
//   }) : httpClient = HttpClient();

//   @override
//   Future<PosInjectionResult> injectOrder(Order order, PosConnectionConfig config) async {
//     try {
//       logger.info('Injecting order ${order.id} to Square POS');
      
//       final squareOrder = _convertOrderToSquareFormat(order);
//       final response = await _makeSquareApiCall(
//         'POST',
//         '/v2/orders',
//         config,
//         body: squareOrder,
//       );

//       if (response['success'] == true) {
//         final squareOrderId = response['data']?['order']?['id'];
//         return PosInjectionResult.success(squareOrderId);
//       } else {
//         return PosInjectionResult.failure(
//           response['message'] ?? 'Unknown Square API error',
//           response['error_code'],
//         );
//       }
      
//     } catch (e) {
//       logger.error('Square order injection failed: $e');
//       return PosInjectionResult.failure('Square integration error: $e');
//     }
//   }

//   @override
//   Future<bool> cancelOrder(String posOrderId, String reason, PosConnectionConfig config) async {
//     try {
//       final response = await _makeSquareApiCall(
//         'PUT',
//         '/v2/orders/$posOrderId/cancel',
//         config,
//         body: {'cancellation_reason': reason},
//       );
      
//       return response['success'] == true;
//     } catch (e) {
//       logger.error('Square order cancellation failed: $e');
//       return false;
//     }
//   }

//   @override
//   Future<PosOrderStatus> getOrderStatus(String posOrderId, PosConnectionConfig config) async {
//     try {
//       final response = await _makeSquareApiCall('GET', '/v2/orders/$posOrderId', config);
//       final status = response['data']?['order']?['state'];
//       return _mapSquareStatusToPosStatus(status);
//     } catch (e) {
//       logger.error('Failed to get Square order status: $e');
//       return PosOrderStatus.pending;
//     }
//   }

//   @override
//   Future<bool> setStoreStatus(StoreStatus status, PosConnectionConfig config) async {
//     // Square doesn't have a direct store status API
//     // This would typically involve updating business hours or similar
//     logger.info('Square store status update requested: $status');
//     return true;
//   }

//   @override
//   Future<StoreStatus> getStoreStatus(PosConnectionConfig config) async {
//     // Implementation would check Square location status
//     return StoreStatus.ONLINE;
//   }

//   @override
//   Future<PosMenu> getMenu(PosConnectionConfig config) async {
//     try {
//       final response = await _makeSquareApiCall('/v2/catalog/list', 'GET', config);
//       return _convertSquareMenuToPosMenu(response);
//     } catch (e) {
//       logger.error('Failed to get Square menu: $e');
//       throw PosIntegrationException('Failed to retrieve menu from Square: $e');
//     }
//   }

//   @override
//   Future<bool> updateItemAvailability(String itemId, bool available, PosConnectionConfig config) async {
//     try {
//       final response = await _makeSquareApiCall(
//         'PUT',
//         '/v2/catalog/object/$itemId',
//         config,
//         body: {
//           'object': {
//             'id': itemId,
//             'item_data': {'available_online': available}
//           }
//         },
//       );
      
//       return response['success'] == true;
//     } catch (e) {
//       logger.error('Failed to update Square item availability: $e');
//       return false;
//     }
//   }

//   @override
//   Future<bool> testConnection(PosConnectionConfig config) async {
//     try {
//       final response = await _makeSquareApiCall('GET', '/v2/locations', config);
//       return response['success'] == true;
//     } catch (e) {
//       logger.error('Square connection test failed: $e');
//       return false;
//     }
//   }

//   Future<Map<String, dynamic>> _makeSquareApiCall(
//     String method,
//     String endpoint,
//     PosConnectionConfig config, {
//     Map<String, dynamic>? body,
//   }) async {
//     final accessToken = config.credentials['access_token'];
//     final baseUrl = config.apiEndpoint ?? 'https://connect.squareup.com';
    
//     final uri = Uri.parse('$baseUrl$endpoint');
//     final request = await httpClient.openUrl(method, uri);
    
//     request.headers.set('Authorization', 'Bearer $accessToken');
//     request.headers.set('Square-Version', '2023-10-18');
//     request.headers.set('Content-Type', 'application/json');
    
//     if (body != null) {
//       request.write(jsonEncode(body));
//     }
    
//     final response = await request.close();
//     final responseBody = await response.transform(utf8.decoder).join();
    
//     if (response.statusCode >= 200 && response.statusCode < 300) {
//       return {
//         'success': true,
//         'data': jsonDecode(responseBody),
//       };
//     } else {
//       return {
//         'success': false,
//         'status_code': response.statusCode,
//         'message': responseBody,
//       };
//     }
//   }

//   Map<String, dynamic> _convertOrderToSquareFormat(Order order) {
//     return {
//       'order': {
//         'location_id': order.platformData['location_id'],
//         'reference_id': order.platformOrderId,
//         'source': {
//           'name': order.platform.toUpperCase(),
//         },
//         'line_items': order.items.map((item) => {
//           'name': item.name,
//           'quantity': item.quantity.toString(),
//           'base_price_money': {
//             'amount': (item.price * 100).round(), // Square uses cents
//             'currency': 'USD',
//           },
//           'modifiers': item.modifiers.map((mod) => {
//             'name': mod.name,
//             'price_money': {
//               'amount': (mod.price * 100).round(),
//               'currency': 'USD',
//             },
//           }).toList(),
//         }).toList(),
//         'fulfillments': [
//           {
//             'type': order.deliveryInfo.type == DeliveryType.pickup ? 'PICKUP' : 'SHIPMENT',
//             'state': 'PROPOSED',
//             if (order.deliveryInfo.type == DeliveryType.pickup)
//               'pickup_details': {
//                 'recipient': {
//                   'display_name': order.customer.name,
//                 },
//                 'pickup_at': order.scheduledFor?.toIso8601String(),
//               }
//             else
//               'shipment_details': {
//                 'recipient': {
//                   'display_name': order.customer.name,
//                   'address': _convertAddressToSquareFormat(order.deliveryInfo.address),
//                 },
//               },
//           }
//         ],
//       }
//     };
//   }

//   PosOrderStatus _mapSquareStatusToPosStatus(String? squareStatus) {
//     switch (squareStatus?.toUpperCase()) {
//       case 'OPEN':
//         return PosOrderStatus.accepted;
//       case 'COMPLETED':
//         return PosOrderStatus.completed;
//       case 'CANCELED':
//         return PosOrderStatus.cancelled;
//       default:
//         return PosOrderStatus.pending;
//     }
//   }
// }


import 'dart:convert';
import 'dart:io';

import 'package:backend/core/models/order.dart' as core;
import 'package:backend/core/models/order.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide Order;
import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
import 'package:backend/pos_integration/models/pos_models.dart';
import 'package:backend/shared/exceptions/app_exceptions.dart';

class SquarePosAdapter implements PosAdapter {
  @override
  String get posSystemName => 'Square';

  @override
  String get version => '1.0';

  final HttpClient httpClient;
  final Logger logger;

  SquarePosAdapter({
    required this.logger,
  }) : httpClient = HttpClient();

  @override
  Future<PosInjectionResult> injectOrder(core.Order order, PosConnectionConfig config) async {
    try {
      logger.info('Injecting order ${order.id} to Square POS');

      final squareOrder = _convertOrderToSquareFormat(order);
      final response = await _makeSquareApiCall(
        'POST',
        '/v2/orders',
        config,
        body: squareOrder,
      );

      if (response['success'] == true) {
        final squareOrderId = response['data']?['order']?['id'];
        return PosInjectionResult.success(squareOrderId);
      } else {
        return PosInjectionResult.failure(
          response['message'] ?? 'Unknown Square API error',
          response['error_code'],
        );
      }
    } catch (e) {
      logger.error('Square order injection failed: $e');
      return PosInjectionResult.failure('Square integration error: $e');
    }
  }

  @override
  Future<bool> cancelOrder(String posOrderId, String reason, PosConnectionConfig config) async {
    try {
      final response = await _makeSquareApiCall(
        'PUT',
        '/v2/orders/$posOrderId/cancel',
        config,
        body: {'cancellation_reason': reason},
      );

      return response['success'] == true;
    } catch (e) {
      logger.error('Square order cancellation failed: $e');
      return false;
    }
  }

  @override
  Future<PosOrderStatus> getOrderStatus(String posOrderId, PosConnectionConfig config) async {
    try {
      final response = await _makeSquareApiCall('GET', '/v2/orders/$posOrderId', config);
      final status = response['data']?['order']?['state'];
      return _mapSquareStatusToPosStatus(status);
    } catch (e) {
      logger.error('Failed to get Square order status: $e');
      return PosOrderStatus.pending;
    }
  }

  @override
  Future<bool> setStoreStatus(StoreStatus status, PosConnectionConfig config) async {
    logger.info('Square store status update requested: $status');
    return true; // Square doesn’t have direct store status API
  }

  @override
  Future<StoreStatus> getStoreStatus(PosConnectionConfig config) async {
    return StoreStatus.ONLINE; // Stub: check Square locations if needed
  }

  @override
  Future<PosMenu> getMenu(PosConnectionConfig config) async {
    try {
      final response = await _makeSquareApiCall('GET', '/v2/catalog/list', config);
      return _convertSquareMenuToPosMenu(response['data']);
    } catch (e) {
      logger.error('Failed to get Square menu: $e');
      throw PosIntegrationException('Failed to retrieve menu from Square: $e');
    }
  }

  @override
  Future<bool> updateItemAvailability(String itemId, bool available, PosConnectionConfig config) async {
    try {
      final response = await _makeSquareApiCall(
        'PUT',
        '/v2/catalog/object/$itemId',
        config,
        body: {
          'object': {
            'id': itemId,
            'item_data': {'available_online': available}
          }
        },
      );

      return response['success'] == true;
    } catch (e) {
      logger.error('Failed to update Square item availability: $e');
      return false;
    }
  }

  @override
  Future<bool> testConnection(PosConnectionConfig config) async {
    try {
      final response = await _makeSquareApiCall('GET', '/v2/locations', config);
      return response['success'] == true;
    } catch (e) {
      logger.error('Square connection test failed: $e');
      return false;
    }
  }

  // ----------------------------
  // Helpers
  // ----------------------------

  Future<Map<String, dynamic>> _makeSquareApiCall(
    String method,
    String endpoint,
    PosConnectionConfig config, {
    Map<String, dynamic>? body,
  }) async {
    final accessToken = config.credentials['access_token'];
    final baseUrl = config.apiEndpoint ?? 'https://connect.squareup.com';

    final uri = Uri.parse('$baseUrl$endpoint');
    final request = await httpClient.openUrl(method, uri);

    request.headers.set('Authorization', 'Bearer $accessToken');
    request.headers.set('Square-Version', '2023-10-18');
    request.headers.set('Content-Type', 'application/json');

    if (body != null) {
      request.write(jsonEncode(body));
    }

    final response = await request.close();
    final responseBody = await response.transform(utf8.decoder).join();

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return {
        'success': true,
        'data': jsonDecode(responseBody),
      };
    } else {
      return {
        'success': false,
        'status_code': response.statusCode,
        'message': responseBody,
      };
    }
  }

  Map<String, dynamic> _convertOrderToSquareFormat(core.Order order) {
    return {
      'order': {
        'location_id': order.branchId,
        'reference_id': order.platformOrderId,
        'source': {
          'name': order.platform.toUpperCase(),
        },
        'line_items': order.items.map((item) => {
              'name': item.name,
              'quantity': item.quantity.toString(),
              'base_price_money': {
                'amount': (item.price * 100).round(),
                'currency': 'USD',
              },
              'modifiers': item.modifiers.map((mod) => {
                    'name': mod.name,
                    'price_money': {
                      'amount': (mod.price * 100).round(),
                      'currency': 'USD',
                    },
                  }).toList(),
            }).toList(),
        'fulfillments': [
          {
            'type': order.deliveryInfo.type == DeliveryType.pickup ? 'PICKUP' : 'SHIPMENT',
            'state': 'PROPOSED',
            if (order.deliveryInfo.type == DeliveryType.pickup)
              'pickup_details': {
                'recipient': {
                  'display_name': order.customer.name,
                },
                'pickup_at': order.scheduledFor?.toIso8601String(),
              }
            else
              'shipment_details': {
                'recipient': {
                  'display_name': order.customer.name,
                  'address': _convertAddressToSquareFormat(order.deliveryInfo.address),
                },
              },
          }
        ],
      }
    };
  }

  PosMenu _convertSquareMenuToPosMenu(Map<String, dynamic> response) {
    final objects = response['objects'] as List? ?? [];

    final items = objects
        .where((o) => o['type'] == 'ITEM')
        .map((o) {
          final itemData = o['item_data'] ?? {};
          final variations = (itemData['variations'] as List?) ?? [];
          final price = (variations.isNotEmpty
                  ? (variations[0]['item_variation_data']?['price_money']?['amount'] ?? 0)
                  : 0) /
              100.0;

          return PosMenuItem(
            id: o['id'],
            name: itemData['name'] ?? 'Unnamed',
            price: price,
            available: true, categoryId: '',
          );
        })
        .toList();

    return PosMenu(items: items, storeId: '', 
    categories: [],
     lastUpdated:  DateTime.now(),
);
  }

  Map<String, dynamic> _convertAddressToSquareFormat( address) {
    return {
      'address_line_1': address.street,
      'locality': address.city,
      'administrative_district_level_1': address.state,
      'postal_code': address.postalCode,
      'country': address.country,
    };
  }

  PosOrderStatus _mapSquareStatusToPosStatus(String? squareStatus) {
    switch (squareStatus?.toUpperCase()) {
      case 'OPEN':
        return PosOrderStatus.accepted;
      case 'COMPLETED':
        return PosOrderStatus.completed;
      case 'CANCELED':
        return PosOrderStatus.cancelled;
      default:
        return PosOrderStatus.pending;
    }
  }
}

class DeliveryType {
  static Object get pickup => "";
}

extension on String {
  get name => null;
  
  get price => null;
}
