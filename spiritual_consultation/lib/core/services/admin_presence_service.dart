// lib/core/services/admin_presence_service.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — تتبّع منصة الأدمن النشطة
//  يكتب الأدمن منصته (mobile/windows) في جدول admin_presence.
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AdminPresenceService with WidgetsBindingObserver {
  AdminPresenceService._();
  static final AdminPresenceService instance = AdminPresenceService._();

  final _supabase = Supabase.instance.client;
  bool _tracking = false;

  /// المنصة الحالية كنص يُخزَّن في قاعدة البيانات.
  static String get currentPlatform {
    if (kIsWeb) return 'web';
    if (defaultTargetPlatform == TargetPlatform.android ||
        defaultTargetPlatform == TargetPlatform.iOS) {
      return 'mobile';
    }
    return 'windows'; // Windows / macOS / Linux (سطح المكتب)
  }

  /// يُستدعى من تطبيق الأدمن: يبدأ تتبّع المنصة ويحدّثها عند الدخول/الاستئناف.
  void startTracking() {
    if (_tracking) return;
    _tracking = true;

    WidgetsBinding.instance.addObserver(this);

    // تحديث فوري إذا كان الأدمن مسجّلاً مسبقاً
    _push();

    // عند تسجيل الدخول لاحقاً
    _supabase.auth.onAuthStateChange.listen((event) {
      if (event.event == AuthChangeEvent.signedIn) {
        _push();
      }
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // عند رجوع التطبيق للمقدمة، نؤكّد أن منصة الأدمن محدّثة
    if (state == AppLifecycleState.resumed) {
      _push();
    }
  }

  Future<void> _push() async {
    final uid = _supabase.auth.currentUser?.id;
    if (uid == null) return;
    try {
      await _supabase.from('admin_presence').upsert({
        'admin_id': uid,
        'platform': currentPlatform,
        'updated_at': DateTime.now().toIso8601String(),
      });
      debugPrint('📍 AdminPresence: $currentPlatform ($uid)');
    } catch (e) {
      debugPrint('⚠️ AdminPresence upsert error: $e');
    }
  }

}
