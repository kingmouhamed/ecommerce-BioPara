// ignore_for_file: avoid_print, depend_on_referenced_packages
import 'dart:convert';
import 'package:http/http.dart' as http;

const _url = 'https://fvtkbnoodktzumzkxtkv.supabase.co';
const _key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGtibm9vZGt0enVtemt4dGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzMwMzAsImV4cCI6MjA4NDc0OTAzMH0.C35VopeG7wTzVo0opnCO0Ru2IzVaVn5TcdZyH5d1Mog';

const folders = [
  'dietary-supplements',
  'herbal-tea',
  'medicinal-herbs',
  'medicinal-oils',
  'natural-honey',
];

Future<List<String>> listFolder(String folder) async {
  final res = await http.post(
    Uri.parse('$_url/storage/v1/object/list/products'),
    headers: {
      'Authorization': 'Bearer $_key',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({'prefix': '$folder/', 'limit': 100, 'offset': 0}),
  );
  if (res.statusCode != 200) {
    print('Error listing $folder: ${res.statusCode} ${res.body}');
    return [];
  }
  final items = (jsonDecode(res.body) as List)
      .map((e) => e['name'] as String)
      .where((n) => n.isNotEmpty && !n.endsWith('/'))
      .toList();
  return items;
}

void main() async {
  print('=== Supabase Storage: products bucket ===\n');
  
  final allFiles = <String, List<String>>{};
  
  for (final folder in folders) {
    final files = await listFolder(folder);
    allFiles[folder] = files;
    print('[$folder] (${files.length} files):');
    for (final f in files) {
      final publicUrl = '$_url/storage/v1/object/public/products/$folder/$f';
      print('  $f => $publicUrl');
    }
    print('');
  }
  
  print('\n=== DART MAP (copy to product_model.dart) ===\n');
  print("static const Map<String, String> _folderMap = {");
  for (final folder in folders) {
    String category = '';
    switch (folder) {
      case 'dietary-supplements': category = 'مكملات غذائية'; break;
      case 'herbal-tea': category = 'شاي أعشاب'; break;
      case 'medicinal-herbs': category = 'أعشاب طبية'; break;
      case 'medicinal-oils': category = 'زيوت طبية'; break;
      case 'natural-honey': category = 'عسل طبيعي'; break;
    }
    print("  '$category': '$folder',");
  }
  print("};");
  
  print('\n\nPublic URL base: $_url/storage/v1/object/public/products/');
}
