// class CoreServiceException implements Exception {
//   final String message;
//   CoreServiceException(this.message);
//   @override
//   String toString() => 'CoreServiceException: $message';
// }

// class ValidationException implements Exception {
//   final String message;
//   ValidationException(this.message);
//   @override
//   String toString() => 'ValidationException: $message';
// }

// class UberEatsApiException implements Exception {
//   final String message;
//   UberEatsApiException(this.message);
//   @override
//   String toString() => 'UberEatsApiException: $message';
// }



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
  final int? statusCode;
  final String? responseBody;

  UberEatsApiException(
    this.message, {
    this.statusCode,
    this.responseBody,
  });

  @override
  String toString() {
    final buffer = StringBuffer('UberEatsApiException: $message');
    if (statusCode != null) buffer.write(' (statusCode: $statusCode)');
    if (responseBody != null) buffer.write(' Response: $responseBody');
    return buffer.toString();
  }
}


