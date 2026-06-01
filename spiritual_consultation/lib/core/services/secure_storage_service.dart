// lib/core/services/secure_storage_service.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final secureStorageServiceProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

class SecureStorageService {
  final _storage = const FlutterSecureStorage();


  /// Write sensitive value
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Read sensitive value
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  /// Delete sensitive value
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  /// Clear all secure data
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
}
