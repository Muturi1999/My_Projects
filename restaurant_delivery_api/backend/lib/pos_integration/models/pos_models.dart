// import 'package:backend/platforms/uber_eats/services/uber_menu_service.dart';

// class PosInjectionResult {
//   final bool success;
//   final String? posOrderId;
//   final String? errorMessage;
//   final String? errorCode;
//   final Map<String, dynamic> metadata;

//   PosInjectionResult({
//     required this.success,
//     this.posOrderId,
//     this.errorMessage,
//     this.errorCode,
//     this.metadata = const {},
//   });

//   PosInjectionResult.success(this.posOrderId) : 
//     success = true,
//     errorMessage = null,
//     errorCode = null,
//     metadata = const {};

//   PosInjectionResult.failure(this.errorMessage, [this.errorCode]) :
//     success = false,
//     posOrderId = null,
//     metadata = const {};
// }

// class PosConnectionConfig {
//   final String posSystem;
//   final String branchId;
//   final Map<String, String> credentials;
//   final Map<String, dynamic> settings;
//   final String? apiEndpoint;

//   PosConnectionConfig({
//     required this.posSystem,
//     required this.branchId,
//     required this.credentials,
//     this.settings = const {},
//     this.apiEndpoint,
//   });
// }

// enum PosOrderStatus { pending, accepted, preparing, ready, completed, cancelled }

// class PosMenu {
//   final String storeId;
//   final List<PosMenuItem> items;
//   final List<PosCategory> categories;
//   final DateTime lastUpdated;

//   PosMenu({
//     required this.storeId,
//     required this.items,
//     required this.categories,
//     required this.lastUpdated,
//   });

//   // static PosMenu fromJson(Map<String, dynamic> toastMenu) {}
//   static PosMenu fromJson(Map<String, dynamic> toastMenu) {
//   final items = (toastMenu['items'] as List? ?? [])
//       .map((item) => PosMenuItem(
//             id: item['id'],
//             name: item['name'],
//             categoryId: item['categoryId'] ?? '',
//             price: (item['price'] as num).toDouble(),
//             available: item['available'] ?? true,
//           ))
//       .toList();

//   final categories = (toastMenu['categories'] as List? ?? [])
//       .map((cat) => PosCategory(
//             id: cat['id'],
//             name: cat['name'], itemIds: [],
//           ))
//       .toList();

//   return PosMenu(
//     storeId: toastMenu['storeId'] ?? '',
//     items: items,
//     categories: categories,
//     lastUpdated: DateTime.tryParse(toastMenu['lastUpdated'] ?? '') ??
//         DateTime.now(),
//   );
// }

// }

// class PosMenuItem {
//   final String id;
//   final String name;
//   final String categoryId;
//   final double price;
//   final bool available;
//   final List<PosModifierGroup> modifierGroups;

//   PosMenuItem({
//     required this.id,
//     required this.name,
//     required this.categoryId,
//     required this.price,
//     required this.available,
//     this.modifierGroups = const [],
//   });
// }

import 'package:backend/platforms/uber_eats/services/uber_menu_service.dart';

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

  PosInjectionResult.success(this.posOrderId)
      : success = true,
        errorMessage = null,
        errorCode = null,
        metadata = const {};

  PosInjectionResult.failure(this.errorMessage, [this.errorCode])
      : success = false,
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

  static PosMenu fromJson(Map<String, dynamic> toastMenu) {
    final items = (toastMenu['items'] as List? ?? [])
        .map((item) => PosMenuItem.fromJson(item))
        .toList();

    final categories = (toastMenu['categories'] as List? ?? [])
        .map((cat) => PosCategory.fromJson(cat))
        .toList();

    return PosMenu(
      storeId: toastMenu['storeId'] ?? '',
      items: items,
      categories: categories,
      lastUpdated: DateTime.tryParse(toastMenu['lastUpdated'] ?? '') ??
          DateTime.now(),
    );
  }
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

  factory PosMenuItem.fromJson(Map<String, dynamic> json) {
    return PosMenuItem(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      categoryId: json['categoryId'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      available: json['available'] ?? true,
      modifierGroups: (json['modifierGroups'] as List? ?? [])
          .map((mg) => PosModifierGroup.fromJson(mg))
          .toList(),
    );
  }
}

class PosCategory {
  final String id;
  final String name;

  PosCategory({
    required this.id,
    required this.name,
  });

  factory PosCategory.fromJson(Map<String, dynamic> json) {
    return PosCategory(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
    );
  }
}

class PosModifierGroup {
  final String id;
  final String name;
  final List<PosModifier> modifiers;

  PosModifierGroup({
    required this.id,
    required this.name,
    required this.modifiers,
  });

  factory PosModifierGroup.fromJson(Map<String, dynamic> json) {
    return PosModifierGroup(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      modifiers: (json['modifiers'] as List? ?? [])
          .map((m) => PosModifier.fromJson(m))
          .toList(),
    );
  }
}

class PosModifier {
  final String id;
  final String name;
  final double price;

  PosModifier({
    required this.id,
    required this.name,
    required this.price,
  });

  factory PosModifier.fromJson(Map<String, dynamic> json) {
    return PosModifier(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
    );
  }
}


