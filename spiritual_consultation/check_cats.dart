// ignore_for_file: depend_on_referenced_packages, avoid_print
import 'package:supabase/supabase.dart';
import 'dart:io';

void main() async {
  final envFile = File('.env');
  final lines = await envFile.readAsLines();
  String url = '';
  String key = '';
  for (var line in lines) {
    if (line.startsWith('SUPABASE_URL=')) url = line.split('=')[1];
    if (line.startsWith('SUPABASE_ANON_KEY=')) key = line.split('=')[1];
  }
  
  final client = SupabaseClient(url, key);
  final res = await client.from('products').select('id, name, category');
  print('Products:');
  for (var p in res) {
    print('- ${p['name']} => Category: "${p['category']}"');
  }
}
