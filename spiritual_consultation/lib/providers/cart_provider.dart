import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item.dart';

// مزود سلة التسوق
final cartProvider = StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  return CartNotifier();
});

// مزود الكمية الكلية
final cartTotalPrice = Provider<double>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.fold(0, (sum, item) => sum + item.total);
});

// مزود عدد العناصر
final cartItemCount = Provider<int>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.length;
});

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super([]);

  /// إضافة منتج للسلة
  void addToCart({
    required String productId,
    required String productName,
    required double productPrice,
    String? imageUrl,
  }) {
    // تحقق إذا كان المنتج موجود بالفعل
    final existingIndex = state.indexWhere(
      (item) => item.productId == productId,
    );

    if (existingIndex != -1) {
      // إذا موجود، زيادة الكمية
      final updatedItem = state[existingIndex].copyWith(
        quantity: state[existingIndex].quantity + 1,
      );

      state = [
        ...state.sublist(0, existingIndex),
        updatedItem,
        ...state.sublist(existingIndex + 1),
      ];
    } else {
      // إذا لا، أضيف منتج جديد
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

  /// إزالة منتج من السلة
  void removeFromCart(String productId) {
    state = state.where((item) => item.productId != productId).toList();
  }

  /// تحديث كمية المنتج
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

  /// تفريغ السلة
  void clearCart() {
    state = [];
  }

  /// الحصول على عدد العناصر
  int getItemCount() => state.length;

  /// الحصول على الكمية الكلية
  double getTotalPrice() {
    return state.fold(0, (sum, item) => sum + item.total);
  }
}
