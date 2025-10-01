import 'dart:convert';
// ignore: unused_import
import 'package:backend/core/utils/logger.dart' hide Logger;
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
import 'package:shelf/shelf.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import



class WebhookController {
  final UberWebhookService uberWebhookService;
  final Logger logger;

  WebhookController({
    required this.uberWebhookService,
    required this.logger,
  });

  // Main webhook endpoint - handles all platform webhooks
  Future<Response> handleWebhook(Request request) async {
    try {
      final platform = request.url.pathSegments.isNotEmpty ? request.url.pathSegments[0] : '';
      final body = await request.readAsString();
      final signature = request.headers['x-uber-signature'] ?? '';
      
      logger.info('Received webhook from $platform, signature: $signature');

      switch (platform.toLowerCase()) {
        case 'uber-eats':
        case 'uber_eats':
          return await _handleUberEatsWebhook(body, signature);
        case 'glovo':
          return await _handleGlovoWebhook(body, signature);
        case 'bolt':
          return await _handleBoltWebhook(body, signature);
        default:
          logger.warning('Unknown webhook platform: $platform');
          return Response.badRequest(
            body: jsonEncode({'error': 'Unknown platform: $platform'}),
            headers: {'Content-Type': 'application/json'},
          );
      }
    } catch (e, stackTrace) {
      logger.error('Webhook processing failed: $e', error: e);
      return Response.internalServerError(
        body: jsonEncode({'error': 'Internal server error'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  Future<Response> _handleUberEatsWebhook(String body, String signature) async {
    try {
      // Validate webhook signature
      if (!uberWebhookService.validateWebhookSignature(body, signature, uberWebhookService.clientSecret)) {
        logger.warning('Invalid Uber Eats webhook signature');
        return Response(401, body: 'Invalid signature');
      }

      // Parse webhook event
      final payload = jsonDecode(body) as Map<String, dynamic>;
      final webhookEvent = uberWebhookService.parseWebhookEvent(payload);

      // Process based on event type
      switch (webhookEvent.eventType) {
        case WebhookEventType.orderCreated:
        case WebhookEventType.scheduledOrderCreated:
          await uberWebhookService.handleOrderNotification(webhookEvent);
          break;
        case WebhookEventType.orderCancelled:
          await uberWebhookService.handleOrderCancellation(webhookEvent);
          break;
        case WebhookEventType.storeProvisioned:
          await _handleStoreProvisioned(webhookEvent);
          break;
        case WebhookEventType.storeDeprovisioned:
          await _handleStoreDeprovisioned(webhookEvent);
          break;
        default:
          logger.info('Unhandled webhook event type: ${webhookEvent.eventType}');
      }

      // Uber Eats requires 200 response with empty body
      return Response.ok('');
      
    } catch (e) {
      logger.error('Uber Eats webhook processing failed: $e');
      return Response.internalServerError();
    }
  }

  Future<Response> _handleGlovoWebhook(String body, String signature) async {
    // Similar implementation for Glovo webhooks
    // Would use GlovoWebhookService
    return Response.ok('');
  }

  Future<Response> _handleBoltWebhook(String body, String signature) async {
    // Similar implementation for Bolt webhooks
    // Would use BoltWebhookService
    return Response.ok('');
  }

  Future<void> _handleStoreProvisioned(WebhookEvent event) async {
    logger.info('Store provisioned: ${event.storeId}');
    // Implementation to handle new store activation
  }

  Future<void> _handleStoreDeprovisioned(WebhookEvent event) async {
    logger.info('Store deprovisioned: ${event.storeId}');
    // Implementation to handle store deactivation
  }
}
