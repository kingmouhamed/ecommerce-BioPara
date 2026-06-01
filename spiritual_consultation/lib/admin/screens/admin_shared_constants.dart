// lib/screens/admin_shared_constants.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// ── ثوابت الألوان الموحدة ──────────────────────────────────────────
const Color kAdminPrimary = Color(0xFF2D4A2E);
const Color kAdminTeal    = Color(0xFF3D5A3E);
const Color kAdminBg      = Color(0xFFF5F0E8);
const Color kAdminGold    = Color(0xFFC8963E);
const Color kAdminPurple  = Color(0xFF6A1B9A);

// ── Providers المشتركة ───────────────────────────────────────────

// عدد الرسائل غير المقروءة (يتابع conversations stream)
final adminUnreadProvider = StreamProvider<int>((ref) {
  return Supabase.instance.client
      .from('conversations')
      .stream(primaryKey: ['id'])
      .map((rows) {
        int total = 0;
        for (final r in rows) {
          total += (r['unread_count'] as int? ?? 0);
        }
        return total;
      });
});

// اسم المدير
final adminNameProvider = FutureProvider<String>((ref) async {
  final uid = Supabase.instance.client.auth.currentUser?.id;
  if (uid == null) return 'مدير';
  try {
    final p = await Supabase.instance.client
        .from('profiles')
        .select('full_name')
        .eq('id', uid)
        .maybeSingle();
    final name = p?['full_name'] as String? ?? '';
    return name.split(' ').first.isNotEmpty ? name.split(' ').first : 'مدير';
  } catch (_) {
    return 'مدير';
  }
});

// معرّف الأدمن الحالي
final adminIdProvider = Provider<String>((ref) {
  return Supabase.instance.client.auth.currentUser?.id ?? '';
});

// ── مساعد: معاينة آخر رسالة (يُستخدم في كل القوائم) ─────────────
String getLastMessagePreview(Map<String, dynamic> row) {
  final type = row['last_message_type'] as String?
      ?? row['message_type'] as String?
      ?? 'text';
  final content = row['last_message'] as String?
      ?? row['content'] as String?
      ?? '...';

  return switch (type) {
    'image'         => '📷 صورة',
    'audio'         => '🎵 رسالة صوتية',
    'call_invite'   => '📞 مكالمة',
    'video'         => '🎬 فيديو',
    'product_share' => '🛍 منتج',
    _               => content.length > 45
                        ? '${content.substring(0, 45)}...'
                        : content,
  };
}

// ── مساعد: وقت نسبي بالعربية ─────────────────────────────────────
String getArabicRelativeTime(String? isoDate) {
  if (isoDate == null) return '';
  try {
    final dt   = DateTime.parse(isoDate).toLocal();
    final diff = DateTime.now().difference(dt);
    if (diff.inSeconds < 60)  return 'الآن';
    if (diff.inMinutes < 60)  return 'منذ ${diff.inMinutes} دقيقة';
    if (diff.inHours < 24)    return 'منذ ${diff.inHours} ساعة';
    if (diff.inDays < 7)      return 'منذ ${diff.inDays} يوم';
    return 'منذ ${diff.inDays ~/ 7} أسبوع';
  } catch (_) {
    return '';
  }
}
