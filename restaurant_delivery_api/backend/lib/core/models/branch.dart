import 'package:backend/core/models/order.dart';

class Branch {
  final String id;
  final String restaurantId;
  final String name;
  final Address address;
  final String phoneNumber;
  final String email;
  final Map<String, String> posSystemIds; // Maps POS system type to POS store ID
  final Map<String, String> platformStoreIds; // Maps platform name to platform store ID
  final StoreStatus status;
  final BusinessHours businessHours;
  final DateTime createdAt;

  Branch({
    required this.id,
    required this.restaurantId,
    required this.name,
    required this.address,
    required this.phoneNumber,
    required this.email,
    required this.posSystemIds,
    required this.platformStoreIds,
    required this.status,
    required this.businessHours,
    required this.createdAt,
  });

  // Convert to JSON for database storage
  Map<String, dynamic> toJson() => {
    'id': id,
    'restaurant_id': restaurantId,
    'name': name,
    'address': address.toJson(),
    'phone_number': phoneNumber,
    'email': email,
    'pos_system_ids': posSystemIds,
    'platform_store_ids': platformStoreIds,
    'status': status.toString(),
    'business_hours': businessHours.toJson(),
    'created_at': createdAt.toIso8601String(),
  };

  factory Branch.fromJson(Map<String, dynamic> json) => Branch(
    id: json['id'],
    restaurantId: json['restaurant_id'],
    name: json['name'],
    address: Address.fromJson(json['address']),
    phoneNumber: json['phone_number'],
    email: json['email'],
    posSystemIds: Map<String, String>.from(json['pos_system_ids'] ?? {}),
    platformStoreIds: Map<String, String>.from(json['platform_store_ids'] ?? {}),
    status: StoreStatus.values.firstWhere((e) => e.toString() == json['status']),
    businessHours: BusinessHours.fromJson(json['business_hours']),
    createdAt: DateTime.parse(json['created_at']),
  );
}