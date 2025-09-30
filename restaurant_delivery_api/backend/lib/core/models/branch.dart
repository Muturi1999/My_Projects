// import 'package:backend/core/models/order.dart';

// class Branch {
//   final String id;
//   final String restaurantId;
//   final String name;
//   final Address address;
//   final String phoneNumber;
//   final String email;
//   final Map<String, String> posSystemIds; // Maps POS system type to POS store ID
//   final Map<String, String> platformStoreIds; // Maps platform name to platform store ID
//   final StoreStatus status;
//   final BusinessHours businessHours;
//   final DateTime createdAt;

//   Branch({
//     required this.id,
//     required this.restaurantId,
//     required this.name,
//     required this.address,
//     required this.phoneNumber,
//     required this.email,
//     required this.posSystemIds,
//     required this.platformStoreIds,
//     required this.status,
//     required this.businessHours,
//     required this.createdAt,
//   });

//   // Convert to JSON for database storage
//   Map<String, dynamic> toJson() => {
//     'id': id,
//     'restaurant_id': restaurantId,
//     'name': name,
//     'address': address.toJson(),
//     'phone_number': phoneNumber,
//     'email': email,
//     'pos_system_ids': posSystemIds,
//     'platform_store_ids': platformStoreIds,
//     'status': status.toString(),
//     'business_hours': businessHours.toJson(),
//     'created_at': createdAt.toIso8601String(),
//   };

//   factory Branch.fromJson(Map<String, dynamic> json) => Branch(
//     id: json['id'],
//     restaurantId: json['restaurant_id'],
//     name: json['name'],
//     address: Address.fromJson(json['address']),
//     phoneNumber: json['phone_number'],
//     email: json['email'],
//     posSystemIds: Map<String, String>.from(json['pos_system_ids'] ?? {}),
//     platformStoreIds: Map<String, String>.from(json['platform_store_ids'] ?? {}),
//     status: StoreStatus.values.firstWhere((e) => e.toString() == json['status']),
//     businessHours: BusinessHours.fromJson(json['business_hours']),
//     createdAt: DateTime.parse(json['created_at']),
//   );
// }

// lib/core/models/branch.dart
import 'package:backend/core/models/order.dart';

class Branch {
  final String id;
  final String restaurantId;
  final String name;
  final String phoneNumber;
  final String email;
  final Address address;
  final Map<String, String> platformStoreIds; // Maps platform name to platform store ID
  final Map<String, String> posSystemIds; // Maps POS system type to POS store ID
  final StoreStatus status;
  final BusinessHours businessHours;
  final DateTime createdAt;
  final DateTime updatedAt;

  Branch({
    required this.id,
    required this.restaurantId,
    required this.name,
    required this.phoneNumber,
    required this.email,
    required this.address,
    this.platformStoreIds = const {},
    this.posSystemIds = const {},
    this.status = StoreStatus.active,
    required this.businessHours,
    required this.createdAt,
    required this.updatedAt,
  });

  /// CopyWith for immutability
  Branch copyWith({
    String? id,
    String? restaurantId,
    String? name,
    String? phoneNumber,
    String? email,
    Address? address,
    Map<String, String>? platformStoreIds,
    Map<String, String>? posSystemIds,
    StoreStatus? status,
    BusinessHours? businessHours,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Branch(
      id: id ?? this.id,
      restaurantId: restaurantId ?? this.restaurantId,
      name: name ?? this.name,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      email: email ?? this.email,
      address: address ?? this.address,
      platformStoreIds: platformStoreIds ?? this.platformStoreIds,
      posSystemIds: posSystemIds ?? this.posSystemIds,
      status: status ?? this.status,
      businessHours: businessHours ?? this.businessHours,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// Convert to JSON for database storage
  Map<String, dynamic> toJson() => {
        'id': id,
        'restaurant_id': restaurantId,
        'name': name,
        'phone_number': phoneNumber,
        'email': email,
        'address': address.toJson(),
        'platform_store_ids': platformStoreIds,
        'pos_system_ids': posSystemIds,
        'status': status.toString(),
        'business_hours': businessHours.toJson(),
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
      };

  /// Construct from JSON
  factory Branch.fromJson(Map<String, dynamic> json) => Branch(
        id: json['id'],
        restaurantId: json['restaurant_id'],
        name: json['name'],
        phoneNumber: json['phone_number'],
        email: json['email'],
        address: Address.fromJson(json['address']),
        platformStoreIds: Map<String, String>.from(json['platform_store_ids'] ?? {}),
        posSystemIds: Map<String, String>.from(json['pos_system_ids'] ?? {}),
        status: StoreStatus.values.firstWhere((e) => e.toString() == json['status']),
        businessHours: BusinessHours.fromJson(json['business_hours']),
        createdAt: DateTime.parse(json['created_at']),
        updatedAt: DateTime.parse(json['updated_at']),
      );

  /// Equality for reliable in-memory comparison
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Branch &&
        other.id == id &&
        other.restaurantId == restaurantId &&
        other.name == name &&
        other.phoneNumber == phoneNumber &&
        other.email == email &&
        other.address == address &&
        other.platformStoreIds.toString() == platformStoreIds.toString() &&
        other.posSystemIds.toString() == posSystemIds.toString() &&
        other.status == status &&
        other.businessHours == businessHours &&
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt;
  }

  @override
  int get hashCode =>
      id.hashCode ^
      restaurantId.hashCode ^
      name.hashCode ^
      phoneNumber.hashCode ^
      email.hashCode ^
      address.hashCode ^
      platformStoreIds.hashCode ^
      posSystemIds.hashCode ^
      status.hashCode ^
      businessHours.hashCode ^
      createdAt.hashCode ^
      updatedAt.hashCode;
}

