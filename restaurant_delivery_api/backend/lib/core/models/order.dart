class Order {
  final String id;
  final String branchId;
  final String platformOrderId; // Original order ID from delivery platform
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
  final Map<String, dynamic> platformData; // Store platform-specific data

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
    'status': status.toString(),
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
    items: (json['items'] as List).map((i) => OrderItem.fromJson(i)).toList(),
    status: OrderStatus.values.firstWhere((e) => e.toString() == json['status']),
    paymentInfo: PaymentInfo.fromJson(json['payment_info']),
    deliveryInfo: DeliveryInfo.fromJson(json['delivery_info']),
    subtotal: json['subtotal'].toDouble(),
    tax: json['tax'].toDouble(),
    deliveryFee: json['delivery_fee'].toDouble(),
    total: json['total'].toDouble(),
    specialInstructions: json['special_instructions'],
    createdAt: DateTime.parse(json['created_at']),
    scheduledFor: json['scheduled_for'] != null ? DateTime.parse(json['scheduled_for']) : null,
    platformData: json['platform_data'] ?? {},
  );
}

// Supporting enums and models
enum StoreStatus { ONLINE, PAUSED, OFFLINE }
enum OrderStatus { PENDING, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED, DENIED }

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
        .map((h) => HolidayHours.fromJson(h)).toList(),
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
    'date': date.toIso8601String().split('T')[0], // YYYY-MM-DD format
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