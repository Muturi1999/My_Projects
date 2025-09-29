// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// class UberOrder {
//   final String id;
//   final String displayId;
//   final String type; // 'DELIVERY' or 'PICKUP'
//   final String store;
//   final int placedAt;
//   final int? estimatedReadyForPickupTime;
//   final int? scheduledFor;
//   final UberCustomer? customer;
//   final UberCart? cart;
//   final UberPayment? payment;
//   final UberDeliveryAddress? deliveryAddress;
//   final String? specialInstructions;
//   final String orderState;
//   final List<UberOrderEvent> events;

//   UberOrder({
//     required this.id,
//     required this.displayId,
//     required this.type,
//     required this.store,
//     required this.placedAt,
//     this.estimatedReadyForPickupTime,
//     this.scheduledFor,
//     this.customer,
//     this.cart,
//     this.payment,
//     this.deliveryAddress,
//     this.specialInstructions,
//     required this.orderState,
//     this.events = const [],
//   });

//   factory UberOrder.fromJson(Map<String, dynamic> json) {
//     return UberOrder(
//       id: json['id'],
//       displayId: json['display_id'] ?? json['id'],
//       type: json['type'],
//       store: json['store'],
//       placedAt: json['placed_at'],
//       estimatedReadyForPickupTime: json['estimated_ready_for_pickup_time'],
//       scheduledFor: json['scheduled_for'],
//       customer: json['customer'] != null ? UberCustomer.fromJson(json['customer']) : null,
//       cart: json['cart'] != null ? UberCart.fromJson(json['cart']) : null,
//       payment: json['payment'] != null ? UberPayment.fromJson(json['payment']) : null,
//       deliveryAddress: json['delivery'] != null ? UberDeliveryAddress.fromJson(json['delivery']) : null,
//       specialInstructions: json['special_instructions'],
//       orderState: json['order_state'] ?? 'CREATED',
//       events: (json['events'] as List? ?? []).map((e) => UberOrderEvent.fromJson(e)).toList(),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'id': id,
//     'display_id': displayId,
//     'type': type,
//     'store': store,
//     'placed_at': placedAt,
//     'estimated_ready_for_pickup_time': estimatedReadyForPickupTime,
//     'scheduled_for': scheduledFor,
//     'customer': customer?.toJson(),
//     'cart': cart?.toJson(),
//     'payment': payment?.toJson(),
//     'delivery': deliveryAddress?.toJson(),
//     'special_instructions': specialInstructions,
//     'order_state': orderState,
//     'events': events.map((e) => e?.toJson()).toList(),
//   };
// }

// class UberCustomer {
//   final String? id;
//   final String? name;
//   final String? phone;
//   final String? email;

//   UberCustomer({this.id, this.name, this.phone, this.email});

//   factory UberCustomer.fromJson(Map<String, dynamic> json) {
//     return UberCustomer(
//       id: json['id'],
//       name: json['name'],
//       phone: json['phone'],
//       email: json['email'],
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'id': id,
//     'name': name,
//     'phone': phone,
//     'email': email,
//   };
// }

// class UberCart {
//   final List<UberCartItem> items;
//   final double subTotal;
//   final double tax;
//   final double total;
//   final double deliveryFee;
//   final double tip;

//   UberCart({
//     required this.items,
//     required this.subTotal,
//     required this.tax,
//     required this.total,
//     required this.deliveryFee,
//     required this.tip,
//   });

//   factory UberCart.fromJson(Map<String, dynamic> json) {
//     return UberCart(
//       items: (json['items'] as List? ?? []).map((i) => UberCartItem.fromJson(i)).toList(),
//       subTotal: _parseDouble(json['sub_total']),
//       tax: _parseDouble(json['tax']),
//       total: _parseDouble(json['total']),
//       deliveryFee: _parseDouble(json['delivery_fee']),
//       tip: _parseDouble(json['tip']),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'items': items.map((i) => i.toJson()).toList(),
//     'sub_total': subTotal,
//     'tax': tax,
//     'total': total,
//     'delivery_fee': deliveryFee,
//     'tip': tip,
//   };

//   static double _parseDouble(dynamic value) {
//     if (value == null) return 0.0;
//     if (value is double) return value;
//     if (value is int) return value.toDouble();
//     if (value is String) return double.tryParse(value) ?? 0.0;
//     return 0.0;
//   }
// }

// class UberCartItem {
//   final String id;
//   final String instanceId;
//   final String title;
//   final int quantity;
//   final double? price;
//   final String? specialInstructions;
//   final List<UberSelectedModifierGroup>? selectedModifierGroups;

//   UberCartItem({
//     required this.id,
//     required this.instanceId,
//     required this.title,
//     required this.quantity,
//     this.price,
//     this.specialInstructions,
//     this.selectedModifierGroups,
//   });

