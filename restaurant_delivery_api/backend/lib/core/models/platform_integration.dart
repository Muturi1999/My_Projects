class PlatformIntegration {
  final String id;
  final String platform; // 'uber_eats', 'glovo', 'bolt'
  final String apiKey;
  final String status; // active, inactive
  final DateTime createdAt;
  final DateTime updatedAt;

  PlatformIntegration({
    required this.id,
    required this.platform,
    required this.apiKey,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PlatformIntegration.fromJson(Map<String, dynamic> json) {
    return PlatformIntegration(
      id: json['id'],
      platform: json['platform'],
      apiKey: json['api_key'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'platform': platform,
        'api_key': apiKey,
        'status': status,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
      };
}
