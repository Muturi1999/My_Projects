// lib/core/repositories/branch_repository.dart
import 'package:backend/core/models/branch.dart';

/// Repository contract for branch persistence and queries.
abstract class BranchRepository {
  Future<Branch?> getById(String id);
  Future<Branch> create(Branch branch);
  Future<void> update(Branch branch);
  Future<void> delete(String id);
  Future<List<Branch>> getByRestaurantId(String restaurantId);
  Future<List<Branch>> getAll();
}
