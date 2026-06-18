// lib/core/config/app_config.dart
// ═══════════════════════════════════════════════════════════════════════
// Centralized secret/config resolution.
//
// Release builds MUST supply every key via --dart-define (see
// scripts/build_patient.sh / scripts/build_admin.sh). .env is never bundled
// into a release APK — it is only used as a developer convenience during
// `flutter run`, and only if it happens to be present on disk.
//
// Resolution order for each key: --dart-define value (if non-empty) → the
// in-memory .env value loaded by main() (if dotenv was loaded) → ''.
// ═══════════════════════════════════════════════════════════════════════
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  AppConfig._();

  static const String _supabaseUrl =
      String.fromEnvironment('SUPABASE_URL');
  static const String _supabaseAnonKey =
      String.fromEnvironment('SUPABASE_ANON_KEY');
  static const String _geminiApiKey =
      String.fromEnvironment('GEMINI_API_KEY');
  static const String _zegoAppId = String.fromEnvironment('ZEGO_APP_ID');
  static const String _zegoAppSign =
      String.fromEnvironment('ZEGO_APP_SIGN');
  static const String _firebaseApiKey =
      String.fromEnvironment('FIREBASE_API_KEY');
  static const String _firebaseProjectId =
      String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const String _firebaseMessagingSenderId =
      String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID');
  static const String _firebaseAppId =
      String.fromEnvironment('FIREBASE_APP_ID');
  static const String _firebaseMeasurementId =
      String.fromEnvironment('FIREBASE_MEASUREMENT_ID');

  static bool _dotenvLoaded = false;

  /// Loads `.env` if present on disk. Never throws — release builds simply
  /// won't have the asset bundled, and that's expected.
  static Future<void> tryLoadDotEnvForLocalDev() async {
    try {
      await dotenv.load(fileName: '.env');
      _dotenvLoaded = true;
    } catch (_) {
      // No .env bundled (release build) or file missing — rely on
      // --dart-define values only. This is the expected production path.
    }
  }

  static String _resolve(String dartDefineValue, String dotenvKey) {
    if (dartDefineValue.isNotEmpty) return dartDefineValue;
    return _dotenvLoaded ? (dotenv.env[dotenvKey] ?? '') : '';
  }

  static String get supabaseUrl => _resolve(_supabaseUrl, 'SUPABASE_URL');
  static String get supabaseAnonKey =>
      _resolve(_supabaseAnonKey, 'SUPABASE_ANON_KEY');
  static String get geminiApiKey =>
      _resolve(_geminiApiKey, 'GEMINI_API_KEY');
  static String get zegoAppId => _resolve(_zegoAppId, 'ZEGO_APP_ID');
  static String get zegoAppSign => _resolve(_zegoAppSign, 'ZEGO_APP_SIGN');
  static String get firebaseApiKey =>
      _resolve(_firebaseApiKey, 'FIREBASE_API_KEY');
  static String get firebaseProjectId =>
      _resolve(_firebaseProjectId, 'FIREBASE_PROJECT_ID');
  static String get firebaseMessagingSenderId =>
      _resolve(_firebaseMessagingSenderId, 'FIREBASE_MESSAGING_SENDER_ID');
  static String get firebaseAppId =>
      _resolve(_firebaseAppId, 'FIREBASE_APP_ID');
  static String get firebaseMeasurementId =>
      _resolve(_firebaseMeasurementId, 'FIREBASE_MEASUREMENT_ID');
}
