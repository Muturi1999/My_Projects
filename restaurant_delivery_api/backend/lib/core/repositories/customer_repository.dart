import 'package:backend/core/models/order.dart';

/// Repository contract for customers.
abstract class CustomerRepository {
  Future<Customer?> getById(String id);
  Future<Customer> create(Customer customer);
  Future<void> update(Customer customer);
  Future<List<Customer>> getAll();
}
