// import 'dart:convert';
// import 'package:crypto/crypto.dart';

// // Models (normally in core/models)
// class WebhookEvent {
//   final String id;
//   final String platform;
//   final WebhookEventType eventType;
//   final String storeId;
//   final String resourceId;
//   final String resourceHref;
//   final DateTime timestamp;
//   final Map<String, dynamic> platformData;

//   WebhookEvent({
//     required this.id,
//     required this.platform,
//     required this.eventType,
//     required this.storeId,
//     required this.resourceId,
//     required this.resourceHref,
//     required this.timestamp,
//     this.platformData = const {},
//   });
// }

// // Enum for webhook events
// enum WebhookEventType {
//   orderCreated,
//   scheduledOrderCreated,
//   orderCancelled,
//   orderFulfillmentResolved,
//   orderReadyForPickup,
//   storeProvisioned,
//   storeDeprovisioned,
//   storeStatusChanged,
//   menuRefreshRequested,
//   unknown,
// }

// // Interfaces / abstractions
// abstract class PlatformWebhookHandler {
//   bool validateWebhookSignature(String body, String signature, String secret);
//   WebhookEvent parseWebhookEvent(Map<String, dynamic> payload);
//   Future<void> handleOrderNotification(WebhookEvent event);
//   Future<void> handleOrderCancellation(WebhookEvent event);
// }

// // Dummy placeholder classes for dependencies
// class Logger {
//   void info(String msg) => print("INFO: $msg");
//   void warning(String msg) => print("WARN: $msg");
//   void error(String msg, {dynamic error, StackTrace? stackTrace}) =>
//       print("ERROR: $msg $error");
//   void critical(String msg) => print("CRITICAL: $msg");
// }

// class CoreOrderService {
//   Future<void> createOrder(dynamic order) async {}
//   Future<void> cancelOrder(String id, String reason) async {}
//   Future<dynamic> getOrderByPlatformId(String id, String platform) async {}
//   Future<void> updateOrderStatus(String id, dynamic status,
//       {Map<String, dynamic>? metadata}) async {}
//   Future<dynamic> getBranchByPlatformStoreId(
//       String platform, String storeId) async {}
// }

// class PosIntegrationService {
//   Future<dynamic> injectOrderToPOS(dynamic order) async =>
//       {"success": true, "posOrderId": "POS123"};
//   Future<void> cancelOrderInPOS(String id, String reason) async {}
//   final adapters = <String, dynamic>{};
// }

// class UberOrderService {
//   Future<dynamic> getOrderDetails(String id) async {}
//   Future<void> acceptOrder(String orderId, String storeId) async {}
//   Future<void> denyOrder(String orderId, String storeId, String reason) async {}
// }

// class UberMenuService {
//   Future<void> syncMenuFromPOS(String storeId, dynamic menu) async {}
// }

// // Placeholder order-related classes
// class Order {}
// class Customer {
//   final String id;
//   final String? name;
//   final String? phone;
//   final String? email;
//   Customer({required this.id, this.name, this.phone, this.email});
// }
// class PaymentInfo {
//   final String method;
//   final String status;
//   final double amount;
//   PaymentInfo({required this.method, required this.status, required this.amount});
// }
// class DeliveryInfo {
//   final DeliveryType type;
//   final Address? address;
//   final DateTime? estimatedTime;
//   DeliveryInfo({required this.type, this.address, this.estimatedTime});
// }
// enum DeliveryType { pickup, delivery }
// class Address {
//   final String street, city, state, zipCode, country;
//   Address({
//     required this.street,
//     required this.city,
//     required this.state,
//     required this.zipCode,
//     required this.country,
//   });
// }
// enum OrderStatus { PENDING, ACCEPTED, DENIED, CANCELLED }
// class OrderItem {
//   final String id, name;
//   final int quantity;
//   final double price;
//   final List<OrderItemModifier> modifiers;
//   final String? specialInstructions;
//   final String? platformItemId;
//   OrderItem({
//     required this.id,
//     required this.name,
//     required this.quantity,
//     required this.price,
//     required this.modifiers,
//     this.specialInstructions,
//     this.platformItemId,
//   });
// }
// class OrderItemModifier {
//   final String id, name;
//   final double price;
//   final int quantity;
//   OrderItemModifier(
//       {required this.id,
//       required this.name,
//       required this.price,
//       required this.quantity});
// }
// class UberWebhookEvent {
//   final String eventId, eventType, userId, resourceId, resourceHref;
//   final int eventTime;
//   UberWebhookEvent(
//       {required this.eventId,
//       required this.eventType,
//       required this.userId,
//       required this.resourceId,
//       required this.resourceHref,
//       required this.eventTime});
//   factory UberWebhookEvent.fromJson(Map<String, dynamic> json) =>
//       UberWebhookEvent(
//         eventId: json['id'],
//         eventType: json['event_type'],
//         userId: json['user_id'],
//         resourceId: json['resource_id'],
//         resourceHref: json['resource_href'],
//         eventTime: json['event_time'],
//       );
//   Map<String, dynamic> toJson() => {};
// }
// class UberOrder {
//   final String id;
//   UberOrder({required this.id});
//   Map<String, dynamic> toJson() => {};
// }
// class UberCartItem {
//   final String id, title, instanceId;
//   final int quantity;
//   final double? price;
//   final String? specialInstructions;
//   final List<UberSelectedModifierGroup>? selectedModifierGroups;
//   UberCartItem({
//     required this.id,
//     required this.title,
//     required this.quantity,
//     required this.instanceId,
//     this.price,
//     this.specialInstructions,
//     this.selectedModifierGroups,
//   });
// }
// class UberSelectedModifierGroup {
//   final List<UberModifierOption>? selectedItems;
//   UberSelectedModifierGroup({this.selectedItems});
// }
// class UberModifierOption {
//   final String id, title;
//   final double? price;
//   final int quantity;
//   UberModifierOption(
//       {required this.id,
//       required this.title,
//       this.price,
//       required this.quantity});
// }

