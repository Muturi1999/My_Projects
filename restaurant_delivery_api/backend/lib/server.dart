// // // import 'dart:convert';
// // // import 'dart:io';

// // // import 'package:backend/api/controllers/health_controller.dart';
// // // import 'package:backend/api/controllers/order_controller.dart';
// // // import 'package:backend/api/controllers/store_controller.dart';
// // // import 'package:backend/api/controllers/webhook_controller.dart';

// // // import 'package:backend/core/database/database_connection.dart';
// // // import 'package:backend/core/services/order_service.dart';
// // // import 'package:backend/core/services/restaurant_service.dart';
// // // import 'package:backend/core/logger.dart'; // ✅ your real logger

// // // import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
// // // import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';
// // // import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
// // // import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart'
// // //     hide Logger, PosIntegrationService, UberOrderService; // ✅ hide dummy placeholders

// // // import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
// // // import 'package:backend/pos_integration/adapters/square_pos_adapter.dart'
// // //     show SquarePosAdapter;
// // // import 'package:backend/pos_integration/adapters/toast_pos_adapter.dart';
// // // import 'package:backend/pos_integration/services/pos_integration_service.dart';
// // // import 'package:postgres/src/connection.dart';

// // // import 'package:shelf/shelf.dart';
// // // import 'package:shelf/shelf_io.dart';
// // // import 'package:shelf_router/shelf_router.dart';
// // // import 'package:shelf_cors_headers/shelf_cors_headers.dart';


// // // // =====================================================
// // // // Main Server Class
// // // // =====================================================
// // // class PosApiServer {
// // //   late HttpServer _server;
// // //   final Logger logger;
// // //   final AppConfig config;

// // //   // Controllers
// // //   late final WebhookController webhookController;
// // //   late final OrderController orderController;
// // //   late final StoreController storeController;
// // //   late final HealthController healthController;

// // //   // Services
// // //   late final CoreOrderService coreOrderService;
// // //   late final CoreRestaurantService restaurantService;
// // //   late final PosIntegrationService posIntegrationService;
// // //   late final UberWebhookService uberWebhookService;
// // //   late final UberStoreService uberStoreService;

// // //   PosApiServer({
// // //     required this.logger,
// // //     required this.config,
// // //   });

// // //   // ==========================================
// // //   // Dependency Initialization
// // //   // ==========================================
// // //   Future<void> _initializeDependencies() async {
// // //     logger.info('Initializing dependencies...');

// // //     // Database connection
// // //     final database = await DatabaseConnection.create(config.databaseConfig);
// // //     final dbConnection = database.connection;

// // //     // Concrete repository implementations
// // //     final orderRepository = PostgresOrderRepository(dbConnection);
// // //     final restaurantRepository = PostgresRestaurantRepository(dbConnection);
// // //     final branchRepository = PostgresBranchRepository(dbConnection);

// // //     // Core services
// // //     coreOrderService = CoreOrderService(
// // //       orderRepository: orderRepository,
// // //       branchRepository: branchRepository,
// // //       logger: logger,
// // //     );

// // //     restaurantService = CoreRestaurantService(
// // //       restaurantRepository: restaurantRepository,
// // //       branchRepository: branchRepository,
// // //       logger: logger,
// // //     );

// // //     // POS adapters
// // //     final posAdapters = <String, PosAdapter>{
// // //       'square': SquarePosAdapter(logger: logger),
// // //       'toast': ToastPosAdapter(logger: logger),
// // //     };

// // //     posIntegrationService = PosIntegrationService(
// // //       adapters: posAdapters,
// // //       coreOrderService: coreOrderService,
// // //       logger: logger,
// // //     );

// // //     // Uber Eats platform services
// // //     final uberAuthService = UberAuthService(
// // //       clientId: config.uberEatsConfig.clientId,
// // //       clientSecret: config.uberEatsConfig.clientSecret,
// // //     );

// // //     uberStoreService = UberStoreService(
// // //       authService: uberAuthService,
// // //       logger: logger,
// // //     );

// // //     final uberOrderService = UberOrderService(
// // //       authService: uberAuthService,
// // //       logger: logger,
// // //     );

// // //     uberWebhookService = UberWebhookService(
// // //       clientSecret: config.uberEatsConfig.clientSecret,
// // //       orderService: uberOrderService,
// // //       coreOrderService: coreOrderService,
// // //       posService: posIntegrationService,
// // //       logger: logger,
// // //     );

// // //     // Controllers
// // //     webhookController = WebhookController(
// // //       uberWebhookService: uberWebhookService,
// // //       logger: logger,
// // //     );

// // //     orderController = OrderController(
// // //       coreOrderService: coreOrderService,
// // //       posIntegrationService: posIntegrationService,
// // //       logger: logger,
// // //     );

// // //     storeController = StoreController(
// // //       restaurantService: restaurantService,
// // //       uberStoreService: uberStoreService,
// // //       logger: logger,
// // //     );

// // //     healthController = HealthController(
// // //       posIntegrationService: posIntegrationService,
// // //       logger: logger,
// // //     );

// // //     logger.info('Dependencies initialized successfully');
// // //   }

// // //   // ==========================================
// // //   // Routes
// // //   // ==========================================
// // //   Router _createRoutes() {
// // //     final router = Router();

// // //     // Health & monitoring
// // //     router.get('/health', healthController.healthCheck);
// // //     router.get('/metrics', healthController.metrics);

// // //     // Webhooks
// // //     router.post('/webhooks/<platform>', webhookController.handleWebhook);

// // //     // Orders
// // //     router.get('/api/v1/orders/branch/<branchId>', orderController.getOrders);
// // //     router.get('/api/v1/orders/<orderId>', orderController.getOrder);
// // //     router.post('/api/v1/orders/<orderId>/retry',
// // //         orderController.retryOrderInjection);

// // //     // Stores
// // //     router.get('/api/v1/restaurants', storeController.getRestaurants);
// // //     router.put('/api/v1/branches/<branchId>/status',
// // //         storeController.updateBranchStatus);
// // //     router.post('/api/v1/branches/<branchId>/holiday-hours',
// // //         storeController.setHolidayHours);

// // //     // Platforms
// // //     router.mount('/api/v1/uber-eats', _createUberEatsRoutes());
// // //     router.mount('/api/v1/glovo', _createGlovoRoutes());
// // //     router.mount('/api/v1/bolt', _createBoltRoutes());

// // //     // Catch-all
// // //     router.all('/<path|.*>', _notFoundHandler);

// // //     return router;
// // //   }

// // //   Router _createUberEatsRoutes() {
// // //     final router = Router();
// // //     router.get('/auth/callback', _handleUberEatsAuthCallback);
// // //     router.get('/stores', _getUberEatsStores);
// // //     router.post('/stores/<storeId>/activate', _activateUberEatsStore);
// // //     router.delete('/stores/<storeId>/deactivate', _deactivateUberEatsStore);
// // //     return router;
// // //   }

// // //   Router _createGlovoRoutes() => Router();
// // //   Router _createBoltRoutes() => Router();

// // //   // ==========================================
// // //   // Middleware
// // //   // ==========================================
// // //   Handler _createMiddlewarePipeline(Handler handler) {
// // //     return Pipeline()
// // //         .addMiddleware(corsHeaders())
// // //         .addMiddleware(logRequests())
// // //         .addMiddleware(_authenticationMiddleware)
// // //         .addMiddleware(_rateLimitMiddleware)
// // //         .addMiddleware(_errorHandlingMiddleware)
// // //         .addHandler(handler);
// // //   }

