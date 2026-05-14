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
  final res = await client.from('products').select('id, name');
  
  int updated = 0;
  for (var p in res) {
    final name = p['name'] as String;
    String category = 'أعشاب طبية'; // Default
    
    if (name.contains('عسل')) {
      category = 'عسل طبيعي';
    } else if (name.contains('زيت')) {
      category = 'زيوت طبية';
    } else if (name.contains('شاي')) {
      category = 'شاي أعشاب';
    } else if (name.contains('مكمل') || name.contains('فيتامين') || name.contains('Omega') || name.contains('زنك') || name.contains('كولاجين') || name.contains('بيوتين') || name.contains('مغنيسيوم')) {
      category = 'مكملات غذائية';
    }
    
    await client.from('products').update({'category': category}).eq('id', p['id']);
    print('Updated ${p['name']} -> $category');
    updated++;
  }
  
  print('Successfully updated $updated products categories!');
}
