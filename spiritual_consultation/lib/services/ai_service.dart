import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

/// خدمة الذكاء الاصطناعي المركزية - تستخدم Gemini API
class AiService {
  static AiService? _instance;
  static AiService get instance => _instance ??= AiService._();
  AiService._();

  GenerativeModel? _model;

  GenerativeModel get _gemini {
    final apiKey = (dotenv.env['GEMINI_API_KEY'] ?? '').trim();
    if (apiKey.isEmpty) {
      throw Exception('❌ خطأ: مفتاح Gemini API غير موجود في ملف .env');
    }

    // نستخدم إصدار 1.5 flash لأنه الأكثر استقراراً ويوفر حصة مجانية أكبر
    _model ??= GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: apiKey,
    );
    return _model!;
  }

  // ─────────────────────────────────────────────
  // 1. المساعد الذكي - سؤال واحد في كل مرة
  // ─────────────────────────────────────────────
  Future<String> askChatbot(String userMessage, List<Map<String, String>> history) async {
    if (userMessage.trim().isEmpty) {
      return '⚠️ المرجو كتابة رسالة قبل الإرسال.';
    }

    try {
      final historyContent = history.take(10).map((h) {
        return '${h['role'] == 'user' ? 'المريض' : 'المساعد'}: ${h['text']}';
      }).join('\n');

      final prompt = '''
أنت مساعد طبي روحاني تابع لعيادة BioPara. مهمتك أن تجمع معلومات المريض قبل جلسة الاستشارة.

التاريخ السابق:
$historyContent

رسالة المريض الجديدة: $userMessage

تعليمات هامة:
- تكلم بالعربية فقط وبلهجة لطيفة.
- اطرح سؤالاً واحداً فقط في كل رد.
- ركز على: (نوع المشكلة، مدتها، الأدوية، الأعراض الجسدية، الحالة النفسية).
- بعد جمع ما يكفي من المعلومات قل: "شكراً لك، لقد جمعت التفاصيل اللازمة وسأحيل ملفك للمعالج الآن لبدء الجلسة 🌿".
- لا تعطي نصائح طبية أو تشخيصات.
''';

      final response = await _gemini.generateContent([Content.text(prompt)]);
      return response.text ?? 'عذراً، لم أستطع فهم ذلك بشكل صحيح. هل يمكنك التوضيح أكثر؟';
    } catch (e) {
      debugPrint('❌ Gemini Chatbot Error: $e');
      
      // معالجة ذكية لخطأ القوطة (Quota) والضغط على السيرفر
      final errorStr = e.toString().toLowerCase();
      if (errorStr.contains('quota') || 
          errorStr.contains('429') || 
          errorStr.contains('limit') ||
          errorStr.contains('exhausted')) {
        return '🌿 شكراً لتواصلك. المساعد الذكي مشغول حالياً في معالجة طلبات أخرى. يمكنك الانتظار قليلاً أو الضغط على "تخطى" في الأعلى للتحدث مع المعالج مباشرة.';
      }
      
      return '⚠️ عذراً، حدث اضطراب بسيط في الاتصال. يرجى المحاولة مرة أخرى بعد قليل.';
    }
  }

  // ─────────────────────────────────────────────
  // 2. تحليل المشاعر - للمعالج فقط
  // ─────────────────────────────────────────────
  Future<SentimentReport> analyzeSentiment(String patientText) async {
    if (patientText.isEmpty) return SentimentReport.empty();
    
    try {
      final prompt = '''
حلل النص التالي من مريض وأعطني تقرير نفسي مختصر بالعربية:
"$patientText"

أجب بهذا التنسيق الدقيق:
SCORE: [رقم من 1 إلى 10]
MOOD: [الحالة النفسية]
SUMMARY: [وصف مختصر]
ADVICE: [نصيحة للمعالج]
''';

      final response = await _gemini.generateContent([Content.text(prompt)]);
      final text = response.text ?? '';
      return SentimentReport.parse(text);
    } catch (e) {
      debugPrint('❌ Gemini Sentiment Error: $e');
      return SentimentReport.empty();
    }
  }

  // ─────────────────────────────────────────────
  // 3. توليد ملف المريض للمعالج
  // ─────────────────────────────────────────────
  Future<String> generatePatientReport(List<Map<String, String>> conversation) async {
    try {
      final conversationText = conversation.take(20)
          .map((m) => '${m['role'] == 'user' ? 'المريض' : 'المساعد'}: ${m['text']}')
          .join('\n');

      final prompt = '''
لخص هذه المحادثة في ملف مريض مهني للمعالج:
$conversationText
''';

      final response = await _gemini.generateContent([Content.text(prompt)]);
      return response.text ?? 'تعذر تلخيص المحادثة حالياً.';
    } catch (e) {
      return 'المحادثة متاحة للمعالج للمراجعة اليدوية.';
    }
  }
}

/// نموذج تقرير تحليل المشاعر
class SentimentReport {
  final int score;
  final String mood;
  final String summary;
  final String advice;

  const SentimentReport({
    required this.score,
    required this.mood,
    required this.summary,
    required this.advice,
  });

  factory SentimentReport.parse(String text) {
    int score = 5;
    String mood = 'غير محدد';
    String summary = '';
    String advice = '';

    try {
      for (final line in text.split('\n')) {
        if (line.startsWith('SCORE:')) {
          score = int.tryParse(line.replaceAll('SCORE:', '').trim()) ?? 5;
        } else if (line.startsWith('MOOD:')) {
          mood = line.replaceAll('MOOD:', '').trim();
        } else if (line.startsWith('SUMMARY:')) {
          summary = line.replaceAll('SUMMARY:', '').trim();
        } else if (line.startsWith('ADVICE:')) {
          advice = line.replaceAll('ADVICE:', '').trim();
        }
      }
    } catch (_) {}

    return SentimentReport(score: score, mood: mood, summary: summary, advice: advice);
  }

  factory SentimentReport.empty() => const SentimentReport(
    score: 0, mood: 'غير متاح', summary: 'لم يتم التحليل', advice: '',
  );

  Color get moodColor {
    if (score >= 8) return const Color(0xFFD32F2F);
    if (score >= 6) return const Color(0xFFF57F17);
    if (score >= 4) return const Color(0xFF1565C0);
    return const Color(0xFF2E7D32);
  }

  String get moodEmoji {
    if (score >= 8) return '🔴';
    if (score >= 6) return '🟠';
    if (score >= 4) return '🔵';
    return '🟢';
  }
}
