// import 'dart:io';
// import 'package:dotenv/dotenv.dart' as dotenv;

// class EnvConfig {
//   static final dotenv.DotEnv _env = dotenv.DotEnv();

//   /// Load environment variables from `.env` file in backend directory
//   static Future<void> load() async {
//     // Get absolute path to .env file (handles running from parent dirs)
//     final envFile = File('.env');
//     final envPath = envFile.absolute.path;

//     try {
//       if (envFile.existsSync()) {
//         _env.load([envPath]);
//         print('✓ Environment variables loaded from: $envPath');

//         // ✅ Inject all .env vars into Platform.environment if not already present
//         _env.map.forEach((key, value) {
//           if (!Platform.environment.containsKey(key)) {
//             // ignore: invalid_use_of_visible_for_testing_member
//             Platform.environment[key] = value;
//           }
//         });
//       } else {
//         print('⚠ Warning: .env file not found at $envPath — using system environment variables');
//       }
//     } catch (e) {
//       print('⚠ Error loading .env file: $e');
//     }
//   }

//   // --- Helpers -------------------------------------------------------------

//   static String get(String key, {String? defaultValue}) {
//     return _env[key] ?? Platform.environment[key] ?? defaultValue ?? '';
//   }

//   static int getInt(String key, {int? defaultValue}) {
//     final value = get(key);
//     return int.tryParse(value) ?? defaultValue ?? 0;
//   }

//   static bool getBool(String key, {bool defaultValue = false}) {
//     final value = get(key).toLowerCase();
//     return value == 'true' || value == '1' || value == 'yes';
//   }

//   // --- Server Configuration ------------------------------------------------

//   static String get host => get('HOST', defaultValue: 'localhost');
//   static int get port => getInt('PORT', defaultValue: 8080);
//   static String get environment => get('ENVIRONMENT', defaultValue: 'development');

//   // --- Database Configuration ---------------------------------------------

//   static String get dbHost => get('DB_HOST', defaultValue: 'localhost');
//   static int get dbPort => getInt('DB_PORT', defaultValue: 5432);
//   static String get dbName => get('DB_NAME', defaultValue: 'pos_bridge');
//   static String get dbUser => get('DB_USER', defaultValue: 'postgres');
//   static String get dbPassword => get('DB_PASSWORD');
//   static String get dbSslMode => get('DB_SSL_MODE', defaultValue: 'disable');

//   // --- Uber Eats -----------------------------------------------------------

//   static String get uberClientId => get('UBER_CLIENT_ID');
//   static String get uberClientSecret => get('UBER_CLIENT_SECRET');
//   static String get uberEnvironment => get('UBER_ENVIRONMENT', defaultValue: 'sandbox');
//   static String get uberBaseUrl => get('UBER_BASE_URL', defaultValue: 'https://api.uber.com');

//   // --- API Security --------------------------------------------------------

//   static String get apiSecretKey => get('API_SECRET_KEY');
//   static String get jwtSecret => get('JWT_SECRET');

//   // --- Webhook -------------------------------------------------------------

//   static String get webhookSecret => get('WEBHOOK_SECRET');

//   // --- Redis ---------------------------------------------------------------

//   static String get redisHost => get('REDIS_HOST', defaultValue: 'localhost');
//   static int get redisPort => getInt('REDIS_PORT', defaultValue: 6379);

//   // --- Logging -------------------------------------------------------------

//   static String get logLevel => get('LOG_LEVEL', defaultValue: 'info');

//   // --- Validation ----------------------------------------------------------

//   static void validate() {
//     final requiredVars = [
//       'DB_PASSWORD',
//       'UBER_CLIENT_ID',
//       'UBER_CLIENT_SECRET',
//       'API_SECRET_KEY',
//       'JWT_SECRET',
//       'WEBHOOK_SECRET',
//     ];

//     final missing = <String>[];
//     for (final varName in requiredVars) {
//       if (get(varName).isEmpty) missing.add(varName);
//     }

//     if (missing.isNotEmpty) {
//       throw Exception(
//         '❌ Missing required environment variables:\n'
//         '${missing.join('\n')}\n\n'
//         'Please set these in your .env file or environment.',
//       );
//     }
//   }
// }

