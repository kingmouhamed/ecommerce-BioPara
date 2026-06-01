// lib/core/utils/app_logger.dart
import 'package:logger/logger.dart';

class AppLogger {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2, // number of method calls to be displayed
      errorMethodCount: 8, // number of method calls if stacktrace is provided
      lineLength: 80, // width of the output
      colors: true, // Colorful log messages
      printEmojis: true, // Print an emoji for each log message
      dateTimeFormat: DateTimeFormat.dateAndTime, // Show timestamp
    ),
  );

  /// Log info message
  static void i(String message) {
    _logger.i(message);
  }

  /// Log debug message
  static void d(String message) {
    _logger.d(message);
  }

  /// Log warning message
  static void w(String message) {
    _logger.w(message);
  }

  /// Log error message
  static void e(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error: error, stackTrace: stackTrace);
  }
}