// // //   Handler _authenticationMiddleware(Handler innerHandler) {
// // //     return (Request request) async {
// // //       if (request.url.path.startsWith('webhooks') ||
// // //           request.url.path == 'health') {
// // //         return await innerHandler(request);
// // //       }

// // //       final authHeader = request.headers['Authorization'];
// // //       if (authHeader == null || !_isValidApiKey(authHeader)) {
// // //         return Response(401,
// // //             body: jsonEncode({'error': 'Unauthorized'}),
// // //             headers: {'Content-Type': 'application/json'});
// // //       }
// // //       return await innerHandler(request);
// // //     };
// // //   }

// // //   Handler _rateLimitMiddleware(Handler innerHandler) {
// // //     final Map<String, List<DateTime>> requestCounts = {};
// // //     return (Request request) async {
// // //       final clientIp =
// // //           request.headers['X-Forwarded-For'] ?? request.headers['X-Real-IP'] ?? 'unknown';
// // //       final now = DateTime.now();
// // //       final windowStart = now.subtract(Duration(minutes: 1));
// // //       requestCounts[clientIp]?.removeWhere((time) => time.isBefore(windowStart));
// // //       requestCounts[clientIp] ??= [];
// // //       if (requestCounts[clientIp]!.length >= 100) {
// // //         return Response(429,
// // //             body: jsonEncode({'error': 'Rate limit exceeded'}),
// // //             headers: {'Content-Type': 'application/json'});
// // //       }
// // //       requestCounts[clientIp]!.add(now);
// // //       return await innerHandler(request);
// // //     };
// // //   }

// // //   Handler _errorHandlingMiddleware(Handler innerHandler) {
// // //     return (Request request) async {
// // //       try {
// // //         return await innerHandler(request);
// // //       } catch (error, stackTrace) {
// // //         logger.error('Unhandled request error: $error',
// // //             error: error);
// // //         return Response.internalServerError(
// // //             body: jsonEncode({
// // //               'error': 'Internal server error',
// // //               'message': 'An unexpected error occurred',
// // //               'timestamp': DateTime.now().toIso8601String(),
// // //             }),
// // //             headers: {'Content-Type': 'application/json'});
// // //       }
// // //     };
// // //   }

// // //   // ==========================================
// // //   // Server Start/Stop
// // //   // ==========================================
// // //   Future<void> start() async {
// // //     try {
// // //       logger.info('Starting POS Bridge API Server...');
// // //       await _initializeDependencies();
// // //       final router = _createRoutes();
// // //       final handler = _createMiddlewarePipeline(router);

// // //       _server = await serve(
// // //         handler,
// // //         config.host,
// // //         config.port,
// // //         securityContext: config.sslConfig?.securityContext,
// // //       );

// // //       logger.info('Server running on ${config.host}:${config.port}');
// // //       logger.info('Webhook endpoint: ${_getWebhookUrl()}');
// // //       logger.info('Health check: ${_getHealthCheckUrl()}');
// // //     } catch (e, stackTrace) {
// // //       logger.error('Failed to start server: $e', error: e);
// // //       rethrow;
// // //     }
// // //   }

// // //   Future<void> stop() async {
// // //     logger.info('Shutting down server...');
// // //     try {
// // //       await _server.close(force: true);
// // //       logger.info('Server stopped successfully');
// // //     } catch (e) {
// // //       logger.error('Error during shutdown: $e');
// // //     }
// // //   }

// // //   // ==========================================
// // //   // Utility Handlers
// // //   // ==========================================
// // //   Future<Response> _notFoundHandler(Request request) async {
// // //     return Response.notFound(
// // //       jsonEncode({'error': 'Not found', 'path': request.url.path, 'method': request.method}),
// // //       headers: {'Content-Type': 'application/json'},
// // //     );
// // //   }

// // //   Future<Response> _handleUberEatsAuthCallback(Request request) async {
// // //     final code = request.url.queryParameters['code'];
// // //     if (code == null) return Response.badRequest(body: 'Missing authorization code');
// // //     return Response.ok('Store authorized successfully');
// // //   }

// // //   Future<Response> _getUberEatsStores(Request request) async {
// // //     try {
// // //       final stores = await uberStoreService.getStores();
// // //       return Response.ok(
// // //         jsonEncode({'stores': stores.map((s) => s.toJson()).toList()}),
// // //         headers: {'Content-Type': 'application/json'},
// // //       );
// // //     } catch (_) {
// // //       return Response.internalServerError(
// // //           body: jsonEncode({'error': 'Failed to retrieve stores'}));
// // //     }
// // //   }

// // //   Future<Response> _activateUberEatsStore(Request request) async {
// // //     final storeId = request.params['storeId'];
// // //     return Response.ok('Store $storeId activated');
// // //   }

// // //   Future<Response> _deactivateUberEatsStore(Request request) async {
// // //     final storeId = request.params['storeId'];
// // //     return Response.ok('Store $storeId deactivated');
// // //   }

// // //   bool _isValidApiKey(String authHeader) {
// // //     return authHeader.startsWith('Bearer ') && authHeader.length > 7;
// // //   }

// // //   String _getWebhookUrl() {
// // //     final protocol = config.sslConfig != null ? 'https' : 'http';
// // //     return '$protocol://${config.host}:${config.port}/webhooks/{platform}';
// // //   }

// // //   String _getHealthCheckUrl() {
// // //     final protocol = config.sslConfig != null ? 'https' : 'http';
// // //     return '$protocol://${config.host}:${config.port}/health';
// // //   }
// // // }

// // // class PostgresBranchRepository {
// // //   PostgresBranchRepository(PostgreSQLConnection dbConnection);
// // // }

// // // class PostgresRestaurantRepository {
// // //   PostgresRestaurantRepository(PostgreSQLConnection dbConnection);
// // // }

// // // class PostgresOrderRepository {
// // //   PostgresOrderRepository(PostgreSQLConnection dbConnection);
// // // }

// // // // =====================================================
// // // // Config Classes
// // // // =====================================================
// // // class AppConfig {
// // //   final String host;
// // //   final int port;
// // //   final DatabaseConfig databaseConfig;
// // //   final UberEatsConfig uberEatsConfig;
// // //   final SslConfig? sslConfig;

// // //   AppConfig({
// // //     required this.host,
// // //     required this.port,
// // //     required this.databaseConfig,
// // //     required this.uberEatsConfig,
// // //     this.sslConfig,
// // //   });
// // // }

// // // class DatabaseConfig {
// // //   final String host;
// // //   final int port;
// // //   final String database;
// // //   final String username;
// // //   final String password;

// // //   DatabaseConfig({
// // //     required this.host,
// // //     required this.port,
// // //     required this.database,
// // //     required this.username,
// // //     required this.password,
// // //   });
// // // }

// // // class UberEatsConfig {
// // //   final String clientId;
// // //   final String clientSecret;
// // //   final String environment;

// // //   UberEatsConfig({
// // //     required this.clientId,
// // //     required this.clientSecret,
// // //     required this.environment,
// // //   });
// // // }

// // // class SslConfig {
// // //   final SecurityContext securityContext;
// // //   SslConfig({required this.securityContext});
// // // }

// // // // =====================================================
// // // // Entry Point
// // // // =====================================================
// // // Future<void> main(List<String> args) async {
// // //   final logger = Logger.create('PosApiServer');
// // //   try {
// // //     final config = _loadConfiguration();
// // //     final server = PosApiServer(logger: logger, config: config);

