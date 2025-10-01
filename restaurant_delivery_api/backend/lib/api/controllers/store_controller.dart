import 'dart:convert';
import 'package:backend/core/models/order.dart';
import 'package:backend/core/services/restaurant_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:backend/core/logger.dart'; // ✅ Added correct logger import



class StoreController {
  final CoreRestaurantService restaurantService;
  final UberStoreService uberStoreService;
  final Logger logger;

  StoreController({
    required this.restaurantService,
    required this.uberStoreService,
    required this.logger,
  });

  // Get all restaurants and branches
  Future<Response> getRestaurants(Request request) async {
    try {
      final restaurants = await restaurantService.getAllRestaurants();
      
      return Response.ok(
        jsonEncode({
          'restaurants': restaurants.map((r) => r.toJson()).toList(),
        }),
        headers: {'Content-Type': 'application/json'},
      );

    } catch (e) {
      logger.error('Failed to get restaurants: $e', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retrieve restaurants'}),
      );
    }
  }

  // Update branch status across all platforms
  Future<Response> updateBranchStatus(Request request) async {
    try {
      final branchId = request.params['branchId'];
      if (branchId == null) {
        return Response.badRequest(body: jsonEncode({'error': 'Branch ID required'}));
      }

      final body = await request.readAsString();
      final data = jsonDecode(body) as Map<String, dynamic>;
      final statusStr = data['status'] as String?;

      if (statusStr == null) {
        return Response.badRequest(body: jsonEncode({'error': 'Status required'}));
      }

      final status = StoreStatus.values.firstWhere((s) => s.toString() == statusStr);

      // Update in core service
      final updatedBranch = await restaurantService.updateBranchStatus(branchId, status);

      // Update on all connected platforms
      for (final entry in updatedBranch.platformStoreIds.entries) {
        final platform = entry.key;
        final platformStoreId = entry.value;

        try {
          if (platform == 'uber_eats') {
            await uberStoreService.setStoreStatus(platformStoreId, status);
          }
          // Add other platforms as needed
        } catch (e) {
          logger.error('Failed to update status on $platform: $e', error: "");
        }
      }

      return Response.ok(
        jsonEncode({
          'success': true,
          'branch': updatedBranch.toJson(),
        }),
        headers: {'Content-Type': 'application/json'},
      );

    } catch (e) {
      logger.error('Failed to update branch status: $e', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to update branch status'}),
      );
    }
  }

  // Set holiday hours for a branch
  Future<Response> setHolidayHours(Request request) async {
    try {
      final branchId = request.params['branchId'];
      if (branchId == null) {
        return Response.badRequest(body: jsonEncode({'error': 'Branch ID required'}));
      }

      final body = await request.readAsString();
      final data = jsonDecode(body) as Map<String, dynamic>;
      final holidayHoursData = data['holiday_hours'] as List<dynamic>?;

      if (holidayHoursData == null) {
        return Response.badRequest(body: jsonEncode({'error': 'Holiday hours required'}));
      }

      final holidayHours = holidayHoursData.map((h) => HolidayHours.fromJson(h)).toList();

      // Get branch details
      final restaurant = await restaurantService.getRestaurantWithBranches(''); // Would need proper lookup
      final branch = restaurant?.branches.firstWhere((b) => b.id == branchId);

      if (branch == null) {
        return Response.notFound(jsonEncode({'error': 'Branch not found'}));
      }

      // Update holiday hours on all platforms
      for (final entry in branch.platformStoreIds.entries) {
        final platform = entry.key;
        final platformStoreId = entry.value;

        try {
          if (platform == 'uber_eats') {
            await uberStoreService.setHolidayHours(platformStoreId, holidayHours);
          }
          // Add other platforms as needed
        } catch (e) {
          logger.error('Failed to set holiday hours on $platform: $e', error: "");
        }
      }

      return Response.ok(
        jsonEncode({'success': true}),
        headers: {'Content-Type': 'application/json'},
      );

    } catch (e) {
      logger.error('Failed to set holiday hours: $e', error: "");
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to set holiday hours'}),
      );
    }
  }
}
