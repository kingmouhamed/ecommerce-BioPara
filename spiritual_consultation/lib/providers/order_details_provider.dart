import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_item_model.dart';

final orderItemsProvider = FutureProvider.family<List<OrderItemModel>, String>((ref, orderId) async {
  final supabase = Supabase.instance.client;

  final response = await supabase
      .from('order_items')
      .select()
      .eq('order_id', orderId);

  return (response as List).map((item) => OrderItemModel.fromMap(item)).toList();
});
