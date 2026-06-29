// lib/core/services/zego_call_service.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — ZegoCloud Call Service (Single Source of Truth)
//  مسؤول عن: تهيئة خدمة الدعوات، ربط المستخدم، الـ IDs الموحدة
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:zego_uikit_prebuilt_call/zego_uikit_prebuilt_call.dart';
import 'package:zego_uikit_signaling_plugin/zego_uikit_signaling_plugin.dart';

import '../config/app_config.dart';

class ZegoCallService {
  ZegoCallService._();
  static final ZegoCallService instance = ZegoCallService._();

  /// مفتاح التنقّل العام — ضروري باش Zego يقدر يفتح شاشة المكالمة
  /// تلقائياً ملي تُقبل الدعوة (بلا هادشي = "جاري الاتصال" عالق).
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  /// معرّف موحّد ثابت للمستشار/الأدمن — خاص يكون **متطابق** فالجيهتين.
  /// الـ patient كيدير دعوة لهاد الـ ID، و الأدمن كيسجّل دخوله بهاد الـ ID.
  static const String adminUserId = 'biopara_admin';
  static const String adminUserName = 'المستشار الروحاني';

  /// Zego (المكالمات الأصلية) مدعوم فقط على Android/iOS.
  /// على Windows/Desktop/Web يجب عدم تهيئته (يسبب أعطالاً عند الإقلاع)،
  /// وتُستعمل مكالمات Jitsi عبر WebView بدلاً منه (انظر CallOverlay).
  static bool get isSupportedPlatform =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  bool _initialized = false;

  /// تُستدعى **مرة وحدة** بعد تسجيل دخول المستخدم بنجاح.
  /// [userId]   = معرّف فريد للمستخدم (Supabase auth uid للمريض، أو adminUserId للأدمن).
  /// [userName] = الاسم المعروض للطرف الآخر.
  Future<void> onUserLogin(String userId, String userName) async {
    // تنظيف الـ userID (Zego كيقبل غير alphanumeric + بعض الرموز)
    final safeUserId = userId.replaceAll(RegExp(r'[^a-zA-Z0-9_]'), '_');

    if (_initialized) {
      debugPrint('ℹ️ ZegoCallService: مسجّل مسبقاً — تجاهل');
      return;
    }

    final appID = int.tryParse(AppConfig.zegoAppId) ?? 0;
    final appSign = AppConfig.zegoAppSign;

    if (appID == 0 || appSign.isEmpty) {
      debugPrint('⛔ ZegoCallService: AppID/AppSign فارغين — تحقق من --dart-define');
      return;
    }
    if (safeUserId.isEmpty) {
      debugPrint('⛔ ZegoCallService: userId فارغ — لا يمكن التسجيل');
      return;
    }

    try {
      await ZegoUIKitPrebuiltCallInvitationService().init(
        appID: appID,
        appSign: appSign,
        userID: safeUserId,
        userName: userName.isEmpty ? 'مستخدم BioPara' : userName,
        plugins: [ZegoUIKitSignalingPlugin()],

        // حاسم: يضمن وصول الدعوة وإظهار شاشة "مكالمة واردة" (قبول/رفض)
        // عند الطرف الآخر حتى لو كان التطبيق في الخلفية أو مُغلقاً.
        // بدون هذا السطر تتصل المكالمة بلا أن تظهر شاشة القبول/الرفض.
        notifyWhenAppRunningInBackgroundOrQuit: true,

        // ── إعداد الإشعارات ──
        notificationConfig: ZegoCallInvitationNotificationConfig(
          androidNotificationConfig: ZegoCallAndroidNotificationConfig(
            callChannel: ZegoCallAndroidNotificationChannelConfig(
              channelID: 'biopara_calls',
              channelName: 'BioPara Calls',
              sound: 'call_ringtone',
              icon: 'notification_icon',
            ),
          ),
          iOSNotificationConfig: ZegoCallIOSNotificationConfig(),
        ),

        // ── إعداد المكالمة (صوت + فيديو) ──
        requireConfig: (ZegoCallInvitationData data) {
          final isVideo = data.type == ZegoCallInvitationType.videoCall;
          final config = isVideo
              ? ZegoUIKitPrebuiltCallConfig.oneOnOneVideoCall()
              : ZegoUIKitPrebuiltCallConfig.oneOnOneVoiceCall();

          // أفاتار مخصص
          config.avatarBuilder = (ctx, size, user, extraInfo) =>
              _buildCallAvatar(user?.name ?? '?', size);

          // تحسينات UX: تأكيد إنهاء المكالمة
          config.hangUpConfirmDialog = ZegoCallHangUpConfirmDialogConfig(
            info: ZegoCallHangUpConfirmDialogInfo(
              title: 'إنهاء المكالمة',
              message: 'هل تريد إنهاء المكالمة؟',
            )
              ..cancelButtonName = 'إلغاء'
              ..confirmButtonName = 'إنهاء',
          );

          return config;
        },

        events: ZegoUIKitPrebuiltCallEvents(
          onCallEnd: (event, defaultAction) {
            debugPrint('📞 ZegoCallService: انتهت المكالمة. السبب: ${event.reason}');
            defaultAction.call();
          },
        ),
      );

      _initialized = true;
      debugPrint('✅ ZegoCallService: تم التسجيل بنجاح — userID=$safeUserId');
    } catch (e) {
      debugPrint('⚠️ ZegoCallService: خطأ في التسجيل — $e');
    }
  }

  /// تُستدعى عند تسجيل الخروج — تنظيف الموارد (Secure by Design).
  Future<void> onUserLogout() async {
    if (!_initialized) return;
    try {
      await ZegoUIKitPrebuiltCallInvitationService().uninit();
      _initialized = false;
      debugPrint('🔒 ZegoCallService: تم تسجيل الخروج وتنظيف الموارد');
    } catch (e) {
      debugPrint('⚠️ ZegoCallService: خطأ في التنظيف — $e');
    }
  }

  /// بناء أفاتار مخصص لشاشة المكالمة
  static Widget _buildCallAvatar(String name, Size size) {
    return Container(
      width: size.width,
      height: size.height,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [Color(0xFF2E7D32), Color(0xFF0D6E6E)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : '?',
          style: TextStyle(
            color: Colors.white,
            fontSize: size.width * 0.4,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
