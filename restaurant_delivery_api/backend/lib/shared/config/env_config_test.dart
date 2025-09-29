
// import 'package:backend/shared/config/env_config.dart';

// void main() {
//   group('EnvConfig', () {
//     setUpAll(() async {
//       await EnvConfig.load();
//     });

//     test('should load server configuration', () {
//       expect(EnvConfig.host, isNotEmpty);
//       expect(EnvConfig.port, greaterThan(0));
//     });

//     test('should load database configuration', () {
//       expect(EnvConfig.dbHost, isNotEmpty);
//       expect(EnvConfig.dbPort, equals(5432));
//       expect(EnvConfig.dbName, isNotEmpty);
//     });

//     test('should validate required variables', () {
//       expect(() => EnvConfig.validate(), returnsNormally);
//     });
//   });
// }