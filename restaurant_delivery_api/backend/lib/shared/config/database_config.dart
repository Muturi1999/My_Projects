import 'env_config.dart';

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
    required this.sslMode,
  });
  
  // Load from environment
  factory DatabaseConfig.fromEnv() {
    return DatabaseConfig(
      host: EnvConfig.dbHost,
      port: EnvConfig.dbPort,
      database: EnvConfig.dbName,
      username: EnvConfig.dbUser,
      password: EnvConfig.dbPassword,
      sslMode: EnvConfig.dbSslMode,
    );
  }
  
  // Create connection string
  String get connectionString {
    return 'postgresql://$username:$password@$host:$port/$database?sslmode=$sslMode';
  }
  
  // Connection parameters map
  Map<String, dynamic> get connectionParams => {
    'host': host,
    'port': port,
    'database': database,
    'username': username,
    'password': password,
    'sslMode': sslMode,
  };
}