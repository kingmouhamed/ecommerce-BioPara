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
    if (userId == null) { state = const ChatUploadError('غير مسجل دخول'); return null; }

    state = const ChatUploadLoading();
    try {
      final name = '${DateTime.now().millisecondsSinceEpoch}$extension';
      final path = '$userId/$folder/$name';
      
      // تحديد نوع الملف لضمان عمله على الويب
      String contentType = 'application/octet-stream';
      if (folder == 'audio') {
        contentType = extension == '.m4a' ? 'audio/mp4' : 'audio/mpeg';
      } else if (folder == 'images') {
        contentType = 'image/jpeg';
      }
      
      await _supabase.storage.from('chat_media').uploadBinary(
        path, 
        bytes,
        fileOptions: FileOptions(contentType: contentType, upsert: true),
      );

      final url = _supabase.storage.from('chat_media').getPublicUrl(path);
      state = ChatUploadSuccess(url);
      return url;
    } catch (e) {
      state = ChatUploadError('$e');
      return null;
    }
  }

  void reset() => state = const ChatUploadIdle();
}

final chatUploadProvider =
    StateNotifierProvider<ChatUploadNotifier, ChatUploadState>(
  (_) => ChatUploadNotifier(),
);
