import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/product_model.dart';

final productsProvider = FutureProvider<List<Product>>((ref) async {
  final supabase = Supabase.instance.client;
  final response = await supabase
      .from('products')
      .select()
      .eq('is_active', true)
      .order('rating', ascending: false)
      .order('name', ascending: true);
  
  return (response as List).map((p) => Product.fromMap(p)).toList();
});

final productsByCategoryProvider = FutureProvider.family<List<Product>, String>((ref, category) async {
  final supabase = Supabase.instance.client;
  final response = await supabase
      .from('products')
      .select()
      .eq('category', category)
      .order('name', ascending: true);
  
  return (response as List).map((p) => Product.fromMap(p)).toList();
});
