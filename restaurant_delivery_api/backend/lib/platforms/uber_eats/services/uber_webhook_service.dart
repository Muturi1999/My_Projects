import 'dart:convert';
import 'package:crypto/crypto.dart';

// Models specific to webhooks
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

abstract class PlatformWebhookHandler {
  bool validateWebhookSignature(String body, String signature, String secret);
  WebhookEvent parseWebhookEvent(Map<String, dynamic> payload);
  Future<void> handleOrderNotification(WebhookEvent event);
  Future<void> handleOrderCancellation(WebhookEvent event);
}

class UberWebhookEvent {
  final String eventId, eventType, userId, resourceId, resourceHref;
  final int eventTime;
  
  UberWebhookEvent({
    required this.eventId,
    required this.eventType,
    required this.userId,
    required this.resourceId,
    required this.resourceHref,
    required this.eventTime,
  });
  
  // factory UberWebhookEvent.fromJson(Map<String, dynamic> json) =>
  //     UberWebhookEvent(
  //       eventId: json['id'],
  //       eventType: json['event_type'],
  //       userId: json['user_id'],
  //       resourceId: json['resource_id'],
  //       resourceHref: json['resource_href'],
  //       eventTime: json['event_time'],
  //     );

  factory UberWebhookEvent.fromJson(Map<String, dynamic> json) {
  final rawTime = json['event_time'];
  int eventTimeInt;

  if (rawTime is int) {
    eventTimeInt = rawTime;
  } else if (rawTime is String) {
    try {
      eventTimeInt = DateTime.parse(rawTime).millisecondsSinceEpoch ~/ 1000;
    } catch (_) {
      eventTimeInt = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    }
  } else {
    eventTimeInt = DateTime.now().millisecondsSinceEpoch ~/ 1000;
  }

  return UberWebhookEvent(
    eventId: json['event_id']?.toString() ?? '',
    eventType: json['event_type']?.toString() ?? '',
    resourceHref: json['resource_href']?.toString() ?? '',
    resourceId: json['resource_id']?.toString() ?? '',
    userId: json['user_id']?.toString() ?? '',
    eventTime: eventTimeInt,
  );
}

  
  Map<String, dynamic> toJson() => {
    'id': eventId,
    'event_type': eventType,
    'user_id': userId,
    'resource_id': resourceId,
    'resource_href': resourceHref,
    'event_time': eventTime,
  };
}

// Main webhook service
class UberWebhookService implements PlatformWebhookHandler {
  final String clientSecret;
  final dynamic orderService;
  final dynamic coreOrderService;
  final dynamic posService;
  final dynamic logger;

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