// import 'dart:convert';
// import 'package:shelf/shelf.dart';
// import 'package:backend/core/logger.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
// import 'package:backend/repositories/webhook_repository.dart'; // ✅ NEW

// class WebhookController {
//   final UberWebhookService uberWebhookService;
//   final Logger logger;
//   final bool skipSignatureVerification;
//   final String environment;
//   final WebhookRepository? webhookRepo; // ✅ optional DB repository

//   WebhookController({
//     required this.uberWebhookService,
//     required this.logger,
//     this.skipSignatureVerification = false,
//     required this.environment,
//     this.webhookRepo, // ✅ can be null in test mode
//   });

//   /// -----------------------------
//   /// 🔹 MAIN ROUTE HANDLER (POST)
//   /// -----------------------------
//   Future<Response> handleWebhook(Request request) async {
//     try {
//       final platform = request.url.pathSegments.length > 1
//           ? request.url.pathSegments[1].toLowerCase()
//           : '';

//       final body = await request.readAsString();
//       final signature = request.headers['x-uber-signature'] ?? '';

//       logger.info('Incoming webhook for platform: $platform');

//       switch (platform) {
//         case 'uber-eats':
//         case 'uber_eats':
//           return await _handleUberEatsWebhook(body, signature);
//         case 'glovo':
//           return _simpleResponse('Glovo webhook not yet implemented');
//         case 'bolt':
//           return _simpleResponse('Bolt webhook not yet implemented');
//         default:
//           logger.warning('Unknown webhook platform: $platform');
//           return Response.badRequest(
//             body: jsonEncode({'error': 'Unknown platform: $platform'}),
//             headers: {'Content-Type': 'application/json'},
//           );
//       }
//     } catch (e, stack) {
//       logger.error('Webhook processing failed: $e');
//       logger.error(stack.toString());
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Internal server error'}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     }
//   }

//   /// -----------------------------
//   /// 🔹 UBER EATS HANDLER
//   /// -----------------------------
//   Future<Response> _handleUberEatsWebhook(String body, String signature) async {
//     try {
//       logger.info('Webhook env=$environment, skipSignature=$skipSignatureVerification');

//       if (!skipSignatureVerification) {
//         final valid = uberWebhookService.validateWebhookSignature(
//           body,
//           signature,
//           uberWebhookService.clientSecret,
//         );

//         if (!valid) {
//           logger.warning('Invalid Uber Eats webhook signature');
//           return Response(
//             401,
//             body: jsonEncode({'error': 'Invalid signature'}),
//             headers: {'Content-Type': 'application/json'},
//           );
//         }
//       } else {
//         logger.info('⚠️ Signature verification skipped (dev/test mode)');
//       }

//       final payload = jsonDecode(body) as Map<String, dynamic>;
//       final event = uberWebhookService.parseWebhookEvent(payload);

//       logger.info('Received Uber Eats event: ${event.eventType}');

//       // ✅ Optionally save event to DB if webhookRepo is available
//       if (webhookRepo != null) {
//         await webhookRepo!.insertEvent(event);
//       }

//       switch (event.eventType) {
//         case WebhookEventType.orderCreated:
//         case WebhookEventType.scheduledOrderCreated:
//           await uberWebhookService.handleOrderNotification(event);
//           break;
//         case WebhookEventType.orderCancelled:
//           await uberWebhookService.handleOrderCancellation(event);
//           break;
//         case WebhookEventType.storeProvisioned:
//           await _onStoreProvisioned(event);
//           break;
//         case WebhookEventType.storeDeprovisioned:
//           await _onStoreDeprovisioned(event);
//           break;
//         default:
//           logger.info('Unhandled event type: ${event.eventType}');
//       }

//       return Response.ok(
//         jsonEncode({'status': 'ok', 'event': event.eventType.toString()}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     } catch (e, stack) {
//       logger.error('Error processing Uber Eats webhook: $e');
//       logger.error(stack.toString());
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Failed to process webhook'}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     }
//   }

//   Future<void> _onStoreProvisioned(WebhookEvent event) async {
//     logger.info('Store provisioned: ${event.storeId}');
//   }

//   Future<void> _onStoreDeprovisioned(WebhookEvent event) async {
//     logger.info('Store deprovisioned: ${event.storeId}');
//   }

//   Response _simpleResponse(String message) => Response.ok(
//         jsonEncode({'message': message}),
//         headers: {'Content-Type': 'application/json'},
//       );

//   /// -----------------------------
//   /// 🔹 NEW: GET ALL WEBHOOK EVENTS
//   /// -----------------------------
//   Future<Response> getAllWebhooks(Request request) async {
//     try {
//       if (webhookRepo == null) {
//         return Response.internalServerError(
//           body: jsonEncode({'error': 'Webhook repository not initialized'}),
//           headers: {'Content-Type': 'application/json'},
//         );
//       }

//       final events = await webhookRepo!.getAllEvents();

