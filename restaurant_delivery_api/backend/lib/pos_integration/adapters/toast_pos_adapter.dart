import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:backend/core/models/order.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide Order;
import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
import 'package:backend/pos_integration/models/pos_models.dart';
import 'package:backend/shared/exceptions/app_exceptions.dart';



class ToastPosAdapter implements PosAdapter {
  @override
  String get posSystemName => 'Toast';

  @override
  String get version => '1.0';

  final HttpClient httpClient;
  final Logger logger;

  ToastPosAdapter({required this.logger}) : httpClient = HttpClient();

  @override
  Future<PosInjectionResult> injectOrder(
      Order order, PosConnectionConfig config) async {
    try {
      logger.info('Injecting order ${order.id} to Toast POS');

      final toastOrder = _convertOrderToToastFormat(order);
      final response = await _makeToastApiCall(
        'POST',
        '/orders',
        config,
        body: toastOrder,
      );

      if (response['success'] == true) {
        final toastOrderId = response['data']?['guid'];
        return PosInjectionResult.success(toastOrderId);
      } else {
        return PosInjectionResult.failure(
          response['message'] ?? 'Unknown Toast API error',
          response['error_code'],
        );
      }
    } catch (e) {
      logger.error('Toast order injection failed: $e');
      return PosInjectionResult.failure('Toast integration error: $e');
    }
  }

  @override
  Future<bool> cancelOrder(
      String posOrderId, String reason, PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall(
        'POST',
        '/orders/$posOrderId/cancel',
        config,
        body: {'reason': reason},
      );
      return response['success'] == true;
    } catch (e) {
      logger.error('Toast order cancellation failed: $e');
      return false;
    }
  }

  @override
  Future<PosOrderStatus> getOrderStatus(
      String posOrderId, PosConnectionConfig config) async {
    try {
      final response =
          await _makeToastApiCall('GET', '/orders/$posOrderId', config);
      final status = response['data']?['status'];
      return _mapToastStatusToPosStatus(status);
    } catch (e) {
      logger.error('Failed to get Toast order status: $e');
      return PosOrderStatus.pending;
    }
  }

  @override
  Future<bool> setStoreStatus(
      StoreStatus status, PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall(
        'POST',
        '/restaurants/${config.credentials['restaurant_guid']}/status',
        config,
        body: {'status': status.toString()},
      );
      return response['success'] == true;
    } catch (e) {
      logger.error('Toast store status update failed: $e');
      return false;
    }
  }

  @override
  Future<StoreStatus> getStoreStatus(PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall(
        'GET',
        '/restaurants/${config.credentials['restaurant_guid']}/status',
        config,
      );
      final status = response['data']?['status'];
      return _mapToastStoreStatus(status);
    } catch (e) {
      logger.error('Failed to get Toast store status: $e');
      return StoreStatus.OFFLINE;
    }
  }

  @override
  Future<PosMenu> getMenu(PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall(
        'GET',
        '/restaurants/${config.credentials['restaurant_guid']}/menu',
        config,
      );
      return _convertToastMenuToPosMenu(response['data']);
    } catch (e) {
      logger.error('Failed to get Toast menu: $e');
      throw PosIntegrationException('Failed to retrieve menu from Toast: $e');
    }
  }

  @override
  Future<bool> updateItemAvailability(
      String itemId, bool available, PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall(
        'PUT',
        '/restaurants/${config.credentials['restaurant_guid']}/menu/items/$itemId',
        config,
        body: {'available': available},
      );
      return response['success'] == true;
    } catch (e) {
      logger.error('Failed to update Toast item availability: $e');
      return false;
    }
  }

  @override
  Future<bool> testConnection(PosConnectionConfig config) async {
    try {
      final response = await _makeToastApiCall('GET', '/restaurants', config);
      return response['success'] == true;
    } catch (e) {
      logger.error('Toast connection test failed: $e');
      return false;
    }
  }

  // --- Internal helpers ---

  Future<Map<String, dynamic>> _makeToastApiCall(
    String method,
    String endpoint,
    PosConnectionConfig config, {
    Map<String, dynamic>? body,
  }) async {
    final accessToken = config.credentials['access_token'];
    final baseUrl = config.apiEndpoint ?? 'https://api.toasttab.com';

    final uri = Uri.parse('$baseUrl$endpoint');
    final request = await httpClient.openUrl(method, uri);

    request.headers.set('Authorization', 'Bearer $accessToken');
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

  Map<String, dynamic> _convertOrderToToastFormat(Order order) {
    return {
      'restaurantGuid': order.platformData['restaurant_guid'],
      'externalReferenceId': order.platformOrderId,
      'items': order.items.map((item) {
        return {
          'name': item.name,
          'quantity': item.quantity,
          'price': item.price,
          'modifiers': item.modifiers
              .map((m) => {'name': m.name, 'price': m.price})
              .toList(),
        };
      }).toList(),
      'customer': {
        'name': order.customer.name,
        'phone': order.customer.phone,
      },
      'delivery': {
        'type': order.deliveryInfo.type.toString(),
        'address': order.deliveryInfo.address.toJson(),
      },
      'scheduledTime': order.scheduledFor?.toIso8601String(),
    };
  }

  PosOrderStatus _mapToastStatusToPosStatus(String? toastStatus) {
    switch (toastStatus?.toUpperCase()) {
      case 'OPEN':
      case 'ACCEPTED':
        return PosOrderStatus.accepted;
      case 'COMPLETED':
        return PosOrderStatus.completed;
      case 'CANCELLED':
        return PosOrderStatus.cancelled;
      default:
        return PosOrderStatus.pending;
    }
  }

  StoreStatus _mapToastStoreStatus(String? status) {
    switch (status?.toUpperCase()) {
      case 'ONLINE':
        return StoreStatus.ONLINE;
      case 'OFFLINE':
        return StoreStatus.OFFLINE;
      default:
        return StoreStatus.OFFLINE;
    }
  }

  PosMenu _convertToastMenuToPosMenu(Map<String, dynamic> toastMenu) {
    // Convert Toast menu JSON to PosMenu domain model
    // This assumes you have a PosMenu.fromJson or similar constructor
    return PosMenu.fromJson(toastMenu);
  }
}

extension on String {
  get name => null;
  
  get price => null;
}

