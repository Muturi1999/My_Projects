import 'package:backend/core/models/order.dart' hide Menu;
import 'package:backend/core/models/menu.dart';  // define Menu model separately


abstract class DeliveryPlatform {
  String get platformName;
  Future<bool> authenticate();
  Future<void> syncMenu(String storeId, Menu menu);
  Future<void> updateStoreStatus(String storeId, StoreStatus status);
  Future<List<PlatformStore>> getStores();
}