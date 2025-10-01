// // lib/core/repositories/restaurant_repository.dart
// // import 'package:backend/core/repositories/restaurant_repository.dart';

// import 'package:backend/core/models/restaurant.dart';

// /// Repository contract for restaurants.
// abstract class RestaurantRepository {
//   Future<Restaurant?> getById(String id);
//   Future<Restaurant> create(Restaurant restaurant);
//   Future<void> update(Restaurant restaurant);
//   Future<List<Restaurant>> getAll();
// }

// /// Stub implementation (to be replaced with real DB logic).
// class RestaurantRepositoryImpl implements RestaurantRepository {
//   @override
//   Future<Restaurant?> getById(String id) async {
//     // TODO: Implement database fetch
//     return null;
//   }

//   @override
//   Future<Restaurant> create(Restaurant restaurant) async {
//     // TODO: Implement database insert
//     return restaurant;
//   }

//   @override
//   Future<void> update(Restaurant restaurant) async {
//     // TODO: Implement database update
//   }

//   @override
//   Future<List<Restaurant>> getAll() async {
//     // TODO: Implement database fetch
//     return [];
//   }
// }

// lib/core/repositories/restaurant_repository.dart
import 'package:backend/core/models/restaurant.dart';

/// Repository contract for restaurants.
abstract class RestaurantRepository {
  Future<Restaurant?> getById(String id);
  Future<Restaurant> create(Restaurant restaurant);
  Future<void> update(Restaurant restaurant);
  Future<List<Restaurant>> getAll();
}

/// Stub implementation (to be replaced with real DB logic).
class RestaurantRepositoryImpl implements RestaurantRepository {
  @override
  Future<Restaurant?> getById(String id) async {
    // TODO: Implement database fetch
    return null;
  }

  @override
  Future<Restaurant> create(Restaurant restaurant) async {
    // TODO: Implement database insert
    return restaurant;
  }

  @override
  Future<void> update(Restaurant restaurant) async {
    // TODO: Implement database update
  }

  @override
  Future<List<Restaurant>> getAll() async {
    // TODO: Implement database fetch
    return [];
  }
}