// // //     ProcessSignal.sigint.watch().listen((_) async {
// // //       logger.info('SIGINT received, shutting down...');
// // //       await server.stop();
// // //       exit(0);
// // //     });

// // //     ProcessSignal.sigterm.watch().listen((_) async {
// // //       logger.info('SIGTERM received, shutting down...');
// // //       await server.stop();
// // //       exit(0);
// // //     });

// // //     await server.start();
// // //   } catch (e, stackTrace) {
// // //     logger.error('Startup failed: $e', error: e);
// // //     exit(1);
// // //   }
// // // }

// // // AppConfig _loadConfiguration() {
// // //   return AppConfig(
// // //     host: Platform.environment['HOST'] ?? 'localhost',
// // //     port: int.parse(Platform.environment['PORT'] ?? '8080'),
// // //     databaseConfig: DatabaseConfig(
// // //       host: Platform.environment['DB_HOST'] ?? 'localhost',
// // //       port: int.parse(Platform.environment['DB_PORT'] ?? '5432'),
// // //       database: Platform.environment['DB_NAME'] ?? 'pos_bridge',
// // //       username: Platform.environment['DB_USER'] ?? 'postgres',
// // //       password: Platform.environment['DB_PASSWORD'] ?? '',
// // //     ),
// // //     uberEatsConfig: UberEatsConfig(
// // //       clientId: Platform.environment['UBER_CLIENT_ID'] ?? '',
// // //       clientSecret: Platform.environment['UBER_CLIENT_SECRET'] ?? '',
// // //       environment: Platform.environment['UBER_ENVIRONMENT'] ?? 'sandbox',
// // //     ),
// // //   );
// // // }


// // import 'dart:convert';
// // import 'dart:io';

// // import 'package:backend/api/controllers/health_controller.dart';
// // import 'package:backend/api/controllers/order_controller.dart';
// // import 'package:backend/api/controllers/store_controller.dart';
// // import 'package:backend/api/controllers/webhook_controller.dart';
// // import 'package:backend/core/database/database_connection.dart';
// // import 'package:backend/core/services/order_service.dart';
// // import 'package:backend/core/services/restaurant_service.dart';
// // import 'package:backend/core/logger.dart';



// // import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
// // import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';
// // import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
// // import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// // import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
// // import 'package:backend/pos_integration/adapters/square_pos_adapter.dart'
// //     show SquarePosAdapter;
// // import 'package:backend/pos_integration/adapters/toast_pos_adapter.dart';
// // import 'package:backend/pos_integration/services/pos_integration_service.dart';
// // import 'package:postgres/src/connection.dart';

// // import 'package:shelf/shelf.dart';
// // import 'package:shelf/shelf_io.dart';
// // import 'package:shelf_router/shelf_router.dart';
// // import 'package:shelf_cors_headers/shelf_cors_headers.dart';

// // // =====================================================
// // // Main Server Class
// // // =====================================================
// // class PosApiServer {
// //   late HttpServer _server;
// //   final Logger logger;
// //   final AppConfig config;

// //   // Controllers
// //   late final WebhookController webhookController;
// //   late final OrderController orderController;
// //   late final StoreController storeController;
// //   late final HealthController healthController;

// //   // Services
// //   late final CoreOrderService coreOrderService;
// //   late final CoreRestaurantService restaurantService;
// //   late final PosIntegrationService posIntegrationService;
// //   late final UberWebhookService uberWebhookService;
// //   late final UberStoreService uberStoreService;

// //   PosApiServer({
// //     required this.logger,
// //     required this.config,
// //   });

// //   // ==========================================
// //   // Dependency Initialization
// //   // ==========================================
// //   Future<void> _initializeDependencies() async {
// //     logger.info('Initializing dependencies...');

// //     // Database connection
// //     final database = await DatabaseConnection.create(config.databaseConfig!);
// //     final dbConnection = database.connection;

// //     // Concrete repository implementations
// //     final orderRepository = PostgresOrderRepository(dbConnection);
// //     final restaurantRepository = PostgresRestaurantRepository(dbConnection);
// //     final branchRepository = PostgresBranchRepository(dbConnection);

// //     // Core services
// //     coreOrderService = CoreOrderService(
// //       orderRepository: orderRepository,
// //       branchRepository: branchRepository,
// //       logger: logger,
// //     );

// //     restaurantService = CoreRestaurantService(
// //       restaurantRepository: restaurantRepository,
// //       branchRepository: branchRepository,
// //       logger: logger,
// //     );

// //     // POS adapters
// //     final posAdapters = <String, PosAdapter>{
// //       'square': SquarePosAdapter(logger: logger),
// //       'toast': ToastPosAdapter(logger: logger),
// //     };

// //     posIntegrationService = PosIntegrationService(
// //       adapters: posAdapters,
// //       coreOrderService: coreOrderService,
// //       logger: logger,
// //     );

// //     // Uber Eats platform services
// //     final uberAuthService = UberAuthService(
// //       clientId: config.uberEatsConfig.clientId,
// //       clientSecret: config.uberEatsConfig.clientSecret,
// //     );

// //     uberStoreService = UberStoreService(
// //       authService: uberAuthService,
// //       logger: logger,
// //     );

// //     final uberOrderService = UberOrderService(
// //       authService: uberAuthService,
// //       logger: logger,
// //     );

// //     uberWebhookService = UberWebhookService(
// //       clientSecret: config.uberEatsConfig.clientSecret,
// //       orderService: uberOrderService,
// //       coreOrderService: coreOrderService,
// //       posService: posIntegrationService,
// //       logger: logger,
// //     );

// //     // Controllers
// //     webhookController = WebhookController(
// //       uberWebhookService: uberWebhookService,
// //       logger: logger,
// //     );

// //     orderController = OrderController(
// //       coreOrderService: coreOrderService,
// //       posIntegrationService: posIntegrationService,
// //       logger: logger,
// //     );

// //     storeController = StoreController(
// //       restaurantService: restaurantService,
// //       uberStoreService: uberStoreService,
// //       logger: logger,
// //     );

// //     healthController = HealthController(
// //       posIntegrationService: posIntegrationService,
// //       logger: logger,
// //     );

// //     logger.info('Dependencies initialized successfully');
// //   }

// //   // ==========================================
// //   // Routes
// //   // ==========================================
// //   Router _createRoutes() {
// //     final router = Router();

// //     // Health & monitoring
// //     router.get('/health', healthController.healthCheck);
// //     router.get('/metrics', healthController.metrics);

// //     // Webhooks
// //     router.post('/webhooks/<platform>', webhookController.handleWebhook);

// //     // Orders
// //     router.get('/api/v1/orders/branch/<branchId>', orderController.getOrders);
// //     router.get('/api/v1/orders/<orderId>', orderController.getOrder);
// //     router.post('/api/v1/orders/<orderId>/retry',
// //         orderController.retryOrderInjection);

// //     // Stores
// //     router.get('/api/v1/restaurants', storeController.getRestaurants);
// //     router.put('/api/v1/branches/<branchId>/status',
// //         storeController.updateBranchStatus);
// //     router.post('/api/v1/branches/<branchId>/holiday-hours',
// //         storeController.setHolidayHours);

// //     // Platforms
// //     router.mount('/api/v1/uber-eats', _createUberEatsRoutes());
// //     router.mount('/api/v1/glovo', _createGlovoRoutes());
// //     router.mount('/api/v1/bolt', _createBoltRoutes());

