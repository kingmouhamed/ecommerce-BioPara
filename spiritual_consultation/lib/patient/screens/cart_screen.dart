import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/models/cart_item.dart';
import '../../core/providers/cart_provider.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final subtotal = ref.watch(cartTotalPrice);
    const shipping = 25.0; // Ø±Ø³Ùˆم Ø´Ø­Ù† ثابتة
    final total = subtotal + shipping;

    if (cart.isEmpty) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text('سلة المشتريات', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
          centerTitle: true,
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.shopping_basket_outlined, size: 100, color: const Color(0xFF0D6E6E).withValues(alpha: 0.5)),
              ),
              const SizedBox(height: 24),
              Text('Ø³Ù„ØªÙƒ فارغة تماماً', style: GoogleFonts.tajawal(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Text('ÙŠØ¨Ø¯Ùˆ Ø£Ù†Ùƒ لم تضف أي Ù…Ù†تجات علاجية بعد', style: GoogleFonts.tajawal(color: Colors.grey)),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D6E6E),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                ),
                child: Text('ابدأ التسوق الآن', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: Text('مراجعة الطلب', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: cart.length,
              itemBuilder: (context, index) => _buildCartItem(context, ref, cart[index]),
            ),
          ),
          _buildSummarySection(context, ref, subtotal, shipping, total, cart),
        ],
      ),
    );
  }

  Widget _buildCartItem(BuildContext context, WidgetRef ref, CartItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: item.imageUrl != null
                ? Image.network(item.imageUrl!, width: 85, height: 85, fit: BoxFit.cover)
                : Container(width: 85, height: 85, color: Colors.grey[100], child: const Icon(Icons.eco, color: Colors.green)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.productName, style: GoogleFonts.tajawal(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 6),
                Text('${item.productPrice} درهم', style: const TextStyle(color: Color(0xFF0D6E6E), fontWeight: FontWeight.w900)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _qtyBtn(Icons.remove, () => ref.read(cartProvider.notifier).updateQuantity(item.productId, item.quantity - 1)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 15),
                      child: Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                    _qtyBtn(Icons.add, () => ref.read(cartProvider.notifier).updateQuantity(item.productId, item.quantity + 1)),
                    const Spacer(),
                    IconButton(
                      onPressed: () => ref.read(cartProvider.notifier).removeFromCart(item.productId),
                      icon: const Icon(Icons.delete_sweep_outlined, color: Colors.redAccent),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _qtyBtn(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: Colors.black87),
      ),
    );
  }

  Widget _buildSummarySection(BuildContext context, WidgetRef ref, double subtotal, double shipping, double total, List<CartItem> cart) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -5))],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _summaryRow('Ø§Ù„Ù…Ø¬Ù…Ùˆع Ø§Ù„Ùرعي', '$subtotal درهم'),
          const SizedBox(height: 10),
          _summaryRow('رسوم التوصيل', '$shipping درهم'),
          const Divider(height: 30),
          _summaryRow('الإجمالي النهائي', '$total درهم', isTotal: true),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 60,
            child: ElevatedButton(
              onPressed: () => _submitOrder(context, ref, cart, total),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D6E6E),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                elevation: 5,
                shadowColor: const Color(0xFF0D6E6E).withValues(alpha: 0.4),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check_circle_outline),
                  const SizedBox(width: 12),
                  Text('إتمام عملية الشراء', style: GoogleFonts.tajawal(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.tajawal(
          fontSize: isTotal ? 18 : 14, 
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          color: isTotal ? Colors.black : Colors.grey[600],
        )),
        Text(value, style: GoogleFonts.tajawal(
          fontSize: isTotal ? 20 : 15, 
          fontWeight: FontWeight.bold,
          color: isTotal ? const Color(0xFF0D6E6E) : Colors.black,
        )),
      ],
    );
  }

  Future<void> _submitOrder(BuildContext context, WidgetRef ref, List<CartItem> cart, double totalPrice) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator(color: Color(0xFF0D6E6E))),
    );

    try {
      final supabase = Supabase.instance.client;
      final userId = supabase.auth.currentUser?.id;
      if (userId == null) throw 'يجب تسجيل الدخول أولاً';

      // 1. Ø¥Ù†شاء الطلب والحصول على بياناته (لجلب الـ ID)
      final orderData = await supabase.from('orders').insert({
        'user_id': userId,
        'status': 'pending',
        'total_price': totalPrice,
      }).select().single();

      final String orderId = orderData['id'];

      // 2. إدخال جميع Ø¹Ù†اصر السلة في جدول order_items
      final List<Map<String, dynamic>> itemsToInsert = cart.map((item) => {
        'order_id': orderId,
        'product_id': item.productId,
        'product_name': item.productName,
        'price': item.productPrice,
        'quantity': item.quantity,
        'image_url': item.imageUrl,
      }).toList();

      await supabase.from('order_items').insert(itemsToInsert);

      // 3. ØªÙ†ظيف السلة
      ref.read(cartProvider.notifier).clearCart();

      if (!context.mounted) return;
      Navigator.pop(context); // إغلاق الـ Loading

      _showSuccessSheet(context);
    } catch (e) {
      if (!context.mounted) return;
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('ÙØ´Ù„ الطلب: $e'), backgroundColor: Colors.red));
    }
  }

  void _showSuccessSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: 400,
        decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle, size: 100, color: Colors.green),
            const SizedBox(height: 20),
            Text('Ø´ÙƒØ±Ø§Ù‹ Ù„Ø«Ù‚ØªÙƒ Ø¨Ù†ا!', style: GoogleFonts.tajawal(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            const Text('تم استلام Ø·Ù„Ø¨Ùƒ Ø¨Ù†جاح وسنتواصل معك قريباً', textAlign: TextAlign.center),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context); // Close sheet
                    Navigator.pop(context); // Back to Shop
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D6E6E),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Ø§Ù„Ø¹Ùˆدة للمتجر'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
