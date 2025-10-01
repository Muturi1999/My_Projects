// // import 'package:backend/core/logger.dart' hide Logger;
// import 'package:backend/core/models/branch.dart';
// import 'package:backend/core/models/order.dart';
// import 'package:backend/core/repositories/branch_repository.dart';
// import 'package:backend/core/repositories/order_repository.dart' show OrderRepository;
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide OrderStatus, Order;

// class CoreOrderService {
//   final OrderRepository orderRepository;
//   final BranchRepository branchRepository;
//   final Logger logger;
//   final List<OrderEventListener> eventListeners;

//   CoreOrderService({
//     required this.orderRepository,
//     required this.branchRepository,
//     required this.logger,
//     this.eventListeners = const [],
//   });
//   /// Fix for controller call

//   // Create a new
//   // order from any platform
//   Future<Order> createOrder(Order order) async {
//     try {
//       // Validate order data
//       _validateOrder(order);
      
//       // Check if order already exists (prevent duplicates)
//       final existingOrder = await orderRepository.getByPlatformOrderId(
//         order.platformOrderId, 
//         order.platform
//       );
      
//       if (existingOrder != null) {
//         logger.warning('Order already exists: ${order.platformOrderId} from ${order.platform}');
//         return existingOrder;
//       }

//       // Save to database
//       final savedOrder = await orderRepository.create(order);
      
//       // Notify all listeners
//       await _notifyEventListeners(OrderEvent(
//         type: OrderEventType.created,
//         order: savedOrder,
//         timestamp: DateTime.now(),
//         source: 'core_service',
//       ));

//       logger.info('Created order: ${savedOrder.id} from ${savedOrder.platform}');
//       return savedOrder;
      
//     } catch (e, stackTrace) {
//       logger.error('Failed to create order: $e', error: e, stackTrace: stackTrace);
//       throw CoreServiceException('Failed to create order: $e');
//     }
//   }

//   // Update order status with metadata
//   Future<Order> updateOrderStatus(
//     String platformOrderId, 
//     OrderStatus newStatus, {
//     Map<String, dynamic>? metadata,
//     String? reason,
//   }) async {
//     try {
//       final order = await orderRepository.getByPlatformOrderId(platformOrderId, '');
//       if (order == null) {
//         throw CoreServiceException('Order not found: $platformOrderId');
//       }

//       final updatedOrder = order.copyWith(
//         status: newStatus,
//         updatedAt: DateTime.now(),
//       );

//       await orderRepository.update(updatedOrder);

//       // Log status change
//       await _logOrderStatusChange(order, newStatus, reason, metadata);

//       // Notify listeners
//       await _notifyEventListeners(OrderEvent(
//         type: OrderEventType.statusChanged,
//         order: updatedOrder,
//         previousStatus: order.status,
//         timestamp: DateTime.now(),
//         source: 'core_service',
//         metadata: metadata,
//       ));

//       logger.info('Updated order ${order.id} status: ${order.status} -> $newStatus');
//       return updatedOrder;
      
//     } catch (e) {
//       logger.error('Failed to update order status: $e');
//       throw CoreServiceException('Failed to update order status: $e');
//     }
//   }

//   // Cancel order with reason
//   Future<Order> cancelOrder(String platformOrderId, String reason) async {
//     return await updateOrderStatus(
//       platformOrderId, 
//       OrderStatus.CANCELLED,
//       reason: reason,
//       metadata: {'cancellation_reason': reason},
//     );
//   }

//   // Get order by platform-specific ID
//   Future<Order?> getOrderByPlatformId(String platformOrderId, String platform) async {
//     return await orderRepository.getByPlatformOrderId(platformOrderId, platform);
//   }

//   // Get orders by branch and date range
//   // Future<List<Order>> getOrdersByBranch(
//   //   String branchId, {
//   //   DateTime? startDate,
//   //   DateTime? endDate,
//   //   List<OrderStatus>? statuses,
//   // }) async {
//   //   return await orderRepository.getByBranchAndDateRange(
//   //     branchId,
//   //     startDate: startDate,
//   //     endDate: endDate,
//   //     statuses: statuses,
//   //   );
//   // }