// //     // Catch-all
// //     router.all('/<path|.*>', _notFoundHandler);

// //     return router;
// //   }

// //   Router _createUberEatsRoutes() {
// //     final router = Router();
// //     router.get('/auth/callback', _handleUberEatsAuthCallback);
// //     router.get('/stores', _getUberEatsStores);
// //     router.post('/stores/<storeId>/activate', _activateUberEatsStore);
// //     router.delete('/stores/<storeId>/deactivate', _deactivateUberEatsStore);
// //     return router;
// //   }

// //   Router _createGlovoRoutes() => Router();
// //   Router _createBoltRoutes() => Router();

// //   // ==========================================
// //   // Middleware
// //   // ==========================================
// //   Handler _createMiddlewarePipeline(Handler handler) {
// //     return Pipeline()
// //         .addMiddleware(corsHeaders())
// //         .addMiddleware(logRequests())
// //         .addMiddleware(_authenticationMiddleware)
// //         .addMiddleware(_rateLimitMiddleware)
// //         .addMiddleware(_errorHandlingMiddleware)
// //         .addHandler(handler);
// //   }

// //   Handler _authenticationMiddleware(Handler innerHandler) {
// //     return (Request request) async {
// //       if (request.url.path.startsWith('webhooks') ||
// //           request.url.path == 'health') {
// //         return await innerHandler(request);
// //       }

// //       final authHeader = request.headers['Authorization'];
// //       if (authHeader == null || !_isValidApiKey(authHeader)) {
// //         return Response(401,
// //             body: jsonEncode({'error': 'Unauthorized'}),
// //             headers: {'Content-Type': 'application/json'});
// //       }
// //       return await innerHandler(request);
// //     };
// //   }

// //   Handler _rateLimitMiddleware(Handler innerHandler) {
// //     final Map<String, List<DateTime>> requestCounts = {};
// //     return (Request request) async {
// //       final clientIp =
// //           request.headers['X-Forwarded-For'] ?? request.headers['X-Real-IP'] ?? 'unknown';
// //       final now = DateTime.now();
// //       final windowStart = now.subtract(Duration(minutes: 1));
// //       requestCounts[clientIp]?.removeWhere((time) => time.isBefore(windowStart));
// //       requestCounts[clientIp] ??= [];
// //       if (requestCounts[clientIp]!.length >= 100) {
// //         return Response(429,
// //             body: jsonEncode({'error': 'Rate limit exceeded'}),
// //             headers: {'Content-Type': 'application/json'});
// //       }
// //       requestCounts[clientIp]!.add(now);
// //       return await innerHandler(request);
// //     };
// //   }

// //   Handler _errorHandlingMiddleware(Handler innerHandler) {
// //     return (Request request) async {
// //       try {
// //         return await innerHandler(request);
// //       } catch (error, stackTrace) {
// //         logger.error('Unhandled request error: $error',
// //             error: error);
// //         return Response.internalServerError(
// //             body: jsonEncode({
// //               'error': 'Internal server error',
// //               'message': 'An unexpected error occurred',
// //               'timestamp': DateTime.now().toIso8601String(),
// //             }),
// //             headers: {'Content-Type': 'application/json'});
// //       }
// //     };
// //   }

// //   // ==========================================
// //   // Server Start/Stop
// //   // ==========================================
// //   Future<void> start() async {
// //     try {
// //       logger.info('Starting POS Bridge API Server...');
// //       await _initializeDependencies();
// //       final router = _createRoutes();
// //       final handler = _createMiddlewarePipeline(router);

// //       _server = await serve(
// //         handler,
// //         config.host,
// //         config.port,
// //         securityContext: config.sslConfig?.securityContext,
// //       );

// //       logger.info('Server running on ${config.host}:${config.port}');
// //       logger.info('Webhook endpoint: ${_getWebhookUrl()}');
// //       logger.info('Health check: ${_getHealthCheckUrl()}');
// //     } catch (e, stackTrace) {
// //       logger.error('Failed to start server: $e', error: e);
// //       rethrow;
// //     }
// //   }

// //   Future<void> stop() async {
// //     logger.info('Shutting down server...');
// //     try {
// //       await _server.close(force: true);
// //       logger.info('Server stopped successfully');
// //     } catch (e) {
// //       logger.error('Error during shutdown: $e');
// //     }
// //   }

// //   // ==========================================
// //   // Utility Handlers
// //   // ==========================================
// //   Future<Response> _notFoundHandler(Request request) async {
// //     return Response.notFound(
// //       jsonEncode({'error': 'Not found', 'path': request.url.path, 'method': request.method}),
// //       headers: {'Content-Type': 'application/json'},
// //     );
// //   }

// //   Future<Response> _handleUberEatsAuthCallback(Request request) async {
// //     final code = request.url.queryParameters['code'];
// //     if (code == null) return Response.badRequest(body: 'Missing authorization code');
// //     return Response.ok('Store authorized successfully');
// //   }

// //   Future<Response> _getUberEatsStores(Request request) async {
// //     try {
// //       final stores = await uberStoreService.getStores();
// //       return Response.ok(
// //         jsonEncode({'stores': stores.map((s) => s.toJson()).toList()}),
// //         headers: {'Content-Type': 'application/json'},
// //       );
// //     } catch (_) {
// //       return Response.internalServerError(
// //           body: jsonEncode({'error': 'Failed to retrieve stores'}));
// //     }
// //   }

// //   Future<Response> _activateUberEatsStore(Request request) async {
// //     final storeId = request.params['storeId'];
// //     return Response.ok('Store $storeId activated');
// //   }

// //   Future<Response> _deactivateUberEatsStore(Request request) async {
// //     final storeId = request.params['storeId'];
// //     return Response.ok('Store $storeId deactivated');
// //   }

// //   bool _isValidApiKey(String authHeader) {
// //     return authHeader.startsWith('Bearer ') && authHeader.length > 7;
// //   }

// //   String _getWebhookUrl() {
// //     final protocol = config.sslConfig != null ? 'https' : 'http';
// //     return '$protocol://${config.host}:${config.port}/webhooks/{platform}';
// //   }

// //   String _getHealthCheckUrl() {
// //     final protocol = config.sslConfig != null ? 'https' : 'http';
// //     return '$protocol://${config.host}:${config.port}/health';
// //   }
// // }

// // class PostgresRestaurantRepository {
// //   PostgresRestaurantRepository(PostgreSQLConnection dbConnection);
// // }

// // class PostgresBranchRepository {
// //   PostgresBranchRepository(PostgreSQLConnection dbConnection);
// // }

// // class PostgresOrderRepository {
// //   PostgresOrderRepository(PostgreSQLConnection dbConnection);
// // }

// // // =====================================================
// // // Config Classes
// // // =====================================================
// // class AppConfig {
// //   final String host;
// //   final int port;
// //   final DatabaseConfig databaseConfig;
// //   final UberEatsConfig uberEatsConfig;
// //   final SslConfig? sslConfig;

// //   AppConfig({
// //     required this.host,
// //     required this.port,
// //     required this.databaseConfig,
// //     required this.uberEatsConfig,
// //     this.sslConfig,
// //   });
// // }

// // class DatabaseConfig {
// //   final String host;
// //   final int port;
// //   final String database;
// //   final String username;
// //   final String password;

// //   DatabaseConfig({
// //     required this.host,
// //     required this.port,
// //     required this.database,
// //     required this.username,
// //     required this.password,
// //   });
// // }