// // MAIN SERVICE
// class UberWebhookService implements PlatformWebhookHandler {
//   final String clientSecret;
//   final UberOrderService orderService;
//   final CoreOrderService coreOrderService;
//   final PosIntegrationService posService;
//   final Logger logger;

//   UberWebhookService({
//     required this.clientSecret,
//     required this.orderService,
//     required this.coreOrderService,
//     required this.posService,
//     required this.logger,
//   });

//   @override
//   bool validateWebhookSignature(String body, String signature, String secret) {
//     try {
//       final key = utf8.encode(secret);
//       final messageBytes = utf8.encode(body);
//       final hmac = Hmac(sha256, key);
//       final digest = hmac.convert(messageBytes);
//       final expectedSignature = digest.toString().toLowerCase();

//       if (signature.length != expectedSignature.length) return false;
//       var result = 0;
//       for (int i = 0; i < signature.length; i++) {
//         result |= signature.codeUnitAt(i) ^ expectedSignature.codeUnitAt(i);
//       }
//       return result == 0;
//     } catch (e) {
//       logger.error('Webhook signature validation failed: $e');
//       return false;
//     }
//   }

//   @override
//   WebhookEvent parseWebhookEvent(Map<String, dynamic> payload) {
//     final uberEvent = UberWebhookEvent.fromJson(payload);
//     return WebhookEvent(
//       id: uberEvent.eventId,
//       platform: 'uber_eats',
//       eventType: _mapUberEventType(uberEvent.eventType),
//       storeId: uberEvent.userId,
//       resourceId: uberEvent.resourceId,
//       resourceHref: uberEvent.resourceHref,
//       timestamp: DateTime.fromMillisecondsSinceEpoch(uberEvent.eventTime * 1000),
//       platformData: uberEvent.toJson(),
//     );
//   }

//   WebhookEventType _mapUberEventType(String uberEventType) {
//     switch (uberEventType) {
//       case 'orders.notification':
//         return WebhookEventType.orderCreated;
//       case 'orders.scheduled.notification':
//         return WebhookEventType.scheduledOrderCreated;
//       case 'orders.cancel':
//       case 'orders.failure':
//         return WebhookEventType.orderCancelled;
//       case 'orders.fulfillment_issues.resolved':
//         return WebhookEventType.orderFulfillmentResolved;
//       case 'orders.release':
//         return WebhookEventType.orderReadyForPickup;
//       case 'store.provisioned':
//         return WebhookEventType.storeProvisioned;
//       case 'store.deprovisioned':
//         return WebhookEventType.storeDeprovisioned;
//       case 'store.status.changed':
//         return WebhookEventType.storeStatusChanged;
//       default:
//         return WebhookEventType.unknown;
//     }
//   }

//   @override
//   Future<void> handleOrderNotification(WebhookEvent event) async {
//     logger.info('Processing order notification: ${event.resourceId}');
//     // TODO: implement actual flow
//   }

//   @override
//   Future<void> handleOrderCancellation(WebhookEvent event) async {
//     logger.info('Processing order cancellation: ${event.resourceId}');
//     // TODO: implement actual flow
//   }
// }

// // ENHANCED SERVICE
// class UberWebhookServiceEnhanced extends UberWebhookService {
//   final UberMenuService menuService;
//   final PosIntegrationService posService;

//   UberWebhookServiceEnhanced({
//     required super.clientSecret,
//     required super.orderService,
//     required super.coreOrderService,
//     required super.posService,
//     required super.logger,
//     required this.menuService,
//     required this.posService,
//   });

