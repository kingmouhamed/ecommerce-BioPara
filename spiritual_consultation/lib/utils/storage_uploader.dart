import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:path/path.dart' as p;

class StorageUploader {
  static const String baseLocalPath = r'C:\Users\msi\Desktop\Ecommerce BioPara\clerk-nextjs\public\images';
  
  static final List<String> folders = [
    'dietary-supplements',
    'herbal tea',
    'medicinal-herbs',
    'medicinal-oils',
    'natural-honey'
  ];

  /// دالة لرفع كافة الصور من المجلدات المحلية إلى Supabase
  static Future<void> uploadAllProducts() async {
    final supabase = Supabase.instance.client;

    for (String folder in folders) {
      final directory = Directory(p.join(baseLocalPath, folder));
      
      if (!await directory.exists()) {
        print('المجلد غير موجود: ${directory.path}');
        continue;
      }

      final List<FileSystemEntity> entities = directory.listSync();
      
      for (var entity in entities) {
        if (entity is File && _isImage(entity.path)) {
          final fileName = p.basename(entity.path);
          final storagePath = '$folder/$fileName';

          try {
            // رفع الصورة
            await supabase.storage.from('products').upload(
              storagePath,
              entity,
              fileOptions: const FileOptions(upsert: true),
            );

            // الحصول على الرابط العمومي
            final publicUrl = supabase.storage.from('products').getPublicUrl(storagePath);

            // تحديث رابط الصورة في جدول المنتجات بناءً على اسم الملف (تقريبي)
            final productNamePart = p.basenameWithoutExtension(fileName).replaceAll('-', ' ').replaceAll('_', ' ');
            
            await supabase
                .from('products')
                .update({'image_url': publicUrl})
                .ilike('name', '%$productNamePart%');

            print('تم رفع وتحديث: $fileName');
          } catch (e) {
            print('خطأ في رفع $fileName: $e');
          }
        }
      }
    }
    print('✅ اكتملت عملية الرفع والتحديث!');
  }

  static bool _isImage(String path) {
    final ext = p.extension(path).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].contains(ext);
  }
}
