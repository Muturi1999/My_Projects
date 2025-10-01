// import 'package:backend/core/models/branch.dart';
// import 'package:backend/core/database/database_connection.dart';
// import '../branch_repository.dart';

// class BranchRepositoryImpl implements BranchRepository {
//   final DatabaseConnection _database;

//   BranchRepositoryImpl(this._database);

//   @override
//   Future<Branch?> getById(String id) async {
//     final result = await _database.query(
//       'SELECT * FROM branches WHERE id = @id',
//       substitutionValues: {'id': id},
//     );
//     if (result.isEmpty) return null;
//     return Branch.fromMap(result.first);
//   }

//   @override
//   Future<Branch> create(Branch branch) async {
//     await _database.execute(
//       'INSERT INTO branches (id, name, restaurant_id, platform_store_id) VALUES (@id, @name, @restaurantId, @platformStoreId)',
//       substitutionValues: {
//         'id': branch.id,
//         'name': branch.name,
//         'restaurantId': branch.restaurantId,
//         'platformStoreId': branch.platformStoreIds,
//       },
//     );
//     return branch;
//   }

//   @override
//   Future<void> update(Branch branch) async {
//     await _database.execute(
//       'UPDATE branches SET name=@name, restaurant_id=@restaurantId, platform_store_id=@platformStoreId WHERE id=@id',
//       substitutionValues: {
//         'id': branch.id,
//         'name': branch.name,
//         'restaurantId': branch.restaurantId,
//         'platformStoreId': branch.platformStoreIds,
//       },
//     );
//   }

//   @override
//   Future<void> delete(String id) async {
//     await _database.execute(
//       'DELETE FROM branches WHERE id=@id',
//       substitutionValues: {'id': id},
//     );
//   }

//   @override
//   Future<List<Branch>> getByRestaurantId(String restaurantId) async {
//     final result = await _database.query(
//       'SELECT * FROM branches WHERE restaurant_id=@restaurantId',
//       substitutionValues: {'restaurantId': restaurantId},
//     );
//     return result.map((r) => Branch.fromMap(r)).toList();
//   }

//   @override
//   Future<List<Branch>> getAll() async {
//     final result = await _database.query('SELECT * FROM branches', substitutionValues: {});
//     return result.map((r) => Branch.fromMap(r)).toList();
//   }

//   @override
//   Future<Branch?> getByPlatformStoreId(String platform, String platformStoreId) async {
//     final result = await _database.query(
//       'SELECT * FROM branches WHERE platform_store_id=@platformStoreId AND platform=@platform',
//       substitutionValues: {
//         'platformStoreId': platformStoreId,
//         'platform': platform,
//       },
//     );
//     if (result.isEmpty) return null;
//     return Branch.fromMap(result.first);
//   }
// }
