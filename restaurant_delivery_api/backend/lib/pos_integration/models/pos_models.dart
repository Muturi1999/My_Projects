class PosInjectionResult {
  final bool success;
  final String? posOrderId;
  final String? errorMessage;
  final String? errorCode;
  final Map<String, dynamic> metadata;

  PosInjectionResult({
    required this.success,
    this.posOrderId,
    this.errorMessage,
    this.errorCode,
    this.metadata = const {},
  });

  PosInjectionResult.success(this.posOrderId) : 
    success = true,
    errorMessage = null,
    errorCode = null,
    metadata = const {};

  PosInjectionResult.failure(this.errorMessage, [this.errorCode]) :
    success = false,
    posOrderId = null,
    metadata = const {};
}

class PosConnectionConfig {
  final String posSystem;
  final String branchId;
  final Map<String, String> credentials;
  final Map<String, dynamic> settings;
  final String? apiEndpoint;

  PosConnectionConfig({
    required this.posSystem,
    required this.branchId,
    required this.credentials,
    this.settings = const {},
    this.apiEndpoint,
  });
}

enum PosOrderStatus { pending, accepted, preparing, ready, completed, cancelled }

class PosMenu {
  final String storeId;
  final List<PosMenuItem> items;
  final List<PosCategory> categories;
  final DateTime lastUpdated;

  PosMenu({
    required this.storeId,
    required this.items,
    required this.categories,
    required this.lastUpdated,
  });
}

class PosMenuItem {
  final String id;
  final String name;
  final String categoryId;
  final double price;
  final bool available;
  final List<PosModifierGroup> modifierGroups;

  PosMenuItem({
    required this.id,
    required this.name,
    required this.categoryId,
    required this.price,
    required this.available,
    this.modifierGroups = const [],
  });
}
