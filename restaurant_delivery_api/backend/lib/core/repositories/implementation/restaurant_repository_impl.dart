// lib/core/repositories/restaurant_repository_impl.dart
import 'package:backend/core/models/restaurant.dart';
import 'package:backend/core/repositories/restaurant_repository.dart';
import 'package:postgres/postgres.dart';

/// Concrete implementation of RestaurantRepository.
class RestaurantRepositoryImpl implements RestaurantRepository {
  final PostgreSQLConnection _db;

  RestaurantRepositoryImpl(this._db);

  @override
  Future<Restaurant?> getById(String id) async {
    final result = await _db.query(
      'SELECT id, name, description, created_at, updated_at FROM restaurants WHERE id = @id',
      substitutionValues: {'id': id},
    );

    if (result.isEmpty) return null;

    final row = result.first;
    return Restaurant(
      id: row[0] as String,
      name: row[1] as String,
      description: row[2] as String?,
      createdAt: row[3] as DateTime,
      updatedAt: row[4] as DateTime, businessLicenseNumber: '', branches: [], platformIntegrations: [],
    );
  }

  @override
  Future<Restaurant> create(Restaurant restaurant) async {
    final id = restaurant.id;
    await _db.query(
      '''
      INSERT INTO restaurants (id, name, description, created_at, updated_at)
      VALUES (@id, @name, @description, @createdAt, @updatedAt)
      ''',
      substitutionValues: {
        'id': id,
        'name': restaurant.name,
        'description': restaurant.description,
        'createdAt': restaurant.createdAt,
        'updatedAt': restaurant.updatedAt,
      },
    );
    return restaurant;
  }

  @override
  Future<void> update(Restaurant restaurant) async {
    await _db.query(
      '''
      UPDATE restaurants
      SET name = @name, description = @description, updated_at = @updatedAt
      WHERE id = @id
      ''',
      substitutionValues: {
        'id': restaurant.id,
        'name': restaurant.name,
        'description': restaurant.description,
        'updatedAt': restaurant.updatedAt,
      },
    );
  }

  @override
  Future<List<Restaurant>> getAll() async {
    final result = await _db.query(
      'SELECT id, name, description, created_at, updated_at FROM restaurants',
    );

    return result.map((row) {
      return Restaurant(
        id: row[0] as String,
        name: row[1] as String,
        description: row[2] as String?,
        createdAt: row[3] as DateTime,
        updatedAt: row[4] as DateTime, businessLicenseNumber: '', branches: [], platformIntegrations: [],
      );
    }).toList();
  }
}
