import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:backend/api/controllers/health_controller.dart';
import 'package:backend/api/controllers/order_controller.dart';
import 'package:backend/api/controllers/store_controller.dart';
import 'package:backend/api/controllers/webhook_controller.dart';
import 'package:backend/core/services/restaurant_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_store_service.dart';
import 'package:backend/platforms/uber_eats/services/uber_webhook_service.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

class PosApiServer {
  late HttpServer _server;
  final Logger logger;
  final AppConfig config;

  // Controllers
  late final WebhookController webhookController;
  late final OrderController orderController;
  late final StoreController storeController;
  late final HealthController healthController;

  // Services (dependency injection)
  late final CoreOrderService coreOrderService;
  late final CoreRestaurantService restaurantService;
  late final PosIntegrationService posIntegrationService;
  late final UberWebhookService uberWebhookService;
  late final UberStoreService uberStoreService;

  PosApiServer({
    required this.logger,
    required this.config,
  });

  // Initialize all services and dependencies
  Future<void> _initializeDependencies() async {
    logger.info('Initializing dependencies...');

    // Initialize database connection
    final database = await DatabaseConnection.create(config.databaseConfig);
    
    // Initialize repositories
    final orderRepository = OrderRepository(database);
    final restaurantRepository = RestaurantRepository(database);
    final branchRepository = BranchRepository(database);

    // Initialize core services
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

    // Initialize POS adapters
    final posAdapters = <String, PosAdapter>{
      'square': SquarePosAdapter(logger: logger),
      'toast': ToastPosAdapter(logger: logger),
      // Add more POS adapters as needed
    };

    posIntegrationService = PosIntegrationService(
      adapters: posAdapters,
      coreOrderService: coreOrderService,
      logger: logger,
    );

    // Initialize platform services
    final uberAuthService = UberAuthService(
      clientId: config.uberEatsConfig.clientId,
      clientSecret: config.uberEatsConfig.clientSecret,
    );

    uberStoreService = UberStoreService(
      authService: uberAuthService,
      logger: logger,
    );

    final uberOrderService = UberOrderService(
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

    // Initialize controllers
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

  // Create and configure all routes
  Router _createRoutes() {
    final router = Router();

    // Health and monitoring routes
    router.get('/health', healthController.healthCheck);
    router.get('/metrics', healthController.metrics);

    // Webhook routes - critical for real-time order processing
    router.post('/webhooks/<platform>', webhookController.handleWebhook);

    // Order management routes
    router.get('/api/v1/orders/branch/<branchId>', orderController.getOrders);
    router.get('/api/v1/orders/<orderId>', orderController.getOrder);
    router.post('/api/v1/orders/<orderId>/retry', orderController.retryOrderInjection);

    // Store management routes
    router.get('/api/v1/restaurants', storeController.getRestaurants);
    router.put('/api/v1/branches/<branchId>/status', storeController.updateBranchStatus);
    router.post('/api/v1/branches/<branchId>/holiday-hours', storeController.setHolidayHours);

    // Platform-specific routes (for future expansion)
    router.mount('/api/v1/uber-eats', _createUberEatsRoutes());
    router.mount('/api/v1/glovo', _createGlovoRoutes());
    router.mount('/api/v1/bolt', _createBoltRoutes());

    // Catch-all for unhandled routes
    router.all('/<path|.*>', _notFoundHandler);

    return router;
  }

  // Uber Eats specific routes
  Router _createUberEatsRoutes() {
    final router = Router();
    
    // OAuth callback for store authorization
    router.get('/auth/callback', _handleUberEatsAuthCallback);
    
    // Manual store operations
    router.get('/stores', _getUberEatsStores);
    router.post('/stores/<storeId>/activate', _activateUberEatsStore);
    router.delete('/stores/<storeId>/deactivate', _deactivateUberEatsStore);
    
    return router;
  }

  // Placeholder routes for future platforms
  Router _createGlovoRoutes() {
    final router = Router();
    // Glovo-specific routes will be added here
    return router;
  }

  Router _createBoltRoutes() {
    final router = Router();
    // Bolt-specific routes will be added here
    return router;
  }

  // Create middleware pipeline
  Handler _createMiddlewarePipeline(Handler handler) {
    return Pipeline()
        .addMiddleware(corsHeaders()) // Enable CORS for web clients
        .addMiddleware(logRequests()) // Log all incoming requests
        .addMiddleware(_authenticationMiddleware) // Authenticate API calls
        .addMiddleware(_rateLimitMiddleware) // Rate limiting
        .addMiddleware(_errorHandlingMiddleware) // Global error handling
        .addHandler(handler);
  }

  // Authentication middleware
  Handler _authenticationMiddleware(Handler innerHandler) {
    return (Request request) async {
      // Skip authentication for webhooks (they use signature validation)
      if (request.url.path.startsWith('/webhooks')) {
        return await innerHandler(request);
      }

      // Skip authentication for health checks
      if (request.url.path == '/health') {
        return await innerHandler(request);
      }

      // Check API key or JWT token for other endpoints
      final authHeader = request.headers['Authorization'];
      if (authHeader == null || !_isValidApiKey(authHeader)) {
        return Response(401, 
          body: jsonEncode({'error': 'Unauthorized'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      return await innerHandler(request);
    };
  }

  // Rate limiting middleware
  Handler _rateLimitMiddleware(Handler innerHandler) {
    final Map<String, List<DateTime>> requestCounts = {};
    
    return (Request request) async {
      final clientIp = request.headers['X-Forwarded-For'] ?? 
                       request.headers['X-Real-IP'] ?? 
                       'unknown';
      
      final now = DateTime.now();
      final windowStart = now.subtract(Duration(minutes: 1));
      
      // Clean old requests
      requestCounts[clientIp]?.removeWhere((time) => time.isBefore(windowStart));
      requestCounts[clientIp] ??= [];
      
      // Check rate limit (100 requests per minute per IP)
      if (requestCounts[clientIp]!.length >= 100) {
        return Response(429,
          body: jsonEncode({'error': 'Rate limit exceeded'}),
          headers: {'Content-Type': 'application/json'},
        );
      }
      
      // Add current request
      requestCounts[clientIp]!.add(now);
      
      return await innerHandler(request);
    };
  }

  // Global error handling middleware
  Handler _errorHandlingMiddleware(Handler innerHandler) {
    return (Request request) async {
      try {
        return await innerHandler(request);
      } catch (error, stackTrace) {
        logger.error('Unhandled request error: $error', 
          error: error, stackTrace: stackTrace);
        
        return Response.internalServerError(
          body: jsonEncode({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred',
            'timestamp': DateTime.now().toIso8601String(),
          }),
          headers: {'Content-Type': 'application/json'},
        );
      }
    };
  }

  // Start the server
  Future<void> start() async {
    try {
      logger.info('Starting POS Bridge API Server...');
      
      // Initialize dependencies
      await _initializeDependencies();
      
      // Create routes
      final router = _createRoutes();
      
      // Create middleware pipeline
      final handler = _createMiddlewarePipeline(router);
      
      // Start HTTP server
      _server = await serve(
        handler,
        config.host,
        config.port,
        securityContext: config.sslConfig?.securityContext,
      );
      
      logger.info('Server running on ${config.host}:${config.port}');
      logger.info('Webhook endpoint: ${_getWebhookUrl()}');
      logger.info('Health check: ${_getHealthCheckUrl()}');
      
    } catch (e, stackTrace) {
      logger.error('Failed to start server: $e', error: e, stackTrace: stackTrace);
      rethrow;
    }
  }

  // Graceful shutdown
  Future<void> stop() async {
    logger.info('Shutting down server...');
    
    try {
      await _server.close(force: true);
      logger.info('Server stopped successfully');
    } catch (e) {
      logger.error('Error during server shutdown: $e');
    }
  }

  // Route handlers
  Future<Response> _notFoundHandler(Request request) async {
    return Response.notFound(
      jsonEncode({
        'error': 'Not found',
        'path': request.url.path,
        'method': request.method,
      }),
      headers: {'Content-Type': 'application/json'},
    );
  }

  Future<Response> _handleUberEatsAuthCallback(Request request) async {
    // Handle OAuth callback for Uber Eats store authorization
    final code = request.url.queryParameters['code'];
    if (code == null) {
      return Response.badRequest(body: 'Missing authorization code');
    }
    
    // Process authorization code and activate store
    // Implementation would go here
    
    return Response.ok('Store authorized successfully');
  }

  Future<Response> _getUberEatsStores(Request request) async {
    try {
      final stores = await uberStoreService.getStores();
      return Response.ok(
        jsonEncode({'stores': stores.map((s) => s.toJson()).toList()}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to retrieve stores'}),
      );
    }
  }

  Future<Response> _activateUberEatsStore(Request request) async {
    final storeId = request.params['storeId'];
    // Implementation for store activation
    return Response.ok('Store activated');
  }

  Future<Response> _deactivateUberEatsStore(Request request) async {
    final storeId = request.params['storeId'];
    // Implementation for store deactivation
    return Response.ok('Store deactivated');
  }

  // Utility methods
  bool _isValidApiKey(String authHeader) {
    // Implementation for API key validation
    // This could check against database, JWT validation, etc.
    return authHeader.startsWith('Bearer ') && 
           authHeader.length > 7; // Simplified validation
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

// Configuration classes
class AppConfig {
  final String host;
  final int port;
  final DatabaseConfig databaseConfig;
  final UberEatsConfig uberEatsConfig;
  final SslConfig? sslConfig;

  AppConfig({
    required this.host,
    required this.port,
    required this.databaseConfig,
    required this.uberEatsConfig,
    this.sslConfig,
  });
}

class DatabaseConfig {
  final String host;
  final int port;
  final String database;
  final String username;
  final String password;

  DatabaseConfig({
    required this.host,
    required this.port,
    required this.database,
    required this.username,
    required this.password,
  });
}

class UberEatsConfig {
  final String clientId;
  final String clientSecret;
  final String environment; // 'sandbox' or 'production'

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

// Main entry point
Future<void> main(List<String> args) async {
  // Initialize logger
  final logger = Logger.create('PosApiServer');

  try {
    // Load configuration from environment
    final config = _loadConfiguration();
    
    // Create and start server
    final server = PosApiServer(
      logger: logger,
      config: config,
    );

    // Handle shutdown signals
    ProcessSignal.sigint.watch().listen((_) async {
      logger.info('Received SIGINT, shutting down...');
      await server.stop();
      exit(0);
    });

    ProcessSignal.sigterm.watch().listen((_) async {
      logger.info('Received SIGTERM, shutting down...');
      await server.stop();
      exit(0);
    });

    // Start server
    await server.start();
    
  } catch (e, stackTrace) {
    logger.error('Application startup failed: $e', error: e, stackTrace: stackTrace);
    exit(1);
  }
}

AppConfig _loadConfiguration() {
  return AppConfig(
    host: Platform.environment['HOST'] ?? 'localhost',
    port: int.parse(Platform.environment['PORT'] ?? '8080'),
    databaseConfig: DatabaseConfig(
      host: Platform.environment['DB_HOST'] ?? 'localhost',
      port: int.parse(Platform.environment['DB_PORT'] ?? '5432'),
      database: Platform.environment['DB_NAME'] ?? 'pos_bridge',
      username: Platform.environment['DB_USER'] ?? 'postgres',
      password: Platform.environment['DB_PASSWORD'] ?? '',
    ),
    uberEatsConfig: UberEatsConfig(
      clientId: Platform.environment['UBER_CLIENT_ID'] ?? '',
      clientSecret: Platform.environment['UBER_CLIENT_SECRET'] ?? '',
      environment: Platform.environment['UBER_ENVIRONMENT'] ?? 'sandbox',
    ),
  );
}
