import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/cart_item.dart';
import '../providers/cart_provider.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final totalPrice = ref.watch(cartTotalPrice);

    if (cart.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('🛒 سلتك'),
          centerTitle: true,
          backgroundColor: const Color(0xFF2E7D32),
          elevation: 0,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.shopping_cart_outlined,
                size: 80,
                color: Colors.grey,
              ),
              const SizedBox(height: 20),
              const Text(
                'السلة فارغة',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                'أضف منتجات من الاستشارة الذكية',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2E7D32),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 15,
                  ),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'العودة للاستشارة',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('🛒 سلتك'),
        centerTitle: true,
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
      ),
      body: Column(
        children: [
          /// قائمة المنتجات
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: cart.length,
              itemBuilder: (context, index) {
                final item = cart[index];
                return _buildCartItem(context, ref, item);
              },
            ),
          ),

          /// قسم الإجمالي والزر
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'الإجمالي:',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${totalPrice.toStringAsFixed(2)} ريال',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2E7D32),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 15),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E7D32),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    onPressed: () async {
                      // حفظ الطلب في Supabase
                      _submitOrder(context, ref, cart, totalPrice);
                    },
                    child: const Text(
                      'تأكيد الطلب',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// بناء عنصر في السلة
  Widget _buildCartItem(BuildContext context, WidgetRef ref, CartItem item) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            /// الصورة
            if (item.imageUrl != null)
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.grey[200],
                  image: DecorationImage(
                    image: NetworkImage(item.imageUrl!),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.grey[200],
                ),
                child: const Icon(Icons.image_not_supported),
              ),
            const SizedBox(width: 12),

            /// المعلومات والأزرار
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.productName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${item.productPrice.toStringAsFixed(2)} ريال',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF2E7D32),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),

                  /// تحكم الكمية
                  Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          ref
                              .read(cartProvider.notifier)
                              .updateQuantity(
                                item.productId,
                                item.quantity - 1,
                              );
                        },
                        icon: const Icon(Icons.remove_circle_outline),
                        iconSize: 20,
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '${item.quantity}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          ref
                              .read(cartProvider.notifier)
                              .updateQuantity(
                                item.productId,
                                item.quantity + 1,
                              );
                        },
                        icon: const Icon(Icons.add_circle_outline),
                        iconSize: 20,
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                      ),
                      const Spacer(),

                      /// زر الحذف
                      IconButton(
                        onPressed: () {
                          ref
                              .read(cartProvider.notifier)
                              .removeFromCart(item.productId);
                        },
                        icon: const Icon(
                          Icons.delete_outline,
                          color: Colors.red,
                        ),
                        iconSize: 20,
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// إرسال الطلب لـ Supabase
  Future<void> _submitOrder(
    BuildContext context,
    WidgetRef ref,
    List<CartItem> cart,
    double totalPrice,
  ) async {
    try {
      final supabase = Supabase.instance.client;
      final userId = supabase.auth.currentUser?.id ?? 'guest_user';

      // حفظ الطلب
      await supabase.from('orders').insert({
        'user_id': userId,
        'status': 'pending',
        'total_price': totalPrice,
        'created_at': DateTime.now().toIso8601String(),
      });

      // تنظيف السلة
      ref.read(cartProvider.notifier).clearCart();

      if (!context.mounted) return;

      // عرض رسالة النجاح
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ تم تأكيد طلبك بنجاح!'),
          backgroundColor: Color(0xFF2E7D32),
          duration: Duration(seconds: 2),
        ),
      );

      // العودة
      Future.delayed(const Duration(seconds: 1), () {
        if (context.mounted) {
          Navigator.pop(context);
        }
      });
    } catch (e) {
      if (!context.mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطأ: $e'), backgroundColor: Colors.red),
      );
    }
  }
}
