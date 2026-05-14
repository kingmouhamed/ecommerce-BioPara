import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item.dart';

// Ù…Ø²Ùˆد سلة التسوق
final cartProvider = StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  return CartNotifier();
});

// Ù…Ø²Ùˆد Ø§Ù„Ùƒمية Ø§Ù„Ùƒلية
final cartTotalPrice = Provider<double>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.fold(0, (sum, item) => sum + item.total);
});

// Ù…Ø²Ùˆد عدد Ø§Ù„Ø¹Ù†اصر
final cartItemCount = Provider<int>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.length;
});

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super([]);

  /// إضافة Ù…Ù†تج للسلة
  void addToCart({
    required String productId,
    required String productName,
    required double productPrice,
    String? imageUrl,
  }) {
    // ØªØ­Ù‚Ù‚ إذا ÙƒØ§Ù† Ø§Ù„Ù…Ù†تج Ù…ÙˆØ¬Ùˆد Ø¨Ø§Ù„Ùعل
    final existingIndex = state.indexWhere(
      (item) => item.productId == productId,
    );

    if (existingIndex != -1) {
      // إذا Ù…ÙˆØ¬Ùˆد، زيادة Ø§Ù„Ùƒمية
      final updatedItem = state[existingIndex].copyWith(
        quantity: state[existingIndex].quantity + 1,
      );

      state = [
        ...state.sublist(0, existingIndex),
        updatedItem,
        ...state.sublist(existingIndex + 1),
      ];
    } else {
      // إذا لا، أضيف Ù…Ù†تج جديد
      state = [
        ...state,
        CartItem(
          productId: productId,
          productName: productName,
          productPrice: productPrice,
          imageUrl: imageUrl,
          quantity: 1,
        ),
      ];
    }
  }

  /// إزالة Ù…Ù†تج Ù…Ù† السلة
  void removeFromCart(String productId) {
    state = state.where((item) => item.productId != productId).toList();
  }

  /// تحديث Ùƒمية Ø§Ù„Ù…Ù†تج
  void updateQuantity(String productId, int quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    final index = state.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      final updatedItem = state[index].copyWith(quantity: quantity);

      state = [
        ...state.sublist(0, index),
        updatedItem,
        ...state.sublist(index + 1),
      ];
    }
  }

  /// ØªÙØ±ÙŠغ السلة
  void clearCart() {
    state = [];
  }

  /// Ø§Ù„Ø­ØµÙˆل Ø¹Ù„Ù‰ عدد Ø§Ù„Ø¹Ù†اصر
  int getItemCount() => state.length;

  /// Ø§Ù„Ø­ØµÙˆل Ø¹Ù„Ù‰ Ø§Ù„Ùƒمية Ø§Ù„Ùƒلية
  double getTotalPrice() {
    return state.fold(0, (sum, item) => sum + item.total);
  }
}