//   Future<List<Order>> getOrdersByBranch(
//     String branchId, {
//     DateTime? startDate,
//     DateTime? endDate,
//     List<OrderStatus>? statuses,
//   }) async {
//     return await orderRepository.getByBranchAndDateRange(
//       branchId,
//       startDate: startDate,
//       endDate: endDate,
//       statuses: statuses,
//     );
//   }


//   // Get orders pending POS injection
//   Future<List<Order>> getPendingOrders() async {
//     return await orderRepository.getByStatus(OrderStatus.PENDING);
//   }

//   // Get branch by platform store ID
//   Future<Branch?> getBranchByPlatformStoreId(String platform, String platformStoreId) async {
//     return await branchRepository.getByPlatformStoreId(platform, platformStoreId);
//   }

//   void _validateOrder(Order order) {
//     if (order.platformOrderId.isEmpty) {
//       throw ValidationException('Platform order ID cannot be empty');
//     }
//     if (order.platform.isEmpty) {
//       throw ValidationException('Platform cannot be empty');
//     }
//     if (order.branchId.isEmpty) {
//       throw ValidationException('Branch ID cannot be empty');
//     }
//     if (order.total <= 0) {
//       throw ValidationException('Order total must be greater than 0');
//     }
//     if (order.items.isEmpty) {
//       throw ValidationException('Order must have at least one item');
//     }
//   }

//   Future<void> _logOrderStatusChange(
//     Order order,
//     OrderStatus newStatus,
//     String? reason,
//     Map<String, dynamic>? metadata,
//   ) async {
//     // Log to audit trail
//     final logEntry = OrderStatusLog(
//       orderId: order.id,
//       previousStatus: order.status,
//       newStatus: newStatus,
//       reason: reason,
//       metadata: metadata,
//       timestamp: DateTime.now(),
//     );
    
//     await orderRepository.logStatusChange(logEntry);
//   }

//   Future<void> _notifyEventListeners(OrderEvent event) async {
//     for (final listener in eventListeners) {
//       try {
//         await listener.onOrderEvent(event);
//       } catch (e) {
//         logger.error('Event listener failed: $e');
//       }
//     }
//   }
// }

// lib/core/services/core_order_service.dart

import 'package:backend/core/logger.dart';
import 'package:backend/core/models/branch.dart';
import 'package:backend/core/models/order.dart';
import 'package:backend/core/repositories/branch_repository.dart';
import 'package:backend/core/repositories/order_repository.dart';

class CoreOrderService {
  final OrderRepository orderRepository;
  final BranchRepository branchRepository;
  final Logger logger;
  final List<OrderEventListener> eventListeners;

  CoreOrderService({
    required this.orderRepository,
    required this.branchRepository,
    required this.logger,
    this.eventListeners = const [],
  });

  /// Create a new order from any platform
  Future<Order> createOrder(Order order) async {
    try {
      // Validate order data
      _validateOrder(order);
      
      // Check if order already exists (prevent duplicates)
      final existingOrder = await orderRepository.getByPlatformOrderId(
        order.platformOrderId, 
        order.platform
      );
      
      if (existingOrder != null) {
        logger.warning('Order already exists: ${order.platformOrderId} from ${order.platform}');
        return existingOrder;
      }

      // Save to database
      final savedOrder = await orderRepository.create(order);
      
      // Notify all listeners
      await _notifyEventListeners(OrderEvent(
        type: OrderEventType.created,
        order: savedOrder,
        timestamp: DateTime.now(),
        source: 'core_service',
      ));

      logger.info('Created order: ${savedOrder.id} from ${savedOrder.platform}');
      return savedOrder;
      
    } catch (e, stackTrace) {
      logger.error('Failed to create order: $e', error: e);
      throw CoreServiceException('Failed to create order: $e');
    }
  }

