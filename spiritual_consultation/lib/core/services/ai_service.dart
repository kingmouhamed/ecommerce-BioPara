import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/foundation.dart';

class AiService {
  static final AiService _instance = AiService._internal();
  factory AiService() => _instance;
  AiService._internal();

  int _currentModelIndex = 0;

  /// يريّح الاتصال ويفحص النماذج البديلة تلقائياً في حالة تعذر تشغيل النموذج الافتراضي
  Future<T> _runWithFallback<T>(Future<T> Function(GenerativeModel model) action) async {
    final apiKey = dotenv.env['GEMINI_API_KEY'];
    if (apiKey == null || apiKey.isEmpty) {
      throw Exception('Gemini API Key is missing in .env');
    }

    final candidateModels = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-pro-latest',
    ];

    if (_currentModelIndex >= candidateModels.length) {
      _currentModelIndex = 0;
    }

    while (_currentModelIndex < candidateModels.length) {
      final modelName = candidateModels[_currentModelIndex];
      final model = GenerativeModel(
        model: modelName,
        apiKey: apiKey,
        systemInstruction: Content.system('أنت خبير كبير في الاستشارات الروحية والعلاج بالأعشاب الطبيعية في منصة BioPara Spiritual. ردودك يجب أن تكون هادئة، محترمة، وباللغة العربية الفصحى أو المغربية الراقية. قدم نصائح مفيدة بناءً على الأعشاب والروحانيات. تجنب التشخيص الطبي الجراحي وركز على الطب البديل والسكينة الروحية.'),
      );

      try {
        return await action(model);
      } catch (e) {
        final errStr = e.toString().toLowerCase();
        if (errStr.contains('not found') ||
            errStr.contains('not supported') ||
            errStr.contains('404') ||
            errStr.contains('deprecated') ||
            errStr.contains('model')) {
          debugPrint('⚠️ Gemini model "$modelName" failed or not found. Trying fallback...');
          _currentModelIndex++;
          if (_currentModelIndex >= candidateModels.length) {
            rethrow;
          }
        } else {
          rethrow;
        }
      }
    }
    throw Exception('All Gemini candidate models failed to load.');
  }

  /// يطلب من البوت الرد على رسالة المستخدم مع مراعاة سياق المحادثة
  Future<String> askChatbot(String message, List<Content> history) async {
    try {
      return await _runWithFallback((model) async {
        final chat = model.startChat(history: history);
        final response = await chat.sendMessage(Content.text(message));
        return response.text ?? 'عذراً، لم أستطع توليد رد حالياً.';
      });
    } catch (e) {
      debugPrint('Gemini Error (askChatbot): $e');
      return 'حدث خطأ أثناء التواصل مع المستشار الذكي.';
    }
  }

  /// يحلل الحالة النفسية والمزاجية للنص
  Future<Map<String, dynamic>> analyzeSentiment(String text) async {
    try {
      final prompt = '''
      حلل النص التالي من منظور استشارة روحية وطبية عشبية:
      "$text"
      أعطني النتيجة بتنسيق JSON حصراً كالتالي:
      {
        "score": (رقم من 1-10 يمثل الحالة الإيجابية),
        "mood": (كلمة تصف المزاج باللغة العربية),
        "advice": (نصيحة روحية قصيرة بناءً على المزاج)
      }
      ''';

      final responseText = await _runWithFallback((model) async {
        final response = await model.generateContent([Content.text(prompt)]);
        return response.text ?? '';
      });

      String cleanJson = responseText;
      if (cleanJson.contains('```')) {
        final regExp = RegExp(r'```(?:json)?\s*([\s\S]*?)\s*```');
        final match = regExp.firstMatch(cleanJson);
        if (match != null) {
          cleanJson = match.group(1) ?? cleanJson;
        }
      }
      cleanJson = cleanJson.trim();

      final Map<String, dynamic> parsed = jsonDecode(cleanJson);
      return {
        'score': int.tryParse(parsed['score']?.toString() ?? '7') ?? 7,
        'mood': parsed['mood']?.toString() ?? 'هادئ',
        'advice': parsed['advice']?.toString() ?? 'استمر في التأمل والاسترخاء.',
        'raw': responseText
      };
    } catch (e) {
      debugPrint('Gemini Error (analyzeSentiment): $e');
      return {'score': 5, 'mood': 'غير محدد', 'advice': 'يرجى المحاولة لاحقاً.'};
    }
  }

  /// يولد تقريراً طبياً احترافياً شاملاً بناءً على محادثة الاستشارة
  Future<String> generatePatientReport(
    String conversation, {
    required String patientName,
  }) async {
    try {
      final prompt = '''
أنت مساعد طبي متخصص في الأعشاب والطب التقليدي المغربي.
بناءً على محادثة الاستشارة التالية مع المريض "$patientName"،
أنشئ تقريراً طبياً احترافياً باللغة العربية يتضمن:

1. **ملخص الحالة**: الشكوى الرئيسية وتفاصيلها
2. **الأعراض المذكورة**: قائمة منظمة بكل الأعراض
3. **التشخيص المقترح**: بناءً على الأعشاب والطب التقليدي
4. **برنامج العلاج**: الأعشاب والمنتجات الموصى بها مع الجرعات
5. **التوصيات**: نصائح لتحسين الحالة
6. **المتابعة**: متى يجب الرجوع للاستشارة

المحادثة:
$conversation

ملاحظة: التقرير للاستخدام الداخلي فقط من قبل المستشار.
''';

      return await _runWithFallback((model) async {
        final response = await model.generateContent([Content.text(prompt)]);
        return response.text ?? 'تعذر توليد التقرير.';
      });
    } catch (e) {
      debugPrint('Gemini Error (generatePatientReport): $e');
      return 'فشل توليد التقرير: $e';
    }
  }
}
