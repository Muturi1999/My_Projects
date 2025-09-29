import 'dart:convert';
import 'dart:io';

import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';

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

  // NEW: Get complete menu from Uber Eats
  Future<UberMenuV2> getMenu(String storeId, {String menuType = 'MENU_TYPE_FULFILLMENT_DELIVERY'}) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus')
          .replace(queryParameters: {'menu_type': menuType});
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Accept-Encoding', 'gzip'); // For large menu optimization
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        return UberMenuV2.fromJson(data);
      } else {
        throw UberEatsApiException(
          'Failed to get menu: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error getting Uber menu for store $storeId: $e');
      throw e;
    }
  }

  // NEW: Upload complete menu to Uber Eats
  Future<void> uploadMenu(String storeId, UberMenuV2 menu) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus');
      
      final request = await httpClient.putUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Content-Type', 'application/json');
      request.headers.set('Content-Encoding', 'gzip'); // Compress large payloads
      
      final menuJson = jsonEncode(menu.toJson());
      request.write(menuJson);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 204) {
        logger.info('Successfully uploaded menu for store: $storeId');
      } else {
        throw UberEatsApiException(
          'Failed to upload menu: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error uploading menu for store $storeId: $e');
      throw e;
    }
  }

  // NEW: Update individual item (availability, price, suspension)
  Future<void> updateMenuItem(String storeId, String itemId, MenuItemUpdate update) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v2/eats/stores/$storeId/menus/items/$itemId');
      
      final request = await httpClient.postUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Content-Type', 'application/json');
      
      request.write(jsonEncode(update.toJson()));
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 204) {
        logger.info('Successfully updated item $itemId for store: $storeId');
      } else {
        throw UberEatsApiException(
          'Failed to update item: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error updating item $itemId for store $storeId: $e');
      throw e;
    }
  }

  // NEW: Sync menu from POS to Uber Eats
  Future<void> syncMenuFromPOS(String storeId, PosMenu posMenu) async {
    try {
      // Convert POS menu to Uber Eats format
      final uberMenu = _convertPosMenuToUberFormat(posMenu);
      
      // Upload to Uber Eats
      await uploadMenu(storeId, uberMenu);
      
      logger.info('Successfully synced menu from POS to Uber Eats for store: $storeId');
    } catch (e) {
      logger.error('Error syncing menu from POS to Uber for store $storeId: $e');
      throw e;
    }
  }

  // NEW: Handle item availability updates from POS
  Future<void> updateItemAvailability(String storeId, String itemId, bool available, {String? reason}) async {
    final update = MenuItemUpdate(
      suspensionInfo: available 
          ? SuspensionRules(suspension: null) // Remove suspension
          : SuspensionRules(
              suspension: Suspension(
                suspendUntil: null, // Indefinite suspension
                reason: reason ?? 'Out of stock',
              ),
            ),
    );
    
    await updateMenuItem(storeId, itemId, update);
  }

  // NEW: Update item price from POS
  Future<void> updateItemPrice(String storeId, String itemId, double newPrice) async {
    final priceInCents = (newPrice * 100).round();
    final update = MenuItemUpdate(
      priceInfo: PriceRules(
        price: priceInCents,
        overrides: [],
      ),
    );
    
    await updateMenuItem(storeId, itemId, update);
  }

  UberMenuV2 _convertPosMenuToUberFormat(PosMenu posMenu) {
    // Convert POS menu structure to Uber Eats format
    final categories = posMenu.categories.map((cat) => UberCategoryV2(
      id: cat.id,
      title: MultiLanguageText({'en_us': cat.name}),
      entities: cat.itemIds.map((itemId) => MenuEntity(
        id: itemId,
        type: 'ITEM',
      )).toList(),
    )).toList();

    final items = posMenu.items.map((item) => UberItemV2(
      id: item.id,
      title: MultiLanguageText({'en_us': item.name}),
      description: item.description != null 
          ? MultiLanguageText({'en_us': item.description!})
          : null,
      priceInfo: PriceRules(
        price: (item.price * 100).round(), // Convert to cents
      ),
      suspensionInfo: item.available 
          ? null
          : SuspensionRules(
              suspension: Suspension(
                suspendUntil: null,
                reason: 'Out of stock',
              ),
            ),
      modifierGroupIds: item.modifierGroups.isNotEmpty 
          ? ModifierGroupsRules(
              ids: item.modifierGroups.map((mg) => mg.id).toList(),
            )
          : null,
      taxInfo: TaxInfo(taxRate: 8.75), // Default tax rate
      externalData: item.posItemId, // Store POS reference
    )).toList();

    final menus = [
      UberMenuV2(
        id: 'all_day',
        title: MultiLanguageText({'en_us': 'All Day'}),
        serviceAvailability: _generateFullWeekAvailability(),
        categoryIds: categories.map((c) => c.id).toList(), menus: [], categories: [], items: [], modifierGroups: [],
      ),
    ];

    return UberMenuV2(
      menus: menus,
      categories: categories,
      items: items,
      modifierGroups: [], // Would convert POS modifier groups
    );
  }

  List<ServiceAvailability> _generateFullWeekAvailability() {
    return [
      'monday', 'tuesday', 'wednesday', 'thursday', 
      'friday', 'saturday', 'sunday'
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

// NEW: Enhanced Uber Menu Models for v2 API
class UberMenuV2 {
  final List<UberMenuV2> menus;
  final List<UberCategoryV2> categories;
  final List<UberItemV2> items;
  final List<UberModifierGroupV2> modifierGroups;
  final String? menuType;

  UberMenuV2({
    required this.menus,
    required this.categories,
    required this.items,
    required this.modifierGroups,
    this.menuType, required title, required List<dynamic> serviceAvailability,
  });

  factory UberMenuV2.fromJson(Map<String, dynamic> json) {
    return UberMenuV2(
      menus: (json['menus'] as List? ?? [])
          .map((m) => UberMenuV2.fromJson(m))
          .toList(),
      categories: (json['categories'] as List? ?? [])
          .map((c) => UberCategoryV2.fromJson(c))
          .toList(),
      items: (json['items'] as List? ?? [])
          .map((i) => UberItemV2.fromJson(i))
          .toList(),
      modifierGroups: (json['modifier_groups'] as List? ?? [])
          .map((mg) => UberModifierGroupV2.fromJson(mg))
          .toList(),
      menuType: json['menu_type'], title: null, serviceAvailability: [],
    );
  }

  Map<String, dynamic> toJson() => {
    'menus': menus.map((m) => m.toJson()).toList(),
    'categories': categories.map((c) => c?.toJson()).toList(),
    'items': items.map((i) => i?.toJson()).toList(),
    'modifier_groups': modifierGroups.map((mg) => mg.toJson()).toList(),
    if (menuType != null) 'menu_type': menuType,
  };
}

class MenuItemUpdate {
  final PriceRules? priceInfo;
  final SuspensionRules? suspensionInfo;
  final String? menuType;
  final ProductInfo? productInfo;
  final Classifications? classifications;

  MenuItemUpdate({
    this.priceInfo,
    this.suspensionInfo,
    this.menuType,
    this.productInfo,
    this.classifications,
  });

  Map<String, dynamic> toJson() => {
    if (priceInfo != null) 'price_info': priceInfo!.toJson(),
    if (suspensionInfo != null) 'suspension_info': suspensionInfo!.toJson(),
    if (menuType != null) 'menu_type': menuType,
    if (productInfo != null) 'product_info': productInfo!.toJson(),
    if (classifications != null) 'classifications': classifications!.toJson(),
  };
}