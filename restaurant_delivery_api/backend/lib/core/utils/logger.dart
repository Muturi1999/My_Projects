class Logger {
  void info(String message) {
    print("[INFO] $message");
  }

  void error(String message, {required Object error, required StackTrace stackTrace}) {
    print("[ERROR] $message");
  }

  void warning(String s) {}
}
