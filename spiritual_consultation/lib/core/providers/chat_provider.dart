import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/message_model.dart';

class ChatNotifier extends StateNotifier<List<MessageModel>> {
  final String conversationId;
  final _supabase = Supabase.instance.client;

  ChatNotifier(this.conversationId) : super([]) {
    _subscribe();
  }

  void _subscribe() {
    _supabase
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', conversationId)
        .order('created_at', ascending: false)
        .listen((data) {
          state = data
              .map((m) => MessageModel.fromMap(m))
              .toList();
        }, onError: (error) {
          // Handle stream error gracefully (e.g., timeout or channel error)
          debugPrint('Supabase Stream Error ($conversationId): $error');
        });
  }

  Future<void> clearChat() async {
    final audios = await _supabase
        .from('messages')
        .select('content')
        .eq('conversation_id', conversationId)
        .eq('message_type', 'audio');

    for (final m in (audios as List)) {
      await _deleteFromStorage(m['content']?.toString() ?? '');
    }
    
    final res = await _supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)
        .select();
        
    if (res.isEmpty) throw Exception('Ù‚اعدة Ø§Ù„Ø¨ÙŠØ§Ù†ات رفضت الحذف (Ù‚د ØªÙƒÙˆÙ† Ø§Ù„Ù…Ø´Ùƒلة ÙÙŠ الصلاحيات RLS)');
  }

  Future<void> deleteMessage(String id, {String? audioUrl}) async {
    if (audioUrl != null && audioUrl.isNotEmpty) await _deleteFromStorage(audioUrl);
    
    final res = await _supabase.from('messages').delete().eq('id', id).select();
    if (res.isEmpty) throw Exception('لم يتم الحذف Ù…Ù† Ù‚اعدة Ø§Ù„Ø¨ÙŠØ§Ù†ات (صلاحيات RLS ØªÙ…Ù†ع ذلك)');
  }

  Future<void> _deleteFromStorage(String url) async {
    try {
      final uri = Uri.tryParse(url);
      if (uri == null) return;
      final segments = uri.pathSegments;
      final idx = segments.indexOf('chat_media');
      if (idx == -1) return;
      final path = segments.skip(idx + 1).join('/');
      await _supabase.storage.from('chat_media').remove([path]);
    } catch (_) {}
  }
}

final chatProvider =
    StateNotifierProvider.family<ChatNotifier, List<MessageModel>, String>(
  (ref, id) => ChatNotifier(id),
);