import 'dart:io';
import 'package:dotenv/dotenv.dart' as dotenv;

class EnvConfig {
  static final dotenv.DotEnv _env = dotenv.DotEnv();

  /// Load environment variables from `.env` file in backend directory
  static Future<void> load() async {
    try {
      // Try to load .env from current directory or fallback to backend/.env
      final localEnv = File('.env');
      final backendEnv = File('backend/.env');

      if (localEnv.existsSync()) {
        // _env.load(['.env']);
        _env.load();
        print('✓ Environment variables loaded from: ${localEnv.absolute.path}');
      } else if (backendEnv.existsSync()) {
        _env.load(['backend/.env']);
        // _env.load(path: 'backend/.env');

        print('✓ Environment variables loaded from: ${backendEnv.absolute.path}');
      } else {
        print('⚠ Warning: .env file not found — using system environment variables');
      }
    } catch (e) {
      print('⚠ Error loading .env file: $e');
    }
  }

  // --- Helpers -------------------------------------------------------------

  static String get(String key, {String? defaultValue}) {
    return _env[key] ?? Platform.environment[key] ?? defaultValue ?? '';
  }

  static int getInt(String key, {int? defaultValue}) {
    final value = get(key);
    return int.tryParse(value) ?? defaultValue ?? 0;
  }

  static bool getBool(String key, {bool defaultValue = false}) {
    final value = get(key).toLowerCase();
    return value == 'true' || value == '1' || value == 'yes';
  }

  // --- Server Configuration ------------------------------------------------

  static String get host => get('HOST', defaultValue: 'localhost');
  static int get port => getInt('PORT', defaultValue: 8080);
  static String get environment => get('ENVIRONMENT', defaultValue: 'development');

  // --- Database Configuration ---------------------------------------------

  static String get dbHost => get('DB_HOST', defaultValue: 'localhost');
  static int get dbPort => getInt('DB_PORT', defaultValue: 5432);
  static String get dbName => get('DB_NAME', defaultValue: 'pos_bridge');
  static String get dbUser => get('DB_USER', defaultValue: 'postgres');
  static String get dbPassword => get('DB_PASSWORD');
  static String get dbSslMode => get('DB_SSL_MODE', defaultValue: 'disable');

  // --- Uber Eats -----------------------------------------------------------

  static String get uberClientId => get('UBER_CLIENT_ID');
  static String get uberClientSecret => get('UBER_CLIENT_SECRET');
  static String get uberEnvironment => get('UBER_ENVIRONMENT', defaultValue: 'sandbox');
  static String get uberBaseUrl => get('UBER_BASE_URL', defaultValue: 'https://api.uber.com');

  // --- API Security --------------------------------------------------------

  static String get apiSecretKey => get('API_SECRET_KEY');
  static String get jwtSecret => get('JWT_SECRET');

  // --- Webhook -------------------------------------------------------------

  static String get webhookSecret => get('WEBHOOK_SECRET');
  static bool get skipWebhookSignatureVerification =>
      getBool('SKIP_WEBHOOK_SIGNATURE_VERIFICATION', defaultValue: false);

  // --- Redis ---------------------------------------------------------------

  static String get redisHost => get('REDIS_HOST', defaultValue: 'localhost');
  static int get redisPort => getInt('REDIS_PORT', defaultValue: 6379);

  // --- Logging -------------------------------------------------------------

  static String get logLevel => get('LOG_LEVEL', defaultValue: 'info');

  // --- Validation ----------------------------------------------------------

  static void validate() {
    final requiredVars = [
      'DB_PASSWORD',
      'UBER_CLIENT_ID',
      'UBER_CLIENT_SECRET',
      'API_SECRET_KEY',
      'JWT_SECRET',
      'WEBHOOK_SECRET',
    ];

    final missing = <String>[];
    for (final varName in requiredVars) {
      if (get(varName).isEmpty) missing.add(varName);
    }

    if (missing.isNotEmpty) {
      throw Exception(
        '❌ Missing required environment variables:\n'
        '${missing.join('\n')}\n\n'
        'Please set these in your .env file or environment.',
      );
    }
  }
}