//       return Response.ok(
//         jsonEncode({'count': events.length, 'data': events}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     } catch (e, stack) {
//       logger.error('Failed to fetch webhook events: $e');
//       logger.error(stack.toString());
//       return Response.internalServerError(
//         body: jsonEncode({'error': 'Failed to fetch webhook events'}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     }
//   }
// }

import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:backend/core/logger.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
import 'package:backend/repositories/webhook_repository.dart';

class WebhookController {
  final UberWebhookService uberWebhookService;
  final Logger logger;
  final bool skipSignatureVerification;
  final String environment;
  final WebhookRepository? webhookRepo;

  WebhookController({
    required this.uberWebhookService,
    required this.logger,
    this.skipSignatureVerification = false,
    required this.environment,
    this.webhookRepo,
  });

  /// -----------------------------
  /// 🔹 MAIN ROUTE HANDLER (POST)
  /// -----------------------------
  Future<Response> handleWebhook(Request request) async {
    try {
      final platform = request.url.pathSegments.length > 1
          ? request.url.pathSegments[1].toLowerCase()
          : '';

      final body = await request.readAsString();
      final signature = request.headers['x-uber-signature'] ?? '';

      logger.info('Incoming webhook for platform: $platform');

      switch (platform) {
        case 'uber-eats':
        case 'uber_eats':
          return await _handleUberEatsWebhook(body, signature);
        case 'glovo':
          return _simpleResponse('Glovo webhook not yet implemented');
        case 'bolt':
          return _simpleResponse('Bolt webhook not yet implemented');
        default:
          logger.warning('Unknown webhook platform: $platform');
          return Response.badRequest(
            body: jsonEncode({'error': 'Unknown platform: $platform'}),
            headers: {'Content-Type': 'application/json'},
          );
      }
    } catch (e, stack) {
      logger.error('Webhook processing failed: $e');
      logger.error(stack.toString());
      return Response.internalServerError(
        body: jsonEncode({'error': 'Internal server error'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  /// -----------------------------
  /// 🔹 UBER EATS HANDLER
  /// -----------------------------
  Future<Response> _handleUberEatsWebhook(String body, String signature) async {
    try {
      logger.info('Webhook env=$environment, skipSignature=$skipSignatureVerification');

      if (!skipSignatureVerification) {
        final valid = uberWebhookService.validateWebhookSignature(
          body,
          signature,
          uberWebhookService.clientSecret,
        );

        if (!valid) {
          logger.warning('Invalid Uber Eats webhook signature');
          return Response(
            401,
            body: jsonEncode({'error': 'Invalid signature'}),
            headers: {'Content-Type': 'application/json'},
          );
        }
      } else {
        logger.info('⚠️ Signature verification skipped (dev/test mode)');
      }

      final payload = jsonDecode(body) as Map<String, dynamic>;
      final event = uberWebhookService.parseWebhookEvent(payload);

      logger.info('Received Uber Eats event: ${event.eventType}');

      // ✅ Save event to DB if repository available
      if (webhookRepo != null) {
        await webhookRepo!.insertEvent(event);
      }

      switch (event.eventType) {
        case WebhookEventType.orderCreated:
        case WebhookEventType.scheduledOrderCreated:
          await uberWebhookService.handleOrderNotification(event);
          break;
        case WebhookEventType.orderCancelled:
          await uberWebhookService.handleOrderCancellation(event);
          break;
        case WebhookEventType.storeProvisioned:
          await _onStoreProvisioned(event);
          break;
        case WebhookEventType.storeDeprovisioned:
          await _onStoreDeprovisioned(event);
          break;
        default:
          logger.info('Unhandled event type: ${event.eventType}');
      }

      return Response.ok(
        jsonEncode({'status': 'ok', 'event': event.eventType.toString()}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e, stack) {
      logger.error('Error processing Uber Eats webhook: $e');
      logger.error(stack.toString());
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to process webhook'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  /// -----------------------------
  /// 🔹 GET ALL WEBHOOK EVENTS
  /// -----------------------------
  Future<Response> getAllWebhooks(Request request) async {
    try {
      if (webhookRepo == null) {
        return Response.internalServerError(
          body: jsonEncode({'error': 'Webhook repository not initialized'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      final events = await webhookRepo!.getAllEvents();

      return Response.ok(
        jsonEncode({'count': events.length, 'data': events}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e, stack) {
      logger.error('Failed to fetch webhook events: $e');
      logger.error(stack.toString());
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to fetch webhook events'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  // --- Private Helpers ---
  Future<void> _onStoreProvisioned(WebhookEvent event) async {
    logger.info('Store provisioned: ${event.storeId}');
  }

  Future<void> _onStoreDeprovisioned(WebhookEvent event) async {
    logger.info('Store deprovisioned: ${event.storeId}');
  }

  Response _simpleResponse(String message) => Response.ok(
        jsonEncode({'message': message}),
        headers: {'Content-Type': 'application/json'},
      );
}