  /// Update order status with metadata
  Future<Order> updateOrderStatus(
    String platformOrderId, 
    OrderStatus newStatus, {
    Map<String, dynamic>? metadata,
    String? reason,
  }) async {
    try {
      final order = await orderRepository.getByPlatformOrderId(platformOrderId, '');
      if (order == null) {
        throw CoreServiceException('Order not found: $platformOrderId');
      }

      final updatedOrder = order.copyWith(
        status: newStatus,
        updatedAt: DateTime.now(),
      );

      await orderRepository.update(updatedOrder);

      // Log status change
      await _logOrderStatusChange(order, newStatus, reason, metadata);

      // Notify listeners
      await _notifyEventListeners(OrderEvent(
        type: OrderEventType.statusChanged,
        order: updatedOrder,
        previousStatus: order.status,
        timestamp: DateTime.now(),
        source: 'core_service',
        metadata: metadata,
      ));

      logger.info('Updated order ${order.id} status: ${order.status} -> $newStatus');
      return updatedOrder;
      
    } catch (e) {
      logger.error('Failed to update order status: $e');
      throw CoreServiceException('Failed to update order status: $e');
    }
  }

  /// Cancel order with reason
  Future<Order> cancelOrder(String platformOrderId, String reason) async {
    return await updateOrderStatus(
      platformOrderId, 
      OrderStatus.CANCELLED,
      reason: reason,
      metadata: {'cancellation_reason': reason},
    );
  }

  /// Get order by platform-specific ID
  Future<Order?> getOrderByPlatformId(String platformOrderId, String platform) async {
    return await orderRepository.getByPlatformOrderId(platformOrderId, platform);
  }

  /// Get orders by branch and date range
  Future<List<Order>> getOrdersByBranch(
    String branchId, {
    DateTime? startDate,
    DateTime? endDate,
    List<OrderStatus>? statuses,
  }) async {
    return await orderRepository.getByBranchAndDateRange(
      branchId,
      startDate: startDate,
      endDate: endDate,
      statuses: statuses,
    );
  }

  /// Get orders pending POS injection
  Future<List<Order>> getPendingOrders() async {
    return await orderRepository.getByStatus(OrderStatus.PENDING);
  }

  /// Get branch by platform store ID
  Future<Branch?> getBranchByPlatformStoreId(String platform, String platformStoreId) async {
    return await branchRepository.getByPlatformStoreId(platform, platformStoreId);
  }

  void _validateOrder(Order order) {
    if (order.platformOrderId.isEmpty) {
      throw ValidationException('Platform order ID cannot be empty');
    }
    if (order.platform.isEmpty) {
      throw ValidationException('Platform cannot be empty');
    }
    if (order.branchId.isEmpty) {
      throw ValidationException('Branch ID cannot be empty');
    }
    if (order.total <= 0) {
      throw ValidationException('Order total must be greater than 0');
    }
    if (order.items.isEmpty) {
      throw ValidationException('Order must have at least one item');
    }
  }

  Future<void> _logOrderStatusChange(
    Order order,
    OrderStatus newStatus,
    String? reason,
    Map<String, dynamic>? metadata,
  ) async {
    final logEntry = OrderStatusLog(
      orderId: order.id,
      previousStatus: order.status,
      newStatus: newStatus,
      reason: reason,
      metadata: metadata,
      timestamp: DateTime.now(),
    );
    
    await orderRepository.logStatusChange(logEntry);
  }

  Future<void> _notifyEventListeners(OrderEvent event) async {
    for (final listener in eventListeners) {
      try {
        await listener.onOrderEvent(event);
      } catch (e) {
        logger.error('Event listener failed: $e');
      }
    }
  }
}

// Exception classes
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

// Event listener interface
abstract class OrderEventListener {
  Future<void> onOrderEvent(OrderEvent event);
}

// Event types
enum OrderEventType {
  created,
  statusChanged,
  cancelled,
  completed,
}

// Event class
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