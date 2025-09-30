import 'package:backend/core/models/branch.dart' show Branch;
import 'package:backend/core/models/platform_integration.dart';


class Restaurant {
  final String id;
  final String name;
  final String businessLicenseNumber;
  final List<Branch> branches;
  final List<PlatformIntegration> platformIntegrations;
  final DateTime createdAt;
  final DateTime updatedAt;

  Restaurant({
    required this.id,
    required this.name,
    required this.businessLicenseNumber,
    required this.branches,
    required this.platformIntegrations,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'business_license_number': businessLicenseNumber,
    'branches': branches.map((b) => b.toJson()).toList(),
    'platform_integrations': platformIntegrations.map((p) => p.toJson()).toList(),
    'created_at': createdAt.toIso8601String(),
    'updated_at': updatedAt.toIso8601String(),
  };

  factory Restaurant.fromJson(Map<String, dynamic> json) => Restaurant(
    id: json['id'],
    name: json['name'],
    businessLicenseNumber: json['business_license_number'],
    branches: (json['branches'] as List).map((b) => Branch.fromJson(b)).toList(),
    platformIntegrations: (json['platform_integrations'] as List).map((p) => PlatformIntegration.fromJson(p)).toList(),
    createdAt: DateTime.parse(json['created_at']),
    updatedAt: DateTime.parse(json['updated_at']),
  );

  Future<Restaurant?> copyWith({required List<Branch> branches}) async {}
}