//   Future<void> handleMenuRefreshRequest(WebhookEvent event) async {
//     logger.info('Processing menu refresh request for store: ${event.storeId}');
//     // TODO: implement menu refresh logic
//   }

//   @override
//   WebhookEventType _mapUberEventType(String uberEventType) {
//     switch (uberEventType) {
//       case 'store.menu_refresh_request':
//         return WebhookEventType.menuRefreshRequested;
//       default:
//         return super._mapUberEventType(uberEventType);
//     }
//   }
// }


import 'dart:convert';
import 'package:crypto/crypto.dart';

// Models (normally in core/models)
class WebhookEvent {
  final String id;
  final String platform;
  final WebhookEventType eventType;
  final String storeId;
  final String resourceId;
  final String resourceHref;
  final DateTime timestamp;
  final Map<String, dynamic> platformData;

  WebhookEvent({
    required this.id,
    required this.platform,
    required this.eventType,
    required this.storeId,
    required this.resourceId,
    required this.resourceHref,
    required this.timestamp,
    this.platformData = const {},
  });
}

// Enum for webhook events
enum WebhookEventType {
  orderCreated,
  scheduledOrderCreated,
  orderCancelled,
  orderFulfillmentResolved,
  orderReadyForPickup,
  storeProvisioned,
  storeDeprovisioned,
  storeStatusChanged,
  menuRefreshRequested,
  unknown,
}

// Interfaces / abstractions
abstract class PlatformWebhookHandler {
  bool validateWebhookSignature(String body, String signature, String secret);
  WebhookEvent parseWebhookEvent(Map<String, dynamic> payload);
  Future<void> handleOrderNotification(WebhookEvent event);
  Future<void> handleOrderCancellation(WebhookEvent event);
}

// Dummy placeholder classes for dependencies
class Logger {
  void info(String msg) => print("INFO: $msg");
  void warning(String msg) => print("WARN: $msg");
  void error(String msg, {dynamic error, StackTrace? stackTrace}) =>
      print("ERROR: $msg $error");
  void critical(String msg) => print("CRITICAL: $msg");
}

class CoreOrderService {
  Future<void> createOrder(dynamic order) async {}
  Future<void> cancelOrder(String id, String reason) async {}
  Future<dynamic> getOrderByPlatformId(String id, String platform) async {}
  Future<void> updateOrderStatus(String id, dynamic status,
      {Map<String, dynamic>? metadata}) async {}
  Future<dynamic> getBranchByPlatformStoreId(
      String platform, String storeId) async {}
}

class PosIntegrationService {
  Future<dynamic> injectOrderToPOS(dynamic order) async =>
      {"success": true, "posOrderId": "POS123"};
  Future<void> cancelOrderInPOS(String id, String reason) async {}
  final adapters = <String, dynamic>{};
}

class UberOrderService {
  Future<dynamic> getOrderDetails(String id) async {}
  Future<void> acceptOrder(String orderId, String storeId) async {}
  Future<void> denyOrder(String orderId, String storeId, String reason) async {}
}

class UberMenuService {
  Future<void> syncMenuFromPOS(String storeId, dynamic menu) async {}
}

// Placeholder order-related classes
class Order {
  get platformOrderId => null;

  get platform => null;

  get platformData => null;
}
class Customer {
  final String id;
  final String? name;
  final String? phone;
  final String? email;
  Customer({required this.id, this.name, this.phone, this.email});
}
class PaymentInfo {
  final String method;
  final String status;
  final double amount;
  PaymentInfo({required this.method, required this.status, required this.amount});
}
class DeliveryInfo {
  final DeliveryType type;
  final Address? address;
  final DateTime? estimatedTime;
  DeliveryInfo({required this.type, this.address, this.estimatedTime});
}
enum DeliveryType { pickup, delivery }
class Address {
  final String street, city, state, zipCode, country;
  Address({
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
  });
}
enum OrderStatus { PENDING, ACCEPTED, DENIED, CANCELLED }
class OrderItem {
  final String id, name;
  final int quantity;
  final double price;
  final List<OrderItemModifier> modifiers;
  final String? specialInstructions;
  final String? platformItemId;
  OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.price,
    required this.modifiers,
    this.specialInstructions,
    this.platformItemId,
  });
}
class OrderItemModifier {
  final String id, name;
  final double price;
  final int quantity;
  OrderItemModifier(
      {required this.id,
      required this.name,
      required this.price,
      required this.quantity});
}
class UberWebhookEvent {
  final String eventId, eventType, userId, resourceId, resourceHref;
  final int eventTime;
  UberWebhookEvent(
      {required this.eventId,
      required this.eventType,
      required this.userId,
      required this.resourceId,
      required this.resourceHref,
      required this.eventTime});
  factory UberWebhookEvent.fromJson(Map<String, dynamic> json) =>
      UberWebhookEvent(
        eventId: json['id'],
        eventType: json['event_type'],
        userId: json['user_id'],
        resourceId: json['resource_id'],
        resourceHref: json['resource_href'],
        eventTime: json['event_time'],
      );
  Map<String, dynamic> toJson() => {};
}
class UberOrder {
  final String id;
  UberOrder({required this.id});
  Map<String, dynamic> toJson() => {};
}
class UberCartItem {
  final String id, title, instanceId;
  final int quantity;
  final double? price;
  final String? specialInstructions;
  final List<UberSelectedModifierGroup>? selectedModifierGroups;
  UberCartItem({
    required this.id,
    required this.title,
    required this.quantity,
    required this.instanceId,
    this.price,
    this.specialInstructions,
    this.selectedModifierGroups,
  });
}
class UberSelectedModifierGroup {
  final List<UberModifierOption>? selectedItems;
  UberSelectedModifierGroup({this.selectedItems});
}
class UberModifierOption {
  final String id, title;
  final double? price;
  final int quantity;
  UberModifierOption(
      {required this.id,
      required this.title,
      this.price,
      required this.quantity});
}

