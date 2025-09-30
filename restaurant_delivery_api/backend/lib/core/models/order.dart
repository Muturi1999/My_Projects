import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// ------------------- Core Order Model -------------------

class Order {
  final String id;
  final String branchId;
  final String platformOrderId;
  final String platform; // 'uber_eats', 'glovo', 'bolt'
  final Customer customer;
  final List<OrderItem> items;
  final OrderStatus status;
  final PaymentInfo paymentInfo;
  final DeliveryInfo deliveryInfo;
  final double subtotal;
  final double tax;
  final double deliveryFee;
  final double total;
  final String? specialInstructions;
  final DateTime createdAt;
  final DateTime? scheduledFor;
  final Map<String, dynamic> platformData;

  Order({
    required this.id,
    required this.branchId,
    required this.platformOrderId,
    required this.platform,
    required this.customer,
    required this.items,
    required this.status,
    required this.paymentInfo,
    required this.deliveryInfo,
    required this.subtotal,
    required this.tax,
    required this.deliveryFee,
    required this.total,
    this.specialInstructions,
    required this.createdAt,
    this.scheduledFor,
    this.platformData = const {},
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'branch_id': branchId,
        'platform_order_id': platformOrderId,
        'platform': platform,
        'customer': customer.toJson(),
        'items': items.map((i) => i.toJson()).toList(),
        'status': status.name,
        'payment_info': paymentInfo.toJson(),
        'delivery_info': deliveryInfo.toJson(),
        'subtotal': subtotal,
        'tax': tax,
        'delivery_fee': deliveryFee,
        'total': total,
        'special_instructions': specialInstructions,
        'created_at': createdAt.toIso8601String(),
        'scheduled_for': scheduledFor?.toIso8601String(),
        'platform_data': platformData,
      };

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'],
        branchId: json['branch_id'],
        platformOrderId: json['platform_order_id'],
        platform: json['platform'],
        customer: Customer.fromJson(json['customer']),
        items: (json['items'] as List)
            .map((i) => OrderItem.fromJson(i))
            .toList(),
        status: OrderStatus.values.byName(json['status']),
        paymentInfo: PaymentInfo.fromJson(json['payment_info']),
        deliveryInfo: DeliveryInfo.fromJson(json['delivery_info']),
        subtotal: (json['subtotal'] as num).toDouble(),
        tax: (json['tax'] as num).toDouble(),
        deliveryFee: (json['delivery_fee'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        specialInstructions: json['special_instructions'],
        createdAt: DateTime.parse(json['created_at']),
        scheduledFor: json['scheduled_for'] != null
            ? DateTime.parse(json['scheduled_for'])
            : null,
        platformData: Map<String, dynamic>.from(json['platform_data'] ?? {}),
      );
}

// ------------------- Enums -------------------

enum StoreStatus { ONLINE, PAUSED, OFFLINE, active, ACTIVE }

enum OrderStatus {
  PENDING,
  ACCEPTED,
  PREPARING,
  READY,
  COMPLETED,
  CANCELLED,
  DENIED
}

// ------------------- Supporting Models -------------------

class Customer {
  final String id;
  final String name;
  final String phoneNumber;
  final String? email;
  final Address address;

  Customer({
    required this.id,
    required this.name,
    required this.phoneNumber,
    this.email,
    required this.address,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone_number': phoneNumber,
        'email': email,
        'address': address.toJson(),
      };

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
        id: json['id'],
        name: json['name'],
        phoneNumber: json['phone_number'],
        email: json['email'],
        address: Address.fromJson(json['address']),
      );
}

class OrderItem {
  final String id;
  final String name;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final List<String> modifiers;

  OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    this.modifiers = const [],
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'quantity': quantity,
        'unit_price': unitPrice,
        'total_price': totalPrice,
        'modifiers': modifiers,
      };

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        id: json['id'],
        name: json['name'],
        quantity: json['quantity'],
        unitPrice: (json['unit_price'] as num).toDouble(),
        totalPrice: (json['total_price'] as num).toDouble(),
        modifiers: (json['modifiers'] as List? ?? []).cast<String>(),
      );
}

class PaymentInfo {
  final String method; // "cash", "card", "mpesa"
  final bool isPrepaid;
  final double amountPaid;
  final String? transactionId;

  PaymentInfo({
    required this.method,
    required this.isPrepaid,
    required this.amountPaid,
    this.transactionId,
  });

  Map<String, dynamic> toJson() => {
        'method': method,
        'is_prepaid': isPrepaid,
        'amount_paid': amountPaid,
        'transaction_id': transactionId,
      };

  factory PaymentInfo.fromJson(Map<String, dynamic> json) => PaymentInfo(
        method: json['method'],
        isPrepaid: json['is_prepaid'],
        amountPaid: (json['amount_paid'] as num).toDouble(),
        transactionId: json['transaction_id'],
      );
}

class DeliveryInfo {
  final String type; // "delivery" or "pickup"
  final Address address;
  final DateTime? estimatedDeliveryTime;
  final String? courierName;
  final String? courierPhone;

  DeliveryInfo({
    required this.type,
    required this.address,
    this.estimatedDeliveryTime,
    this.courierName,
    this.courierPhone,
  });

  Map<String, dynamic> toJson() => {
        'type': type,
        'address': address.toJson(),
        'estimated_delivery_time': estimatedDeliveryTime?.toIso8601String(),
        'courier_name': courierName,
        'courier_phone': courierPhone,
      };

