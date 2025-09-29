class CoreServiceException implements Exception {
  final String message;
  CoreServiceException(this.message);
  @override
  String toString() => 'CoreServiceException: $message';
}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);
  @override
  String toString() => 'ValidationException: $message';
}

class UberEatsApiException implements Exception {
  final String message;
  UberEatsApiException(this.message);
  @override
  String toString() => 'UberEatsApiException: $message';
}
