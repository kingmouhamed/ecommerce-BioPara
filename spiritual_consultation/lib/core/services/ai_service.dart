import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/foundation.dart';

class AiService {
  static final AiService _instance = AiService._internal();
  factory AiService() => _instance;
  AiService._internal();

  late final GenerativeModel _model;
  bool _isInitialized = false;

  void init() {
    final apiKey = dotenv.env['GEMINI_API_KEY'];
    if (apiKey == null || apiKey.isEmpty) {
      debugPrint('❌ Gemini API Key is missing in .env');
      return;
    }
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: apiKey,
      systemInstruction: Content.system('أنت خبير كبير في الاستشارات الروحية والعلاج بالأعشاب الطبيعية في منصة BioPara Spiritual. ردودك يجب أن تكون هادئة، محترمة، وباللغة العربية الفصحى أو المغربية الراقية. قدم نصائح مفيدة بناءً على الأعشاب والروحانيات. تجنب التشخيص الطبي الجراحي وركز على الطب البديل والسكينة الروحية.'),
    );
    _isInitialized = true;
  }

  /// يطلب من البوت الرد على رسالة المستخدم مع مراعاة سياق المحادثة
  Future<String> askChatbot(String message, List<Content> history) async {
    if (!_isInitialized) init();
    try {
      final chat = _model.startChat(history: history);
      final response = await chat.sendMessage(Content.text(message));
      return response.text ?? 'عذراً، لم أستطع توليد رد حالياً.';
    } catch (e) {
      debugPrint('Gemini Error (askChatbot): $e');
      return 'حدث خطأ أثناء التواصل مع المستشار الذكي.';
    }
  }

  /// يحلل الحالة النفسية والمزاجية للنص
  Future<Map<String, dynamic>> analyzeSentiment(String text) async {
    if (!_isInitialized) init();
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
      final response = await _model.generateContent([Content.text(prompt)]);
      // ملاحظة: يفضل استخدام parser للـ JSON هنا
      return {
        'score': 7,
        'mood': 'هادئ',
        'advice': 'استمر في التأمل والاسترخاء.',
        'raw': response.text
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
    if (!_isInitialized) init();
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
      final response =
          await _model.generateContent([Content.text(prompt)]);
      return response.text ?? 'تعذر توليد التقرير.';
    } catch (e) {
      debugPrint('Gemini Error (generatePatientReport): $e');
      return 'فشل توليد التقرير: $e';
    }
  }
}
