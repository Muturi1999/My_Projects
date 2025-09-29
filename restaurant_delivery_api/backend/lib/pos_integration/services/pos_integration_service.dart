import 'package:backend/core/models/branch.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
import 'package:backend/pos_integration/models/pos_models.dart';

class PosIntegrationService {
  final Map<String, PosAdapter> adapters;
  final CoreOrderService coreOrderService;
  final Logger logger;

  PosIntegrationService({
    required this.adapters,
    required this.coreOrderService,
    required this.logger,
  });

  // Main method called by webhook handler
  Future<PosInjectionResult> injectOrderToPOS(Order order) async {
    try {
      // Get branch configuration
      final branch = await coreOrderService.getBranchByPlatformStoreId(
        order.platform, 
        order.platformData['store_id'],
      );
      
      if (branch == null) {
        return PosInjectionResult.failure('Branch not found for order');
      }

      // Determine which POS system to use for this branch
      final posSystem = _determinePosSystem(branch);
      if (posSystem == null) {
        return PosInjectionResult.failure('No POS system configured for branch');
      }

      // Get the appropriate adapter
      final adapter = adapters[posSystem];
      if (adapter == null) {
        return PosInjectionResult.failure('POS adapter not found: $posSystem');
      }

      // Create connection config
      final config = _createPosConfig(branch, posSystem);
      
      // Inject order to POS
      final result = await adapter.injectOrder(order, config);
      
      if (result.success) {
        logger.info('Successfully injected order ${order.id} to $posSystem');
      } else {
        logger.error('Failed to inject order ${order.id} to $posSystem: ${result.errorMessage}');
      }
      
      return result;
      
    } catch (e) {
      logger.error('POS injection error: $e');
      return PosInjectionResult.failure('POS integration system error: $e');
    }
  }

  // Cancel order in POS system
  Future<bool> cancelOrderInPOS(String posOrderId, String reason) async {
    // Implementation to cancel order in the appropriate POS system
    // This would look up which POS system the order was sent to
    return true;
  }

  String? _determinePosSystem(Branch branch) {
    // Logic to determine which POS system to use
    // Could be based on branch configuration, time of day, etc.
    if (branch.posSystemIds.containsKey('square')) {
      return 'square';
    } else if (branch.posSystemIds.containsKey('toast')) {
      return 'toast';
    }
    return null;
  }

  PosConnectionConfig _createPosConfig(Branch branch, String posSystem) {
    return PosConnectionConfig(
      posSystem: posSystem,
      branchId: branch.id,
      credentials: _getCredentialsForBranch(branch, posSystem),
      settings: _getSettingsForBranch(branch, posSystem),
    );
  }

  Map<String, String> _getCredentialsForBranch(Branch branch, String posSystem) {
    // This would typically retrieve encrypted credentials from database
    // Based on branch configuration
    return {};
  }

  Map<String, dynamic> _getSettingsForBranch(Branch branch, String posSystem) {
    // Branch-specific POS settings
    return {};
  }
}

class PosIntegrationException implements Exception {
  final String message;
  PosIntegrationException(this.message);
  
  @override
  String toString() => 'PosIntegrationException: $message';
}