  factory DeliveryInfo.fromJson(Map<String, dynamic> json) => DeliveryInfo(
        type: json['type'],
        address: Address.fromJson(json['address']),
        estimatedDeliveryTime: json['estimated_delivery_time'] != null
            ? DateTime.parse(json['estimated_delivery_time'])
            : null,
        courierName: json['courier_name'],
        courierPhone: json['courier_phone'],
      );
}

class Address {
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;
  final double? latitude;
  final double? longitude;

  Address({
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
    this.latitude,
    this.longitude,
  });

  Map<String, dynamic> toJson() => {
        'street': street,
        'city': city,
        'state': state,
        'zip_code': zipCode,
        'country': country,
        'latitude': latitude,
        'longitude': longitude,
      };

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        street: json['street'],
        city: json['city'],
        state: json['state'],
        zipCode: json['zip_code'],
        country: json['country'],
        latitude: json['latitude']?.toDouble(),
        longitude: json['longitude']?.toDouble(),
      );
}



//  Business Hours

class BusinessHours {
  final Map<String, DayHours> weeklyHours;
  final List<HolidayHours> holidayHours;

  BusinessHours({
    required this.weeklyHours,
    this.holidayHours = const [],
  });

  Map<String, dynamic> toJson() => {
        'weekly_hours': weeklyHours.map((k, v) => MapEntry(k, v.toJson())),
        'holiday_hours': holidayHours.map((h) => h.toJson()).toList(),
      };

  factory BusinessHours.fromJson(Map<String, dynamic> json) => BusinessHours(
        weeklyHours: (json['weekly_hours'] as Map<String, dynamic>)
            .map((k, v) => MapEntry(k, DayHours.fromJson(v))),
        holidayHours: (json['holiday_hours'] as List? ?? [])
            .map((h) => HolidayHours.fromJson(h))
            .toList(),
      );
}

class DayHours {
  final String? openTime; // "09:00"
  final String? closeTime; // "22:00"
  final bool isClosed;

  DayHours({this.openTime, this.closeTime, this.isClosed = false});

  Map<String, dynamic> toJson() => {
        'open_time': openTime,
        'close_time': closeTime,
        'is_closed': isClosed,
      };

  factory DayHours.fromJson(Map<String, dynamic> json) => DayHours(
        openTime: json['open_time'],
        closeTime: json['close_time'],
        isClosed: json['is_closed'] ?? false,
      );
}

class HolidayHours {
  final DateTime date;
  final String? openTime;
  final String? closeTime;
  final bool isClosed;
  final String? reason;

  HolidayHours({
    required this.date,
    this.openTime,
    this.closeTime,
    this.isClosed = false,
    this.reason,
  });

  Map<String, dynamic> toJson() => {
        'date': date.toIso8601String().split('T')[0],
        'open_time': openTime,
        'close_time': closeTime,
        'is_closed': isClosed,
        'reason': reason,
      };

  factory HolidayHours.fromJson(Map<String, dynamic> json) => HolidayHours(
        date: DateTime.parse(json['date']),
        openTime: json['open_time'],
        closeTime: json['close_time'],
        isClosed: json['is_closed'] ?? false,
        reason: json['reason'],
      );
}

// ------------------- Exceptions -------------------

class CoreServiceException implements Exception {
  final String message;
  CoreServiceException(this.message);

  @override
  String toString() => "CoreServiceException: $message";
}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);

  @override
  String toString() => "ValidationException: $message";
}

// ------------------- Order Events -------------------

enum OrderEventType {
  created,
  statusChanged,
  cancelled,
  completed,
}

class OrderEvent {
  final OrderEventType type;
  final Order order;
  final DateTime timestamp;
  final String source;
  final OrderStatus? previousStatus;
  final Map<String, dynamic>? metadata;

  OrderEvent({
    required this.type,
    required this.order,
    required this.timestamp,
    required this.source,
    this.previousStatus,
    this.metadata,
  });
}

abstract class OrderEventListener {
  Future<void> onOrderEvent(OrderEvent event);
}

// ------------------- Order Status Logs -------------------

class OrderStatusLog {
  final String orderId;
  final OrderStatus previousStatus;
  final OrderStatus newStatus;
  final String? reason;
  final Map<String, dynamic>? metadata;
  final DateTime timestamp;

  OrderStatusLog({
    required this.orderId,
    required this.previousStatus,
    required this.newStatus,
    this.reason,
    this.metadata,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'order_id': orderId,
        'previous_status': previousStatus.name,
        'new_status': newStatus.name,
        'reason': reason,
        'metadata': metadata,
        'timestamp': timestamp.toIso8601String(),
      };

  factory OrderStatusLog.fromJson(Map<String, dynamic> json) => OrderStatusLog(
        orderId: json['order_id'],
        previousStatus: OrderStatus.values.byName(json['previous_status']),
        newStatus: OrderStatus.values.byName(json['new_status']),
        reason: json['reason'],
        metadata: json['metadata'] != null
            ? Map<String, dynamic>.from(json['metadata'])
            : null,
        timestamp: DateTime.parse(json['timestamp']),
      );
}

// ------------------- Platform Helpers -------------------

class Menu {
  final String id;
  final String name;
  final List<MenuItem> items;

  Menu({required this.id, required this.name, required this.items});
}

class MenuItem {
  final String id;
  final String name;
  final double price;

  MenuItem({required this.id, required this.name, required this.price});
}

class PlatformStore {
  final String id;
  final String name;
  final StoreStatus status;

  PlatformStore({required this.id, required this.name, required this.status});
}