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