// // class UberEatsConfig {
// //   final String clientId;
// //   final String clientSecret;
// //   final String environment;

// //   UberEatsConfig({
// //     required this.clientId,
// //     required this.clientSecret,
// //     required this.environment,
// //   });
// // }

// // class SslConfig {
// //   final SecurityContext securityContext;
// //   SslConfig({required this.securityContext});
// // }

// // // =====================================================
// // // Entry Point
// // // =====================================================
// // Future<void> main(List<String> args) async {
// //   final logger = Logger.create('PosApiServer');
// //   try {
// //     final config = _loadConfiguration();
// //     final server = PosApiServer(logger: logger, config: config);

// //     ProcessSignal.sigint.watch().listen((_) async {
// //       logger.info('SIGINT received, shutting down...');
// //       await server.stop();
// //       exit(0);
// //     });

// //     ProcessSignal.sigterm.watch().listen((_) async {
// //       logger.info('SIGTERM received, shutting down...');
// //       await server.stop();
// //       exit(0);
// //     });

// //     await server.start();
// //   } catch (e, stackTrace) {
// //     logger.error('Startup failed: $e', error: e);
// //     exit(1);
// //   }
// // }

// // AppConfig _loadConfiguration() {
// //   return AppConfig(
// //     host: Platform.environment['HOST'] ?? 'localhost',
// //     port: int.parse(Platform.environment['PORT'] ?? '8080'),
// //     databaseConfig: DatabaseConfig(
// //       host: Platform.environment['DB_HOST'] ?? 'localhost',
// //       port: int.parse(Platform.environment['DB_PORT'] ?? '5432'),
// //       database: Platform.environment['DB_NAME'] ?? 'pos_bridge',
// //       username: Platform.environment['DB_USER'] ?? 'postgres',
// //       password: Platform.environment['DB_PASSWORD'] ?? '',
// //     ),
// //     uberEatsConfig: UberEatsConfig(
// //       clientId: Platform.environment['UBER_CLIENT_ID'] ?? '',
// //       clientSecret: Platform.environment['UBER_CLIENT_SECRET'] ?? '',
// //       environment: Platform.environment['UBER_ENVIRONMENT'] ?? 'sandbox',
// //     ),
// //   );
// // }

// import 'dart:convert';
// import 'dart:io';

// import 'package:backend/api/controllers/health_controller.dart';
// import 'package:backend/api/controllers/order_controller.dart';
// import 'package:backend/api/controllers/store_controller.dart';
// import 'package:backend/api/controllers/webhook_controller.dart';
// import 'package:backend/core/database/database_connection.dart';
// import 'package:backend/core/services/order_service.dart';
// import 'package:backend/core/services/restaurant_service.dart';
// import 'package:backend/core/logger.dart';

// import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
// import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';
// import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
// import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

// import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
// import 'package:backend/pos_integration/adapters/square_pos_adapter.dart'
//     show SquarePosAdapter;
// import 'package:backend/pos_integration/adapters/toast_pos_adapter.dart';
// import 'package:backend/pos_integration/services/pos_integration_service.dart';
// import 'package:postgres/src/connection.dart';

// import 'package:shelf/shelf.dart';
// import 'package:shelf/shelf_io.dart';
// import 'package:shelf_router/shelf_router.dart';
// import 'package:shelf_cors_headers/shelf_cors_headers.dart';

// // =====================================================
// // Main Server Class
// // =====================================================
// class PosApiServer {
//   late HttpServer _server;
//   final Logger logger;
//   final AppConfig config;

//   // Controllers
//   late final WebhookController webhookController;
//   late final OrderController orderController;
//   late final StoreController storeController;
//   late final HealthController healthController;

//   // Services
//   late final CoreOrderService coreOrderService;
//   late final CoreRestaurantService restaurantService;
//   late final PosIntegrationService posIntegrationService;
//   late final UberWebhookService uberWebhookService;
//   late final UberStoreService uberStoreService;

//   PosApiServer({
//     required this.logger,
//     required this.config,
//   });

//   // ==========================================
//   // Dependency Initialization
//   // ==========================================
//   Future<void> _initializeDependencies() async {
//     logger.info('Initializing dependencies...');

//     // Database connection
//     final database = await DatabaseConnection.create(config.databaseConfig);
//     final dbConnection = database.connection;

//     // Concrete repository implementations
//     final orderRepository = PostgresOrderRepository(dbConnection);
//     final restaurantRepository = PostgresRestaurantRepository(dbConnection);
//     final branchRepository = PostgresBranchRepository(dbConnection);

//     // Core services
//     coreOrderService = CoreOrderService(
//       orderRepository: orderRepository,
//       branchRepository: branchRepository,
//       logger: logger,
//     );

//     restaurantService = CoreRestaurantService(
//       restaurantRepository: restaurantRepository,
//       branchRepository: branchRepository,
//       logger: logger,
//     );

//     // POS adapters
//     final posAdapters = <String, PosAdapter>{
//       'square': SquarePosAdapter(logger: logger),
//       'toast': ToastPosAdapter(logger: logger),
//     };

//     posIntegrationService = PosIntegrationService(
//       adapters: posAdapters,
//       coreOrderService: coreOrderService,
//       logger: logger,
//     );

//     // Uber Eats platform services
//     final uberAuthService = UberAuthService(
//       clientId: config.uberEatsConfig.clientId,
//       clientSecret: config.uberEatsConfig.clientSecret,
//     );

//     uberStoreService = UberStoreService(
//       authService: uberAuthService,
//       logger: logger,
//     );

//     final uberOrderService = UberOrderService(
//       authService: uberAuthService,
//       logger: logger,
//     );

//     uberWebhookService = UberWebhookService(
//       clientSecret: config.uberEatsConfig.clientSecret,
//       orderService: uberOrderService,
//       coreOrderService: coreOrderService,
//       posService: posIntegrationService,
//       logger: logger,
//     );

//     // Controllers
//     webhookController = WebhookController(
//       uberWebhookService: uberWebhookService,
//       logger: logger,
//     );

//     orderController = OrderController(
//       coreOrderService: coreOrderService,
//       posIntegrationService: posIntegrationService,
//       logger: logger,
//     );

//     storeController = StoreController(
//       restaurantService: restaurantService,
//       uberStoreService: uberStoreService,
//       logger: logger,
//     );

//     healthController = HealthController(
//       posIntegrationService: posIntegrationService,
//       logger: logger,
//     );

//     logger.info('Dependencies initialized successfully');
//   }

//   // ==========================================
//   // Routes
//   // ==========================================
//   Router _createRoutes() {
//     final router = Router();

//     // Health & monitoring
//     router.get('/health', healthController.healthCheck);
//     router.get('/metrics', healthController.metrics);

//     // Webhooks
//     router.post('/webhooks/<platform>', webhookController.handleWebhook);

//     // Orders
//     router.get('/api/v1/orders/branch/<branchId>', orderController.getOrders);
//     router.get('/api/v1/orders/<orderId>', orderController.getOrder);
//     router.post('/api/v1/orders/<orderId>/retry',
//         orderController.retryOrderInjection);

//     // Stores
//     router.get('/api/v1/restaurants', storeController.getRestaurants);
//     router.put('/api/v1/branches/<branchId>/status',
//         storeController.updateBranchStatus);
//     router.post('/api/v1/branches/<branchId>/holiday-hours',
//         storeController.setHolidayHours);

