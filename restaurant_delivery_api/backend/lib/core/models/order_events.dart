// lib/core/models/order_events.dart


abstract class OrderEvent {}

class OrderCreated extends OrderEvent {
  final String orderId;
  OrderCreated(this.orderId);
}

class OrderCancelled extends OrderEvent {
  final String orderId;
  final String reason;
  OrderCancelled(this.orderId, {this.reason = "Unknown"});
}

class OrderCompleted extends OrderEvent {
  final String orderId;
  OrderCompleted(this.orderId);
}
