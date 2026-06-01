import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/providers/order_details_provider.dart';
import '../../core/providers/orders_provider.dart';
import '../../core/models/order_item_model.dart';
import '../../core/models/order_model.dart';

class OrderDetailsScreen extends ConsumerWidget {
  final OrderModel order;
  const OrderDetailsScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(orderItemsProvider(order.id));

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: Text('تف اصيل الطلب', style: GoogleFonts.tajawal(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        leading: Directionality(
          textDirection: TextDirection.ltr,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black87),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: Column(
        children: [
          _buildOrderHeader(context, ref),
          Expanded(
            child: itemsAsync.when(
              data: (items) => ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: items.length,
                itemBuilder: (context, index) => _buildItemCard(items[index]),
              ),
              loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF0D6E6E))),
              error: (err, stack) => Center(child: Text('خطأ في تحميل العناصر: $err')),
            ),
          ),
          _buildTotalSection(),
        ],
      ),
    );
  }

  Widget _buildOrderHeader(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('رقم الطلب: #${order.id.substring(0, 8)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('الحالة: ${order.statusArabic}', style: const TextStyle(color: Color(0xFF0D6E6E), fontWeight: FontWeight.bold)),
                ],
              ),
              if (order.status == 'pending')
                TextButton.icon(
                  onPressed: () => _confirmCancel(context, ref),
                  icon: const Icon(Icons.cancel_outlined, color: Colors.red, size: 18),
                  label: const Text('إلغاء الطلب', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
        ],
      ),
    );
  }

  void _confirmCancel(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إلغاء الطلب', textAlign: TextAlign.center),
        content: const Text('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟', textAlign: TextAlign.center),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('تراجع')),
          TextButton(
            onPressed: () async {
              Navigator.pop(context); // Close dialog
              await _cancelOrder(context, ref);
            },
            child: const Text('نعم، إلغاء', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Future<void> _cancelOrder(BuildContext context, WidgetRef ref) async {
    try {
      await Supabase.instance.client
          .from('orders')
          .update({'status': 'cancelled'})
          .eq('id', order.id);

      ref.invalidate(ordersProvider);
      
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('تم إلغاء الطلب بنجاح'), backgroundColor: Colors.orange),
        );
        Navigator.pop(context); // Return to orders list
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('فشل إلغاء الطلب: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Widget _buildItemCard(OrderItemModel item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 5)],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: item.imageUrl != null
                ? Image.network(item.imageUrl!, width: 60, height: 60, fit: BoxFit.cover)
                : Container(width: 60, height: 60, color: Colors.grey[100], child: const Icon(Icons.eco, color: Colors.green)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.productName, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text('الكمية: ${item.quantity}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          Text('${item.price * item.quantity} درهم', style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildTotalSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('الإجمالي المدف وع', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          Text('${order.totalPrice} درهم', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0D6E6E))),
        ],
      ),
    );
  }
}