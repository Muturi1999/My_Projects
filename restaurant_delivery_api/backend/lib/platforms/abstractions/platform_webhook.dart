abstract class PlatformWebhookHandler {
  bool validateWebhookSignature(String body, String signature, String secret);
  WebhookEvent parseWebhookEvent(Map<String, dynamic> payload);
  Future<void> handleOrderNotification(WebhookEvent event);
  Future<void> handleOrderCancellation(WebhookEvent event);
}