//     // Platforms
//     router.mount('/api/v1/uber-eats', _createUberEatsRoutes());
//     router.mount('/api/v1/glovo', _createGlovoRoutes());
//     router.mount('/api/v1/bolt', _createBoltRoutes());

//     // Catch-all
//     router.all('/<path|.*>', _notFoundHandler);

//     return router;
//   }

//   Router _createUberEatsRoutes() {
//     final router = Router();
//     router.get('/auth/callback', _handleUberEatsAuthCallback);
//     router.get('/stores', _getUberEatsStores);
//     router.post('/stores/<storeId>/activate', _activateUberEatsStore);
//     router.delete('/stores/<storeId>/deactivate', _deactivateUberEatsStore);
//     return router;
//   }

//   Router _createGlovoRoutes() => Router();
//   Router _createBoltRoutes() => Router();

//   // ==========================================
//   // Middleware
//   // ==========================================
//   Handler _createMiddlewarePipeline(Handler handler) {
//     return Pipeline()
//         .addMiddleware(corsHeaders())
//         .addMiddleware(logRequests())
//         .addMiddleware(_authenticationMiddleware)
//         .addMiddleware(_rateLimitMiddleware)
//         .addMiddleware(_errorHandlingMiddleware)
//         .addHandler(handler);
//   }

//   Handler _authenticationMiddleware(Handler innerHandler) {
//     return (Request request) async {
//       if (request.url.path.startsWith('webhooks') ||
//           request.url.path == 'health') {
//         return await innerHandler(request);
//       }

//       final authHeader = request.headers['Authorization'];
//       if (authHeader == null || !_isValidApiKey(authHeader)) {
//         return Response(401,
//             body: jsonEncode({'error': 'Unauthorized'}),
//             headers: {'Content-Type': 'application/json'});
//       }
//       return await innerHandler(request);
//     };
//   }

//   Handler _rateLimitMiddleware(Handler innerHandler) {
//     final Map<String, List<DateTime>> requestCounts = {};
//     return (Request request) async {
//       final clientIp =
//           request.headers['X-Forwarded-For'] ?? request.headers['X-Real-IP'] ?? 'unknown';
//       final now = DateTime.now();
//       final windowStart = now.subtract(Duration(minutes: 1));
//       requestCounts[clientIp]?.removeWhere((time) => time.isBefore(windowStart));
//       requestCounts[clientIp] ??= [];
//       if (requestCounts[clientIp]!.length >= 100) {
//         return Response(429,
//             body: jsonEncode({'error': 'Rate limit exceeded'}),
//             headers: {'Content-Type': 'application/json'});
//       }
//       requestCounts[clientIp]!.add(now);
//       return await innerHandler(request);
//     };
//   }

//   Handler _errorHandlingMiddleware(Handler innerHandler) {
//     return (Request request) async {
//       try {
//         return await innerHandler(request);
//       } catch (error, stackTrace) {
//         logger.error('Unhandled request error: $error', error: error);
//         return Response.internalServerError(
//             body: jsonEncode({
//               'error': 'Internal server error',
//               'message': 'An unexpected error occurred',
//               'timestamp': DateTime.now().toIso8601String(),
//             }),
//             headers: {'Content-Type': 'application/json'});
//       }
//     };
//   }

//   // ==========================================
//   // Server Start/Stop
//   // ==========================================
//   Future<void> start() async {
//     try {
//       logger.info('Starting POS Bridge API Server...');
//       await _initializeDependencies();
//       final router = _createRoutes();
//       final handler = _createMiddlewarePipeline(router);

//       _server = await serve(
//         handler,
//         config.host,
//         config.port,
//         securityContext: config.sslConfig?.securityContext,
//       );

//       logger.info('Server running on ${config.host}:${config.port}');
//       logger.info('Webhook endpoint: ${_getWebhookUrl()}');
//       logger.info('Health check: ${_getHealthCheckUrl()}');
//     } catch (e, stackTrace) {
//       logger.error('Failed to start server: $e', error: e);
//       rethrow;
//     }
//   }

//   Future<void> stop() async {
//     logger.info('Shutting down server...');
//     try {
//       await _server.close(force: true);
//       logger.info('Server stopped successfully');
//     } catch (e) {
//       logger.error('Error during shutdown: $e');
//     }
//   }

//   // ==========================================
//   // Utility Handlers
//   // ==========================================
//   Future<Response> _notFoundHandler(Request request) async {
//     return Response.notFound(
//       jsonEncode({'error': 'Not found', 'path': request.url.path, 'method': request.method}),
//       headers: {'Content-Type': 'application/json'},
//     );
//   }

//   Future<Response> _handleUberEatsAuthCallback(Request request) async {
//     final code = request.url.queryParameters['code'];
//     if (code == null) return Response.badRequest(body: 'Missing authorization code');
//     return Response.ok('Store authorized successfully');
//   }

//   Future<Response> _getUberEatsStores(Request request) async {
//     try {
//       final stores = await uberStoreService.getStores();
//       return Response.ok(
//         jsonEncode({'stores': stores.map((s) => s.toJson()).toList()}),
//         headers: {'Content-Type': 'application/json'},
//       );
//     } catch (_) {
//       return Response.internalServerError(
//           body: jsonEncode({'error': 'Failed to retrieve stores'}));
//     }
//   }

//   Future<Response> _activateUberEatsStore(Request request) async {
//     final storeId = request.params['storeId'];
//     return Response.ok('Store $storeId activated');
//   }

//   Future<Response> _deactivateUberEatsStore(Request request) async {
//     final storeId = request.params['storeId'];
//     return Response.ok('Store $storeId deactivated');
//   }

//   bool _isValidApiKey(String authHeader) {
//     return authHeader.startsWith('Bearer ') && authHeader.length > 7;
//   }

//   String _getWebhookUrl() {
//     final protocol = config.sslConfig != null ? 'https' : 'http';
//     return '$protocol://${config.host}:${config.port}/webhooks/{platform}';
//   }

//   String _getHealthCheckUrl() {
//     final protocol = config.sslConfig != null ? 'https' : 'http';
//     return '$protocol://${config.host}:${config.port}/health';
//   }
// }

// // =====================================================
// // Stub Repositories (replace with real ones later)
// // =====================================================
// class PostgresBranchRepository {
//   PostgresBranchRepository(PostgreSQLConnection dbConnection);
// }

// class PostgresRestaurantRepository {
//   PostgresRestaurantRepository(PostgreSQLConnection dbConnection);
// }

// class PostgresOrderRepository {
//   PostgresOrderRepository(PostgreSQLConnection dbConnection);
// }

// // =====================================================
// // Config Classes
// // =====================================================
// class AppConfig {
//   final String host;
//   final int port;
//   final DatabaseConfig databaseConfig;
//   final UberEatsConfig uberEatsConfig;
//   final SslConfig? sslConfig;

//   AppConfig({
//     required this.host,
//     required this.port,
//     required this.databaseConfig,
//     required this.uberEatsConfig,
//     this.sslConfig,
//   });
// }

// class DatabaseConfig {
//   final String host;
//   final int port;
//   final String database;
//   final String username;
//   final String password;

//   DatabaseConfig({
//     required this.host,
//     required this.port,
//     required this.database,
//     required this.username,
//     required this.password,
//   });
// }

// class UberEatsConfig {
//   final String clientId;
//   final String clientSecret;
//   final String environment;

//   UberEatsConfig({
//     required this.clientId,
//     required this.clientSecret,
//     required this.environment,
//   });
// }

