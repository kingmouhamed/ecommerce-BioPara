// lib/core/services/zego_call_service.dart
// ═══════════════════════════════════════════════════════════
//  BioPara — ZegoCloud Call Service (Single Source of Truth)
//  مسؤول عن: تهيئة خدمة الدعوات، ربط المستخدم، الـ IDs الموحدة
// ═══════════════════════════════════════════════════════════
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform;
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

  /// Zego مدعوم فقط على Android/iOS — لا يعمل على Windows/Desktop/Web.
  static bool get isSupportedPlatform =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  bool _initialized = false;

  /// تُستدعى **مرة وحدة** بعد تسجيل دخول المستخدم بنجاح.
  /// [userId]      = معرّف فريد للمستخدم (Supabase auth uid للمريض، أو adminUserId للأدمن).
  /// [userName]    = الاسم المعروض للطرف الآخر.
  /// [isAdminMode] = true للأدمن (يُفعّل ZegoUIKitPrebuiltCallInvitationService).
  ///                 false للمريض — يتجاهل PrebuiltService تمامًا لأن
  ///                 call_screen_mobile.dart يستخدم ZegoExpressEngine مباشرةً.
  ///
  /// ⚠️ WHY this matters:
  ///   ZegoUIKitPrebuiltCallInvitationService internally re-registers
  ///   ZegoExpressEngine.onRoomStreamUpdate / onPublisherStateUpdate /
  ///   onPlayerStateUpdate — overwriting the callbacks set by
  ///   call_screen_mobile.dart, which causes remote streams to be silently
  ///   dropped and the mic to stay muted. NEVER call this with isAdminMode=false
  ///   on a device that also uses the raw engine directly.
  Future<void> onUserLogin(
    String userId,
    String userName, {
    bool isAdminMode = false,
  }) async {
    // تنظيف الـ userID (Zego كيقبل غير alphanumeric + بعض الرموز)
    final safeUserId = userId.replaceAll(RegExp(r'[^a-zA-Z0-9_]'), '_');

    // ⚠️ FIX: Patient app uses ZegoExpressEngine directly in call_screen_mobile.
    // Do NOT initialize ZegoUIKitPrebuiltCallInvitationService for the patient —
    // it would hijack the engine callbacks and silence the audio streams.
    if (!isAdminMode) {
      debugPrint(
        'ℹ️ ZegoCallService: Patient mode — skipping PrebuiltCallInvitationService '
        '(patient uses ZegoExpressEngine directly). userID=$safeUserId',
      );
      return;
    }

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

          // ── إعداد الوسائط (يحل: لا صوت في الفيديو / كاميرا سوداء) ──
          // UIKit هو من ينشر ويشغّل الـ streams داخلياً؛ نحن فقط نضبط الحالة
          // الابتدائية بشكل صريح لضمان تشغيل المايك دائماً والكاميرا في الفيديو.
          config.turnOnMicrophoneWhenJoining = true;      // صوت في كل الأنواع
          config.turnOnCameraWhenJoining = isVideo;        // كاميرا في الفيديو فقط
          // توجيه الصوت لمكبّر الصوت (loudspeaker) عند الانضمام — يشمل الفيديو
          // (بدونه قد يخرج الصوت من سمّاعة الأذن فيبدو منعدماً في مكالمة الفيديو).
          config.useSpeakerWhenJoining = true;

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
      ).timeout(const Duration(seconds: 3));

      _initialized = true;
      debugPrint('✅ ZegoCallService: تم التسجيل بنجاح — userID=$safeUserId');
    } catch (e) {
      debugPrint('⚠️ ZegoCallService: خطأ في التسجيل أو انتهت المهلة — $e');
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
