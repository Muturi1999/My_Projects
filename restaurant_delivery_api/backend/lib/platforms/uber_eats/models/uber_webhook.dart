// class UberWebhookEvent {
//   final String eventId;
//   final String eventType;
//   final int eventTime;
//   final String resourceHref;
//   final String resourceId;
//   final String userId; // This corresponds to store_id
//   final Map<String, dynamic> meta;

//   UberWebhookEvent({
//     required this.eventId,
//     required this.eventType,
//     required this.eventTime,
//     required this.resourceHref,
//     required this.resourceId,
//     required this.userId,
//     this.meta = const {},
//   });

//   factory UberWebhookEvent.fromJson(Map<String, dynamic> json) {
//     return UberWebhookEvent(
//       eventId: json['event_id'],
//       eventType: json['event_type'],
//       eventTime: json['event_time'],
//       resourceHref: json['resource_href'],
//       resourceId: json['resource_id'],
//       userId: json['user_id'],
//       meta: json['meta'] ?? {},
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'event_id': eventId,
//     'event_type': eventType,
//     'event_time': eventTime,
//     'resource_href': resourceHref,
//     'resource_id': resourceId,
//     'user_id': userId,
//     'meta': meta,
//   };
// }


class UberWebhookEvent {
  final String eventId;
  final String eventType;
  final int eventTime;
  final String resourceHref;
  final String resourceId;
  final String userId; // This corresponds to store_id
  final Map<String, dynamic> meta;

  UberWebhookEvent({
    required this.eventId,
    required this.eventType,
    required this.eventTime,
    required this.resourceHref,
    required this.resourceId,
    required this.userId,
    this.meta = const {},
  });

  factory UberWebhookEvent.fromJson(Map<String, dynamic> json) {
    return UberWebhookEvent(
      eventId: json['event_id'],
      eventType: json['event_type'],
      eventTime: json['event_time'],
      resourceHref: json['resource_href'],
      resourceId: json['resource_id'],
      userId: json['user_id'],
      meta: json['meta'] ?? {},
    );
  }

  Map<String, dynamic> toJson() => {
    'event_id': eventId,
    'event_type': eventType,
    'event_time': eventTime,
    'resource_href': resourceHref,
    'resource_id': resourceId,
    'user_id': userId,
    'meta': meta,
  };
}