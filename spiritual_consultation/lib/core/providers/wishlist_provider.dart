// lib/core/providers/wishlist_provider.dart
// ═══════════════════════════════════════════════════
//  BioPara — مزوّد قائمة الأماني (Wishlist)
//  يحفظ المنتجات المفضلة في Supabase
// ═══════════════════════════════════════════════════
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// الحالة: قائمة معرّفات المنتجات المفضلة
class WishlistNotifier extends AsyncNotifier<Set<String>> {
  final _supabase = Supabase.instance.client;

  @override
  Future<Set<String>> build() async {
    return await _fetchWishlist();
  }

  Future<Set<String>> _fetchWishlist() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return {};

    try {
      final response = await _supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', userId);

      return (response as List)
          .map((item) => item['product_id'] as String)
          .toSet();
    } catch (e) {
      return {};
    }
  }

  Future<void> toggle(String productId) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return;

    final current = state.valueOrNull ?? {};

    if (current.contains(productId)) {
      // إزالة من المفضلة
      state = AsyncData(Set.from(current)..remove(productId));
      try {
        await _supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
      } catch (_) {
        // rollback
        state = AsyncData(Set.from(current));
      }
    } else {
      // إضافة للمفضلة
      state = AsyncData(Set.from(current)..add(productId));
      try {
        await _supabase.from('wishlists').insert({
          'user_id': userId,
          'product_id': productId,
        });
      } catch (_) {
        // rollback
        state = AsyncData(Set.from(current));
      }
    }
  }

  bool isWishlisted(String productId) {
    return state.valueOrNull?.contains(productId) ?? false;
  }
}

final wishlistProvider =
    AsyncNotifierProvider<WishlistNotifier, Set<String>>(() {
  return WishlistNotifier();
});
