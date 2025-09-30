import 'package:backend/core/models/customer.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

/// Repository contract for customers.
abstract class CustomerRepository {
  Future<Customer?> getById(String id);
  Future<Customer> create(Customer customer);
  Future<void> update(Customer customer);
  Future<List<Customer>> getAll();
}
