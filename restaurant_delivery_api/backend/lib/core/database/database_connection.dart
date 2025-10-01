// lib/core/database/database_connection.dart
import 'package:postgres/postgres.dart';

/// Configuration model for database connection
class DatabaseConfig {
  final String host;
  final int port;
  final String database;
  final String username;
  final String password;
  final bool useSSL;

  DatabaseConfig({
    required this.host,
    required this.port,
    required this.database,
    required this.username,
    required this.password,
    this.useSSL = false,
  });
}

/// Database connection wrapper
class DatabaseConnection {
  final PostgreSQLConnection _connection;

  DatabaseConnection._(this._connection);

  /// Create and open a database connection
  static Future<DatabaseConnection> create(DatabaseConfig config) async {
    try {
      final connection = PostgreSQLConnection(
        config.host,
        config.port,
        config.database,
        username: config.username,
        password: config.password,
        useSSL: config.useSSL,
      );

      await connection.open();
      print(
        '✅ Database connected: ${config.database}@${config.host}:${config.port}',
      );

      return DatabaseConnection._(connection);
    } catch (e, stackTrace) {
      print('❌ Failed to connect to database: $e');
      print(stackTrace);
      rethrow;
    }
  }

  /// Get the underlying PostgreSQL connection
  PostgreSQLConnection get connection => _connection;

  /// Execute a query safely
  Future<List<List<dynamic>>> query(
    String sql, {
    Map<String, dynamic>? substitutionValues,
  }) async {
    try {
      print('➡️ Executing query: $sql');
      return await _connection.query(
        sql,
        substitutionValues: substitutionValues ?? {},
      );
    } catch (e, stackTrace) {
      print('❌ Query failed: $e');
      print(stackTrace);
      rethrow;
    }
  }

  /// Execute a statement (INSERT, UPDATE, DELETE)
  Future<int> execute(
    String sql, {
    Map<String, dynamic>? substitutionValues,
  }) async {
    try {
      print('➡️ Executing statement: $sql');
      return await _connection.execute(
        sql,
        substitutionValues: substitutionValues ?? {},
      );
    } catch (e, stackTrace) {
      print('❌ Statement execution failed: $e');
      print(stackTrace);
      rethrow;
    }
  }

  /// Close the database connection
  Future<void> close() async {
    try {
      await _connection.close();
      print('🛑 Database connection closed');
    } catch (e, stackTrace) {
      print('⚠️ Error closing database connection: $e');
      print(stackTrace);
    }
  }
}
