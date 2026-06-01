// lib/core/services/cache_service.dart
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/app_logger.dart';

final cacheServiceProvider = Provider<CacheService>((ref) {
  return CacheService();
});

class CacheService {
  static const String _boxName = 'biopara_cache';
  late Box _box;

  /// Initialize Hive NoSQL local database
  Future<void> init() async {
    try {
      await Hive.initFlutter();
      _box = await Hive.openBox(_boxName);
      AppLogger.i('✅ Hive Caching Database initialized successfully!');
    } catch (e) {
      AppLogger.e('❌ Hive Initialization failed', e);
    }
  }

  /// Write cache data
  Future<void> put(String key, dynamic value) async {
    await _box.put(key, value);
  }

  /// Read cache data
  dynamic get(String key, {dynamic defaultValue}) {
    return _box.get(key, defaultValue: defaultValue);
  }

  /// Delete cache key
  Future<void> delete(String key) async {
    await _box.delete(key);
  }

  /// Clear all cache data
  Future<void> clear() async {
    await _box.clear();
  }
}