// MAIN SERVICE
class UberWebhookService implements PlatformWebhookHandler {
  final String clientSecret;
  final UberOrderService orderService;
  final CoreOrderService coreOrderService;
  final PosIntegrationService posService;
  final Logger logger;

  UberWebhookService({
    required this.clientSecret,
    required this.orderService,
    required this.coreOrderService,
    required this.posService,
    required this.logger,
  });

  @override
  bool validateWebhookSignature(String body, String signature, String secret) {
    try {
      final key = utf8.encode(secret);
      final messageBytes = utf8.encode(body);
      final hmac = Hmac(sha256, key);
      final digest = hmac.convert(messageBytes);
      final expectedSignature = digest.toString().toLowerCase();

      if (signature.length != expectedSignature.length) return false;
      var result = 0;
      for (int i = 0; i < signature.length; i++) {
        result |= signature.codeUnitAt(i) ^ expectedSignature.codeUnitAt(i);
      }
      return result == 0;
    } catch (e) {
      logger.error('Webhook signature validation failed: $e');
      return false;
    }
  }

  @override
  WebhookEvent parseWebhookEvent(Map<String, dynamic> payload) {
    final uberEvent = UberWebhookEvent.fromJson(payload);
    return WebhookEvent(
      id: uberEvent.eventId,
      platform: 'uber_eats',
      eventType: _mapUberEventType(uberEvent.eventType),
      storeId: uberEvent.userId,
      resourceId: uberEvent.resourceId,
      resourceHref: uberEvent.resourceHref,
      timestamp: DateTime.fromMillisecondsSinceEpoch(uberEvent.eventTime * 1000),
      platformData: uberEvent.toJson(),
    );
  }

  WebhookEventType _mapUberEventType(String uberEventType) {
    switch (uberEventType) {
      case 'orders.notification':
        return WebhookEventType.orderCreated;
      case 'orders.scheduled.notification':
        return WebhookEventType.scheduledOrderCreated;
      case 'orders.cancel':
      case 'orders.failure':
        return WebhookEventType.orderCancelled;
      case 'orders.fulfillment_issues.resolved':
        return WebhookEventType.orderFulfillmentResolved;
      case 'orders.release':
        return WebhookEventType.orderReadyForPickup;
      case 'store.provisioned':
        return WebhookEventType.storeProvisioned;
      case 'store.deprovisioned':
        return WebhookEventType.storeDeprovisioned;
      case 'store.status.changed':
        return WebhookEventType.storeStatusChanged;
      default:
        return WebhookEventType.unknown;
    }
  }

  @override
  Future<void> handleOrderNotification(WebhookEvent event) async {
    logger.info('Processing order notification: ${event.resourceId}');
    // TODO: implement actual flow
  }

  @override
  Future<void> handleOrderCancellation(WebhookEvent event) async {
    logger.info('Processing order cancellation: ${event.resourceId}');
    // TODO: implement actual flow
  }
}

// ENHANCED SERVICE
class UberWebhookServiceEnhanced extends UberWebhookService {
  final UberMenuService menuService;

  UberWebhookServiceEnhanced({
    required super.clientSecret,
    required super.orderService,
    required super.coreOrderService,
    required super.posService,
    required super.logger,
    required this.menuService,
  });

  Future<void> handleMenuRefreshRequest(WebhookEvent event) async {
    logger.info('Processing menu refresh request for store: ${event.storeId}');
    // TODO: implement menu refresh logic
  }

  @override
  WebhookEventType _mapUberEventType(String uberEventType) {
    if (uberEventType == 'store.menu_refresh_request') {
      return WebhookEventType.menuRefreshRequested;
    }
    return super._mapUberEventType(uberEventType);
  }
}