//   factory UberCartItem.fromJson(Map<String, dynamic> json) {
//     return UberCartItem(
//       id: json['id'],
//       instanceId: json['instance_id'],
//       title: json['title'],
//       quantity: json['quantity'],
//       price: json['price']?.toDouble(),
//       specialInstructions: json['special_instructions'],
//       selectedModifierGroups: (json['selected_modifier_groups'] as List? ?? [])
//           .map((g) => UberSelectedModifierGroup.fromJson(g)).toList(),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'id': id,
//     'instance_id': instanceId,
//     'title': title,
//     'quantity': quantity,
//     'price': price,
//     'special_instructions': specialInstructions,
//     'selected_modifier_groups': selectedModifierGroups?.map((g) => g.toJson()).toList(),
//   };
// }


// backend/lib/models/uber_order.dart
// Enhanced Uber Eats order models (v2-ready)

class UberOrderV2 {
  final String id;
  final String externalId;
  final String state; // e.g. PENDING, COMPLETED
  final String status; // finer-grained status
  final String preparationStatus; // READY, IN_PROGRESS, etc.
  final String orderingPlatform; // UBER_EATS, DIRECT
  final String fulfillmentType; // DELIVERY, PICKUP

  final List<String> eligibleActions; // e.g. ACCEPT, DENY, CANCEL
  final FailureInfo? failureInfo;

  final List<UberCustomer> customers;
  final List<UberCart> carts;
  final UberDelivery? delivery;
  final UberPayment? payment;

  UberOrderV2({
    required this.id,
    required this.externalId,
    required this.state,
    required this.status,
    required this.preparationStatus,
    required this.orderingPlatform,
    required this.fulfillmentType,
    required this.eligibleActions,
    required this.failureInfo,
    required this.customers,
    required this.carts,
    this.delivery,
    this.payment,
  });

  factory UberOrderV2.fromJson(Map<String, dynamic> json) {
    return UberOrderV2(
      id: json['id'],
      externalId: json['externalId'] ?? '',
      state: json['state'] ?? '',
      status: json['status'] ?? '',
      preparationStatus: json['preparationStatus'] ?? '',
      orderingPlatform: json['orderingPlatform'] ?? '',
      fulfillmentType: json['fulfillmentType'] ?? '',
      eligibleActions: List<String>.from(json['eligibleActions'] ?? []),
      failureInfo: json['failureInfo'] != null
          ? FailureInfo.fromJson(json['failureInfo'])
          : null,
      customers: (json['customers'] as List<dynamic>? ?? [])
          .map((c) => UberCustomer.fromJson(c))
          .toList(),
      carts: (json['carts'] as List<dynamic>? ?? [])
          .map((c) => UberCart.fromJson(c))
          .toList(),
      delivery: json['delivery'] != null
          ? UberDelivery.fromJson(json['delivery'])
          : null,
      payment:
          json['payment'] != null ? UberPayment.fromJson(json['payment']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'externalId': externalId,
        'state': state,
        'status': status,
        'preparationStatus': preparationStatus,
        'orderingPlatform': orderingPlatform,
        'fulfillmentType': fulfillmentType,
        'eligibleActions': eligibleActions,
        'failureInfo': failureInfo?.toJson(),
        'customers': customers.map((c) => c.toJson()).toList(),
        'carts': carts.map((c) => c.toJson()).toList(),
        'delivery': delivery?.toJson(),
        'payment': payment?.toJson(),
      };
}

class FailureInfo {
  final String code;
  final String message;

  FailureInfo({required this.code, required this.message});

  factory FailureInfo.fromJson(Map<String, dynamic> json) {
    return FailureInfo(
      code: json['code'] ?? '',
      message: json['message'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'code': code,
        'message': message,
      };
}

class UberCustomer {
  final String id;
  final String name;
  final String phone;

  UberCustomer({required this.id, required this.name, required this.phone});

  factory UberCustomer.fromJson(Map<String, dynamic> json) {
    return UberCustomer(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
      };
}

class UberCart {
  final String id;
  final List<UberItem> items;

  UberCart({required this.id, required this.items});

  factory UberCart.fromJson(Map<String, dynamic> json) {
    return UberCart(
      id: json['id'] ?? '',
      items: (json['items'] as List<dynamic>? ?? [])
          .map((i) => UberItem.fromJson(i))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'items': items.map((i) => i.toJson()).toList(),
      };
}

class UberItem {
  final String id;
  final String name;
  final int quantity;

  UberItem({required this.id, required this.name, required this.quantity});

  factory UberItem.fromJson(Map<String, dynamic> json) {
    return UberItem(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'quantity': quantity,
      };
}

class UberDelivery {
  final String type;
  final String address;

  UberDelivery({required this.type, required this.address});

  factory UberDelivery.fromJson(Map<String, dynamic> json) {
    return UberDelivery(
      type: json['type'] ?? '',
      address: json['address'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'type': type,
        'address': address,
      };
}

class UberPayment {
  final String method;
  final double amount;

  UberPayment({required this.method, required this.amount});

  factory UberPayment.fromJson(Map<String, dynamic> json) {
    return UberPayment(
      method: json['method'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'method': method,
        'amount': amount,
      };
}