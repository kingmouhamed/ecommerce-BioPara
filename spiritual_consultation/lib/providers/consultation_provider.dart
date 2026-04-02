import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/message.dart';
import '../services/gemini_service.dart';

// مزود الاستشارات
final consultationProvider =
    StateNotifierProvider<ConsultationNotifier, List<Message>>((ref) {
      return ConsultationNotifier();
    });

// مزود حالة التحميل
final isConsultationLoadingProvider =
    StateNotifierProvider<IsLoadingNotifier, bool>((ref) {
      return IsLoadingNotifier();
    });

// مزود خدمة Gemini
final geminiServiceProvider = Provider((ref) {
  return GeminiService();
});

// مزود قاعدة البيانات
final supabaseProvider = Provider((ref) {
  return Supabase.instance.client;
});

class IsLoadingNotifier extends StateNotifier<bool> {
  IsLoadingNotifier() : super(false);

  void setLoading(bool isLoading) {
    state = isLoading;
  }
}

class ConsultationNotifier extends StateNotifier<List<Message>> {
  ConsultationNotifier() : super([]);

  /// ** إضافة رسالة المستخدم **
  void addUserMessage(String content) {
    final message = Message(
      content: content,
      isAgent: false,
      createdAt: DateTime.now(),
    );
    state = [...state, message];
  }

  /// ** إضافة رد الذكاء الاصطناعي **
  void addAgentMessage(String content, String? recommendedProductId) {
    final message = Message(
      content: content,
      isAgent: true,
      recommendedProductId: recommendedProductId,
      createdAt: DateTime.now(),
    );
    state = [...state, message];
  }

  /// ** مسح جميع الرسائل **
  void clearMessages() {
    state = [];
  }

  /// ** جلب الرسائل السابقة من Supabase **
  Future<void> loadPreviousMessages(String consultationId) async {
    try {
      final supabase = Supabase.instance.client;

      final response = await supabase
          .from('messages')
          .select()
          .eq('consultation_id', consultationId)
          .order('created_at', ascending: true);

      final messages = response
          .map((m) => Message.fromMap(m))
          .toList();

      state = messages;
    } catch (e) {
      debugPrint('❌ خطأ في جلب الرسائل: $e');
    }
  }

  /// ** حفظ الرسالة في قاعدة البيانات **
  Future<void> saveMessageToDatabase(
    String consultationId,
    String userId,
    String content,
    bool isAgent,
    String? recommendedProductId,
  ) async {
    try {
      final supabase = Supabase.instance.client;

      await supabase.from('messages').insert({
        'consultation_id': consultationId,
        'user_id': userId,
        'content': content,
        'is_agent': isAgent,
        'recommended_product_id': recommendedProductId,
        'created_at': DateTime.now().toIso8601String(),
      });

      debugPrint('✅ تم حفظ الرسالة بنجاح');
    } catch (e) {
      debugPrint('❌ خطأ في حفظ الرسالة: $e');
    }
  }
}
