class WebhookEventModel {
  final int? id;
  final String eventId;
  final String platform;
  final String eventType;
  final String storeId;
  final String resourceId;
  final String resourceHref;
  final DateTime timestamp;
  final Map<String, dynamic> data;

  WebhookEventModel({
    this.id,
    required this.eventId,
    required this.platform,
    required this.eventType,
    required this.storeId,
    required this.resourceId,
    required this.resourceHref,
    required this.timestamp,
    required this.data,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'event_id': eventId,
        'platform': platform,
        'event_type': eventType,
        'store_id': storeId,
        'resource_id': resourceId,
        'resource_href': resourceHref,
        'timestamp': timestamp.toIso8601String(),
        'data': data,
      };
}
