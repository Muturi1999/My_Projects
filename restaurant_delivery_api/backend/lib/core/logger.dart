// // // // lib/core/logger.dart

// // // /// Simple logger implementation
// // // class Logger {
// // //   final String name;

// // //   Logger(this.name);

// // //   /// Factory method to create a logger
// // //   static Logger create(String name) {
// // //     return Logger(name);
// // //   }

// // //   void info(String message) {
// // //     _log('INFO', message);
// // //   }

// // //   void error(String message, {Object? error, StackTrace? stackTrace}) {
// // //     _log('ERROR', message);
// // //     if (error != null) {
// // //       print('  Error: $error');
// // //     }
// // //     if (stackTrace != null) {
// // //       print('  StackTrace: $stackTrace');
// // //     }
// // //   }

// // //   void warning(String message) {
// // //     _log('WARNING', message);
// // //   }

// // //   void debug(String message) {
// // //     _log('DEBUG', message);
// // //   }

// // //   void _log(String level, String message) {
// // //     final timestamp = DateTime.now().toIso8601String();
// // //     print('[$timestamp] [$level] [$name] $message');
// // //   }
// // // }

// // // lib/core/logger.dart

// // /// Simple logger implementation
// // class Logger {
// //   final String name;

// //   Logger(this.name);

// //   /// Factory method to create a logger
// //   static Logger create(String name) {
// //     return Logger(name);
// //   }

// //   void info(String message) {
// //     _log('INFO', message);
// //   }

// //   void error(String message, {Object? error, StackTrace? stackTrace}) {
// //     _log('ERROR', message);
// //     if (error != null) {
// //       print('  Error: $error');
// //     }
// //     if (stackTrace != null) {
// //       print('  StackTrace: $stackTrace');
// //     }
// //   }

// //   void warning(String message) {
// //     _log('WARNING', message);
// //   }

// //   void debug(String message) {
// //     _log('DEBUG', message);
// //   }

// //   void _log(String level, String message) {
// //     final timestamp = DateTime.now().toIso8601String();
// //     print('[$timestamp] [$level] [$name] $message');
// //   }
// // }

// // lib/core/logger.dart

// /// Simple logger implementation
// class Logger {
//   final String name;

//   Logger(this.name, {required level});

//   /// Factory method to create a logger
//   static Logger create(String name) {
//     return Logger(name);
//   }

//   void info(String message) {
//     _log('INFO', message);
//   }

//   void error(String message, {Object? error}) {
//     _log('ERROR', message);
//     if (error != null) {
//       print('  Error: $error');
//     }
//   }

//   void warning(String message) {
//     _log('WARNING', message);
//   }

//   void debug(String message) {
//     _log('DEBUG', message);
//   }

//   void _log(String level, String message) {
//     final timestamp = DateTime.now().toIso8601String();
//     print('[$timestamp] [$level] [$name] $message');
//   }
// }

// lib/core/logger.dart

/// Simple logger implementation
class Logger {
  final String name;

  Logger(this.name);

  /// Factory method to create a logger
  static Logger create(String name) {
    return Logger(name);
  }

  void info(String message) {
    _log('INFO', message);
  }

  void error(String message, {Object? error, StackTrace? stackTrace}) {
    _log('ERROR', message);
    if (error != null) {
      print('  Error: $error');
    }
    if (stackTrace != null) {
      print('  StackTrace: $stackTrace');
    }
  }

  void warning(String message) {
    _log('WARNING', message);
  }

  void debug(String message) {
    _log('DEBUG', message);
  }

  void _log(String level, String message) {
    final timestamp = DateTime.now().toIso8601String();
    print('[$timestamp] [$level] [$name] $message');
  }
}
