import 'package:backend/core/models/restaurant.dart';

/// Repository contract for restaurants.
abstract class RestaurantRepository {
  Future<Restaurant?> getById(String id);
  Future<Restaurant> create(Restaurant restaurant);
  Future<void> update(Restaurant restaurant);
  Future<List<Restaurant>> getAll();
}
