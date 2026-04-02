import 'package:flutter/foundation.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class GeminiService {
  static final String _geminiApiKey = dotenv.env['GEMINI_API_KEY'] ?? '';

  late final GenerativeModel _model;

  GeminiService() {
    if (_geminiApiKey.isEmpty) {
      throw Exception('GEMINI_API_KEY not found in .env');
    }
    _model = GenerativeModel(
      model: 'gemini-1.5-flash', // أسرع وأوفر من gemini-pro
      apiKey: _geminiApiKey,
      safetySettings: [
        SafetySetting(HarmCategory.dangerousContent, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.harassment, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.hateSpeech, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.sexuallyExplicit, HarmBlockThreshold.none),
      ],
      generationConfig: GenerationConfig(
        temperature: 0.7,
        maxOutputTokens: 500,
      ),
    );
  }

  /// نظام الاستشارة الذكي: يرسل سؤال المستخدم + قائمة المنتجات لـ Gemini
  /// ويعيد: { 'consultation': String, 'recommendedProduct': Map?, 'success': bool }
  Future<Map<String, dynamic>> getSmartConsultation({
    required String userMessage,
    required List<Map<String, dynamic>> products,
  }) async {
    try {
      final productsContext = _buildProductsContext(products);

      final systemPrompt =
          '''أنت خبير استشارة صحية وروحية في منصة BioPara المتخصصة في المنتجات الطبيعية.

**المنتجات المتاحة لديك في المخزون:**
$productsContext

**تعليماتك الصارمة:**
1. استمع جيداً لمشكلة المستخدم
2. قدّم استشارة علمية مختصرة (2-3 أسطر) باللغة العربية
3. اقترح المنتج الأنسب من القائمة أعلاه (فقط من المنتجات المذكورة)
4. اشرح سبب اختيار هذا المنتج

**صيغة الرد المطلوبة (التزم بها تماماً):**
[رد الاستشارة هنا]
[PRODUCT_RECOMMENDATION: اسم_المنتج_بالضبط_كما_هو_في_القائمة]

**مثال:**
المستخدم: أعاني من إرهاق مستمر وتعب جسدي.
ردك: الإرهاق المستمر غالباً ناتج عن نقص البروتين والمعادن الأساسية. ينصح بتناول بروتين مكمّل مع نظام غذائي متوازن وراحة كافية. منتج Biotein الطبيعي سيساعدك في استعادة طاقتك بفضل احتوائه على البروتينات الأساسية.
[PRODUCT_RECOMMENDATION: Biotein]''';

      final response = await _model.generateContent([
        Content.text('$systemPrompt\n\n**سؤال المستخدم:** $userMessage'),
      ]);

      final responseText = response.text ?? '';

      if (responseText.isEmpty) {
        return {
          'consultation':
              'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مجدداً.',
          'recommendedProduct': null,
          'success': false,
        };
      }

      final recommendedProduct = _extractProductRecommendation(
        responseText,
        products,
      );
      final cleanResponse = _cleanResponse(responseText);

      return {
        'consultation': cleanResponse,
        'recommendedProduct': recommendedProduct,
        'success': true,
      };
    } catch (e) {
      debugPrint('❌ Gemini Error: $e');
      return {
        'consultation':
            'عذراً، حدث خطأ في معالجة طلبك. يرجى التحقق من الاتصال بالإنترنت والمحاولة لاحقاً.',
        'recommendedProduct': null,
        'success': false,
        'error': e.toString(),
      };
    }
  }

  /// بناء نص السياق من قائمة المنتجات
  String _buildProductsContext(List<Map<String, dynamic>> products) {
    if (products.isEmpty) return 'لا توجد منتجات متاحة حالياً.';

    return products
        .asMap()
        .entries
        .map((entry) {
          final p = entry.value;
          final name = p['name'] ?? 'منتج';
          final nameAr = p['name_ar'] != null ? ' (${p['name_ar']})' : '';
          final desc = p['description'] ?? '';
          final price = p['price']?.toString() ?? '0';
          final shortDesc = desc.length > 80
              ? '${desc.substring(0, 80)}...'
              : desc;
          return '- $name$nameAr: $shortDesc | السعر: $price د.م';
        })
        .join('\n');
  }

  /// استخراج المنتج الموصى به من رد Gemini
  Map<String, dynamic>? _extractProductRecommendation(
    String response,
    List<Map<String, dynamic>> products,
  ) {
    try {
      final pattern = RegExp(
        r'\[PRODUCT_RECOMMENDATION:\s*(.+?)\]',
        caseSensitive: false,
      );
      final match = pattern.firstMatch(response);

      if (match == null) return null;

      final extractedName = match.group(1)?.trim() ?? '';
      if (extractedName.isEmpty) return null;

      // ابحث عن أدق تطابق في المنتجات
      Map<String, dynamic>? found;
      int bestScore = 0;

      for (final product in products) {
        final name = (product['name'] as String? ?? '').toLowerCase();
        final nameAr = (product['name_ar'] as String? ?? '').toLowerCase();
        final extracted = extractedName.toLowerCase();

        int score = 0;
        if (name == extracted || nameAr == extracted) {
          score = 3; // تطابق كامل
        } else if (name.contains(extracted) || nameAr.contains(extracted)) {
          score = 2; // تطابق جزئي
        } else if (extracted.contains(name) || extracted.contains(nameAr)) {
          score = 1;
        }

        if (score > bestScore) {
          bestScore = score;
          found = product;
        }
      }

      return bestScore > 0 ? found : null;
    } catch (e) {
      debugPrint('Error extracting product: $e');
      return null;
    }
  }

  /// تنظيف الرد وإزالة أكواد الاقتراح
  String _cleanResponse(String response) {
    return response
        .replaceAll(RegExp(r'\[PRODUCT_RECOMMENDATION:.*?\]'), '')
        .trim();
  }

  /// تحليل سريع للكلمات المفتاحية (للاستخدام المساعد)
  List<Map<String, dynamic>> findRelatedProducts(
    String keyword,
    List<Map<String, dynamic>> allProducts,
  ) {
    final cleanKeyword = keyword.toLowerCase().trim();
    return allProducts.where((p) {
      final name = (p['name'] as String? ?? '').toLowerCase();
      final nameAr = (p['name_ar'] as String? ?? '').toLowerCase();
      final description = (p['description'] as String? ?? '').toLowerCase();
      final category = (p['category'] as String? ?? '').toLowerCase();
      return name.contains(cleanKeyword) ||
          nameAr.contains(cleanKeyword) ||
          description.contains(cleanKeyword) ||
          category.contains(cleanKeyword);
    }).toList();
  }
}