// class SslConfig {
//   final SecurityContext securityContext;
//   SslConfig({required this.securityContext});
// }

// // =====================================================
// // Entry Point
// // =====================================================
// Future<void> main(List<String> args) async {
//   final logger = Logger.create('PosApiServer');
//   try {
//     final config = _loadConfiguration();
//     final server = PosApiServer(logger: logger, config: config);

//     ProcessSignal.sigint.watch().listen((_) async {
//       logger.info('SIGINT received, shutting down...');
//       await server.stop();
//       exit(0);
//     });

//     ProcessSignal.sigterm.watch().listen((_) async {
//       logger.info('SIGTERM received, shutting down...');
//       await server.stop();
//       exit(0);
//     });

//     await server.start();
//   } catch (e, stackTrace) {
//     logger.error('Startup failed: $e', error: e);
//     exit(1);
//   }
// }

// AppConfig _loadConfiguration() {
//   return AppConfig(
//     host: Platform.environment['HOST'] ?? 'localhost',
//     port: int.parse(Platform.environment['PORT'] ?? '8080'),
//     databaseConfig: DatabaseConfig(
//       host: Platform.environment['DB_HOST'] ?? 'localhost',
//       port: int.parse(Platform.environment['DB_PORT'] ?? '5432'),
//       database: Platform.environment['DB_NAME'] ?? 'pos_bridge',
//       username: Platform.environment['DB_USER'] ?? 'postgres',
//       password: Platform.environment['DB_PASSWORD'] ?? '',
//     ),
//     uberEatsConfig: UberEatsConfig(
//       clientId: Platform.environment['UBER_CLIENT_ID'] ?? '',
//       clientSecret: Platform.environment['UBER_CLIENT_SECRET'] ?? '',
//       environment: Platform.environment['UBER_ENVIRONMENT'] ?? 'sandbox',
//     ),
//   );
// }

import 'dart:convert';
import 'dart:io';

import 'package:backend/api/controllers/health_controller.dart';
import 'package:backend/api/controllers/order_controller.dart';
import 'package:backend/api/controllers/store_controller.dart';
import 'package:backend/api/controllers/webhook_controller.dart';

import 'package:backend/core/database/database_connection.dart';
import 'package:backend/core/services/order_service.dart';
import 'package:backend/core/services/restaurant_service.dart';
import 'package:backend/core/logger.dart';

import 'package:backend/platforms/uber_eats/services/uber_auth_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_order_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';

import 'package:backend/pos_integration/abstractions/pos_adapter.dart';
import 'package:backend/pos_integration/adapters/square_pos_adapter.dart'
    show SquarePosAdapter;
import 'package:backend/pos_integration/adapters/toast_pos_adapter.dart';
import 'package:backend/pos_integration/services/pos_integration_service.dart';

import 'package:backend/shared/config/env_config.dart';
import 'package:backend/shared/config/database_config.dart';

import 'package:backend/core/repositories/postgres/postgres_order_repository.dart';
import 'package:backend/core/repositories/postgres/postgres_branch_repository.dart';
import 'package:backend/core/repositories/postgres/postgres_restaurant_repository.dart';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

// =====================================================
// Main Server Class
// =====================================================
class PosApiServer {
  late HttpServer _server;
  final Logger logger;
  final AppConfig config;

  // Controllers
  late final WebhookController webhookController;
  late final OrderController orderController;
  late final StoreController storeController;
  late final HealthController healthController;

  // Services
  late final CoreOrderService coreOrderService;
  late final CoreRestaurantService restaurantService;
  late final PosIntegrationService posIntegrationService;
  late final UberWebhookService uberWebhookService;
  late final UberStoreService uberStoreService;

  PosApiServer({
    required this.logger,
    required this.config,
  });

  // ==========================================
  // Dependency Initialization
  // ==========================================
  Future<void> _initializeDependencies() async {
    logger.info('Initializing dependencies...');

    // Database connection
    final dbConfig = DatabaseConfigLoader.fromEnv();
    final database = await DatabaseConnection.create(dbConfig);
    final dbConnection = database.connection;

    // Concrete repository implementations (stubs for now)
    final orderRepository = PostgresOrderRepository(dbConnection);
    final restaurantRepository = PostgresRestaurantRepository(dbConnection);
    final branchRepository = PostgresBranchRepository(dbConnection);

    // Core services
    coreOrderService = CoreOrderService(
      orderRepository: orderRepository,
      branchRepository: branchRepository,
      logger: logger,
    );

    restaurantService = CoreRestaurantService(
      restaurantRepository: restaurantRepository,
      branchRepository: branchRepository,
      logger: logger,
    );

    // POS adapters
    final posAdapters = <String, PosAdapter>{
      'square': SquarePosAdapter(logger: logger),
      'toast': ToastPosAdapter(logger: logger),
    };

    posIntegrationService = PosIntegrationService(
      adapters: posAdapters,
      coreOrderService: coreOrderService,
      logger: logger,
    );

    // Uber Eats platform services
    final uberAuthService = UberAuthService(
      clientId: config.uberEatsConfig.clientId,
      clientSecret: config.uberEatsConfig.clientSecret,
    );

    uberStoreService = UberStoreService(
      authService: uberAuthService,
      logger: logger,
    );

    final uberOrderService = UberOrderService(
      "",
      authService: uberAuthService,
      logger: logger,
    );

    uberWebhookService = UberWebhookService(
      clientSecret: config.uberEatsConfig.clientSecret,
      orderService: uberOrderService,
      coreOrderService: coreOrderService,
      posService: posIntegrationService,
      logger: logger,
    );

    // Controllers
    webhookController = WebhookController(
      uberWebhookService: uberWebhookService,
      logger: logger,
    );

    orderController = OrderController(
      coreOrderService: coreOrderService,
      posIntegrationService: posIntegrationService,
      logger: logger,
    );

    storeController = StoreController(
      restaurantService: restaurantService,
      uberStoreService: uberStoreService,
      logger: logger,
    );

    healthController = HealthController(
      posIntegrationService: posIntegrationService,
      logger: logger,
    );

    logger.info('Dependencies initialized successfully');
  }

  // ==========================================
  // Routes
  // ==========================================
  Router _createRoutes() {
    final router = Router();

    // Health & monitoring
    router.get('/health', healthController.healthCheck);
    router.get('/metrics', healthController.metrics);

    // Webhooks
    router.post('/webhooks/<platform>', webhookController.handleWebhook);

    // Orders
    router.get('/api/v1/orders/branch/<branchId>', orderController.getOrders);
    router.get('/api/v1/orders/<orderId>', orderController.getOrder);
    router.post('/api/v1/orders/<orderId>/retry',
        orderController.retryOrderInjection);

    // Stores
    router.get('/api/v1/restaurants', storeController.getRestaurants);
    router.put('/api/v1/branches/<branchId>/status',
        storeController.updateBranchStatus);
    router.post('/api/v1/branches/<branchId>/holiday-hours',
        storeController.setHolidayHours);

    // Platforms
    router.mount('/api/v1/uber-eats', _createUberEatsRoutes());
    router.mount('/api/v1/glovo', _createGlovoRoutes());
    router.mount('/api/v1/bolt', _createBoltRoutes());

    // Catch-all
    router.all('/<path|.*>', _notFoundHandler);

    return router;
  }

