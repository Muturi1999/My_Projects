// lib/core/repositories/database_config.dart
class DatabaseConfig {
  final String host;
  final int port;
  final String database;
  final String username;
  final String password;
  final String sslMode;

  DatabaseConfig({
    required this.host,
    required this.port,
    required this.database,
    required this.username,
    required this.password,
    this.sslMode = 'disable',
  });
}
