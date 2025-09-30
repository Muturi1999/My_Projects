/// Base exception for core service errors
class CoreServiceException implements Exception {
  final String message;
  final String? code;
  final Map<String, dynamic>? metadata;
  
  CoreServiceException(
    this.message, {
    this.code,
    this.metadata,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('CoreServiceException: $message');
    if (code != null) buffer.write(' [Code: $code]');
    if (metadata != null) buffer.write(' | Metadata: $metadata');
    return buffer.toString();
  }
}

/// Exception for validation errors
class ValidationException implements Exception {
  final String message;
  final String? field;
  final dynamic invalidValue;
  
  ValidationException(
    this.message, {
    this.field,
    this.invalidValue,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('ValidationException: $message');
    if (field != null) buffer.write(' [Field: $field]');
    if (invalidValue != null) buffer.write(' | Value: $invalidValue');
    return buffer.toString();
  }
}

/// Exception for Uber Eats API errors
class UberEatsApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? responseBody;
  final String? errorCode;
  final Map<String, dynamic>? metadata;
  
  UberEatsApiException(
    this.message, {
    this.statusCode,
    this.responseBody,
    this.errorCode,
    this.metadata,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('UberEatsApiException: $message');
    if (statusCode != null) buffer.write(' (Status: $statusCode)');
    if (errorCode != null) buffer.write(' [Code: $errorCode]');
    if (responseBody != null) buffer.write('\nResponse: $responseBody');
    return buffer.toString();
  }
  
  /// Check if error is retryable
  bool get isRetryable {
    if (statusCode == null) return false;
    return statusCode! >= 500 || statusCode == 429 || statusCode == 408;
  }
  
  /// Check if error is authentication related
  bool get isAuthError {
    return statusCode == 401 || statusCode == 403;
  }
}

/// Exception for POS integration errors
class PosIntegrationException implements Exception {
  final String message;
  final String? posSystem;
  final String? errorCode;
  final Map<String, dynamic>? metadata;
  
  PosIntegrationException(
    this.message, {
    this.posSystem,
    this.errorCode,
    this.metadata,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('PosIntegrationException: $message');
    if (posSystem != null) buffer.write(' [POS: $posSystem]');
    if (errorCode != null) buffer.write(' [Code: $errorCode]');
    if (metadata != null) buffer.write(' | Metadata: $metadata');
    return buffer.toString();
  }
}

/// Exception for database operations
class DatabaseException implements Exception {
  final String message;
  final String? operation;
  final dynamic originalError;
  
  DatabaseException(
    this.message, {
    this.operation,
    this.originalError,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('DatabaseException: $message');
    if (operation != null) buffer.write(' [Operation: $operation]');
    if (originalError != null) buffer.write('\nOriginal Error: $originalError');
    return buffer.toString();
  }
}

/// Exception for authentication and authorization errors
class AuthException implements Exception {
  final String message;
  final String? reason;
  final bool isTokenExpired;
  
  AuthException(
    this.message, {
    this.reason,
    this.isTokenExpired = false,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('AuthException: $message');
    if (reason != null) buffer.write(' [Reason: $reason]');
    if (isTokenExpired) buffer.write(' | Token expired');
    return buffer.toString();
  }
}

/// Exception for webhook processing errors
class WebhookException implements Exception {
  final String message;
  final String? platform;
  final String? eventType;
  final bool isSignatureInvalid;
  
  WebhookException(
    this.message, {
    this.platform,
    this.eventType,
    this.isSignatureInvalid = false,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('WebhookException: $message');
    if (platform != null) buffer.write(' [Platform: $platform]');
    if (eventType != null) buffer.write(' [Event: $eventType]');
    if (isSignatureInvalid) buffer.write(' | Invalid signature');
    return buffer.toString();
  }
}

/// Exception for configuration errors
class ConfigurationException implements Exception {
  final String message;
  final String? configKey;
  final List<String>? missingKeys;
  
  ConfigurationException(
    this.message, {
    this.configKey,
    this.missingKeys,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('ConfigurationException: $message');
    if (configKey != null) buffer.write(' [Key: $configKey]');
    if (missingKeys != null && missingKeys!.isNotEmpty) {
      buffer.write('\nMissing keys: ${missingKeys!.join(", ")}');
    }
    return buffer.toString();
  }
}

/// Exception for rate limiting errors
class RateLimitException implements Exception {
  final String message;
  final int? retryAfterSeconds;
  final int? currentCount;
  final int? limit;
  
  RateLimitException(
    this.message, {
    this.retryAfterSeconds,
    this.currentCount,
    this.limit,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('RateLimitException: $message');
    if (retryAfterSeconds != null) buffer.write(' | Retry after: ${retryAfterSeconds}s');
    if (currentCount != null && limit != null) {
      buffer.write(' | Usage: $currentCount/$limit');
    }
    return buffer.toString();
  }
}

/// Exception for order processing errors
class OrderProcessingException implements Exception {
  final String message;
  final String? orderId;
  final String? platform;
  final String? stage; // e.g., 'validation', 'pos_injection', 'acceptance'
  
  OrderProcessingException(
    this.message, {
    this.orderId,
    this.platform,
    this.stage,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('OrderProcessingException: $message');
    if (orderId != null) buffer.write(' [Order: $orderId]');
    if (platform != null) buffer.write(' [Platform: $platform]');
    if (stage != null) buffer.write(' [Stage: $stage]');
    return buffer.toString();
  }
}

/// Exception for menu synchronization errors
class MenuSyncException implements Exception {
  final String message;
  final String? storeId;
  final String? operation; // 'upload', 'download', 'update'
  final int? affectedItems;
  
  MenuSyncException(
    this.message, {
    this.storeId,
    this.operation,
    this.affectedItems,
  });
  
  @override
  String toString() {
    final buffer = StringBuffer('MenuSyncException: $message');
    if (storeId != null) buffer.write(' [Store: $storeId]');
    if (operation != null) buffer.write(' [Operation: $operation]');
    if (affectedItems != null) buffer.write(' | Affected items: $affectedItems');
    return buffer.toString();
  }
}