import 'dart:convert';
import 'dart:io';

import 'package:backend/core/exceptions/core_exceptions.dart';
import 'package:backend/core/models/order.dart';
// import 'package:backend/core/utils/logger.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import

import 'package:backend/platforms/uber_eats/models/uber_store.dart';
import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';

class UberStoreService {
  final String baseUrl;
  final UberAuthService authService;
  final HttpClient httpClient;
  final Logger logger;
  String? _cachedToken;
  DateTime? _tokenExpiry;

  UberStoreService({
    required this.authService,
    required this.logger,
    this.baseUrl = 'https://api.uber.com',
  }) : httpClient = HttpClient();

  // Get all stores associated with the application
  Future<List<UberStore>> getStores() async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores');
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final stores = (data['stores'] as List? ?? [])
            .map((store) => UberStore.fromJson(store))
            .toList();
        
        logger.info('Retrieved ${stores.length} stores from Uber Eats');
        return stores;
      } else {
        throw UberEatsApiException(
          'Failed to get stores: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error retrieving stores: $e', error: "",  );
      throw e;
    }
  }

  // Get specific store details
  Future<UberStore> getStore(String storeId) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId');
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final store = UberStore.fromJson(data);
        
        logger.info('Retrieved store details for: $storeId');
        return store;
      } else {
        throw UberEatsApiException(
          'Failed to get store details: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error retrieving store $storeId: $e');
      throw e;
    }
  }

  // Set store status (ONLINE, PAUSED)
  Future<void> setStoreStatus(String storeId, StoreStatus status) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/status');
      
      final request = await httpClient.postUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Content-Type', 'application/json');
      
      final uberStatus = _mapStoreStatusToUber(status);
      final body = jsonEncode({
        'status': uberStatus,
      });
      request.write(body);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        logger.info('Successfully updated store status: $storeId -> $uberStatus');
      } else {
        throw UberEatsApiException(
          'Failed to update store status: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error updating store status for $storeId: $e');
      throw e;
    }
  }

  // Get current store status
  Future<StoreStatus> getStoreStatus(String storeId) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/status');
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final uberStatus = data['status'];
        final status = _mapUberStatusToStoreStatus(uberStatus);
        
        logger.info('Retrieved store status for $storeId: $uberStatus');
        return status;
      } else {
        throw UberEatsApiException(
          'Failed to get store status: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error getting store status for $storeId: $e');
      throw e;
    }
  }

  // Set holiday hours for specific dates
  Future<void> setHolidayHours(String storeId, List<HolidayHours> holidayHours) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/holiday_hours');
      
      final request = await httpClient.postUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Content-Type', 'application/json');
      
      final uberHolidayHours = holidayHours.map((h) => {
        'date': h.date.toIso8601String().split('T')[0], // YYYY-MM-DD format
        'open_time': h.openTime,
        'close_time': h.closeTime,
        'is_closed': h.isClosed,
      }).toList();
      
      final body = jsonEncode({
        'holiday_hours': uberHolidayHours,
      });
      request.write(body);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        logger.info('Successfully updated holiday hours for store: $storeId');
      } else {
        throw UberEatsApiException(
          'Failed to update holiday hours: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error updating holiday hours for $storeId: $e');
      throw e;
    }
  }

  // Get holiday hours
  Future<List<HolidayHours>> getHolidayHours(String storeId) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/holiday_hours');
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final holidayHours = (data['holiday_hours'] as List? ?? [])
            .map((h) => HolidayHours(
                  date: DateTime.parse(h['date']),
                  openTime: h['open_time'],
                  closeTime: h['close_time'],
                  isClosed: h['is_closed'] ?? false,
                  reason: h['reason'],
                ))
            .toList();
        
        logger.info('Retrieved holiday hours for store: $storeId');
        return holidayHours;
      } else {
        throw UberEatsApiException(
          'Failed to get holiday hours: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error getting holiday hours for $storeId: $e');
      throw e;
    }
  }

  // Configure POS integration settings
  Future<void> configurePosIntegration(String storeId, PosIntegrationConfig config) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/pos_data');
      
      final request = await httpClient.patchUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      request.headers.set('Content-Type', 'application/json');
      
      final body = jsonEncode({
        'integrator_store_id': config.integratorStoreId,
        'merchant_store_id': config.merchantStoreId,
        'is_order_manager': config.isOrderManager,
        'integration_enabled': config.integrationEnabled,
        'store_configuration_data': config.configurationData,
        'require_manual_acceptance': config.requireManualAcceptance,
        'webhooks_config': {
          'webhooks_version': '1.0.0',
        },
      });
      request.write(body);
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        logger.info('Successfully configured POS integration for store: $storeId');
      } else {
        throw UberEatsApiException(
          'Failed to configure POS integration: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error configuring POS integration for $storeId: $e');
      throw e;
    }
  }

  // Get POS integration configuration
  Future<PosIntegrationConfig> getPosIntegrationConfig(String storeId) async {
    try {
      final token = await _getValidToken();
      final uri = Uri.parse('$baseUrl/v1/eats/stores/$storeId/pos_data');
      
      final request = await httpClient.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $token');
      
      final response = await request.close();
      final responseBody = await response.transform(utf8.decoder).join();
      
      if (response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final config = PosIntegrationConfig(
          integratorStoreId: data['integrator_store_id'],
          merchantStoreId: data['merchant_store_id'],
          isOrderManager: data['is_order_manager'] ?? false,
          integrationEnabled: data['integration_enabled'] ?? false,
          configurationData: data['store_configuration_data'],
          requireManualAcceptance: data['require_manual_acceptance'] ?? false,
        );
        
        logger.info('Retrieved POS integration config for store: $storeId');
        return config;
      } else {
        throw UberEatsApiException(
          'Failed to get POS integration config: ${response.statusCode}',
          statusCode: response.statusCode,
          responseBody: responseBody,
        );
      }
    } catch (e) {
      logger.error('Error getting POS integration config for $storeId: $e');
      throw e;
    }
  }

  Future<String> _getValidToken() async {
    if (_cachedToken != null && _tokenExpiry != null && DateTime.now().isBefore(_tokenExpiry!)) {
      return _cachedToken!;
    }

    final token = await authService.getClientCredentialsToken(['eats.store', 'eats.store.status.write']);
    
    _cachedToken = token;
    _tokenExpiry = DateTime.now().add(Duration(days: 29));
    
    return token;
  }

  String _mapStoreStatusToUber(StoreStatus status) {
    switch (status) {
      case StoreStatus.ONLINE:
        return 'ONLINE';
      case StoreStatus.PAUSED:
        return 'PAUSED';
      case StoreStatus.OFFLINE:
        return 'OFFLINE';
      case StoreStatus.ACTIVE: 
        return 'ONLINE'; 
      case StoreStatus.active:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }

  StoreStatus _mapUberStatusToStoreStatus(String uberStatus) {
    switch (uberStatus.toUpperCase()) {
      case 'ONLINE':
        return StoreStatus.ONLINE;
      case 'PAUSED':
        return StoreStatus.PAUSED;
      case 'OFFLINE':
        return StoreStatus.OFFLINE;
      default:
        return StoreStatus.OFFLINE;
    }
  }
}

// Configuration model for POS integration
class PosIntegrationConfig {
  final String integratorStoreId;
  final String? merchantStoreId;
  final bool isOrderManager;
  final bool integrationEnabled;
  final String? configurationData;
  final bool requireManualAcceptance;

  PosIntegrationConfig({
    required this.integratorStoreId,
    this.merchantStoreId,
    required this.isOrderManager,
    required this.integrationEnabled,
    this.configurationData,
    this.requireManualAcceptance = false,
  });
}