  Router _createUberEatsRoutes() {
    final router = Router();
    router.get('/auth/callback', _handleUberEatsAuthCallback);
    router.get('/stores', _getUberEatsStores);
    router.post('/stores/<storeId>/activate', _activateUberEatsStore);
    router.delete('/stores/<storeId>/deactivate', _deactivateUberEatsStore);
    return router;
  }

  Router _createGlovoRoutes() => Router();
  Router _createBoltRoutes() => Router();

  // ==========================================
  // Middleware
  // ==========================================
  Handler _createMiddlewarePipeline(Handler handler) {
    return Pipeline()
        .addMiddleware(corsHeaders())
        .addMiddleware(logRequests())
        .addMiddleware(_authenticationMiddleware)
        .addMiddleware(_rateLimitMiddleware)
        .addMiddleware(_errorHandlingMiddleware)
        .addHandler(handler);
  }

  Handler _authenticationMiddleware(Handler innerHandler) {
    return (Request request) async {
      if (request.url.path.startsWith('webhooks') ||
          request.url.path == 'health') {
        return await innerHandler(request);
      }

      final authHeader = request.headers['Authorization'];
      if (authHeader == null || !_isValidApiKey(authHeader)) {
        return Response(401,
            body: jsonEncode({'error': 'Unauthorized'}),
            headers: {'Content-Type': 'application/json'});
      }
      return await innerHandler(request);
    };
  }

  Handler _rateLimitMiddleware(Handler innerHandler) {
    final Map<String, List<DateTime>> requestCounts = {};
    return (Request request) async {
      final clientIp =
          request.headers['X-Forwarded-For'] ?? request.headers['X-Real-IP'] ?? 'unknown';
      final now = DateTime.now();
      final windowStart = now.subtract(Duration(minutes: 1));
      requestCounts[clientIp]?.removeWhere((time) => time.isBefore(windowStart));
      requestCounts[clientIp] ??= [];
      if (requestCounts[clientIp]!.length >= 100) {
        return Response(429,
            body: jsonEncode({'error': 'Rate limit exceeded'}),
            headers: {'Content-Type': 'application/json'});
      }
      requestCounts[clientIp]!.add(now);
      return await innerHandler(request);
    };
  }

  Handler _errorHandlingMiddleware(Handler innerHandler) {
    return (Request request) async {
      try {
        return await innerHandler(request);
      } catch (error) {
        logger.error('Unhandled request error: $error', error: error);
        return Response.internalServerError(
            body: jsonEncode({
              'error': 'Internal server error',
              'message': 'An unexpected error occurred',
              'timestamp': DateTime.now().toIso8601String(),
            }),
            headers: {'Content-Type': 'application/json'});
      }
    };
  }

  // ==========================================
  // Server Start/Stop
  // ==========================================
  Future<void> start() async {
    try {
      logger.info('Starting POS Bridge API Server...');
      await _initializeDependencies();
      final router = _createRoutes();
      final handler = _createMiddlewarePipeline(router);

      _server = await serve(
        handler,
        config.host,
        config.port,
        securityContext: config.sslConfig?.securityContext,
      );

      logger.info('Server running on ${config.host}:${config.port}');
      logger.info('Webhook endpoint: ${_getWebhookUrl()}');
      logger.info('Health check: ${_getHealthCheckUrl()}');
    } catch (e) {
      logger.error('Failed to start server: $e', error: e);
      rethrow;
    }
  }

  Future<void> stop() async {
    logger.info('Shutting down server...');
    try {
      await _server.close(force: true);
      logger.info('Server stopped successfully');
    } catch (e) {
      logger.error('Error during shutdown: $e');
    }
  }

  // ==========================================
  // Utility Handlers
  // ==========================================
  Future<Response> _notFoundHandler(Request request) async {
    return Response.notFound(
      jsonEncode({'error': 'Not found', 'path': request.url.path, 'method': request.method}),
      headers: {'Content-Type': 'application/json'},
    );
  }

  Future<Response> _handleUberEatsAuthCallback(Request request) async {
    final code = request.url.queryParameters['code'];
    if (code == null) return Response.badRequest(body: 'Missing authorization code');
    return Response.ok('Store authorized successfully');
  }

  Future<Response> _getUberEatsStores(Request request) async {
    try {
      final stores = await uberStoreService.getStores();
      return Response.ok(
        jsonEncode({'stores': stores.map((s) => s.toJson()).toList()}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (_) {
      return Response.internalServerError(
          body: jsonEncode({'error': 'Failed to retrieve stores'}));
    }
  }

  Future<Response> _activateUberEatsStore(Request request) async {
    final storeId = request.params['storeId'];
    return Response.ok('Store $storeId activated');
  }

  Future<Response> _deactivateUberEatsStore(Request request) async {
    final storeId = request.params['storeId'];
    return Response.ok('Store $storeId deactivated');
  }

  bool _isValidApiKey(String authHeader) {
    return authHeader.startsWith('Bearer ') && authHeader.length > 7;
  }

  String _getWebhookUrl() {
    final protocol = config.sslConfig != null ? 'https' : 'http';
    return '$protocol://${config.host}:${config.port}/webhooks/{platform}';
  }

  String _getHealthCheckUrl() {
    final protocol = config.sslConfig != null ? 'https' : 'http';
    return '$protocol://${config.host}:${config.port}/health';
  }
}

// =====================================================
// Stub Repositories (replace with real ones later)
// =====================================================
// class PostgresBranchRepository {
//   PostgresBranchRepository(PostgreSQLConnection dbConnection);
// }

// class PostgresRestaurantRepository {
//   PostgresRestaurantRepository(PostgreSQLConnection dbConnection);
// }

// class PostgresOrderRepository {
//   PostgresOrderRepository(PostgreSQLConnection dbConnection);
// }

// =====================================================
// Config Classes
// =====================================================
class AppConfig {
  final String host;
  final int port;
  final UberEatsConfig uberEatsConfig;
  final SslConfig? sslConfig;

  AppConfig({
    required this.host,
    required this.port,
    required this.uberEatsConfig,
    this.sslConfig,
  });
}

class UberEatsConfig {
  final String clientId;
  final String clientSecret;
  final String environment;

  UberEatsConfig({
    required this.clientId,
    required this.clientSecret,
    required this.environment,
  });
}

class SslConfig {
  final SecurityContext securityContext;
  SslConfig({required this.securityContext});
}

// =====================================================
// Entry Point
// =====================================================
Future<void> main(List<String> args) async {
  final logger = Logger.create('PosApiServer');
  try {
    await EnvConfig.load();
    EnvConfig.validate();

    final config = _loadConfiguration();
    final server = PosApiServer(logger: logger, config: config);

    ProcessSignal.sigint.watch().listen((_) async {
      logger.info('SIGINT received, shutting down...');
      await server.stop();
      exit(0);
    });

    ProcessSignal.sigterm.watch().listen((_) async {
      logger.info('SIGTERM received, shutting down...');
      await server.stop();
      exit(0);
    });

    await server.start();
  } catch (e) {
    logger.error('Startup failed: $e', error: e);
    exit(1);
  }
}

AppConfig _loadConfiguration() {
  return AppConfig(
    host: Platform.environment['HOST'] ?? 'localhost',
    port: int.parse(Platform.environment['PORT'] ?? '8080'),
    uberEatsConfig: UberEatsConfig(
      clientId: Platform.environment['UBER_CLIENT_ID'] ?? '',
      clientSecret: Platform.environment['UBER_CLIENT_SECRET'] ?? '',
      environment: Platform.environment['UBER_ENVIRONMENT'] ?? 'sandbox',
    ),
  );
}
