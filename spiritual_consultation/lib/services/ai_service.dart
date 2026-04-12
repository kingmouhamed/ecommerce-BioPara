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

    _model ??= GenerativeModel(
      model: 'gemini-2.0-flash',
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
      final historyContent = history.map((h) {
        return '${h['role'] == 'user' ? 'المريض' : 'المساعد'}: ${h['text']}';
      }).join('\n');

      final prompt = '''
أنت مساعد طبي روحاني تابع لعيادة BioPara. مهمتك أن تجمع معلومات المريض قبل جلسة الاستشارة.

التاريخ السابق:
$historyContent

رسالة المريض الجديدة: $userMessage

تعليمات:
- تكلم بالعربية فقط
- كن لطيفاً ومتعاطفاً
- اطرح سؤالاً واحداً فقط في كل رد
- الأسئلة تشمل: نوع المشكلة، المدة، الأدوية، الأعراض الجسدية، الحالة النفسية
- بعد 5 أسئلة قل: "شكراً، سأحيل معلوماتك للمعالج الآن 🌿"
- لا تعطي تشخيصاً طبياً أبداً
''';

      final response = await _gemini.generateContent([Content.text(prompt)]);
      return response.text ?? 'عذراً، حدث خطأ. حاول مجدداً.';
    } catch (e) {
      debugPrint('❌ Gemini Chatbot Error: $e');
      return '⚠️ خطأ هوش مصنوعی:\n$e';
    }
  }

  // ─────────────────────────────────────────────
  // 2. تحليل المشاعر - للمعالج فقط
  // ─────────────────────────────────────────────
  Future<SentimentReport> analyzeSentiment(String patientText) async {
    try {
      final prompt = '''
حلل النص التالي من مريض وأعطني تقرير نفسي مختصر بالعربية:

نص المريض:
"$patientText"

أجب بهذا التنسيق الدقيق (لا تضف أي نص إضافي):
SCORE: [رقم من 1 إلى 10، حيث 10 = توتر شديد]
MOOD: [متوتر / خائف / مكتئب / قلق / مستقر / في ضائقة]
SUMMARY: [جملة واحدة تصف الحالة النفسية]
ADVICE: [جملة واحدة تنصح المعالج كيف يتعامل مع هذا المريض]
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
      final conversationText = conversation
          .map((m) => '${m['role'] == 'user' ? 'المريض' : 'المساعد'}: ${m['text']}')
          .join('\n');

      final prompt = '''
بناءً على هذه المحادثة بين مساعد ذكي ومريض، أنشئ ملف موجز للمعالج:

$conversationText

أنشئ الملف بهذا الشكل:
📋 ملف المريض
━━━━━━━━━━━━━━
🔍 المشكلة الرئيسية: [اذكرها]
⏱️ المدة: [كم من الوقت]
💊 الأدوية الحالية: [إن وُجدت]
😰 الأعراض: [قائمة مختصرة]
🧠 الحالة النفسية: [وصف]
⚡ الأولوية: [عادية / متوسطة / عاجلة]
''';

      final response = await _gemini.generateContent([Content.text(prompt)]);
      return response.text ?? 'لم يتم توليد الملف.';
    } catch (e) {
      return 'خطأ في توليد الملف.';
    }
  }
}

/// نموذج تقرير تحليل المشاعر
class SentimentReport {
  final int score;        // 1-10
  final String mood;      // الحالة العاطفية
  final String summary;   // ملخص
  final String advice;    // نصيحة للمعالج

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

    return SentimentReport(score: score, mood: mood, summary: summary, advice: advice);
  }

  factory SentimentReport.empty() => const SentimentReport(
    score: 0, mood: 'غير متاح', summary: 'لم يتم التحليل', advice: '',
  );

  Color get moodColor {
    if (score >= 8) return const Color(0xFFD32F2F);   // أحمر - خطر
    if (score >= 6) return const Color(0xFFF57F17);   // برتقالي - تنبيه
    if (score >= 4) return const Color(0xFF1565C0);   // أزرق - متوسط
    return const Color(0xFF2E7D32);                    // أخضر - مستقر
  }

  String get moodEmoji {
    if (score >= 8) return '🔴';
    if (score >= 6) return '🟠';
    if (score >= 4) return '🔵';
    return '🟢';
  }
}
