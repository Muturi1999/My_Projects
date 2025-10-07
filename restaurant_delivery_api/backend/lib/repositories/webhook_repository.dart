// import 'dart:convert';

// import 'package:postgres/postgres.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// class WebhookRepository {
//   final PostgreSQLConnection db;
//   WebhookRepository(this.db);

//   Future<void> insertEvent(WebhookEvent event) async {
//     await db.query('''
//       INSERT INTO webhook_events (
//         event_id, platform, event_type, store_id,
//         resource_id, resource_href, timestamp, data
//       ) VALUES (@event_id, @platform, @event_type, @store_id,
//                 @resource_id, @resource_href, @timestamp, @data::jsonb)
//     ''', substitutionValues: {
//       'event_id': event.id,
//       'platform': event.platform,
//       'event_type': event.eventType.toString(),
//       'store_id': event.storeId,
//       'resource_id': event.resourceId,
//       'resource_href': event.resourceHref,
//       'timestamp': event.timestamp.toIso8601String(),
//       'data': jsonEncode(event.platformData),
//     });
//   }

  

//   Future<List<Map<String, dynamic>>> getAllEvents() async {
//     final result = await db.query('SELECT * FROM webhook_events ORDER BY timestamp DESC');
//     return result
//         .map((row) => {
//               'id': row[0],
//               'event_id': row[1],
//               'platform': row[2],
//               'event_type': row[3],
//               'store_id': row[4],
//               'resource_id': row[5],
//               'resource_href': row[6],
//               'timestamp': row[7],
//               'data': row[8],
//             })
//         .toList();
//   }
// }

// import 'dart:convert';
// import 'package:backend/core/logger.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
// import 'package:postgres/postgres.dart';

// class WebhookRepository {
//   final PostgreSQLConnection db;
//   final Logger logger;

//   WebhookRepository(this.db, this.logger);

//   /// Insert a new webhook event into the database
//   Future<void> insertEvent(WebhookEvent event) async {
//     await db.query('''
//       INSERT INTO webhook_events (
//         event_id, platform, event_type, store_id,
//         resource_id, resource_href, timestamp, data
//       ) VALUES (
//         @event_id, @platform, @event_type, @store_id,
//         @resource_id, @resource_href, @timestamp, @data::jsonb
//       )
//     ''', substitutionValues: {
//       'event_id': event.id,
//       'platform': event.platform,
//       'event_type': event.eventType.toString(),
//       'store_id': event.storeId,
//       'resource_id': event.resourceId,
//       'resource_href': event.resourceHref,
//       'timestamp': event.timestamp.toIso8601String(),
//       'data': jsonEncode(event.platformData),
//     });

//     logger.info('✅ Webhook event inserted: ${event.id}');
//   }

//   /// Fetch all webhook events from the database
//   Future<List<Map<String, dynamic>>> getAllEvents() async {
//     final result = await db.query('SELECT * FROM webhook_events ORDER BY timestamp DESC');
//     return result
//         .map((row) => {
//               'id': row[0],
//               'event_id': row[1],
//               'platform': row[2],
//               'event_type': row[3],
//               'store_id': row[4],
//               'resource_id': row[5],
//               'resource_href': row[6],
//               'timestamp': row[7],
//               'data': row[8],
//             })
//         .toList();
//   }
// }

import 'dart:convert';
import 'package:backend/core/logger.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
import 'package:postgres/postgres.dart';

class WebhookRepository {
  final PostgreSQLConnection db;
  final Logger logger;

  WebhookRepository(this.db, this.logger);

  /// Insert a new webhook event into the database
  Future<void> insertEvent(WebhookEvent event) async {
    try {
      // 🔧 Extract store_id from platformData if not directly available
      final storeId = event.storeId ?? 
                      event.platformData['store_id'] as String? ?? 
                      '';
      
      await db.query('''
        INSERT INTO webhook_events (
          event_id, platform, event_type, store_id,
          resource_id, resource_href, timestamp, data
        ) VALUES (
          @event_id, @platform, @event_type, @store_id,
          @resource_id, @resource_href, @timestamp, @data::jsonb
        )
      ''', substitutionValues: {
        'event_id': event.id,
        'platform': 'uber_eats',  // 🔧 Use hardcoded platform or extract from event
        'event_type': event.eventType.toString(),
        'store_id': storeId,  // 🔧 Use extracted storeId
        'resource_id': event.resourceId,
        'resource_href': event.resourceHref,
        'timestamp': event.timestamp.toIso8601String(),
        'data': jsonEncode(event.platformData),
      });

      logger.info('✅ Webhook event inserted: ${event.id} (store: $storeId)');
    } catch (e, stack) {
      logger.error('❌ Failed to insert webhook event: $e');
      logger.error(stack.toString());
      rethrow;
    }
  }

  /// Fetch all webhook events from the database
  Future<List<Map<String, dynamic>>> getAllEvents() async {
    try {
      final result = await db.query(
        'SELECT * FROM webhook_events ORDER BY timestamp DESC'
      );
      
      return result.map((row) {
        return {
          'id': row[0],
          'event_id': row[1],
          'platform': row[2],
          'event_type': row[3],
          'store_id': row[4],
          'resource_id': row[5],
          'resource_href': row[6],
          'timestamp': (row[7] as DateTime).toIso8601String(),
          'data': row[8] is String ? jsonDecode(row[8]) : row[8],
          'created_at': (row[9] as DateTime).toIso8601String(),
        };
      }).toList();
    } catch (e, stack) {
      logger.error('❌ Failed to fetch webhook events: $e');
      logger.error(stack.toString());
      rethrow;
    }
  }
}