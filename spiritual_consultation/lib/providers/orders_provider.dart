import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_model.dart';

final ordersProvider = FutureProvider<List<OrderModel>>((ref) async {
  final supabase = Supabase.instance.client;
  final userId = supabase.auth.currentUser?.id;

  if (userId == null) return [];

  final response = await supabase
      .from('orders')
      .select()
      .eq('user_id', userId)
      .order('created_at', ascending: false);

  return (response as List).map((o) => OrderModel.fromMap(o)).toList();
});
