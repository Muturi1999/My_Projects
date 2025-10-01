import 'package:backend/core/models/branch.dart';
import 'package:backend/core/repositories/branch_repository.dart';
import 'package:postgres/src/connection.dart';

class PostgresBranchRepository implements BranchRepository {
  PostgresBranchRepository(PostgreSQLConnection dbConnection);

  @override
  Future<Branch?> getById(String id) async {
    return null;
  }

  @override
  Future<Branch> create(Branch branch) async {
    return branch;
  }

  @override
  Future<void> update(Branch branch) async {}

  @override
  Future<List<Branch>> getAll() async {
    return [];
  }
  
  @override
  Future<void> delete(String id) {
    // TODO: implement delete
    throw UnimplementedError();
  }
  
  @override
  Future<Branch?> getByPlatformStoreId(String platform, String platformStoreId) {
    // TODO: implement getByPlatformStoreId
    throw UnimplementedError();
  }
  
  @override
  Future<List<Branch>> getByRestaurantId(String restaurantId) {
    // TODO: implement getByRestaurantId
    throw UnimplementedError();
  }
}
