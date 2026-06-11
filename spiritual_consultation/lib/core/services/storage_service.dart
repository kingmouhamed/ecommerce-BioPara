import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class StorageService {
  final _supabase = Supabase.instance.client;
  static const String defaultBucket = 'chat_media';

  /// Generates a public URL for a given path.
  String getPublicUrl(String path, {String bucket = defaultBucket}) {
    return _supabase.storage.from(bucket).getPublicUrl(path);
  }

  /// Generates a signed URL for private access.
  Future<String> getSignedUrl(String path,
      {String bucket = defaultBucket, int expiresIn = 3600}) async {
    try {
      return await _supabase.storage
          .from(bucket)
          .createSignedUrl(path, expiresIn);
    } catch (e) {
      throw Exception('Could not access media: $e');
    }
  }

  /// Extracts the storage path from a full Supabase URL.
  /// Handles public URLs: /object/public/bucket/path
  /// Handles signed URLs: /object/sign/bucket/path
  String? extractPath(String url, {String bucket = defaultBucket}) {
    if (url.isEmpty) return null;
    
    // If it's already a relative path, return it as is
    if (!url.startsWith('http')) return url;

    try {
      final uri = Uri.tryParse(url);
      if (uri == null) return null;
      
      final segments = uri.pathSegments;
      // Identify the bucket name to find the starting point of the file path
      final int bucketIdx = segments.indexOf(bucket);
      
      if (bucketIdx >= 0 && bucketIdx < segments.length - 1) {
        // Skip all segments up to and including the bucket name
        return segments.skip(bucketIdx + 1).map(Uri.decodeComponent).join('/');
      }
    } catch (_) {}
    return null;
  }

  /// Helper to check if a string is a full URL or a relative path
  bool isFullUrl(String input) => input.startsWith('http');
}

final storageServiceProvider = Provider((ref) => StorageService());
