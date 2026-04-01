import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AgentLogic {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// **NEW: Fetch herbal products from BioPara products table**
  Future<List<Map<String, dynamic>>> fetchHerbalProducts({
    int limit = 10,
  }) async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .ilike('name', '%عشب%') // Arabic herbal
          .or(
            'name.ilike.%herb%,name.ilike.%herbal%,name.ilike.%tea%,category.eq.herbal',
          )
          .limit(limit)
          .order('name');
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('Error fetching herbal products: $e');
      return [];
    }
  }

  /// Fetch a herbal product recommendation based on keywords in the chat context
  Future<Map<String, dynamic>?> recommendProduct(String keyword) async {
    try {
      final response = await _supabase
          .from('products')
          .select()
          .ilike('name', '%$keyword%')
          .limit(1)
          .maybeSingle();
      return response;
    } catch (e) {
      debugPrint('Error fetching recommendation for keyword $keyword: $e');
      return null;
    }
  }

  /// Analyze latest user message and suggest response/product if applicable - Herbal focus
  Future<void> processMessage({
    required String consultationId,
    required String messageContent,
  }) async {
    String? matchedKeyword;
    // Herbal/Spiritual keywords
    final keywords = [
      'أعشاب',
      'عشبية',
      'شاي',
      'نبات',
      'علاج',
      'روحاني',
      'استرخاء',
      'طاقة',
      'herb',
      'herbal',
      'tea',
      'relax',
      'energy',
      'spiritual',
    ];

    for (var k in keywords) {
      if (messageContent.toLowerCase().contains(k.toLowerCase())) {
        matchedKeyword = k;
        break;
      }
    }

    if (matchedKeyword != null) {
      final product = await recommendProduct(matchedKeyword);

      if (product != null) {
        await _supabase.from('messages').insert({
          'consultation_id': consultationId,
          'user_id': 'spiritual_bot', // Bot ID for RLS
          'content':
              'بناءً على استشارتك، أوصي بهذا المنتج العشبي: ${product['name']}',
          'is_agent': true,
          'recommended_product_id': product['id'],
        });
      }
    }
  }
}
