import 'package:backend/core/utils/logger.dart' hide Logger;
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide Order;
import 'package:backend/core/models/order.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import



class NotificationService {
  final Logger logger;
  final List<NotificationChannel> channels;

  NotificationService({
    required this.logger,
    this.channels = const [],
  });

  // Send order notification to configured channels
  Future<void> notifyOrderEvent(OrderEvent event) async {
    try {
      final notification = _buildOrderNotification(event);
      
      for (final channel in channels) {
        try {
          await channel.send(notification);
        } catch (e) {
          logger.error('Failed to send notification via ${channel.name}: $e', error: "");
        }
      }
      
    } catch (e) {
      logger.error('Failed to build order notification: $e', error: "");
    }
  }

  // Send system alerts
  Future<void> sendAlert(AlertLevel level, String message, {Map<String, dynamic>? metadata}) async {
    final alert = SystemAlert(
      level: level,
      message: message,
      timestamp: DateTime.now(),
      metadata: metadata,
    );
    
    for (final channel in channels) {
      if (channel.supportsAlertLevel(level)) {
        try {
          await channel.sendAlert(alert);
        } catch (e) {
          logger.error('Failed to send alert via ${channel.name}: $e', error: "");
        }
      }
    }
  }

  Notification _buildOrderNotification(OrderEvent event) {
    String title;
    String message;
    
    switch (event.type) {
      case OrderEventType.created:
        title = 'New Order Received';
        message = 'Order ${event.order.platformOrderId} from ${event.order.platform}';
        break;
      case OrderEventType.statusChanged:
        title = 'Order Status Updated';
        message = 'Order ${event.order.platformOrderId}: ${event.previousStatus} → ${event.order.status}';
        break;
      case OrderEventType.failed:
        title = 'Order Processing Failed';
        message = 'Failed to process order ${event.order.platformOrderId}';
        break;
    }
    
    return Notification(
      id: 'order_${event.order.id}_${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      message: message,
      level: _getNotificationLevel(event.type),
      timestamp: event.timestamp,
      metadata: {
        'order_id': event.order.id,
        'platform': event.order.platform,
        'branch_id': event.order.branchId,
        ...?event.metadata,
      },
    );
  }

  NotificationLevel _getNotificationLevel(OrderEventType eventType) {
    switch (eventType) {
      case OrderEventType.created:
        return NotificationLevel.info;
      case OrderEventType.statusChanged:
        return NotificationLevel.info;
      case OrderEventType.failed:
        return NotificationLevel.error;
      default:
        return NotificationLevel.info;
    }
  }
}

// Supporting models and interfaces
abstract class OrderEventListener {
  Future<void> onOrderEvent(OrderEvent event);
}

abstract class NotificationChannel {
  String get name;
  Future<void> send(Notification notification);
  Future<void> sendAlert(SystemAlert alert);
  bool supportsAlertLevel(AlertLevel level);
}

enum OrderEventType { created, statusChanged, failed }
enum AlertLevel { info, warning, error, critical }
enum NotificationLevel { info, warning, error }

class OrderEvent {
  final OrderEventType type;
  final Order order;
  final OrderStatus? previousStatus;
  final DateTime timestamp;
  final String source;
  final Map<String, dynamic>? metadata;

  OrderEvent({
    required this.type,
    required this.order,
    this.previousStatus,
    required this.timestamp,
    required this.source,
    this.metadata,
  });
}

// class OrderStatusLog {
//   final String orderId;
//   final OrderStatus previousStatus;
//   final OrderStatus newStatus;
//   final String? reason;
//   final Map<String, dynamic>? metadata;
//   final DateTime timestamp;

//   OrderStatusLog({
//     required this.orderId,
//     required this.previousStatus,
//     required this.newStatus,
//     this.reason,
//     this.metadata,
//     required this.timestamp,
//   });
// }

class Notification {
  final String id;
  final String title;
  final String message;
  final NotificationLevel level;
  final DateTime timestamp;
  final Map<String, dynamic> metadata;

  Notification({
    required this.id,
    required this.title,
    required this.message,
    required this.level,
    required this.timestamp,
    this.metadata = const {},
  });
}

class SystemAlert {
  final AlertLevel level;
  final String message;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;

  SystemAlert({
    required this.level,
    required this.message,
    required this.timestamp,
    this.metadata,
  });
}

class CoreServiceException implements Exception {
  final String message;
  CoreServiceException(this.message);
  
  @override
  String toString() => 'CoreServiceException: $message';
}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);
  
  @override
  String toString() => 'ValidationException: $message';
}
