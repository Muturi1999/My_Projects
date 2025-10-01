// import 'dart:convert';
// import 'dart:io';

// import 'package:backend/core/exceptions/core_exceptions.dart';
// import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
// import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// class UberMenuService {
//   final String baseUrl;
//   final UberAuthService authService;
//   final HttpClient httpClient;
//   final Logger logger;
//   String? _cachedToken;
//   DateTime? _tokenExpiry;

//   UberMenuService({
//     required this.authService,
//     required this.logger,
//     this.baseUrl = 'https://api.uber.com',
//   }) : httpClient = HttpClient();

//   // NEW: Get complete menu from Uber Eats
//   Future<UberMenuV2> getMenu(String storeId, {String menuType = 'MENU_TYPE_FULFILLMENT_DELIVERY'}) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus')
//           .replace(queryParameters: {'menu_type': menuType});
      
//       final request = await httpClient.getUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Accept-Encoding', 'gzip'); // For large menu optimization
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 200) {
//         final data = jsonDecode(responseBody);
//         return UberMenuV2.fromJson(data);
//       } else {
//         throw UberEatsApiException(
//           'Failed to get menu: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error getting Uber menu for store $storeId: $e');
//       throw e;
//     }
//   }

//   // NEW: Upload complete menu to Uber Eats
//   Future<void> uploadMenu(String storeId, UberMenuV2 menu) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus');
      
//       final request = await httpClient.putUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
//       request.headers.set('Content-Encoding', 'gzip'); // Compress large payloads
      
//       final menuJson = jsonEncode(menu.toJson());
//       request.write(menuJson);
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 204) {
//         logger.info('Successfully uploaded menu for store: $storeId');
//       } else {
//         throw UberEatsApiException(
//           'Failed to upload menu: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error uploading menu for store $storeId: $e');
//       throw e;
//     }
//   }

//   // NEW: Update individual item (availability, price, suspension)
//   Future<void> updateMenuItem(String storeId, String itemId, MenuItemUpdate update) async {
//     try {
//       final token = await _getValidToken();
//       final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus/items/$itemId');
      
//       final request = await httpClient.postUrl(uri);
//       request.headers.set('Authorization', 'Bearer $token');
//       request.headers.set('Content-Type', 'application/json');
      
//       request.write(jsonEncode(update.toJson()));
      
//       final response = await request.close();
//       final responseBody = await response.transform(utf8.decoder).join();
      
//       if (response.statusCode == 204) {
//         logger.info('Successfully updated item $itemId for store: $storeId');
//       } else {
//         throw UberEatsApiException(
//           'Failed to update item: ${response.statusCode}',
//           statusCode: response.statusCode,
//           responseBody: responseBody,
//         );
//       }
//     } catch (e) {
//       logger.error('Error updating item $itemId for store $storeId: $e');
//       throw e;
//     }
//   }

//   // NEW: Sync menu from POS to Uber Eats
//   Future<void> syncMenuFromPOS(String storeId, PosMenu posMenu) async {
//     try {
//       // Convert POS menu to Uber Eats format
//       final uberMenu = _convertPosMenuToUberFormat(posMenu);
      
//       // Upload to Uber Eats
//       await uploadMenu(storeId, uberMenu);
      
//       logger.info('Successfully synced menu from POS to Uber Eats for store: $storeId');
//     } catch (e) {
//       logger.error('Error syncing menu from POS to Uber for store $storeId: $e');
//       throw e;
//     }
//   }

//   // NEW: Handle item availability updates from POS
//   Future<void> updateItemAvailability(String storeId, String itemId, bool available, {String? reason}) async {
//     final update = MenuItemUpdate(
//       suspensionInfo: available 
//           ? SuspensionRules(suspension: null) // Remove suspension
//           : SuspensionRules(
//               suspension: Suspension(
//                 suspendUntil: null, // Indefinite suspension
//                 reason: reason ?? 'Out of stock',
//               ),
//             ),
//     );
    
//     await updateMenuItem(storeId, itemId, update);
//   }

//   // NEW: Update item price from POS
//   Future<void> updateItemPrice(String storeId, String itemId, double newPrice) async {
//     final priceInCents = (newPrice * 100).round();
//     final update = MenuItemUpdate(
//       priceInfo: PriceRules(
//         price: priceInCents,
//         overrides: [],
//       ),
//     );
    
//     await updateMenuItem(storeId, itemId, update);
//   }

//   UberMenuV2 _convertPosMenuToUberFormat(PosMenu posMenu) {
//     // Convert POS menu structure to Uber Eats format
//     final categories = posMenu.categories.map((cat) => UberCategoryV2(
//       id: cat.id,
//       title: MultiLanguageText({'en_us': cat.name}),
//       entities: cat.itemIds.map((itemId) => MenuEntity(
//         id: itemId,
//         type: 'ITEM',
//       )).toList(),
//     )).toList();

//     final items = posMenu.items.map((item) => UberItemV2(
//       id: item.id,
//       title: MultiLanguageText({'en_us': item.name}),
//       description: item.description != null 
//           ? MultiLanguageText({'en_us': item.description!})
//           : null,
//       priceInfo: PriceRules(
//         price: (item.price * 100).round(), // Convert to cents
//       ),
//       suspensionInfo: item.available 
//           ? null
//           : SuspensionRules(
//               suspension: Suspension(
//                 suspendUntil: null,
//                 reason: 'Out of stock',
//               ),
//             ),
//       modifierGroupIds: item.modifierGroups.isNotEmpty 
//           ? ModifierGroupsRules(
//               ids: item.modifierGroups.map((mg) => mg.id).toList(),
//             )
//           : null,
//       taxInfo: TaxInfo(taxRate: 8.75), // Default tax rate
//       externalData: item.posItemId, // Store POS reference
//     )).toList();

//     final menus = [
//       UberMenuV2(
//         id: 'all_day',
//         title: MultiLanguageText({'en_us': 'All Day'}),
//         serviceAvailability: _generateFullWeekAvailability(),
//         categoryIds: categories.map((c) => c.id).toList(), menus: [], categories: [], items: [], modifierGroups: [],
//       ),
//     ];

//     return UberMenuV2(
//       menus: menus,
//       categories: categories,
//       items: items,
//       modifierGroups: [], // Would convert POS modifier groups
//     );
//   }

//   List<ServiceAvailability> _generateFullWeekAvailability() {
//     return [
//       'monday', 'tuesday', 'wednesday', 'thursday', 
//       'friday', 'saturday', 'sunday'
//     ].map((day) => ServiceAvailability(
//       dayOfWeek: day,
//       timePeriods: [TimePeriod(startTime: '00:00', endTime: '23:59')],
//     )).toList();
//   }

//   Future<String> _getValidToken() async {
//     if (_cachedToken != null && _tokenExpiry != null && DateTime.now().isBefore(_tokenExpiry!)) {
//       return _cachedToken!;
//     }

//     final token = await authService.getClientCredentialsToken(['eats.store']);
//     _cachedToken = token;
//     _tokenExpiry = DateTime.now().add(Duration(days: 29));
    
//     return token;
//   }
// }

// // NEW: Enhanced Uber Menu Models for v2 API
// class UberMenuV2 {
//   final List<UberMenuV2> menus;
//   final List<UberCategoryV2> categories;
//   final List<UberItemV2> items;
//   final List<UberModifierGroupV2> modifierGroups;
//   final String? menuType;

//   UberMenuV2({
//     required this.menus,
//     required this.categories,
//     required this.items,
//     required this.modifierGroups,
//     this.menuType, required title, required List<dynamic> serviceAvailability,
//   });

//   factory UberMenuV2.fromJson(Map<String, dynamic> json) {
//     return UberMenuV2(
//       menus: (json['menus'] as List? ?? [])
//           .map((m) => UberMenuV2.fromJson(m))
//           .toList(),
//       categories: (json['categories'] as List? ?? [])
//           .map((c) => UberCategoryV2.fromJson(c))
//           .toList(),
//       items: (json['items'] as List? ?? [])
//           .map((i) => UberItemV2.fromJson(i))
//           .toList(),
//       modifierGroups: (json['modifier_groups'] as List? ?? [])
//           .map((mg) => UberModifierGroupV2.fromJson(mg))
//           .toList(),
//       menuType: json['menu_type'], title: null, serviceAvailability: [],
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'menus': menus.map((m) => m.toJson()).toList(),
//     'categories': categories.map((c) => c?.toJson()).toList(),
//     'items': items.map((i) => i?.toJson()).toList(),
//     'modifier_groups': modifierGroups.map((mg) => mg.toJson()).toList(),
//     if (menuType != null) 'menu_type': menuType,
//   };
// }

// class MenuItemUpdate {
//   final PriceRules? priceInfo;
//   final SuspensionRules? suspensionInfo;
//   final String? menuType;
//   final ProductInfo? productInfo;
//   final Classifications? classifications;

//   MenuItemUpdate({
//     this.priceInfo,
//     this.suspensionInfo,
//     this.menuType,
//     this.productInfo,
//     this.classifications,
//   });

//   Map<String, dynamic> toJson() => {
//     if (priceInfo != null) 'price_info': priceInfo!.toJson(),
//     if (suspensionInfo != null) 'suspension_info': suspensionInfo!.toJson(),
//     if (menuType != null) 'menu_type': menuType,
//     if (productInfo != null) 'product_info': productInfo!.toJson(),
//     if (classifications != null) 'classifications': classifications!.toJson(),
//   };
// }
import 'dart:io';

import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
import 'package:logging/logging.dart';

class UberMenuService {
  final String baseUrl;
  final UberAuthService authService;
  final HttpClient httpClient;
  final Logger logger;
  String? _cachedToken;
  DateTime? _tokenExpiry;

  UberMenuService({
    required this.authService,
    required this.logger,
    this.baseUrl = 'https://api.uber.com',
  }) : httpClient = HttpClient();

  // --- Service methods unchanged ---
  // (getMenu, uploadMenu, updateMenuItem, syncMenuFromPOS, updateItemAvailability, updateItemPrice)
  // ... [same as your draft] ...
  
  // --- Helpers and token cache ---
  UberMenuV2 _convertPosMenuToUberFormat(PosMenu posMenu) {
    final categories = posMenu.categories.map((cat) => UberCategoryV2(
      id: cat.id,
      title: MultiLanguageText({'en_us': cat.name}),
      entities: cat.itemIds.map((itemId) => MenuEntity(id: itemId, type: 'ITEM')).toList(),
    )).toList();

    final items = posMenu.items.map((item) => UberItemV2(
      id: item.id,
      title: MultiLanguageText({'en_us': item.name}),
      description: item.description != null
          ? MultiLanguageText({'en_us': item.description!})
          : null,
      priceInfo: PriceRules(price: (item.price * 100).round()),
      suspensionInfo: item.available
          ? null
          : SuspensionRules(
              suspension: Suspension(reason: 'Out of stock'),
            ),
      modifierGroupIds: item.modifierGroups.isNotEmpty
          ? ModifierGroupsRules(ids: item.modifierGroups.map((mg) => mg.id).toList())
          : null,
      taxInfo: TaxInfo(taxRate: 8.75),
      externalData: item.posItemId,
    )).toList();

    return UberMenuV2(
      menus: [],
      categories: categories,
      items: items,
      modifierGroups: [],
      menuType: 'MENU_TYPE_FULFILLMENT_DELIVERY',
      title: MultiLanguageText({'en_us': 'All Day'}),
      serviceAvailability: _generateFullWeekAvailability(),
    );
  }

  List<ServiceAvailability> _generateFullWeekAvailability() {
    return [
      'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
    ].map((day) => ServiceAvailability(
      dayOfWeek: day,
      timePeriods: [TimePeriod(startTime: '00:00', endTime: '23:59')],
    )).toList();
  }

  Future<String> _getValidToken() async {
    if (_cachedToken != null && _tokenExpiry != null && DateTime.now().isBefore(_tokenExpiry!)) {
      return _cachedToken!;
    }
    final token = await authService.getClientCredentialsToken(['eats.store']);
    _cachedToken = token;
    _tokenExpiry = DateTime.now().add(Duration(days: 29));
    return token;
  }
}

// ---------------- Models ----------------

class UberMenuV2 {
  final List<UberMenuV2> menus;
  final List<UberCategoryV2> categories;
  final List<UberItemV2> items;
  final List<UberModifierGroupV2> modifierGroups;
  final String? menuType;
  final MultiLanguageText? title;
  final List<ServiceAvailability> serviceAvailability;

  UberMenuV2({
    required this.menus,
    required this.categories,
    required this.items,
    required this.modifierGroups,
    this.menuType,
    this.title,
    required this.serviceAvailability,
  });

  factory UberMenuV2.fromJson(Map<String, dynamic> json) {
    return UberMenuV2(
      menus: (json['menus'] as List? ?? []).map((m) => UberMenuV2.fromJson(m)).toList(),
      categories: (json['categories'] as List? ?? []).map((c) => UberCategoryV2.fromJson(c)).toList(),
      items: (json['items'] as List? ?? []).map((i) => UberItemV2.fromJson(i)).toList(),
      modifierGroups: (json['modifier_groups'] as List? ?? []).map((mg) => UberModifierGroupV2.fromJson(mg)).toList(),
      menuType: json['menu_type'],
      title: null,
      serviceAvailability: [],
    );
  }

  Map<String, dynamic> toJson() => {
    'menus': menus.map((m) => m.toJson()).toList(),
    'categories': categories.map((c) => c.toJson()).toList(),
    'items': items.map((i) => i.toJson()).toList(),
    'modifier_groups': modifierGroups.map((mg) => mg.toJson()).toList(),
    if (menuType != null) 'menu_type': menuType,
  };
}

class UberCategoryV2 {
  final String id;
  final MultiLanguageText title;
  final List<MenuEntity> entities;

  UberCategoryV2({required this.id, required this.title, required this.entities});

  factory UberCategoryV2.fromJson(Map<String, dynamic> json) {
    return UberCategoryV2(
      id: json['id'],
      title: MultiLanguageText.fromJson(json['title']),
      entities: (json['entities'] as List? ?? []).map((e) => MenuEntity.fromJson(e)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title.toJson(),
    'entities': entities.map((e) => e.toJson()).toList(),
  };
}

class UberItemV2 {
  final String id;
  final MultiLanguageText title;
  final MultiLanguageText? description;
  final PriceRules? priceInfo;
  final SuspensionRules? suspensionInfo;
  final ModifierGroupsRules? modifierGroupIds;
  final TaxInfo? taxInfo;
  final String? externalData;

  UberItemV2({
    required this.id,
    required this.title,
    this.description,
    this.priceInfo,
    this.suspensionInfo,
    this.modifierGroupIds,
    this.taxInfo,
    this.externalData,
  });

  factory UberItemV2.fromJson(Map<String, dynamic> json) {
    return UberItemV2(
      id: json['id'],
      title: MultiLanguageText.fromJson(json['title']),
      description: json['description'] != null ? MultiLanguageText.fromJson(json['description']) : null,
      priceInfo: json['price_info'] != null ? PriceRules.fromJson(json['price_info']) : null,
      suspensionInfo: json['suspension_info'] != null ? SuspensionRules.fromJson(json['suspension_info']) : null,
      modifierGroupIds: json['modifier_group_ids'] != null ? ModifierGroupsRules.fromJson(json['modifier_group_ids']) : null,
      taxInfo: json['tax_info'] != null ? TaxInfo.fromJson(json['tax_info']) : null,
      externalData: json['external_data'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title.toJson(),
    if (description != null) 'description': description!.toJson(),
    if (priceInfo != null) 'price_info': priceInfo!.toJson(),
    if (suspensionInfo != null) 'suspension_info': suspensionInfo!.toJson(),
    if (modifierGroupIds != null) 'modifier_group_ids': modifierGroupIds!.toJson(),
    if (taxInfo != null) 'tax_info': taxInfo!.toJson(),
    if (externalData != null) 'external_data': externalData,
  };
}

class UberModifierGroupV2 {
  final String id;
  final MultiLanguageText title;

  UberModifierGroupV2({required this.id, required this.title});

  factory UberModifierGroupV2.fromJson(Map<String, dynamic> json) {
    return UberModifierGroupV2(
      id: json['id'],
      title: MultiLanguageText.fromJson(json['title']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title.toJson(),
  };
}

class MultiLanguageText {
  final Map<String, String> translations;

  MultiLanguageText(this.translations);

  factory MultiLanguageText.fromJson(Map<String, dynamic> json) {
    return MultiLanguageText(Map<String, String>.from(json));
  }

  Map<String, dynamic> toJson() => translations;
}

class MenuEntity {
  final String id;
  final String type;

  MenuEntity({required this.id, required this.type});

  factory MenuEntity.fromJson(Map<String, dynamic> json) {
    return MenuEntity(id: json['id'], type: json['type']);
  }

  Map<String, dynamic> toJson() => {'id': id, 'type': type};
}

class Suspension {
  final String reason;
  final DateTime? suspendUntil;

  Suspension({required this.reason, this.suspendUntil});

  factory Suspension.fromJson(Map<String, dynamic> json) {
    return Suspension(reason: json['reason'], suspendUntil: json['suspend_until'] != null ? DateTime.parse(json['suspend_until']) : null);
  }

  Map<String, dynamic> toJson() => {
    'reason': reason,
    if (suspendUntil != null) 'suspend_until': suspendUntil!.toIso8601String(),
  };
}

class SuspensionRules {
  final Suspension? suspension;

  SuspensionRules({this.suspension});

  factory SuspensionRules.fromJson(Map<String, dynamic> json) {
    return SuspensionRules(suspension: json['suspension'] != null ? Suspension.fromJson(json['suspension']) : null);
  }

  Map<String, dynamic> toJson() => {
    if (suspension != null) 'suspension': suspension!.toJson(),
  };
}

class PriceRules {
  final int price;
  final List<dynamic>? overrides;

  PriceRules({required this.price, this.overrides});

  factory PriceRules.fromJson(Map<String, dynamic> json) {
    return PriceRules(price: json['price'], overrides: json['overrides']);
  }

  Map<String, dynamic> toJson() => {
    'price': price,
    if (overrides != null) 'overrides': overrides,
  };
}

class ModifierGroupsRules {
  final List<String> ids;

  ModifierGroupsRules({required this.ids});

  factory ModifierGroupsRules.fromJson(Map<String, dynamic> json) {
    return ModifierGroupsRules(ids: List<String>.from(json['ids']));
  }

  Map<String, dynamic> toJson() => {'ids': ids};
}

class TaxInfo {
  final double taxRate;

  TaxInfo({required this.taxRate});

  factory TaxInfo.fromJson(Map<String, dynamic> json) {
    return TaxInfo(taxRate: (json['tax_rate'] as num).toDouble());
  }

  Map<String, dynamic> toJson() => {'tax_rate': taxRate};
}

class ProductInfo {
  final String? sku;
  final String? barcode;

  ProductInfo({this.sku, this.barcode});

  factory ProductInfo.fromJson(Map<String, dynamic> json) {
    return ProductInfo(sku: json['sku'], barcode: json['barcode']);
  }

  Map<String, dynamic> toJson() => {
    if (sku != null) 'sku': sku,
    if (barcode != null) 'barcode': barcode,
  };
}

class Classifications {
  final String? category;
  final String? cuisine;

  Classifications({this.category, this.cuisine});

  factory Classifications.fromJson(Map<String, dynamic> json) {
    return Classifications(category: json['category'], cuisine: json['cuisine']);
  }

  Map<String, dynamic> toJson() => {
    if (category != null) 'category': category,
    if (cuisine != null) 'cuisine': cuisine,
  };
}

class ServiceAvailability {
  final String dayOfWeek;
  final List<TimePeriod> timePeriods;

  ServiceAvailability({required this.dayOfWeek, required this.timePeriods});

  factory ServiceAvailability.fromJson(Map<String, dynamic> json) {
    return ServiceAvailability(
      dayOfWeek: json['day_of_week'],
      timePeriods: (json['time_periods'] as List).map((tp) => TimePeriod.fromJson(tp)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'day_of_week': dayOfWeek,
    'time_periods': timePeriods.map((tp) => tp.toJson()).toList(),
  };
}

class TimePeriod {
  final String startTime;
  final String endTime;

  TimePeriod({required this.startTime, required this.endTime});

  factory TimePeriod.fromJson(Map<String, dynamic> json) {
    return TimePeriod(startTime: json['start_time'], endTime: json['end_time']);
  }

  Map<String, dynamic> toJson() => {
    'start_time': startTime,
    'end_time': endTime,
  };
}

// Simulated POS Menu structures
class PosMenu {
  final List<PosCategory> categories;
  final List<PosItem> items;

  PosMenu({required this.categories, required this.items});
}

class PosCategory {
  final String id;
  final String name;
  final List<String> itemIds;

  PosCategory({required this.id, required this.name, required this.itemIds});
}

class PosItem {
  final String id;
  final String name;
  final String? description;
  final double price;
  final bool available;
  final List<PosModifierGroup> modifierGroups;
  final String? posItemId;

  PosItem({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.available = true,
    this.modifierGroups = const [],
    this.posItemId,
  });
}

class PosModifierGroup {
  final String id;
  final String name;

  PosModifierGroup({required this.id, required this.name});
}
