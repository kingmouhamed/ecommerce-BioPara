// ignore_for_file: depend_on_referenced_packages, avoid_print
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:supabase/supabase.dart';

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
  
  Map<String, String> imageMap = {};
  
  for (var p in res) {
    String name = p['name'] as String;
    String searchWord = _getSearchKeyword(name);
    
    // First try Arabic Wikipedia
    String? imageUrl = await _fetchWikiImage(searchWord, 'ar');
    
    // If not found, try English translation map
    if (imageUrl == null) {
      String enWord = _getEnKeyword(searchWord);
      imageUrl = await _fetchWikiImage(enWord, 'en');
    }
    
    if (imageUrl != null) {
      imageMap[name] = imageUrl;
      print('Found image for $name');
    } else {
      print('NO IMAGE for $name');
    }
  }
  
  // Write to a Dart file
  final buffer = StringBuffer();
  buffer.writeln('const Map<String, String> staticProductImages = {');
  imageMap.forEach((k, v) {
    buffer.writeln('  "$k": "$v",');
  });
  buffer.writeln('};');
  
  await File('lib/models/product_images_map.dart').writeAsString(buffer.toString());
  print('Done writing staticProductImages map.');
  exit(0);
}

String _getSearchKeyword(String name) {
  name = name.replaceAll('شاي', '').replaceAll('مكمل', '').replaceAll('زيت', '')
             .replaceAll('عسل', '').replaceAll('طبيعي', '').replaceAll('العضوي', '')
             .replaceAll('عشبة', '').replaceAll('نبتة', '').replaceAll('جذور', '')
             .replaceAll('أوراق', '').trim();
  return name;
}

String _getEnKeyword(String arWord) {
  final map = {
    'أشواجاندا': 'Ashwagandha',
    'Omega 3 Fish': 'Fish oil',
    'خروع': 'Castor oil',
    'Flower': 'Honey',
    'Thyme': 'Thyme',
    'Forest': 'Honey',
    'مانوكا': 'M\u0101nuka honey',
    'بيوتين': 'Biotin',
    'كولاجين': 'Collagen',
    'مغنيسيوم': 'Magnesium',
    'فيتامين D3 + K2': 'Vitamin D',
    'الزعتر الطبي': 'Thyme',
    'زنك': 'Zinc',
    'مستكة': 'Mastic (plant resin)',
    'Wildflower': 'Honey',
    'Rose': 'Rose oil',
    'الجنسنغ': 'Ginseng',
    'القرفة': 'Cinnamon',
    'الكركديه': 'Hibiscus tea',
    'الخزامى': 'Lavender',
    'الألوفيرا': 'Aloe vera',
    'الماكا': 'Maca',
    'القديسين': 'St John\'s wort',
    'اللويزة': 'Lemon verbena',
    'إكليل الجبل': 'Rosemary',
    'Lanvender': 'Lavender',
    'Musk': 'Musk',
    'Carob': 'Carob',
    'أوميغا 3': 'Omega-3 fatty acid',
    'اليانسون': 'Anise',
    'Orange Blossom': 'Orange blossom',
    'الإشنسا': 'Echinacea',
    'كافور': 'Camphor',
    'الكافور': 'Camphor',
    'طلح': 'Acacia',
    'Blackseed': 'Nigella sativa',
    'فيتامينات متعددة': 'Multivitamin',
    'المريمية': 'Salvia officinalis',
    'الكركم': 'Turmeric',
  };
  return map[arWord] ?? arWord;
}

Future<String?> _fetchWikiImage(String query, String lang) async {
  if (query.isEmpty) return null;
  final url = Uri.parse('https://$lang.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${Uri.encodeComponent(query)}&format=json&pithumbsize=600');
  try {
    final response = await http.get(url);
    final data = jsonDecode(response.body);
    final pages = data['query']['pages'] as Map;
    for (var val in pages.values) {
      if (val.containsKey('thumbnail')) {
        return val['thumbnail']['source'];
      }
    }
  } catch (_) {} // ignore: empty_catches
  return null;
}
