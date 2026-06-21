// lib/core/providers/chat_provider.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — مزود الدردشة مع stream محسّن
// ═══════════════════════════════════════════════════════════
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/message_model.dart';

class ChatNotifier extends StateNotifier<List<MessageModel>> {
  final String conversationId;
  final _supabase = Supabase.instance.client;
  RealtimeChannel? _channel;

  ChatNotifier(this.conversationId) : super([]) {
    _init();
  }

  Future<void> _init() async {
    if (conversationId.isEmpty) {
      debugPrint('⚠️ ChatNotifier: conversationId is empty. Skipping initialization.');
      return;
    }
    // 1. تحميل الرسائل الموجودة أولاً
    await _loadMessages();
    // 2. الاشتراك في التحديثات الفورية
    _subscribeRealtime();
  }

  /// تحميل الرسائل مرة واحدة من قاعدة البيانات
  Future<void> _loadMessages() async {
    if (conversationId.isEmpty) return;
    try {
      List<dynamic> data;
      try {
        data = await _supabase
            .from('messages')
            .select()
            .eq('conversation_id', conversationId)
            .eq('is_deleted', false)
            .order('created_at', ascending: false)
            .limit(200);
      } on PostgrestException catch (e) {
        if (e.code == '42703' || e.message.contains('is_deleted')) {
          // Column is_deleted doesn't exist yet in the DB schema, fallback to query without it
          data = await _supabase
              .from('messages')
              .select()
              .eq('conversation_id', conversationId)
              .order('created_at', ascending: false)
              .limit(200);
        } else {
          rethrow;
        }
      }

      state = data
          .map((m) => MessageModel.fromMap(m as Map<String, dynamic>))
          .toList();

      debugPrint('✅ Loaded ${state.length} messages for $conversationId');
    } catch (e) {
      debugPrint('❌ Load messages error: $e');
    }
  }

  /// الاشتراك في التحديثات الفورية عبر Realtime
  void _subscribeRealtime() {
    if (conversationId.isEmpty) return;
    _channel = _supabase
        .channel('messages:$conversationId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'conversation_id',
            value: conversationId,
          ),
          callback: (payload) {
            final newMsg = MessageModel.fromMap(payload.newRecord);
            // أضف الرسالة فقط إذا لم تكن موجودة
            if (!state.any((m) => m.id == newMsg.id)) {
              state = [newMsg, ...state];
              debugPrint('📩 New message received: ${newMsg.content.substring(0, newMsg.content.length.clamp(0, 30))}...');
            }
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.update,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'conversation_id',
            value: conversationId,
          ),
          callback: (payload) {
            final updatedMsg = MessageModel.fromMap(payload.newRecord);
            state = state.map((m) => m.id == updatedMsg.id ? updatedMsg : m).toList();
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.delete,
          schema: 'public',
          table: 'messages',
          callback: (payload) {
            final deletedId = payload.oldRecord['id']?.toString();
            if (deletedId != null) {
              state = state.where((m) => m.id != deletedId).toList();
            }
          },
        )
        .subscribe((status, [error]) {
          if (status == RealtimeSubscribeStatus.subscribed) {
            debugPrint('✅ Realtime subscribed for $conversationId');
          } else if (error != null) {
            debugPrint('❌ Realtime error: $error — falling back to polling');
            _startPolling();
          }
        });
  }

  /// إضافة رسالة محلياً لتحديث الواجهة فوراً
  void addMessageLocal(MessageModel message) {
    if (!state.any((m) => m.id == message.id)) {
      state = [message, ...state];
    }
  }

  /// إعادة تحميل الرسائل يدوياً
  Future<void> reloadMessages() async {
    await _loadMessages();
  }

  /// Polling كبديل إذا فشل Realtime
  void _startPolling() {
    Future.doWhile(() async {
      if (!mounted) return false;
      await Future.delayed(const Duration(seconds: 5));
      if (!mounted) return false;
      await _loadMessages();
      return mounted;
    });
  }

  /// تحديث حالة القراءة لرسالة
  Future<void> markAsRead(String messageId) async {
    try {
      await _supabase
          .from('messages')
          .update({'is_read': true, 'status': 'read'})
          .eq('id', messageId);
    } catch (e) {
      debugPrint('markAsRead error: $e');
    }
  }

  /// إضافة تفاعل (reaction) على رسالة
  Future<void> addReaction(String messageId, String emoji, String userId) async {
    final msg = state.firstWhere((m) => m.id == messageId, orElse: () => MessageModel(
      id: '', conversationId: '', senderId: '', content: '',
    ));
    if (msg.id.isEmpty) return;

    final currentReactions = Map<String, List<String>>.from(msg.reactions);
    final users = List<String>.from(currentReactions[emoji] ?? []);

    if (users.contains(userId)) {
      users.remove(userId);
    } else {
      users.add(userId);
    }

    if (users.isEmpty) {
      currentReactions.remove(emoji);
    } else {
      currentReactions[emoji] = users;
    }

    try {
      await _supabase
          .from('messages')
          .update({'reactions': currentReactions})
          .eq('id', messageId);
    } catch (e) {
      debugPrint('addReaction error: $e');
    }
  }

  /// حذف رسالة (للجميع)
  Future<void> deleteMessage(String id, {String? audioUrl}) async {
    if (audioUrl != null && audioUrl.isNotEmpty) {
      await _deleteFromStorage(audioUrl);
    }
    try {
      try {
        await _supabase
            .from('messages')
            .update({'is_deleted': true, 'content': 'تم حذف هذه الرسالة'})
            .eq('id', id);
      } on PostgrestException catch (e) {
        if (e.code == '42703' || e.message.contains('is_deleted')) {
          // Column is_deleted doesn't exist yet, fallback to updating content only
          await _supabase
              .from('messages')
              .update({'content': 'تم حذف هذه الرسالة'})
              .eq('id', id);
        } else {
          rethrow;
        }
      }
    } catch (e) {
      debugPrint('deleteMessage error: $e');
      rethrow;
    }
  }

  /// تعديل رسالة نصية
  Future<void> editMessage(String id, String newContent) async {
    try {
      await _supabase
          .from('messages')
          .update({'content': newContent, 'metadata': {'edited': true}})
          .eq('id', id);
    } catch (e) {
      debugPrint('editMessage error: $e');
    }
  }

  /// تفريغ المحادثة
  Future<void> clearChat() async {
    try {
      try {
        await _supabase
            .from('messages')
            .update({'is_deleted': true})
            .eq('conversation_id', conversationId);
      } on PostgrestException catch (e) {
        if (e.code == '42703' || e.message.contains('is_deleted')) {
          // Column is_deleted doesn't exist yet, physically delete the messages as a fallback
          await _supabase
              .from('messages')
              .delete()
              .eq('conversation_id', conversationId);
        } else {
          rethrow;
        }
      }
    } catch (e) {
      debugPrint('clearChat error: $e');
      rethrow;
    }
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

  @override
  void dispose() {
    _channel?.unsubscribe();
    super.dispose();
  }
}

final chatProvider =
    StateNotifierProvider.family<ChatNotifier, List<MessageModel>, String>(
  (ref, id) => ChatNotifier(id),
);