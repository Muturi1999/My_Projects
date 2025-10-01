import 'package:backend/core/models/restaurant.dart';
import 'package:backend/core/repositories/restaurant_repository.dart';
import 'package:postgres/src/connection.dart';

class PostgresRestaurantRepository implements RestaurantRepository {
  PostgresRestaurantRepository(PostgreSQLConnection dbConnection);

  @override
  Future<Restaurant?> getById(String id) async {
    return null;
  }

  @override
  Future<Restaurant> create(Restaurant restaurant) async {
    return restaurant;
  }

  @override
  Future<void> update(Restaurant restaurant) async {}

  @override
  Future<List<Restaurant>> getAll() async {
    return [];
  }
}
