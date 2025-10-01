import 'package:backend/core/models/branch.dart';
import 'package:backend/core/models/order.dart' hide CoreServiceException;
import 'package:backend/core/models/restaurant.dart';
import 'package:backend/core/repositories/branch_repository.dart';
import 'package:backend/core/repositories/restaurant_repository.dart';
import 'package:backend/core/services/notification_service.dart' hide ValidationException;
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import


class CoreRestaurantService {
  final RestaurantRepository restaurantRepository;
  final BranchRepository branchRepository;
  final Logger logger;

  CoreRestaurantService({
    required this.restaurantRepository,
    required this.branchRepository,
    required this.logger,
  });

  // Create restaurant with branches
  Future<Restaurant> createRestaurant(Restaurant restaurant) async {
    try {
      _validateRestaurant(restaurant);
      
      final savedRestaurant = await restaurantRepository.create(restaurant);
      
      // Create branches
      for (final branch in restaurant.branches) {
        await branchRepository.create(branch.copyWith(restaurantId: savedRestaurant.id));
      }
      
      logger.info('Created restaurant: ${savedRestaurant.name} with ${restaurant.branches.length} branches');
      return savedRestaurant;
      
    } catch (e) {
      logger.error('Failed to create restaurant: $e', error: "");
      throw CoreServiceException('Failed to create restaurant: $e');
    }
  }

  // Add branch to existing restaurant
  Future<Branch> addBranch(String restaurantId, Branch branch) async {
    try {
      // Verify restaurant exists
      final restaurant = await restaurantRepository.getById(restaurantId);
      if (restaurant == null) {
        throw CoreServiceException('Restaurant not found: $restaurantId');
      }

      final branchWithRestaurantId = branch.copyWith(restaurantId: restaurantId);
      _validateBranch(branchWithRestaurantId);
      
      final savedBranch = await branchRepository.create(branchWithRestaurantId);
      
      logger.info('Added branch: ${savedBranch.name} to restaurant: ${restaurant.name}');
      return savedBranch;
      
    } catch (e) {
      logger.error('Failed to add branch: $e', error: "");
      throw CoreServiceException('Failed to add branch: $e');
    }
  }

  // Update branch platform integration
  Future<Branch> updateBranchPlatformIntegration(
    String branchId,
    String platform,
    String platformStoreId,
    Map<String, dynamic> integrationConfig,
  ) async {
    try {
      final branch = await branchRepository.getById(branchId);
      if (branch == null) {
        throw CoreServiceException('Branch not found: $branchId');
      }

      final updatedPlatformStoreIds = Map<String, String>.from(branch.platformStoreIds);
      updatedPlatformStoreIds[platform] = platformStoreId;

      final updatedBranch = branch.copyWith(
        platformStoreIds: updatedPlatformStoreIds,
      );

      await branchRepository.update(updatedBranch);
      
      logger.info('Updated platform integration for branch $branchId: $platform -> $platformStoreId');
      return updatedBranch;
      
    } catch (e) {
      logger.error('Failed to update platform integration: $e', error: "");
      throw CoreServiceException('Failed to update platform integration: $e');
    }
  }

  // Update branch POS integration
  Future<Branch> updateBranchPosIntegration(
    String branchId,
    String posSystem,
    String posStoreId,
    Map<String, dynamic> posConfig,
  ) async {
    try {
      final branch = await branchRepository.getById(branchId);
      if (branch == null) {
        throw CoreServiceException('Branch not found: $branchId');
      }

      final updatedPosSystemIds = Map<String, String>.from(branch.posSystemIds);
      updatedPosSystemIds[posSystem] = posStoreId;

      final updatedBranch = branch.copyWith(
        posSystemIds: updatedPosSystemIds,
      );

      await branchRepository.update(updatedBranch);
      
      logger.info('Updated POS integration for branch $branchId: $posSystem -> $posStoreId');
      return updatedBranch;
      
    } catch (e) {
      logger.error('Failed to update POS integration: $e', error: "");
      throw CoreServiceException('Failed to update POS integration: $e');
    }
  }

  // Get restaurant with all branches
  Future<Restaurant?> getRestaurantWithBranches(String restaurantId) async {
    final restaurant = await restaurantRepository.getById(restaurantId);
    if (restaurant == null) return null;

    final branches = await branchRepository.getByRestaurantId(restaurantId);
    return restaurant.copyWith(branches: branches);
  }

  // Get all restaurants for a business
  Future<List<Restaurant>> getAllRestaurants() async {
    return await restaurantRepository.getAll();
  }

  // Update branch status
  Future<Branch> updateBranchStatus(String branchId, StoreStatus status) async {
    try {
      final branch = await branchRepository.getById(branchId);
      if (branch == null) {
        throw CoreServiceException('Branch not found: $branchId');
      }

      final updatedBranch = branch.copyWith(status: status);
      await branchRepository.update(updatedBranch);
      
      logger.info('Updated branch status: $branchId -> $status');
      return updatedBranch;
      
    } catch (e) {
      logger.error('Failed to update branch status: $e', error: "");
      throw CoreServiceException('Failed to update branch status: $e');
    }
  }

  void _validateRestaurant(Restaurant restaurant) {
    if (restaurant.name.trim().isEmpty) {
      throw ValidationException('Restaurant name cannot be empty');
    }
    if (restaurant.businessLicenseNumber.trim().isEmpty) {
      throw ValidationException('Business license number cannot be empty');
    }
    if (restaurant.branches.isEmpty) {
      throw ValidationException('Restaurant must have at least one branch');
    }
    
    for (final branch in restaurant.branches) {
      _validateBranch(branch);
    }
  }

  void _validateBranch(Branch branch) {
    if (branch.name.trim().isEmpty) {
      throw ValidationException('Branch name cannot be empty');
    }
    if (branch.phoneNumber.trim().isEmpty) {
      throw ValidationException('Branch phone number cannot be empty');
    }
    if (branch.address.street.trim().isEmpty) {
      throw ValidationException('Branch address cannot be empty');
    }
  }
}