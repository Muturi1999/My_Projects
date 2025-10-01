import 'package:backend/core/models/branch.dart';

/// Repository contract for branch persistence and queries.
abstract class BranchRepository {
  Future<Branch?> getById(String id);
  Future<Branch> create(Branch branch);
  Future<void> update(Branch branch);
  Future<void> delete(String id);
  Future<List<Branch>> getByRestaurantId(String restaurantId);
  Future<List<Branch>> getAll();
  Future<Branch?> getByPlatformStoreId(String platform, String platformStoreId);
}


// // lib/core/repositories/branch_repository.dart
// // import 'package:backend/core/models/branch.dart';

// class BranchRepository {
//   Future<List<Branch>> getByRestaurantId(String restaurantId) async {
//     // TODO: Implement DB fetch
//     return [];
//   }

//   Future<Branch?> getById(String id) async {
//     // TODO: Implement DB fetch
//     return null;
//   }

//   Future<Branch> create(Branch branch) async {
//     // TODO: Implement DB insert
//     return branch;
//   }

//   Future<Branch> update(Branch branch) async {
//     // TODO: Implement DB update
//     return branch;
//   }
// }
