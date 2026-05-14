import 'dart:typed_data';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

abstract class ChatUploadState { const ChatUploadState(); }
class ChatUploadIdle    extends ChatUploadState { const ChatUploadIdle(); }
class ChatUploadLoading extends ChatUploadState { const ChatUploadLoading(); }
class ChatUploadSuccess extends ChatUploadState { final String url; const ChatUploadSuccess(this.url); }
class ChatUploadError   extends ChatUploadState { final String message; const ChatUploadError(this.message); }

class ChatUploadNotifier extends StateNotifier<ChatUploadState> {
  ChatUploadNotifier() : super(const ChatUploadIdle());

  final _supabase = Supabase.instance.client;

  Future<String?> uploadBytes(Uint8List bytes, String extension, {String folder = 'audio'}) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) {
      state = const ChatUploadError('User not authenticated');
      return null;
    }

    state = const ChatUploadLoading();
    try {
      final name = '${DateTime.now().millisecondsSinceEpoch}$extension';
      final path = '$userId/$folder/$name';
      
      // Determine content type based on folder and extension
      String contentType = _getContentType(folder, extension);
      
      await _supabase.storage.from('chat_media').uploadBinary(
        path, 
        bytes,
        fileOptions: FileOptions(contentType: contentType, upsert: true),
      );

      // We return the path for better flexibility with RLS/Private buckets
      // But for backward compatibility with existing UI, we can still provide the Public URL
      // if the bucket is intended to be accessed that way, or a path if we want to handle signing later.
      final publicUrl = _supabase.storage.from('chat_media').getPublicUrl(path);
      state = ChatUploadSuccess(publicUrl);
      return publicUrl;
    } catch (e) {
      state = ChatUploadError('Upload failed: $e');
      return null;
    }
  }

  String _getContentType(String folder, String extension) {
    if (folder == 'audio') return extension == '.m4a' ? 'audio/mp4' : 'audio/mpeg';
    if (folder == 'images') return 'image/jpeg';
    if (folder == 'documents') {
      if (extension == '.pdf') return 'application/pdf';
      if (extension == '.doc' || extension == '.docx') return 'application/msword';
    }
    return 'application/octet-stream';
  }

  void reset() => state = const ChatUploadIdle();
}

final chatUploadProvider =
    StateNotifierProvider<ChatUploadNotifier, ChatUploadState>(
  (_) => ChatUploadNotifier(),
);
