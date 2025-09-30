import 'package:backend/core/models/order.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart' hide Order;
import 'package:backend/pos_integration/models/pos_models.dart';

abstract class PosAdapter {
  String get posSystemName;
  String get version;
  
  // Order operations
  Future<PosInjectionResult> injectOrder(Order order, PosConnectionConfig config);
  Future<bool> cancelOrder(String posOrderId, String reason, PosConnectionConfig config);
  Future<PosOrderStatus> getOrderStatus(String posOrderId, PosConnectionConfig config);
  
  // Menu operations (for bidirectional sync)
  Future<PosMenu> getMenu(PosConnectionConfig config);
  Future<bool> updateItemAvailability(String itemId, bool available, PosConnectionConfig config);
  
  // Store operations
  Future<bool> setStoreStatus(StoreStatus status, PosConnectionConfig config);
  Future<StoreStatus> getStoreStatus(PosConnectionConfig config);
  
  // Connection testing
  Future<bool> testConnection(PosConnectionConfig config);
}